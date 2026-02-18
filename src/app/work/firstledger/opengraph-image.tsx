import { ogImage, ogSize } from "@/lib/og";

export const size = ogSize;
export const contentType = "image/png";

export default function Image() {
  return ogImage("First Ledger", "Brand Identity System — 2024");
}
