import type { Metadata } from "next";
import { CropCanvasPage } from "@/screens/tools/ImageTools";

export const metadata: Metadata = {
  title: "이미지 자르기",
  description:
    "업로드한 이미지를 빠르게 자르고 내보내세요. 원하는 크기와 포맷 설정 — 무료, 가입 없이.",
};

export default function Page() {
  return <CropCanvasPage />;
}
