import io

from fastapi.testclient import TestClient

from app.api.dependencies import get_video_generation_service
from app.config import get_settings
from app.main import app
from app.schemas import GenerationParams


def test_health_endpoint() -> None:
    client = TestClient(app)
    response = client.get("/health")

    assert response.status_code == 200
    payload = response.json()
    assert payload["status"] == "ok"
    assert payload["model"] == "minimax/video-01"


def test_generate_video_success_with_mock(monkeypatch) -> None:
    client = TestClient(app)

    class FakeService:
        async def generate_from_upload(self, image, params: GenerationParams) -> bytes:
            assert image.filename == "input.png"
            assert isinstance(params, GenerationParams)
            return b"fake-mp4-content"

    app.dependency_overrides[get_video_generation_service] = lambda: FakeService()

    files = {"image": ("input.png", io.BytesIO(b"png-bytes"), "image/png")}
    data = {"prompt": "test prompt"}
    response = client.post("/generate-video", files=files, data=data)

    app.dependency_overrides.clear()

    assert response.status_code == 200
    assert response.content == b"fake-mp4-content"
    assert response.headers["content-type"].startswith("video/mp4")


def test_generate_video_requires_token(monkeypatch) -> None:
    client = TestClient(app)
    monkeypatch.setenv("REPLICATE_API_TOKEN", "")
    get_settings.cache_clear()
    app.dependency_overrides.clear()

    files = {"image": ("input.png", io.BytesIO(b"png-bytes"), "image/png")}
    response = client.post("/generate-video", files=files)

    get_settings.cache_clear()

    assert response.status_code == 500
    assert "Missing REPLICATE_API_TOKEN" in response.text


def test_generate_video_requires_image_content_type() -> None:
    client = TestClient(app)

    class FakeService:
        async def generate_from_upload(self, image, params: GenerationParams) -> bytes:
            raise ValueError("Uploaded file must be an image")

    app.dependency_overrides[get_video_generation_service] = lambda: FakeService()

    files = {"image": ("input.txt", io.BytesIO(b"hello"), "text/plain")}
    response = client.post("/generate-video", files=files)

    app.dependency_overrides.clear()

    assert response.status_code == 400
    assert "Uploaded file must be an image" in response.text


def test_generate_video_maps_invalid_token_to_401() -> None:
    client = TestClient(app)

    class FakeService:
        async def generate_from_upload(self, image, params: GenerationParams) -> bytes:
            raise RuntimeError("Generation failed: Error code: 401 - {'detail': 'Invalid token'}")

    app.dependency_overrides[get_video_generation_service] = lambda: FakeService()

    files = {"image": ("input.png", io.BytesIO(b"png-bytes"), "image/png")}
    response = client.post("/generate-video", files=files)

    app.dependency_overrides.clear()

    assert response.status_code == 401
    assert "Replicate authentication failed" in response.text


def test_generate_video_maps_not_found_to_404() -> None:
    client = TestClient(app)

    class FakeService:
        async def generate_from_upload(self, image, params: GenerationParams) -> bytes:
            raise RuntimeError(
                "Generation failed: Error code: 404 - {'detail': 'The requested resource could not be found.', 'status': 404}"
            )

    app.dependency_overrides[get_video_generation_service] = lambda: FakeService()

    files = {"image": ("input.png", io.BytesIO(b"png-bytes"), "image/png")}
    response = client.post("/generate-video", files=files)

    app.dependency_overrides.clear()

    assert response.status_code == 404
    assert "Replicate resource not found" in response.text
