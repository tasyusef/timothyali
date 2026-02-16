import { ogImage, ogSize } from "@/lib/og";

export const size = ogSize;
export const contentType = "image/png";

export default function Image() {
  return ogImage(
    "Starting With Less",
    "A Foundation-First Approach to Design",
  );
}
