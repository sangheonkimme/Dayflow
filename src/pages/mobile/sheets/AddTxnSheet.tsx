// @ts-nocheck
import { useState, useEffect } from "react";
import { Ico } from "@/pages/mobile/shared/Ico";
import { useTransactions } from "@/data/transactions";

export const AddTxnSheet = ({ open, onClose }) => {
  const [type, setType] = useState("out");        // out | in
  const [amount, setAmount] = useState("");
  const [cat, setCat] = useState("식비");
  const [name, setName] = useState("");
  const [pay, setPay] = useState("체크카드");
  const cats = type === "out"
    ? ["식비", "교통", "쇼핑", "엔터", "건강", "기타"]
    : ["월급", "용돈", "이자", "기타"];
  const pays = ["체크카드", "신용카드", "현금", "계좌이체"];
  const today = new Date();
  const dateStr = `${today.getMonth()+1}월 ${today.getDate()}일 (${"일월화수목금토"[today.getDay()]})`;
  const fmt = (v) => v ? Number(v).toLocaleString() : "0";

  return (
    <>
      <div className={`dfm-sheet-scrim ${open ? "on" : ""}`} onClick={onClose} />
      <div className={`dfm-sheet ${open ? "on" : ""}`}>
        <div className="dfm-sheet-grip" />
        <div className="dfm-sheet-head">
          <div className="ttl">새 거래 추가<small>{dateStr}</small></div>
          <button className="close" onClick={onClose}><Ico name="plus" size={18} /></button>
        </div>

        <div className="dfm-sheet-body" style={{ padding: "0 18px 22px" }}>
          {/* type segmented */}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:6, padding:4, background:"var(--bg)", borderRadius:12, border:"1px solid var(--line)", marginBottom:18 }}>
            {[["out","지출"],["in","수입"]].map(([k,l]) => (
              <button key={k} onClick={() => { setType(k); setCat(k==="out"?"식비":"월급"); }}
                style={{
                  padding:"10px 0", borderRadius:9, border:"none",
                  background: type===k ? "var(--bg-paper)" : "transparent",
                  fontWeight: type===k ? 700 : 500, fontSize:13, cursor:"pointer",
                  color: type===k ? (k==="out"?"#d44":"#1a8a4a") : "var(--ink-mute)",
                  boxShadow: type===k ? "0 1px 3px rgba(0,0,0,0.06)" : "none",
                }}>{l}</button>
            ))}
          </div>

          {/* amount */}
          <div style={{ textAlign:"center", padding:"14px 0 22px", borderBottom:"1px dashed var(--line)" }}>
            <div style={{ fontSize:11, color:"var(--ink-mute)", marginBottom:4, letterSpacing:0.5 }}>금액</div>
            <div style={{ display:"flex", justifyContent:"center", alignItems:"baseline", gap:4, fontFamily:"var(--mono)" }}>
              <span style={{ fontSize:18, color: type==="out"?"#d44":"#1a8a4a", fontWeight:600 }}>
                {type==="out"?"-":"+"}₩
              </span>
              <input value={fmt(amount)} onChange={e => setAmount(e.target.value.replace(/[^\d]/g,""))}
                inputMode="numeric"
                style={{ fontSize:36, fontWeight:700, fontFamily:"var(--mono)", border:"none", background:"transparent",
                  color:"var(--ink)", textAlign:"center", width:"60%", outline:"none" }} />
            </div>
          </div>

          {/* category */}
          <div style={{ marginTop:18 }}>
            <div style={{ fontSize:11, color:"var(--ink-mute)", marginBottom:8, fontWeight:600 }}>카테고리</div>
            <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
              {cats.map(c => (
                <button key={c} onClick={() => setCat(c)}
                  style={{
                    padding:"7px 12px", borderRadius:999, fontSize:12, fontWeight:600,
                    border:"1px solid " + (cat===c?"var(--ink)":"var(--line)"),
                    background: cat===c?"var(--ink)":"transparent",
                    color: cat===c?"var(--bg-paper)":"var(--ink)",
                    cursor:"pointer",
                  }}>{c}</button>
              ))}
            </div>
          </div>

          {/* name */}
          <div style={{ marginTop:16 }}>
            <div style={{ fontSize:11, color:"var(--ink-mute)", marginBottom:6, fontWeight:600 }}>내용</div>
            <input value={name} onChange={e => setName(e.target.value)}
              placeholder={type==="out"?"예: 스타벅스 강남점":"예: 11월 월급"}
              style={{ width:"100%", padding:"11px 12px", border:"1px solid var(--line)", borderRadius:10,
                background:"var(--bg-paper)", fontSize:13, color:"var(--ink)", outline:"none" }} />
          </div>

          {/* method */}
          <div style={{ marginTop:14 }}>
            <div style={{ fontSize:11, color:"var(--ink-mute)", marginBottom:8, fontWeight:600 }}>결제수단</div>
            <div style={{ display:"flex", gap:6 }}>
              {pays.map(p => (
                <button key={p} onClick={() => setPay(p)}
                  style={{
                    flex:1, padding:"9px 0", borderRadius:9, fontSize:11, fontWeight:600,
                    border:"1px solid " + (pay===p?"var(--ink)":"var(--line)"),
                    background: pay===p?"var(--bg)":"transparent",
                    color: pay===p?"var(--ink)":"var(--ink-mute)",
                    cursor:"pointer",
                  }}>{p}</button>
              ))}
            </div>
          </div>

          {/* actions */}
          <div style={{ display:"flex", gap:8, marginTop:22 }}>
            <button onClick={onClose} style={{ flex:1, padding:"14px 0", borderRadius:12, border:"1px solid var(--line)", background:"transparent", color:"var(--ink)", fontWeight:600, fontSize:13, cursor:"pointer" }}>취소</button>
            <button onClick={onClose} style={{ flex:2, padding:"14px 0", borderRadius:12, border:"none", background:"var(--ink)", color:"var(--bg-paper)", fontWeight:700, fontSize:13, cursor:"pointer" }}>저장하기</button>
          </div>
        </div>
      </div>
    </>
  );
}

