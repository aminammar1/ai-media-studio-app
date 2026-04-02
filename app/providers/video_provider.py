from pathlib import Path
from typing import Protocol

from app.schemas import GenerationParams


class VideoProvider(Protocol):
    def generate_from_image(self, image_path: Path, params: GenerationParams) -> bytes:
        pass
