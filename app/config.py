import os
from dataclasses import dataclass
from functools import lru_cache
from pathlib import Path


@dataclass(frozen=True)
class Settings:
    replicate_api_token: str
    model_name: str = "minimax/video-01"


def _load_dotenv_file(dotenv_path: Path) -> None:
    if not dotenv_path.exists():
        return

    for raw_line in dotenv_path.read_text(encoding="utf-8").splitlines():
        line = raw_line.strip()
        if not line or line.startswith("#"):
            continue

        if line.startswith("export "):
            line = line[len("export ") :].strip()

        if "=" not in line:
            continue

        key, value = line.split("=", 1)
        key = key.strip()
        value = value.strip().strip('"').strip("'")
        os.environ.setdefault(key, value)


@lru_cache
def get_settings() -> Settings:
    project_root = Path(__file__).resolve().parents[1]
    _load_dotenv_file(project_root / ".env")

    token = os.environ.get("REPLICATE_API_TOKEN", "").strip()
    model_name = os.environ.get("REPLICATE_MODEL_NAME", "minimax/video-01").strip() or "minimax/video-01"
    return Settings(replicate_api_token=token, model_name=model_name)
