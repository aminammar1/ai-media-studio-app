import { NextResponse } from "next/server";

import { editImage } from "@/lib/generate";
import { normalizeOutputUrl } from "@/lib/output";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const prompt = String(formData.get("prompt") ?? "");
    const file = formData.get("image");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "image file is required" },
        { status: 400 }
      );
    }

    // Convert file to data URI for Replicate
    const bytes = await file.arrayBuffer();
    const base64 = Buffer.from(bytes).toString("base64");
    const mimeType = file.type || "image/png";
    const dataUri = `data:${mimeType};base64,${base64}`;

    const output = await editImage(prompt, dataUri);

    const url = normalizeOutputUrl(output);
    return NextResponse.json({ url });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown image edit error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
