// @ts-nocheck
import { useState, useEffect, useMemo } from "react";
import { Ico } from "@/pages/mobile/shared/Ico";
import { useTransactions } from "@/features/transactions/hooks/useTransactions";
import { useEvents } from "@/features/events/hooks/useEvents";
import { useMemos } from "@/features/memos/hooks/useMemos";

export const SearchSheet = ({ open, onClose, onJump }) => {
  const [q, setQ] = useState("");
  const inputRef = useRef(null);
  useEffect(() => {
    if (open) {
      const t = setTimeout(() => inputRef.current?.focus(), 80);
      return () => clearTimeout(t);
    } else {
      setQ("");
    }
  }, [open]);

  // unified search corpus across the app
  const corpus = [
    // 거래
    { kind: "거래",   tab: "ledger",   ico: "wallet", title: "스타벅스 강남점",      sub: "11/06 · 식비 · ₩6,800",   tone: "#ffd1b3" },
    { kind: "거래",   tab: "ledger",   ico: "wallet", title: "GS25 편의점",          sub: "11/05 · 식비 · ₩4,200",   tone: "#ffd1b3" },
    { kind: "거래",   tab: "ledger",   ico: "wallet", title: "11월 월급",             sub: "11/01 · 수입 · +₩3,200,000", tone: "#b9e7c9" },
    { kind: "거래",   tab: "ledger",   ico: "wallet", title: "쿠팡 — 생필품",         sub: "11/03 · 쇼핑 · ₩42,500",  tone: "#d4c1f0" },
    { kind: "거래",   tab: "ledger",   ico: "wallet", title: "지하철",                sub: "11/06 · 교통 · ₩1,400",   tone: "#cfe7ff" },
    // 구독
    { kind: "구독",   tab: "menu",     route: "subs", ico: "play",  title: "넷플릭스",       sub: "프리미엄 4K · 매월 8일 · ₩17,000", tone: "#ffb38a" },
    { kind: "구독",   tab: "menu",     route: "subs", ico: "music", title: "스포티파이",     sub: "개인 · 매월 12일 · ₩7,900",      tone: "#b9e7c9" },
    { kind: "구독",   tab: "menu",     route: "subs", ico: "tag",   title: "노션",            sub: "플러스 · 매월 1일 · ₩12,000",    tone: "#d4c1f0" },
    { kind: "구독",   tab: "menu",     route: "subs", ico: "doc",   title: "ChatGPT Plus",    sub: "월간 · 매월 27일 · ₩28,000",     tone: "#d4c1f0" },
    { kind: "구독",   tab: "menu",     route: "subs", ico: "cloud", title: "iCloud+",         sub: "200GB · 매월 17일 · ₩3,300",     tone: "#cfe7ff" },
    // 일정
    { kind: "일정",   tab: "calendar", ico: "cal",   title: "디자인 리뷰",          sub: "11/22 · 14:00 — 15:00 · 회의실 A", tone: "#ffd95e" },
    { kind: "일정",   tab: "calendar", ico: "cal",   title: "헬스장",                sub: "11/14 · 19:30 · 강남점",          tone: "#b9e7c9" },
    { kind: "일정",   tab: "calendar", ico: "cal",   title: "민지랑 저녁",           sub: "11/22 · 19:00 · 합정 단골집",      tone: "#ffb38a" },
    // 메모 / 할 일
    { kind: "메모",   tab: "home",     ico: "tag",   title: "이번 주 회고",         sub: "디자인 리뷰 잘 마무리…",          tone: "#fff0a8" },
    { kind: "메모",   tab: "home",     ico: "tag",   title: "살 것",                  sub: "우유 · 계란 · 시리얼 · 바나나",   tone: "#ffd2dc" },
    { kind: "메모",   tab: "home",     ico: "tag",   title: "아이디어",               sub: "잠금화면 위젯 — 오늘 예산 한 줄로", tone: "#d4efdb" },
    { kind: "할 일",  tab: "home",     ico: "check", title: "월말 카드 명세서 정리", sub: "가계부",                          tone: "#fff0a8" },
    { kind: "할 일",  tab: "home",     ico: "check", title: "수요일 회의실 예약",     sub: "업무",                            tone: "#fff0a8" },
    // 도구
    { kind: "도구",   tab: "menu",     ico: "coin",  title: "연봉 계산기",            sub: "실수령액 · 4대 보험",             tone: "#fff0a8" },
    { kind: "도구",   tab: "menu",     ico: "pdf",   title: "이미지 → PDF",           sub: "여러 이미지를 한 파일로",          tone: "#cfe7ff" },
    { kind: "도구",   tab: "menu",     ico: "crop",  title: "이미지 자르기",          sub: "빠른 크롭과 내보내기",             tone: "#d4efdb" },
  ];

  const recent = ["넷플릭스", "스타벅스", "디자인 리뷰", "월급"];
  const trimmed = q.trim().toLowerCase();
  const matches = trimmed
    ? corpus.filter(it =>
        it.title.toLowerCase().includes(trimmed) ||
        it.sub.toLowerCase().includes(trimmed) ||
        it.kind.toLowerCase().includes(trimmed))
    : [];

  // group by kind
  const grouped = matches.reduce((acc, it) => {
    (acc[it.kind] = acc[it.kind] || []).push(it);
    return acc;
  }, {});

  const highlight = (text) => {
    if (!trimmed) return text;
    const i = text.toLowerCase().indexOf(trimmed);
    if (i < 0) return text;
    return (
      <>
        {text.slice(0, i)}
        <mark style={{ background: "var(--yellow)", color: "var(--ink)", padding: "0 1px", borderRadius: 2 }}>
          {text.slice(i, i + trimmed.length)}
        </mark>
        {text.slice(i + trimmed.length)}
      </>
    );
  };

  const goTo = (it) => onJump?.(it.route || it.tab);

  return (
    <>
      <div className={`dfm-sheet-scrim ${open ? "on" : ""}`} onClick={onClose} />
      <div className={`dfm-sheet ${open ? "on" : ""}`} style={{ height: "92vh", maxHeight: "92vh" }}>
        <div className="dfm-sheet-grip" />
        {/* search bar */}
        <div style={{ padding: "4px 16px 12px", borderBottom: "1px dashed var(--line)" }}>
          <div style={{
            display: "flex", alignItems: "center", gap: 10,
            padding: "11px 14px", background: "var(--bg)",
            border: "1px solid var(--line)", borderRadius: 12,
          }}>
            <Ico name="search" size={16} />
            <input ref={inputRef} value={q} onChange={e => setQ(e.target.value)}
              placeholder="거래 · 구독 · 일정 · 메모 검색"
              style={{ flex: 1, fontSize: 14, fontWeight: 500, border: "none", background: "transparent", color: "var(--ink)", outline: "none" }} />
            {q && (
              <button onClick={() => setQ("")} style={{ background: "transparent", border: "none", color: "var(--ink-mute)", cursor: "pointer", padding: 0, fontSize: 14, lineHeight: 1 }}>✕</button>
            )}
            <button onClick={onClose} style={{ background: "transparent", border: "none", color: "var(--ink-mute)", cursor: "pointer", fontSize: 13, fontWeight: 600, padding: 0, marginLeft: 4 }}>취소</button>
          </div>
        </div>

        <div className="dfm-sheet-body" style={{ padding: "12px 16px 22px", overflowY: "auto" }}>
          {!trimmed && (
            <>
              {/* recent */}
              <div style={{ marginBottom: 18 }}>
                <div style={{ fontSize: 11, color: "var(--ink-mute)", marginBottom: 8, fontWeight: 600, letterSpacing: 0.5 }}>최근 검색</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {recent.map(r => (
                    <button key={r} onClick={() => setQ(r)}
                      style={{
                        padding: "7px 12px", borderRadius: 999, fontSize: 12, fontWeight: 600,
                        border: "1px solid var(--line)", background: "var(--bg-paper)",
                        color: "var(--ink)", cursor: "pointer",
                      }}>{r}</button>
                  ))}
                </div>
              </div>

              {/* shortcuts */}
              <div>
                <div style={{ fontSize: 11, color: "var(--ink-mute)", marginBottom: 8, fontWeight: 600, letterSpacing: 0.5 }}>바로가기</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                  {[
                    { ico: "wallet", title: "이번 달 가계부",  tone: "#fff0a8", target: "ledger" },
                    { ico: "cal",    title: "11월 캘린더",     tone: "#cfe7ff", target: "calendar" },
                    { ico: "tag",    title: "구독 관리",        tone: "#d4c1f0", target: "subs" },
                    { ico: "bell",   title: "알림 설정",        tone: "#ffd2dc", target: "notif" },
                  ].map(s => (
                    <button key={s.target} onClick={() => onJump?.(s.target)}
                      style={{
                        display: "flex", alignItems: "center", gap: 10,
                        padding: "12px 12px", borderRadius: 12,
                        border: "1px solid var(--line)", background: "var(--bg-paper)",
                        cursor: "pointer", textAlign: "left",
                      }}>
                      <div className="dfm-tool-ico" style={{ width: 32, height: 32, background: s.tone, borderColor: "rgba(0,0,0,0.06)" }}>
                        <Ico name={s.ico} size={14} />
                      </div>
                      <b style={{ fontSize: 12 }}>{s.title}</b>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {trimmed && matches.length === 0 && (
            <div style={{ padding: "60px 0", textAlign: "center", color: "var(--ink-mute)" }}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>🔍</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "var(--ink)" }}>"{q}" 결과가 없어요</div>
              <small style={{ fontSize: 11 }}>다른 단어로 검색해보세요</small>
            </div>
          )}

          {trimmed && matches.length > 0 && (
            <>
              <div style={{ fontSize: 11, color: "var(--ink-mute)", marginBottom: 10, fontWeight: 600 }}>
                {matches.length}개 결과
              </div>
              {Object.entries(grouped).map(([kind, items]) => (
                <div key={kind} style={{ marginBottom: 14 }}>
                  <div style={{ fontSize: 10, color: "var(--ink-mute)", letterSpacing: 0.6, fontWeight: 700, textTransform: "uppercase", marginBottom: 6 }}>{kind}</div>
                  <div className="dfm-card" style={{ padding: 0 }}>
                    {items.map((it, i) => (
                      <button key={i} onClick={() => goTo(it)}
                        style={{
                          display: "flex", alignItems: "center", gap: 12,
                          padding: "11px 14px", width: "100%",
                          borderBottom: i < items.length - 1 ? "1px dashed var(--line)" : "none",
                          background: "transparent", border: "none", textAlign: "left",
                          cursor: "pointer", color: "var(--ink)",
                        }}>
                        <div className="dfm-tool-ico" style={{ width: 32, height: 32, background: it.tone, borderColor: "rgba(0,0,0,0.06)", flexShrink: 0 }}>
                          <Ico name={it.ico} size={14} />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <b style={{ fontSize: 13, display: "block" }}>{highlight(it.title)}</b>
                          <small style={{ fontSize: 11, color: "var(--ink-mute)", display: "block", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{highlight(it.sub)}</small>
                        </div>
                        <Ico name="chevR" size={14} />
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </>
  );
}

