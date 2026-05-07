// @ts-nocheck
import { useState } from "react";
import { Ico } from "@/pages/mobile/shared/Ico";
import { SubHeader } from "@/pages/mobile/shared/SubHeader";
import { SwipeRow } from "@/pages/mobile/shared/SwipeRow";
import { useSubscriptions } from "@/data/subscriptions";

export const SubscriptionsScreen = ({ onBack, onAdd }) => {
  const subs = [
    { ico: "play",  name: "넷플릭스",       plan: "프리미엄 4K",        price: 17000, day: 8,  cat: "엔터", color: "#ffb38a" },
    { ico: "music", name: "스포티파이",     plan: "개인",               price:  7900, day: 12, cat: "엔터", color: "#b9e7c9" },
    { ico: "play",  name: "유튜브 프리미엄", plan: "광고 제거",          price: 14900, day: 3,  cat: "엔터", color: "#ffb38a" },
    { ico: "cloud", name: "iCloud+",        plan: "200GB",              price:  3300, day: 17, cat: "유틸", color: "#cfe7ff" },
    { ico: "tag",   name: "노션",            plan: "플러스",             price: 12000, day: 1,  cat: "업무", color: "#d4c1f0" },
    { ico: "tag",   name: "Figma",           plan: "프로페셔널",         price: 19500, day: 21, cat: "업무", color: "#d4c1f0" },
    { ico: "doc",   name: "어도비 CC",       plan: "포토 플랜",          price: 11000, day: 14, cat: "업무", color: "#d4c1f0" },
    { ico: "music", name: "애플뮤직",        plan: "패밀리",             price: 14900, day: 9,  cat: "엔터", color: "#b9e7c9" },
    { ico: "cloud", name: "Dropbox",         plan: "Plus 2TB",           price: 13900, day: 24, cat: "유틸", color: "#cfe7ff" },
    { ico: "tag",   name: "1Password",       plan: "개인",               price:  4500, day: 6,  cat: "유틸", color: "#cfe7ff" },
    { ico: "play",  name: "쿠팡플레이",      plan: "와우 멤버십 포함",   price:  7890, day: 18, cat: "엔터", color: "#ffb38a" },
    { ico: "doc",   name: "ChatGPT Plus",    plan: "월간",               price: 28000, day: 27, cat: "업무", color: "#d4c1f0" },
  ];
  const total = subs.reduce((a, s) => a + s.price, 0);
  const [filter, setFilter] = useState("전체");
  const cats = ["전체", "엔터", "업무", "유틸"];
  const visible = filter === "전체" ? subs : subs.filter(s => s.cat === filter);

  // upcoming charges (next 7 days) — fake "today is Nov 11"
  const today = 11;
  const upcoming = subs
    .map(s => ({ ...s, daysAway: ((s.day - today) + 30) % 30 }))
    .filter(s => s.daysAway <= 7)
    .sort((a, b) => a.daysAway - b.daysAway)
    .slice(0, 3);

  return (
    <div>
      <SubHeader
        title="구독 관리"
        onBack={onBack}
        action={<button className="dfm-icon-btn" aria-label="추가" onClick={onAdd}><Ico name="plus" size={18} /></button>}
      />

      {/* hero summary */}
      <div className="dfm-card" style={{ background: "var(--yellow)", borderColor: "var(--yellow-edge)", marginBottom: 14, position: "relative", overflow: "hidden" }}>
        <small style={{ fontSize: 11, color: "var(--ink-mute)", letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 700 }}>이번 달 구독료</small>
        <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginTop: 4 }}>
          <b style={{ fontSize: 30, fontFamily: "var(--mono)", letterSpacing: "-0.02em" }}>₩{total.toLocaleString()}</b>
          <span style={{ fontSize: 12, color: "var(--ink-mute)" }}>/ {subs.length}개</span>
        </div>
        <div style={{ display: "flex", gap: 14, marginTop: 12, fontSize: 11 }}>
          <span><b style={{ fontFamily: "var(--mono)", fontSize: 13 }}>₩{subs.filter(s=>s.cat==="엔터").reduce((a,s)=>a+s.price,0).toLocaleString()}</b><div style={{ color: "var(--ink-mute)" }}>엔터테인먼트</div></span>
          <span><b style={{ fontFamily: "var(--mono)", fontSize: 13 }}>₩{subs.filter(s=>s.cat==="업무").reduce((a,s)=>a+s.price,0).toLocaleString()}</b><div style={{ color: "var(--ink-mute)" }}>업무</div></span>
          <span><b style={{ fontFamily: "var(--mono)", fontSize: 13 }}>₩{subs.filter(s=>s.cat==="유틸").reduce((a,s)=>a+s.price,0).toLocaleString()}</b><div style={{ color: "var(--ink-mute)" }}>유틸리티</div></span>
        </div>
      </div>

      {/* upcoming */}
      <SectionHeader title="다가오는 결제" />
      <div className="dfm-card" style={{ padding: 0, marginBottom: 14 }}>
        {upcoming.map((s, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", borderBottom: i < upcoming.length - 1 ? "1px dashed var(--line)" : "none" }}>
            <div className="dfm-tool-ico" style={{ width: 32, height: 32, background: s.color, borderColor: "rgba(0,0,0,0.06)" }}><Ico name={s.ico} size={14} /></div>
            <div style={{ flex: 1 }}>
              <b style={{ fontSize: 13, display: "block" }}>{s.name}</b>
              <small style={{ fontSize: 11, color: "var(--ink-mute)" }}>{s.daysAway === 0 ? "오늘" : `${s.daysAway}일 후`} · 매월 {s.day}일</small>
            </div>
            <b style={{ fontSize: 13, fontFamily: "var(--mono)" }}>₩{s.price.toLocaleString()}</b>
          </div>
        ))}
      </div>

      {/* filter chips */}
      <SectionHeader title="전체 구독" />
      <div style={{ display: "flex", gap: 6, marginBottom: 10, overflowX: "auto", paddingBottom: 4 }}>
        {cats.map(c => (
          <button key={c} onClick={() => setFilter(c)}
            style={{
              padding: "7px 13px", borderRadius: 999, fontSize: 12, fontWeight: 600,
              border: "1px solid " + (filter === c ? "var(--ink)" : "var(--line)"),
              background: filter === c ? "var(--ink)" : "transparent",
              color: filter === c ? "var(--bg-paper)" : "var(--ink)",
              whiteSpace: "nowrap", cursor: "pointer",
            }}>{c}</button>
        ))}
      </div>

      {/* list */}
      <div className="dfm-card" style={{ padding: 0 }}>
        {visible.map((s, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 14px", borderBottom: i < visible.length - 1 ? "1px dashed var(--line)" : "none", cursor: "pointer" }}>
            <div className="dfm-tool-ico" style={{ width: 36, height: 36, background: s.color, borderColor: "rgba(0,0,0,0.06)" }}>
              <Ico name={s.ico} size={16} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <b style={{ fontSize: 13, display: "block" }}>{s.name}</b>
              <small style={{ fontSize: 11, color: "var(--ink-mute)" }}>{s.plan} · 매월 {s.day}일</small>
            </div>
            <div style={{ textAlign: "right" }}>
              <b style={{ fontSize: 13, fontFamily: "var(--mono)", display: "block" }}>₩{s.price.toLocaleString()}</b>
              <small style={{ fontSize: 10, color: "var(--ink-mute)" }}>월</small>
            </div>
          </div>
        ))}
      </div>

      <div style={{ height: 16 }}></div>
    </div>
  );
}

// ────────────────────────────────────────────────
// NOTIFICATIONS — 알림 설정
// ────────────────────────────────────────────────
