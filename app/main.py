from fastapi import FastAPI

from app.api.routes.health import router as health_router
from app.api.routes.video import router as video_router


def create_app() -> FastAPI:
    app = FastAPI(title="Image to Video Agent", version="1.0.0")
    app.include_router(health_router)
    app.include_router(video_router)
    return app


app = create_app()
