from pathlib import Path
from typing import Any
import time

import replicate
import requests

from app.schemas import GenerationParams


class ReplicateVideoProvider:
    def __init__(self, api_token: str, model_name: str) -> None:
        # Replicate client token kwarg changed across versions (api_token -> bearer_token).
        try:
            self._client = replicate.Client(bearer_token=api_token)
        except TypeError:
            self._client = replicate.Client(api_token=api_token)
        self._model_name = model_name
        self._model_version_id: str | None = None

    def generate_from_image(self, image_path: Path, params: GenerationParams) -> bytes:
        model_version = self._get_model_version_id()

        with image_path.open("rb") as image_file:
            input_payload = self._build_input_payload(image_file=image_file, params=params)
            prediction = self._client.predictions.create(
                version=model_version,
                input=input_payload,
            )

        output = self._wait_for_prediction_output(prediction_id=prediction.id)

        video_source = self._extract_video_source(output)
        return self._download_video_bytes(video_source)

    def _build_input_payload(self, image_file: Any, params: GenerationParams) -> dict[str, Any]:
        # Try-for-free default: minimax/video-01 (supports first_frame_image for I2V).
        if self._model_name == "minimax/video-01":
            return {
                "prompt": params.prompt,
                "first_frame_image": image_file,
                "prompt_optimizer": params.prompt_optimizer,
            }

        # Legacy/paid profile: ltx-video.
        if self._model_name == "lightricks/ltx-video":
            return {
                "prompt": params.prompt,
                "negative_prompt": params.negative_prompt,
                "image": image_file,
                "image_noise_scale": params.image_noise_scale,
                "target_size": params.target_size,
                "cfg": params.cfg,
                "steps": params.steps,
                "length": params.length_frames,
                "seed": params.seed,
            }

        # Generic fallback for other image-to-video models.
        return {
            "prompt": params.prompt,
            "image": image_file,
            "seed": params.seed,
        }

    def _get_model_version_id(self) -> str:
        if self._model_version_id:
            return self._model_version_id

        try:
            model_owner, model_name = self._model_name.split("/", 1)
        except ValueError as exc:
            raise ValueError(f"Invalid model name format: {self._model_name}") from exc

        model = self._client.models.get(model_owner=model_owner, model_name=model_name)
        latest_version = getattr(model, "latest_version", None)
        version_id = getattr(latest_version, "id", None)
        if not version_id:
            raise ValueError(f"No latest version found for model: {self._model_name}")

        self._model_version_id = version_id
        return version_id

    def _wait_for_prediction_output(self, prediction_id: str, timeout_seconds: int = 420) -> Any:
        deadline = time.monotonic() + timeout_seconds

        while time.monotonic() < deadline:
            prediction = self._client.predictions.get(prediction_id=prediction_id)
            status = getattr(prediction, "status", "")

            if status == "succeeded":
                return getattr(prediction, "output", None)

            if status in {"failed", "canceled"}:
                error = getattr(prediction, "error", None)
                raise RuntimeError(f"Prediction {status}: {error or 'No error details provided'}")

            time.sleep(1.5)

        raise RuntimeError("Prediction timed out while waiting for Replicate output")

    def _extract_video_source(self, output: Any) -> Any:
        if hasattr(output, "read"):
            return output

        if isinstance(output, str):
            return output

        if isinstance(output, (list, tuple)) and output:
            return self._extract_video_source(output[0])

        if isinstance(output, dict):
            for key in ("video", "output", "url"):
                if key not in output:
                    continue
                value = output[key]
                if isinstance(value, dict) and "url" in value:
                    return value["url"]
                return self._extract_video_source(value)

        raise ValueError(f"Unsupported output format: {type(output)}")

    def _download_video_bytes(self, video_source: Any) -> bytes:
        if hasattr(video_source, "read"):
            return video_source.read()

        if isinstance(video_source, str) and video_source.startswith("http"):
            response = requests.get(video_source, timeout=300)
            response.raise_for_status()
            return response.content

        raise ValueError(f"Unsupported video source type: {type(video_source)}")
