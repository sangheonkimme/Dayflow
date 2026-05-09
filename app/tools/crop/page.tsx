import type { Metadata } from "next";
import { CropCanvasPage } from "@/screens/tools/ImageTools";
import { getSiteUrl } from "@/lib/site-url";

export const metadata: Metadata = {
  title: "이미지 자르기",
  description:
    "업로드한 이미지를 빠르게 자르고 내보내세요. 원하는 비율·크기·포맷 설정 — 가입 없이 무료, 브라우저에서 바로 처리해 안전합니다.",
  keywords: [
    "이미지 자르기",
    "이미지 크롭",
    "사진 자르기",
    "온라인 크롭",
    "무료 이미지 편집",
    "JPG 자르기",
    "PNG 자르기",
  ],
  alternates: { canonical: "/tools/crop" },
  openGraph: {
    title: "이미지 자르기 · Dayflow",
    description:
      "원하는 비율·크기로 이미지를 빠르게 크롭. 브라우저에서 바로 처리, 가입·결제 없이 무료.",
    url: "/tools/crop",
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "이미지 자르기",
  url: `${getSiteUrl()}/tools/crop`,
  applicationCategory: "UtilitiesApplication",
  operatingSystem: "Web",
  offers: { "@type": "Offer", price: "0", priceCurrency: "KRW" },
  description:
    "이미지를 원하는 비율·크기로 크롭하는 무료 웹 도구. 가입 없이 브라우저에서 바로 처리.",
  inLanguage: "ko-KR",
};

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <CropCanvasPage />
    </>
  );
}
