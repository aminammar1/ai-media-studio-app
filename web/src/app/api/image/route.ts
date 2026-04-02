import { NextResponse } from "next/server";

import { generateImage } from "@/lib/generate";
import { normalizeOutputUrl } from "@/lib/output";

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();
    const output = await generateImage(prompt);

    const url = normalizeOutputUrl(output);
    return NextResponse.json({ url });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown image generation error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
