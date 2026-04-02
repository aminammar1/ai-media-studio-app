import tempfile
from pathlib import Path

from fastapi import UploadFile

from app.providers.video_provider import VideoProvider
from app.schemas import GenerationParams


class VideoGenerationService:
    def __init__(self, provider: VideoProvider) -> None:
        self._provider = provider

    async def generate_from_upload(self, image: UploadFile, params: GenerationParams) -> bytes:
        content_type = image.content_type or ""
        if not content_type.startswith("image/"):
            raise ValueError("Uploaded file must be an image")

        image_bytes = await image.read()
        if not image_bytes:
            raise ValueError("Uploaded image is empty")

        suffix = Path(image.filename or "upload.png").suffix or ".png"
        return self.generate_from_bytes(image_bytes=image_bytes, suffix=suffix, params=params)

    def generate_from_bytes(self, image_bytes: bytes, suffix: str, params: GenerationParams) -> bytes:
        temp_path: Path | None = None
        try:
            with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
                temp_path = Path(tmp.name)
                tmp.write(image_bytes)

            return self._provider.generate_from_image(temp_path, params)
        except Exception as exc:
            raise RuntimeError(f"Generation failed: {exc}") from exc
        finally:
            if temp_path and temp_path.exists():
                temp_path.unlink(missing_ok=True)
