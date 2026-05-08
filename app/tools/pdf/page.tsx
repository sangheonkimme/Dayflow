import type { Metadata } from "next";
import { PdfCanvasPage } from "@/screens/tools/ImageTools";

export const metadata: Metadata = {
  title: "이미지 → PDF",
  description:
    "여러 이미지를 하나의 PDF로 깔끔하게 합쳐요. 품질 유지와 순서 편집 — 무료, 가입 없이.",
};

export default function Page() {
  return <PdfCanvasPage />;
}
