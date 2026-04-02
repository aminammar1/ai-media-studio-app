import replicate

from app.config import get_settings


def main() -> int:
    get_settings.cache_clear()
    settings = get_settings()

    if not settings.replicate_api_token:
        print("ERROR: Missing REPLICATE_API_TOKEN (set it in .env)")
        return 1

    try:
        try:
            client = replicate.Client(bearer_token=settings.replicate_api_token)
        except TypeError:
            client = replicate.Client(api_token=settings.replicate_api_token)

        model_owner, model_name = settings.model_name.split("/", 1)
        model = client.models.get(model_owner=model_owner, model_name=model_name)
        model_name = f"{model_owner}/{getattr(model, 'name', model_name)}"
        print(f"OK: token is valid and model is accessible ({model_name})")
        return 0
    except Exception as exc:
        text = str(exc)
        lowered = text.lower()
        if "invalid authentication token" in lowered or "invalid token" in lowered or "error code: 401" in lowered:
            print("ERROR: Invalid REPLICATE_API_TOKEN")
            return 2
        print(f"ERROR: token/model check failed: {text}")
        return 3


if __name__ == "__main__":
    raise SystemExit(main())
