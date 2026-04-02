from pydantic import BaseModel, Field

DEFAULT_PROMPT = (
    "A cinematic close-up portrait. The subject slowly turns toward camera, "
    "natural soft light, shallow depth of field, subtle handheld motion."
)
DEFAULT_NEGATIVE_PROMPT = "low quality, blurry, distorted, jittery motion, watermark"


class GenerationParams(BaseModel):
    prompt: str = Field(default=DEFAULT_PROMPT, min_length=3)
    prompt_optimizer: bool = Field(default=True)
    negative_prompt: str = Field(default=DEFAULT_NEGATIVE_PROMPT)
    length_frames: int = Field(default=49, ge=17, le=257)
    steps: int = Field(default=24, ge=1, le=50)
    cfg: float = Field(default=3.0, ge=1.0, le=20.0)
    image_noise_scale: float = Field(default=0.15, ge=0.0, le=1.0)
    target_size: int = Field(default=640, ge=256, le=1280)
    seed: int = Field(default=42)
