import io
import os

import pytest
from fastapi.testclient import TestClient

from app.main import app


@pytest.mark.skipif(
    os.getenv("RUN_LIVE_REPLICATE_TEST") != "1",
    reason="Set RUN_LIVE_REPLICATE_TEST=1 and REPLICATE_API_TOKEN to run live test",
)
def test_live_replicate_image_to_video() -> None:
    token = os.getenv("REPLICATE_API_TOKEN", "").strip()
    if not token:
        pytest.skip("REPLICATE_API_TOKEN is not set")

    try:
        from PIL import Image
    except Exception as exc:
        pytest.skip(f"Pillow is required for live test: {exc}")

    img = Image.new("RGB", (256, 256), color=(35, 90, 160))
    buf = io.BytesIO()
    img.save(buf, format="PNG")
    buf.seek(0)

    client = TestClient(app)
    response = client.post(
        "/generate-video",
        files={"image": ("live_input.png", buf, "image/png")},
        data={"prompt": "A short cinematic camera move around a blue object."},
    )

    assert response.status_code == 200
    assert response.headers["content-type"].startswith("video/mp4")
    assert len(response.content) > 1024
