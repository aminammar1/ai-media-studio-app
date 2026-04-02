import io

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile
from fastapi.responses import StreamingResponse

from app.api.dependencies import get_video_generation_service
from app.schemas import DEFAULT_NEGATIVE_PROMPT, DEFAULT_PROMPT, GenerationParams
from app.services.video_generation_service import VideoGenerationService

router = APIRouter(tags=["video"])


def _map_runtime_error_to_http(exc: RuntimeError) -> HTTPException:
    message = str(exc)
    lowered = message.lower()

    if "invalid token" in lowered or "invalid authentication token" in lowered or "error code: 401" in lowered:
        return HTTPException(
            status_code=401,
            detail="Replicate authentication failed. Check REPLICATE_API_TOKEN in .env.",
        )

    if "error code: 404" in lowered or "could not be found" in lowered:
        return HTTPException(
            status_code=404,
            detail="Replicate resource not found. Verify provider model configuration and try again.",
        )

    return HTTPException(status_code=500, detail=message)


def parse_generation_params(
    prompt: str = Form(DEFAULT_PROMPT),
    prompt_optimizer: bool = Form(True),
    negative_prompt: str = Form(DEFAULT_NEGATIVE_PROMPT),
    length_frames: int = Form(49),
    steps: int = Form(24),
    cfg: float = Form(3.0),
    image_noise_scale: float = Form(0.15),
    target_size: int = Form(640),
    seed: int = Form(42),
) -> GenerationParams:
    return GenerationParams(
        prompt=prompt,
        prompt_optimizer=prompt_optimizer,
        negative_prompt=negative_prompt,
        length_frames=length_frames,
        steps=steps,
        cfg=cfg,
        image_noise_scale=image_noise_scale,
        target_size=target_size,
        seed=seed,
    )


@router.post("/generate-video")
async def generate_video(
    image: UploadFile = File(...),
    params: GenerationParams = Depends(parse_generation_params),
    service: VideoGenerationService = Depends(get_video_generation_service),
) -> StreamingResponse:
    try:
        video_bytes = await service.generate_from_upload(image=image, params=params)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    except RuntimeError as exc:
        raise _map_runtime_error_to_http(exc) from exc

    filename = "generated_reel.mp4"
    headers = {"Content-Disposition": f'attachment; filename="{filename}"'}
    return StreamingResponse(io.BytesIO(video_bytes), media_type="video/mp4", headers=headers)
