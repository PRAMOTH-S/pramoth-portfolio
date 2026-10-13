import { OG_SIZE, renderOgImage } from "@/lib/ogImage";

export const alt = "Pramoth S — Product Development Engineer · Robotics, Embedded, AI";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  return renderOgImage();
}
