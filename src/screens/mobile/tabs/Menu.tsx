import { Ico } from "@/screens/mobile/shared/Ico";
import { SectionHeader } from "@/screens/mobile/shared/SectionHeader";
import { IMAGE_TOOLS_PUBLIC } from "@/lib/feature-flags";
import { pressable } from "@/lib/a11y";
import styles from "@/screens/mobile/mobile.module.css";

export const MobileMenu = ({ onNavigate, onProfile }: any) => {
  const links = [
    ["wallet", "가계부 상세", "거래 내역 · 카테고리 분석", "ledger"],
    ["tag", "구독 관리", "12개 활성 · 이번 달 ₩47,000", "subs"],
    ["coin", "연봉 계산기", "실수령액 · 4대 보험", null],
    ...(IMAGE_TOOLS_PUBLIC
      ? [
          ["pdf", "이미지 → PDF", "여러 이미지를 한 파일로", null],
          ["crop", "이미지 자르기", "빠른 크롭과 내보내기", null],
        ]
      : []),
    ["bell", "알림 설정", "리마인더 · 푸시 알림", "notif"],
    ["moon", "테마 · 모양", "다크 모드 · 포인트 컬러", "theme"],
  ];
  return (
    <div>
      <div
        className={styles.dfmCard}
        {...pressable(() => onProfile?.())}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          marginBottom: 14,
          cursor: "pointer",
        }}
      >
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: 14,
            background: "var(--yellow)",
            display: "grid",
            placeItems: "center",
            fontFamily: "var(--hand)",
            fontWeight: 700,
            fontSize: 22,
            border: "1px solid var(--yellow-edge)",
          }}
        >
          나
        </div>
        <div style={{ flex: 1 }}>
          <b style={{ fontSize: 15 }}>나비</b>
          <div style={{ fontSize: 12, color: "var(--ink-mute)" }}>
            nabi@dayflow.app · 무료 플랜
          </div>
        </div>
        <Ico name="chevR" size={16} />
      </div>
      <SectionHeader title="바로가기" />
      <div className={styles.dfmCard} style={{ padding: 0 }}>
        {links.map(([icoName, ttl, sub, route], i) => (
          <div
            key={i}
            {...pressable(() => {
              if (route) onNavigate?.(route);
            })}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "14px 14px",
              borderBottom:
                i < links.length - 1 ? "1px dashed var(--line)" : "none",
              cursor: route ? "pointer" : "default",
              opacity: route ? 1 : 0.78,
            }}
          >
            <div
              className={styles.dfmToolIco}
              style={{ width: 36, height: 36, fontSize: 16 }}
            >
              <Ico name={icoName} size={16} />
            </div>
            <div style={{ flex: 1 }}>
              <b style={{ fontSize: 13, display: "block" }}>{ttl}</b>
              <small style={{ fontSize: 11, color: "var(--ink-mute)" }}>
                {sub}
              </small>
            </div>
            <Ico name="chevR" size={14} />
          </div>
        ))}
      </div>
    </div>
  );
};

// ────────────────────────────────────────────────
// SUB-SCREEN HEADER (back button + title)
// ────────────────────────────────────────────────
