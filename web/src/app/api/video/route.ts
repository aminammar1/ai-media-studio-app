import { NextResponse } from "next/server";

import { generateVideo } from "@/lib/generate";
import { normalizeOutputUrl } from "@/lib/output";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const prompt = String(formData.get("prompt") ?? "");
    const file = formData.get("firstFrameImage");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "firstFrameImage is required" }, { status: 400 });
    }

    const output = await generateVideo(prompt, file);

    const url = normalizeOutputUrl(output);
    return NextResponse.json({ url });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown video generation error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
