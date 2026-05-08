import { useState } from "react";
import { SectionHeader } from "@/screens/mobile/shared/SectionHeader";
import { Ico } from "@/screens/mobile/shared/Ico";
import { SubHeader } from "@/screens/mobile/shared/SubHeader";
import { NotifToggleRow } from "@/screens/mobile/shared/NotifToggleRow";

export const NotificationsScreen = ({ onBack }: any) => {
  const [s, setS] = useState({
    push: true,
    daily: true,
    weekly: true,
    budget: true,
    bigSpend: true,
    subRenew: true,
    cal30: true,
    cal1d: false,
    quietStart: "22:00",
    quietEnd: "08:00",
    quietOn: true,
    sound: "기본",
  });
  const set = (k, v) => setS((p) => ({ ...p, [k]: v }));

  return (
    <div>
      <SubHeader title="알림 설정" onBack={onBack} />

      {/* master push status */}
      <div
        className="dfm-card"
        style={{
          marginBottom: 14,
          display: "flex",
          alignItems: "center",
          gap: 12,
          background: s.push ? "var(--mint, #e8f3e2)" : "var(--card)",
        }}
      >
        <div
          className="dfm-tool-ico"
          style={{
            width: 40,
            height: 40,
            background: s.push ? "#b9e7c9" : "var(--bg-paper)",
          }}
        >
          <Ico name="bell" size={18} />
        </div>
        <div style={{ flex: 1 }}>
          <b style={{ fontSize: 14, display: "block" }}>
            {s.push ? "알림이 켜져 있어요" : "알림이 꺼져 있어요"}
          </b>
          <small style={{ fontSize: 11, color: "var(--ink-mute)" }}>
            {s.push ? "iOS 시스템 권한 · 허용됨" : "탭하여 활성화"}
          </small>
        </div>
        <button
          onClick={() => set("push", !s.push)}
          aria-pressed={s.push}
          style={{
            width: 44,
            height: 26,
            borderRadius: 999,
            border: "1px solid " + (s.push ? "var(--ink)" : "var(--line)"),
            background: s.push ? "var(--ink)" : "transparent",
            padding: 0,
            cursor: "pointer",
            position: "relative",
          }}
        >
          <span
            style={{
              position: "absolute",
              top: 2,
              left: s.push ? 20 : 2,
              width: 20,
              height: 20,
              borderRadius: "50%",
              background: s.push ? "var(--bg-paper)" : "var(--ink)",
              transition: "left 0.18s cubic-bezier(0.2,0.7,0.2,1)",
            }}
          />
        </button>
      </div>

      {/* digests */}
      <SectionHeader title="요약 리포트" />
      <div
        className="dfm-card"
        style={{
          padding: 0,
          marginBottom: 14,
          opacity: s.push ? 1 : 0.5,
          pointerEvents: s.push ? "auto" : "none",
        }}
      >
        <NotifToggleRow
          title="일일 요약"
          sub="매일 밤 9:00 · 오늘의 흐름"
          value={s.daily}
          onChange={(v) => set("daily", v)}
        />
        <NotifToggleRow
          title="주간 리포트"
          sub="일요일 오전 10:00 · 이번 주 정리"
          value={s.weekly}
          onChange={(v) => set("weekly", v)}
          last
        />
      </div>

      {/* triggers */}
      <SectionHeader title="가계부" />
      <div
        className="dfm-card"
        style={{
          padding: 0,
          marginBottom: 14,
          opacity: s.push ? 1 : 0.5,
          pointerEvents: s.push ? "auto" : "none",
        }}
      >
        <NotifToggleRow
          ico="wallet"
          title="예산 80% 도달"
          sub="카테고리별 한도 임박"
          value={s.budget}
          onChange={(v) => set("budget", v)}
        />
        <NotifToggleRow
          ico="coin"
          title="큰 지출 감지"
          sub="₩100,000 이상 결제 즉시"
          value={s.bigSpend}
          onChange={(v) => set("bigSpend", v)}
        />
        <NotifToggleRow
          ico="tag"
          title="구독 갱신"
          sub="결제 1일 전 알림"
          value={s.subRenew}
          onChange={(v) => set("subRenew", v)}
          last
        />
      </div>

      <SectionHeader title="캘린더" />
      <div
        className="dfm-card"
        style={{
          padding: 0,
          marginBottom: 14,
          opacity: s.push ? 1 : 0.5,
          pointerEvents: s.push ? "auto" : "none",
        }}
      >
        <NotifToggleRow
          ico="cal"
          title="시작 30분 전"
          value={s.cal30}
          onChange={(v) => set("cal30", v)}
        />
        <NotifToggleRow
          ico="cal"
          title="하루 전 오전 9:00"
          value={s.cal1d}
          onChange={(v) => set("cal1d", v)}
          last
        />
      </div>

      {/* quiet hours */}
      <SectionHeader title="방해 금지" />
      <div className="dfm-card" style={{ padding: 0, marginBottom: 14 }}>
        <NotifToggleRow
          ico="moon"
          title="방해 금지 모드"
          sub="설정한 시간 동안 무음"
          value={s.quietOn}
          onChange={(v) => set("quietOn", v)}
        />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "12px 14px",
            opacity: s.quietOn ? 1 : 0.45,
          }}
        >
          <div style={{ flex: 1, fontSize: 13 }}>시작</div>
          <input
            type="time"
            value={s.quietStart}
            onChange={(e) => set("quietStart", e.target.value)}
            disabled={!s.quietOn}
            style={{
              fontFamily: "var(--mono)",
              fontSize: 14,
              padding: "6px 12px",
              background: "var(--bg-paper)",
              borderRadius: 8,
              border: "1px solid var(--line)",
              color: "var(--ink)",
              outline: "none",
              cursor: s.quietOn ? "pointer" : "default",
            }}
          />
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "12px 14px",
            borderTop: "1px dashed var(--line)",
            opacity: s.quietOn ? 1 : 0.45,
          }}
        >
          <div style={{ flex: 1, fontSize: 13 }}>종료</div>
          <input
            type="time"
            value={s.quietEnd}
            onChange={(e) => set("quietEnd", e.target.value)}
            disabled={!s.quietOn}
            style={{
              fontFamily: "var(--mono)",
              fontSize: 14,
              padding: "6px 12px",
              background: "var(--bg-paper)",
              borderRadius: 8,
              border: "1px solid var(--line)",
              color: "var(--ink)",
              outline: "none",
              cursor: s.quietOn ? "pointer" : "default",
            }}
          />
        </div>
      </div>

      {/* sound */}
      <SectionHeader title="알림음" />
      <div className="dfm-card" style={{ padding: 0, marginBottom: 14 }}>
        {["기본", "차임", "조약돌", "물방울", "무음"].map((opt, i, arr) => (
          <div
            key={opt}
            onClick={() => set("sound", opt)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "12px 14px",
              borderBottom:
                i < arr.length - 1 ? "1px dashed var(--line)" : "none",
              cursor: "pointer",
            }}
          >
            <div style={{ flex: 1, fontSize: 13 }}>{opt}</div>
            {s.sound === opt && <Ico name="check" size={16} />}
          </div>
        ))}
      </div>

      <div style={{ height: 16 }}></div>
    </div>
  );
};

// ────────────────────────────────────────────────
// PROFILE — 프로필 / 계정
// ────────────────────────────────────────────────
