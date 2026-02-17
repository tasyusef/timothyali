import { ogImage, ogSize } from "@/lib/og";

export const size = ogSize;
export const contentType = "image/png";

export default function Image() {
  return ogImage(
    "Systems Thinking",
    "in the Age of AI-Assisted Design",
  );
}
