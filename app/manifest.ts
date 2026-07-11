import type { MetadataRoute } from "next";

// PWA 매니페스트 (App Router 컨벤션 → /manifest.webmanifest 로 서빙).
// 아이콘은 app/icons/*.png route handler 가 ImageResponse 로 생성.
// 서비스워커/오프라인은 이 스프린트 스코프 외 (별도 스프린트).
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Dayflow — 하루를, 종이에 적던 그대로",
    short_name: "Dayflow",
    description:
      "디지털로 옮긴 종이 책상. 가계부·달력·메모·체크리스트를 한 화면에서.",
    start_url: "/dashboard",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    lang: "ko",
    theme_color: "#f7f1e3",
    background_color: "#efe9dc",
    icons: [
      {
        src: "/icons/192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
