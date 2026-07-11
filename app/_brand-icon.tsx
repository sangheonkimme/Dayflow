import { ImageResponse } from "next/og";

// Dayflow 브랜드 글리프 — 기존 icon.tsx / apple-icon.tsx 와 동일한 노란 타일 +
// 두 점(눈/콜론) 모티프를 파라메트릭하게 렌더. PWA manifest 용 192/512 아이콘이
// 여기서 재사용된다. Satori(ImageResponse) 제약상 flex/absolute/borderRadius 만 사용.
const YELLOW = "#ffd84d";
const INK = "#1a1814";

// maskable=true: 배경을 모서리까지 풀-블리드(사각) 하고 글리프를 안전영역(중앙 80%)
// 안으로 축소 — OS 가 원형/스쿼클로 마스킹해도 잘리지 않는다.
// maskable=false: 기존 파비콘처럼 라운드 타일 + 코너 점.
export function renderBrandIcon(size: number, opts?: { maskable?: boolean }) {
  const maskable = opts?.maskable ?? false;
  const bigDot = maskable ? size * 0.3 : size * 0.42;
  const smallDot = maskable ? size * 0.15 : size * 0.22;
  const smallInset = maskable ? size * 0.2 : size * 0.18;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: YELLOW,
          borderRadius: maskable ? 0 : size * 0.22,
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: bigDot,
            height: bigDot,
            borderRadius: "50%",
            background: INK,
          }}
        />
        <div
          style={{
            position: "absolute",
            top: smallInset,
            right: smallInset,
            width: smallDot,
            height: smallDot,
            borderRadius: "50%",
            background: INK,
          }}
        />
      </div>
    ),
    { width: size, height: size },
  );
}
