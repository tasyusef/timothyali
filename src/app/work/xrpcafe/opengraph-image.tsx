import { ogImage, ogSize } from "@/lib/og";

export const size = ogSize;
export const contentType = "image/png";

export default function Image() {
  return ogImage("xrp.cafe", "Brand Identity & Motion Design — 2021");
}
