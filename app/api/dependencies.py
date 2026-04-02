from fastapi import HTTPException

from app.config import get_settings
from app.providers.replicate_provider import ReplicateVideoProvider
from app.services.video_generation_service import VideoGenerationService


def get_video_generation_service() -> VideoGenerationService:
    settings = get_settings()
    if not settings.replicate_api_token:
        raise HTTPException(status_code=500, detail="Missing REPLICATE_API_TOKEN")

    provider = ReplicateVideoProvider(
        api_token=settings.replicate_api_token,
        model_name=settings.model_name,
    )
    return VideoGenerationService(provider=provider)
