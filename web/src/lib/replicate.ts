import Replicate from "replicate";

function getClient() {
  const token = process.env.REPLICATE_API_TOKEN?.trim();
  if (!token) {
    throw new Error("Missing REPLICATE_API_TOKEN");
  }

  const client = new Replicate({ auth: token, useFileOutput: false });
  client.fetch = (url, options) => fetch(url, { ...options, cache: "no-store" });
  return client;
}

type ReplicateModelSlug = `${string}/${string}` | `${string}/${string}:${string}`;

export async function runModel(model: ReplicateModelSlug, input: Record<string, unknown>) {
  const client = getClient();
  return client.run(model, { input });
}
