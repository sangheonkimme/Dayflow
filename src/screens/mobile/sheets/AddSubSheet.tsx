import { useState, type KeyboardEvent } from "react";
import { Ico } from "@/screens/mobile/shared/Ico";
import { useSheet } from "@/screens/mobile/sheets/useSheet";
import { useSubscriptions } from "@/data/subscriptions";
import styles from "@/screens/mobile/mobile.module.css";

export const AddSubSheet = ({ open, onClose }: any) => {
  const { sheetRef, gripHandlers, sheetStyle } = useSheet({
    open,
    onClose: () => onClose?.(),
    snaps: ["medium", "large"],
  });
  const { upsert } = useSubscriptions();
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [cat, setCat] = useState("엔터");
  const [day, setDay] = useState(1);
  const [cycle, setCycle] = useState<"월" | "년">("월");
  const [pay, setPay] = useState("신용카드");

  const handleSubmit = async () => {
    const priceNum = Number(price.replace(/[^0-9]/g, ""));
    if (!name.trim() || priceNum <= 0) return;
    await upsert({
      id: Date.now(),
      name: name.trim(),
      cat,
      price: priceNum,
      cycle,
      day,
      status: "active",
      initial: name.trim().slice(0, 1),
    });
    setName("");
    setPrice("");
    onClose?.();
  };
  const cats = [
    { name: "엔터", color: "#ffb38a", ico: "play" },
    { name: "업무", color: "#d4c1f0", ico: "tag" },
    { name: "유틸", color: "#cfe7ff", ico: "cloud" },
    { name: "기타", color: "#fff0a8", ico: "bell" },
  ];
  const presets = [
    { name: "넷플릭스", price: 17000, cat: "엔터" },
    { name: "유튜브 프리미엄", price: 14900, cat: "엔터" },
    { name: "스포티파이", price: 7900, cat: "엔터" },
    { name: "노션", price: 12000, cat: "업무" },
    { name: "ChatGPT Plus", price: 28000, cat: "업무" },
    { name: "iCloud+", price: 3300, cat: "유틸" },
  ];
  const cur = cats.find((c) => c.name === cat) || cats[0];
  const cycles: ("월" | "년")[] = ["월", "년"];
  const pays = ["신용카드", "체크카드", "계좌이체", "기타"];
  const fmt = (v) => (v ? Number(v).toLocaleString() : "0");

  // 결제일 그리드를 정식 radiogroup 으로 — 화살표/Home/End 로 로빙 포커스 이동.
  // 선택된 칩만 tabbable, 이동 시 즉시 선택(radio select-on-focus).
  const onDayKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const delta: Record<string, number> = {
      ArrowRight: 1,
      ArrowLeft: -1,
      ArrowDown: 7,
      ArrowUp: -7,
    };
    let next = day;
    if (e.key in delta) next = day + delta[e.key];
    else if (e.key === "Home") next = 1;
    else if (e.key === "End") next = 31;
    else return;
    e.preventDefault();
    next = Math.min(31, Math.max(1, next));
    if (next === day) return;
    setDay(next);
    e.currentTarget
      .querySelector<HTMLElement>(`[data-day="${next}"]`)
      ?.focus();
  };

  return (
    <>
      <div
        role="presentation"
        className={`${styles.dfmSheetScrim} ${open ? styles.on : ""}`}
        onClick={onClose}
      />
      <div
        ref={sheetRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label="새 구독 추가"
        className={`${styles.dfmSheet} ${open ? styles.on : ""}`}
        style={sheetStyle}
      >
        <div className={styles.dfmSheetGrip} {...gripHandlers} />
        <div className={styles.dfmSheetHead} {...gripHandlers}>
          <div className={styles.ttl}>
            새 구독 추가<small>매월 빠져나가는 항목</small>
          </div>
          <button className={styles.close} onClick={onClose} aria-label="닫기">
            <Ico name="close" size={18} />
          </button>
        </div>

        <div className={styles.dfmSheetBody} style={{ padding: "0 18px 22px" }}>
          {/* preset chips */}
          <div style={{ marginBottom: 16 }}>
            <div
              style={{
                fontSize: 11,
                color: "var(--ink-mute)",
                marginBottom: 8,
                fontWeight: 600,
              }}
            >
              자주 쓰는 서비스
            </div>
            <div
              style={{
                display: "flex",
                gap: 6,
                overflowX: "auto",
                paddingBottom: 4,
                marginRight: -18,
                paddingRight: 18,
                scrollbarWidth: "none",
              }}
            >
              {presets.map((p) => (
                <button
                  key={p.name}
                  onClick={() => {
                    setName(p.name);
                    setPrice(String(p.price));
                    setCat(p.cat);
                  }}
                  style={{
                    flex: "0 0 auto",
                    padding: "7px 12px",
                    borderRadius: 999,
                    fontSize: 12,
                    fontWeight: 600,
                    border: "1px solid var(--line)",
                    background: "var(--bg-paper)",
                    color: "var(--ink)",
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                  }}
                >
                  {p.name}
                </button>
              ))}
            </div>
          </div>

          {/* name with icon swatch */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "6px 0 16px",
              borderBottom: "1px dashed var(--line)",
            }}
          >
            <div
              className={styles.dfmToolIco}
              style={{
                width: 36,
                height: 36,
                background: cur.color,
                borderColor: "rgba(0,0,0,0.06)",
                flexShrink: 0,
              }}
            >
              <Ico name={cur.ico} size={16} />
            </div>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="구독 서비스 이름"
              style={{
                flex: 1,
                fontSize: 18,
                fontWeight: 600,
                border: "none",
                background: "transparent",
                color: "var(--ink)",
                outline: "none",
              }}
            />
          </div>

          {/* price */}
          <div
            style={{
              textAlign: "center",
              padding: "16px 0 18px",
              borderBottom: "1px dashed var(--line)",
            }}
          >
            <div
              style={{
                fontSize: 11,
                color: "var(--ink-mute)",
                marginBottom: 4,
                letterSpacing: 0.5,
              }}
            >
              {cycle}별 결제 금액
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "baseline",
                gap: 4,
                fontFamily: "var(--mono)",
              }}
            >
              <span style={{ fontSize: 18, color: "#d44", fontWeight: 600 }}>
                ₩
              </span>
              <input
                value={fmt(price)}
                onChange={(e) => setPrice(e.target.value.replace(/[^\d]/g, ""))}
                inputMode="numeric"
                style={{
                  fontSize: 32,
                  fontWeight: 700,
                  fontFamily: "var(--mono)",
                  border: "none",
                  background: "transparent",
                  color: "var(--ink)",
                  textAlign: "center",
                  width: "60%",
                  outline: "none",
                }}
              />
            </div>
            {/* cycle segmented */}
            <div
              style={{
                display: "inline-flex",
                gap: 0,
                marginTop: 10,
                padding: 3,
                background: "var(--bg)",
                borderRadius: 9,
                border: "1px solid var(--line)",
              }}
            >
              {cycles.map((c) => (
                <button
                  key={c}
                  onClick={() => setCycle(c)}
                  style={{
                    padding: "5px 14px",
                    borderRadius: 7,
                    fontSize: 11,
                    fontWeight: 600,
                    border: "none",
                    background: cycle === c ? "var(--bg-paper)" : "transparent",
                    color: cycle === c ? "var(--ink)" : "var(--ink-mute)",
                    cursor: "pointer",
                    boxShadow:
                      cycle === c ? "0 1px 2px rgba(0,0,0,0.06)" : "none",
                  }}
                >
                  {c}별
                </button>
              ))}
            </div>
          </div>

          {/* category */}
          <div
            style={{
              padding: "14px 0",
              borderBottom: "1px dashed var(--line)",
            }}
          >
            <div
              style={{
                fontSize: 11,
                color: "var(--ink-mute)",
                marginBottom: 8,
                fontWeight: 600,
              }}
            >
              분류
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {cats.map((c) => (
                <button
                  key={c.name}
                  onClick={() => setCat(c.name)}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "7px 12px",
                    borderRadius: 999,
                    fontSize: 12,
                    fontWeight: 600,
                    border:
                      "1px solid " +
                      (cat === c.name ? "var(--ink)" : "var(--line)"),
                    background: cat === c.name ? "var(--ink)" : "transparent",
                    color: cat === c.name ? "var(--bg-paper)" : "var(--ink)",
                    cursor: "pointer",
                  }}
                >
                  <span
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: c.color,
                    }}
                  />
                  {c.name}
                </button>
              ))}
            </div>
          </div>

          {/* billing day */}
          <div
            style={{
              padding: "14px 0",
              borderBottom: "1px dashed var(--line)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
                marginBottom: 8,
              }}
            >
              <span
                id="addsub-payday-label"
                style={{
                  fontSize: 11,
                  color: "var(--ink-mute)",
                  fontWeight: 600,
                }}
              >
                결제일
              </span>
              <b style={{ fontFamily: "var(--mono)", fontSize: 14 }}>
                매월 {day}일
              </b>
            </div>
            {/* 슬라이더는 31스텝이 11px 간격이라 정확한 날짜 선택이 불가 —
                분류/결제수단과 같은 탭-선택 chip 그리드로 통일.
                단일 선택이라 radiogroup 시맨틱 + 44px 터치 타깃. */}
            <div
              role="radiogroup"
              aria-labelledby="addsub-payday-label"
              tabIndex={-1}
              onKeyDown={onDayKey}
              style={{
                outline: "none",
                display: "grid",
                gridTemplateColumns: "repeat(7, 1fr)",
                gap: 5,
              }}
            >
              {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
                <button
                  key={d}
                  type="button"
                  role="radio"
                  aria-checked={day === d}
                  aria-label={`${d}일`}
                  data-day={d}
                  tabIndex={day === d ? 0 : -1}
                  onClick={() => setDay(d)}
                  style={{
                    display: "grid",
                    placeItems: "center",
                    minHeight: 44,
                    padding: 0,
                    borderRadius: 9,
                    fontSize: 12,
                    fontWeight: 600,
                    fontFamily: "var(--mono)",
                    border:
                      "1px solid " + (day === d ? "var(--ink)" : "var(--line)"),
                    background: day === d ? "var(--ink)" : "transparent",
                    color: day === d ? "var(--bg-paper)" : "var(--ink)",
                    cursor: "pointer",
                  }}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* method */}
          <div style={{ padding: "14px 0 4px" }}>
            <div
              style={{
                fontSize: 11,
                color: "var(--ink-mute)",
                marginBottom: 8,
                fontWeight: 600,
              }}
            >
              결제수단
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              {pays.map((p) => (
                <button
                  key={p}
                  onClick={() => setPay(p)}
                  style={{
                    flex: 1,
                    padding: "9px 0",
                    borderRadius: 9,
                    fontSize: 11,
                    fontWeight: 600,
                    border:
                      "1px solid " + (pay === p ? "var(--ink)" : "var(--line)"),
                    background: pay === p ? "var(--bg)" : "transparent",
                    color: pay === p ? "var(--ink)" : "var(--ink-mute)",
                    cursor: "pointer",
                  }}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* actions */}
          <div style={{ display: "flex", gap: 8, marginTop: 22 }}>
            <button
              onClick={onClose}
              style={{
                flex: 1,
                padding: "14px 0",
                borderRadius: 12,
                border: "1px solid var(--line)",
                background: "transparent",
                color: "var(--ink)",
                fontWeight: 600,
                fontSize: 13,
                cursor: "pointer",
              }}
            >
              취소
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!name.trim() || !price}
              style={{
                flex: 2,
                padding: "14px 0",
                borderRadius: 12,
                border: "none",
                background: "var(--ink)",
                color: "var(--bg-paper)",
                fontWeight: 700,
                fontSize: 13,
                cursor: !name.trim() || !price ? "not-allowed" : "pointer",
                opacity: !name.trim() || !price ? 0.5 : 1,
              }}
            >
              구독 추가하기
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
