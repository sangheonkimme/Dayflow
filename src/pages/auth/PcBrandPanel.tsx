// @ts-nocheck
import { BrandMark } from "@/pages/auth/BrandMark";
import { AUTH_TEXT } from "@/pages/auth/authText";

export const BrandPanel = ({ dark, lang }) => {
  const t = AUTH_TEXT[lang];
  return (
    <div
      style={{
        flex: 1,
        minHeight: "100vh",
        background: "#1a1814",
        color: "#fff",
        padding: "48px 56px",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* decorative shapes */}
      <div
        style={{
          position: "absolute",
          top: -80,
          right: -80,
          width: 280,
          height: 280,
          borderRadius: "50%",
          background: "#ffd84d",
          opacity: 0.15,
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: -100,
          left: -100,
          width: 320,
          height: 320,
          borderRadius: "50%",
          background: "#dc4c3e",
          opacity: 0.12,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "30%",
          left: "30%",
          width: 80,
          height: 80,
          borderRadius: "50%",
          background: "#ffd84d",
          opacity: 0.06,
        }}
      />

      {/* top: brand */}
      <div style={{ position: "relative" }}>
        <BrandMark size={32} dark={true} />
      </div>

      {/* center: marketing */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          position: "relative",
        }}
      >
        <div
          style={{
            fontSize: 12,
            fontWeight: 700,
            color: "#ffd84d",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            marginBottom: 18,
          }}
        >
          {lang === "ko" ? "돈과 시간, 한 화면에서" : "Money & time, one place"}
        </div>
        <h2
          style={{
            fontSize: 38,
            fontWeight: 800,
            letterSpacing: "-0.03em",
            margin: "0 0 18px",
            lineHeight: 1.15,
          }}
        >
          {lang === "ko" ? (
            <>
              하루는 가볍게
              <br />한 달은 단단하게.
            </>
          ) : (
            <>
              Lighter days,
              <br />
              stronger months.
            </>
          )}
        </h2>
        <p
          style={{
            fontSize: 14,
            color: "rgba(255,255,255,0.65)",
            margin: 0,
            lineHeight: 1.6,
            maxWidth: 380,
          }}
        >
          {lang === "ko"
            ? "가계부와 캘린더를 한 곳에서 관리하세요. 영수증 사진 한 장이면 자동으로 입력됩니다."
            : "Track expenses and your calendar in one view. Snap a receipt and it logs itself."}
        </p>

        {/* mini preview card */}
        <div
          style={{
            marginTop: 36,
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)",
            backdropFilter: "blur(10px)",
            borderRadius: 14,
            padding: 20,
            display: "flex",
            gap: 14,
            alignItems: "center",
            maxWidth: 380,
          }}
        >
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 10,
              background: "#ffd84d",
              display: "grid",
              placeItems: "center",
              fontSize: 22,
              color: "#1a1814",
            }}
          >
            💰
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontSize: 11,
                color: "rgba(255,255,255,0.55)",
                fontWeight: 600,
              }}
            >
              {lang === "ko" ? "이번 달 예산" : "This month"}
            </div>
            <div
              style={{
                fontFamily: "ui-monospace, monospace",
                fontSize: 18,
                fontWeight: 800,
                marginTop: 2,
              }}
            >
              ₩ 1,847,200
              <span
                style={{
                  color: "rgba(255,255,255,0.4)",
                  fontSize: 12,
                  marginLeft: 6,
                }}
              >
                / 2.4M
              </span>
            </div>
            <div
              style={{
                height: 4,
                background: "rgba(255,255,255,0.1)",
                borderRadius: 2,
                marginTop: 8,
                overflow: "hidden",
              }}
            >
              <div
                style={{ width: "77%", height: "100%", background: "#ffd84d" }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* bottom: testimonial */}
      <div
        style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          gap: 12,
          fontSize: 12,
          color: "rgba(255,255,255,0.55)",
        }}
      >
        <div style={{ display: "flex" }}>
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              style={{
                width: 28,
                height: 28,
                borderRadius: "50%",
                background: ["#ffd84d", "#dc4c3e", "#a8d4c0", "#e89aac"][i],
                border: "2px solid #1a1814",
                marginLeft: i === 0 ? 0 : -8,
              }}
            />
          ))}
        </div>
        <span>
          {lang === "ko" ? "10,000+ 직장인이 사용 중" : "10,000+ pros using it"}
        </span>
      </div>
    </div>
  );
};

// ============================================================
// PC LOGIN
// ============================================================
