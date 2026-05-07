// @ts-nocheck
import { useState, useEffect } from "react";
import { Ico } from "@/pages/mobile/shared/Ico";
import { useSubscriptions } from "@/data/subscriptions";

export const AddSubSheet = ({ open, onClose }) => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [cat, setCat] = useState("엔터");
  const [day, setDay] = useState(1);
  const [cycle, setCycle] = useState("월");
  const [pay, setPay] = useState("신용카드");
  const cats = [
    { name: "엔터", color: "#ffb38a", ico: "play"  },
    { name: "업무", color: "#d4c1f0", ico: "tag"   },
    { name: "유틸", color: "#cfe7ff", ico: "cloud" },
    { name: "기타", color: "#fff0a8", ico: "bell"  },
  ];
  const presets = [
    { name: "넷플릭스",       price: 17000, cat: "엔터" },
    { name: "유튜브 프리미엄", price: 14900, cat: "엔터" },
    { name: "스포티파이",     price:  7900, cat: "엔터" },
    { name: "노션",            price: 12000, cat: "업무" },
    { name: "ChatGPT Plus",    price: 28000, cat: "업무" },
    { name: "iCloud+",         price:  3300, cat: "유틸" },
  ];
  const cur = cats.find(c => c.name === cat) || cats[0];
  const cycles = ["월", "년", "주"];
  const pays = ["신용카드", "체크카드", "계좌이체", "기타"];
  const fmt = (v) => v ? Number(v).toLocaleString() : "0";

  return (
    <>
      <div className={`dfm-sheet-scrim ${open ? "on" : ""}`} onClick={onClose} />
      <div className={`dfm-sheet ${open ? "on" : ""}`}>
        <div className="dfm-sheet-grip" />
        <div className="dfm-sheet-head">
          <div className="ttl">새 구독 추가<small>매월 빠져나가는 항목</small></div>
          <button className="close" onClick={onClose}><Ico name="plus" size={18} /></button>
        </div>

        <div className="dfm-sheet-body" style={{ padding: "0 18px 22px" }}>
          {/* preset chips */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 11, color: "var(--ink-mute)", marginBottom: 8, fontWeight: 600 }}>자주 쓰는 서비스</div>
            <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 4, marginRight: -18, paddingRight: 18, scrollbarWidth: "none" }}>
              {presets.map(p => (
                <button key={p.name} onClick={() => { setName(p.name); setPrice(String(p.price)); setCat(p.cat); }}
                  style={{
                    flex: "0 0 auto", padding: "7px 12px", borderRadius: 999, fontSize: 12, fontWeight: 600,
                    border: "1px solid var(--line)", background: "var(--bg-paper)", color: "var(--ink)",
                    cursor: "pointer", whiteSpace: "nowrap",
                  }}>{p.name}</button>
              ))}
            </div>
          </div>

          {/* name with icon swatch */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "6px 0 16px", borderBottom: "1px dashed var(--line)" }}>
            <div className="dfm-tool-ico" style={{ width: 36, height: 36, background: cur.color, borderColor: "rgba(0,0,0,0.06)", flexShrink: 0 }}>
              <Ico name={cur.ico} size={16} />
            </div>
            <input value={name} onChange={e => setName(e.target.value)}
              placeholder="구독 서비스 이름"
              style={{ flex: 1, fontSize: 18, fontWeight: 600, border: "none", background: "transparent", color: "var(--ink)", outline: "none" }} />
          </div>

          {/* price */}
          <div style={{ textAlign: "center", padding: "16px 0 18px", borderBottom: "1px dashed var(--line)" }}>
            <div style={{ fontSize: 11, color: "var(--ink-mute)", marginBottom: 4, letterSpacing: 0.5 }}>{cycle}별 결제 금액</div>
            <div style={{ display: "flex", justifyContent: "center", alignItems: "baseline", gap: 4, fontFamily: "var(--mono)" }}>
              <span style={{ fontSize: 18, color: "#d44", fontWeight: 600 }}>₩</span>
              <input value={fmt(price)} onChange={e => setPrice(e.target.value.replace(/[^\d]/g, ""))}
                inputMode="numeric"
                style={{ fontSize: 32, fontWeight: 700, fontFamily: "var(--mono)", border: "none", background: "transparent", color: "var(--ink)", textAlign: "center", width: "60%", outline: "none" }} />
            </div>
            {/* cycle segmented */}
            <div style={{ display: "inline-flex", gap: 0, marginTop: 10, padding: 3, background: "var(--bg)", borderRadius: 9, border: "1px solid var(--line)" }}>
              {cycles.map(c => (
                <button key={c} onClick={() => setCycle(c)}
                  style={{
                    padding: "5px 14px", borderRadius: 7, fontSize: 11, fontWeight: 600, border: "none",
                    background: cycle === c ? "var(--bg-paper)" : "transparent",
                    color: cycle === c ? "var(--ink)" : "var(--ink-mute)",
                    cursor: "pointer", boxShadow: cycle === c ? "0 1px 2px rgba(0,0,0,0.06)" : "none",
                  }}>{c}별</button>
              ))}
            </div>
          </div>

          {/* category */}
          <div style={{ padding: "14px 0", borderBottom: "1px dashed var(--line)" }}>
            <div style={{ fontSize: 11, color: "var(--ink-mute)", marginBottom: 8, fontWeight: 600 }}>분류</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {cats.map(c => (
                <button key={c.name} onClick={() => setCat(c.name)}
                  style={{
                    display: "inline-flex", alignItems: "center", gap: 6,
                    padding: "7px 12px", borderRadius: 999, fontSize: 12, fontWeight: 600,
                    border: "1px solid " + (cat === c.name ? "var(--ink)" : "var(--line)"),
                    background: cat === c.name ? "var(--ink)" : "transparent",
                    color: cat === c.name ? "var(--bg-paper)" : "var(--ink)",
                    cursor: "pointer",
                  }}>
                  <span style={{ width: 8, height: 8, borderRadius: "50%", background: c.color }} />
                  {c.name}
                </button>
              ))}
            </div>
          </div>

          {/* billing day */}
          <div style={{ padding: "14px 0", borderBottom: "1px dashed var(--line)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
              <span style={{ fontSize: 11, color: "var(--ink-mute)", fontWeight: 600 }}>결제일</span>
              <b style={{ fontFamily: "var(--mono)", fontSize: 14 }}>매월 {day}일</b>
            </div>
            <input type="range" min="1" max="31" value={day} onChange={e => setDay(Number(e.target.value))}
              style={{ width: "100%", accentColor: "var(--ink)" }} />
          </div>

          {/* method */}
          <div style={{ padding: "14px 0 4px" }}>
            <div style={{ fontSize: 11, color: "var(--ink-mute)", marginBottom: 8, fontWeight: 600 }}>결제수단</div>
            <div style={{ display: "flex", gap: 6 }}>
              {pays.map(p => (
                <button key={p} onClick={() => setPay(p)}
                  style={{
                    flex: 1, padding: "9px 0", borderRadius: 9, fontSize: 11, fontWeight: 600,
                    border: "1px solid " + (pay === p ? "var(--ink)" : "var(--line)"),
                    background: pay === p ? "var(--bg)" : "transparent",
                    color: pay === p ? "var(--ink)" : "var(--ink-mute)",
                    cursor: "pointer",
                  }}>{p}</button>
              ))}
            </div>
          </div>

          {/* actions */}
          <div style={{ display: "flex", gap: 8, marginTop: 22 }}>
            <button onClick={onClose} style={{ flex: 1, padding: "14px 0", borderRadius: 12, border: "1px solid var(--line)", background: "transparent", color: "var(--ink)", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>취소</button>
            <button onClick={onClose} style={{ flex: 2, padding: "14px 0", borderRadius: 12, border: "none", background: "var(--ink)", color: "var(--bg-paper)", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>구독 추가하기</button>
          </div>
        </div>
      </div>
    </>
  );
}

