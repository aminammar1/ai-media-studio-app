import { IMAGE_MODEL, VIDEO_MODEL } from "@/lib/models";
import { runModel } from "@/lib/replicate";

export async function generateImage(prompt: string) {
  return runModel(`${IMAGE_MODEL.owner}/${IMAGE_MODEL.name}`, {
    prompt,
    aspect_ratio: "1:1",
    image_size: "1K",
    safety_filter_level: "block_only_high",
    output_format: "jpg",
  });
}

export async function editImage(prompt: string, image: string) {
  return runModel(`${IMAGE_MODEL.owner}/${IMAGE_MODEL.name}`, {
    prompt,
    image,
    aspect_ratio: "1:1",
    image_size: "1K",
    safety_filter_level: "block_only_high",
    output_format: "jpg",
  });
}

export async function generateVideo(prompt: string, firstFrameImage: File) {
  return runModel(`${VIDEO_MODEL.owner}/${VIDEO_MODEL.name}`, {
    prompt,
    prompt_optimizer: true,
    first_frame_image: firstFrameImage,
  });
}
