import type { Metadata } from "next";
import { PdfCanvasPage } from "@/screens/tools/ImageTools";
import { getSiteUrl } from "@/lib/site-url";
import { IMAGE_TOOLS_PUBLIC } from "@/lib/feature-flags";

export const metadata: Metadata = {
  title: "이미지 → PDF 변환기",
  description:
    "여러 장의 JPG·PNG 이미지를 한 번에 PDF 로 합치세요. 가입 없이 무료, 브라우저에서 바로 처리해 안전합니다. 순서 편집과 품질 조절도 지원해요.",
  keywords: [
    "이미지 PDF",
    "JPG PDF",
    "PNG PDF",
    "이미지 합치기",
    "여러 이미지 PDF",
    "온라인 PDF 변환",
    "무료 PDF 변환",
  ],
  alternates: { canonical: "/tools/pdf" },
  openGraph: {
    title: "이미지 → PDF 변환기 · Dayflow",
    description:
      "여러 이미지를 PDF 한 장으로. 브라우저에서 바로 처리, 가입·결제 없이 무료.",
    url: "/tools/pdf",
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "이미지 → PDF 변환기",
  url: `${getSiteUrl()}/tools/pdf`,
  applicationCategory: "UtilitiesApplication",
  operatingSystem: "Web",
  offers: { "@type": "Offer", price: "0", priceCurrency: "KRW" },
  description:
    "여러 이미지를 한 PDF 로 합치는 무료 웹 도구. 가입 없이 브라우저에서 바로 처리.",
  inLanguage: "ko-KR",
};

export default function Page() {
  return (
    <>
      {IMAGE_TOOLS_PUBLIC && (
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <PdfCanvasPage />
    </>
  );
}
