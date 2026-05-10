import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

const YELLOW = "#ffd84d";
const INK = "#1a1814";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: YELLOW,
          borderRadius: 40,
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: 76,
            height: 76,
            borderRadius: "50%",
            background: INK,
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 32,
            right: 36,
            width: 40,
            height: 40,
            borderRadius: "50%",
            background: INK,
          }}
        />
      </div>
    ),
    size,
  );
}
