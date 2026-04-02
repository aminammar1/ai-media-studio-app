export function normalizeOutputUrl(output: unknown): string {
  if (typeof output === "string") {
    return output;
  }

  if (Array.isArray(output) && output.length > 0) {
    return normalizeOutputUrl(output[0]);
  }

  if (output && typeof output === "object") {
    const maybeUrlValue = output as { url?: unknown };
    if (typeof maybeUrlValue.url === "function") {
      return (maybeUrlValue.url as () => string)();
    }
    if (typeof maybeUrlValue.url === "string") {
      return maybeUrlValue.url;
    }
  }

  throw new Error(`Unsupported Replicate output format: ${typeof output}`);
}