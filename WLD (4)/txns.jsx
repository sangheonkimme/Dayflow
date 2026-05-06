/* global React, Icon */
const { useState, useMemo } = React;

// ============================================================
// TRANSACTIONS PAGE — 거래내역 detail
// Detailed list with search, filters, range, detail panel
// ============================================================

const TXN_DATA = [
  { id: 1,  date: "2026-05-02", time: "14:32", label: "스타벅스 강남R점",   note: "라떼 + 샌드위치", amount: -12300,  type: "out", icon: "coffee", cat: "식비",   pay: "신한카드", memo: "팀원과 1:1" },
  { id: 2,  date: "2026-05-02", time: "12:10", label: "GS25",             note: "음료수, 간식",      amount: -4800,   type: "out", icon: "wallet", cat: "식비",   pay: "현대카드", memo: "" },
  { id: 3,  date: "2026-05-02", time: "09:00", label: "월급 입금",         note: "(주)디자인하우스 5월", amount: 3650000, type: "in",  icon: "cash",   cat: "급여",   pay: "신한 입금", memo: "정기 급여" },
  { id: 4,  date: "2026-05-01", time: "23:14", label: "택시",             note: "심야할증",          amount: -18400,  type: "out", icon: "zap",    cat: "교통",   pay: "신한카드", memo: "회식 후 귀가" },
  { id: 5,  date: "2026-05-01", time: "20:42", label: "한식주점 도담",     note: "팀 회식 N빵",        amount: -42000,  type: "out", icon: "wallet", cat: "외식",   pay: "신한카드", memo: "5명 워크샵" },
  { id: 6,  date: "2026-05-01", time: "10:00", label: "월세",             note: "정기 자동이체",      amount: -850000, type: "out", icon: "home",   cat: "주거",   pay: "자동이체", memo: "5월분" },
  { id: 7,  date: "2026-05-01", time: "08:00", label: "헬스장",            note: "5월 정기결제",       amount: -89000,  type: "out", icon: "repeat", cat: "건강",   pay: "자동이체", memo: "" },
  { id: 8,  date: "2026-04-30", time: "22:11", label: "넷플릭스",          note: "프리미엄 구독",      amount: -17000,  type: "out", icon: "repeat", cat: "구독",   pay: "신한카드", memo: "" },
  { id: 9,  date: "2026-04-30", time: "19:48", label: "이마트",           note: "장보기 · 식료품",    amount: -78400,  type: "out", icon: "wallet", cat: "식비",   pay: "현대카드", memo: "주말 장보기" },
  { id: 10, date: "2026-04-30", time: "15:32", label: "프리랜서 수익",     note: "디자인 프로젝트 · A사", amount: 450000,  type: "in",  icon: "sparkle", cat: "부수입", pay: "토스 입금", memo: "5월 1차" },
  { id: 11, date: "2026-04-29", time: "11:24", label: "스타벅스 R 청담",   note: "아이스 아메리카노",  amount: -4900,   type: "out", icon: "coffee", cat: "식비",   pay: "신한카드", memo: "" },
  { id: 12, date: "2026-04-29", time: "10:00", label: "ChatGPT Plus",     note: "정기 구독",         amount: -28000,  type: "out", icon: "repeat", cat: "구독",   pay: "현대카드", memo: "" },
  { id: 13, date: "2026-04-28", time: "21:08", label: "쿠팡",             note: "생필품 · 무료배송",  amount: -34500,  type: "out", icon: "wallet", cat: "쇼핑",   pay: "신한카드", memo: "휴지, 세제" },
  { id: 14, date: "2026-04-28", time: "13:50", label: "김밥천국",          note: "점심",             amount: -8500,   type: "out", icon: "wallet", cat: "식비",   pay: "현금",     memo: "" },
  { id: 15, date: "2026-04-27", time: "18:22", label: "올리브영",          note: "스킨케어",          amount: -56700,  type: "out", icon: "wallet", cat: "쇼핑",   pay: "신한카드", memo: "" },
  { id: 16, date: "2026-04-27", time: "08:30", label: "지하철",            note: "교통카드 충전",      amount: -50000,  type: "out", icon: "zap",    cat: "교통",   pay: "신한카드", memo: "" },
  { id: 17, date: "2026-04-26", time: "20:00", label: "CGV 왕십리",        note: "영화 + 팝콘",        amount: -28000,  type: "out", icon: "sparkle", cat: "여가",   pay: "현대카드", memo: "친구와" },
  { id: 18, date: "2026-04-26", time: "12:00", label: "무신사",            note: "봄 셔츠 1벌",        amount: -64000,  type: "out", icon: "wallet", cat: "쇼핑",   pay: "현대카드", memo: "" },
  { id: 19, date: "2026-04-25", time: "16:00", label: "친구 빌려준 돈",    note: "민지에게",          amount: -50000,  type: "out", icon: "cash",   cat: "기타",   pay: "토스 송금", memo: "5월 말 갚기로" },
  { id: 20, date: "2026-04-25", time: "09:30", label: "병원",             note: "감기 진료비",        amount: -8500,   type: "out", icon: "wallet", cat: "건강",   pay: "현금",     memo: "" },
  { id: 21, date: "2026-04-24", time: "14:00", label: "환불 — 무신사",    note: "사이즈 안 맞음",     amount: 32000,   type: "in",  icon: "repeat", cat: "환불",   pay: "신한 입금", memo: "" },
  { id: 22, date: "2026-04-23", time: "19:18", label: "교보문고",          note: "책 2권",            amount: -32400,  type: "out", icon: "wallet", cat: "도서",   pay: "신한카드", memo: "디자인 책" },
];

const CAT_COLOR = {
  "식비": "#e89aac", "외식": "#e25c4d", "주거": "#1f1d18", "교통": "#8ec0d6",
  "쇼핑": "#e8c84a", "여가": "#a8d09b", "구독": "#a259ff", "건강": "#4a8d5a",
  "도서": "#2c5e8b", "급여": "#4a8d5a", "부수입": "#4a8d5a", "환불": "#4a8d5a", "기타": "#c9bd9f",
};

function TxnsPage({ onAdd, onEditTxn }) {
  const [q, setQ] = useState("");
  const [type, setType] = useState("all"); // all | in | out
  const [cat, setCat] = useState("all");
  const [pay, setPay] = useState("all");
  const [range, setRange] = useState("month"); // week | month | 3m
  const [activeId, setActiveId] = useState(1);
  const [receiptOpen, setReceiptOpen] = useState(false);

  const allCats = useMemo(() => Array.from(new Set(TXN_DATA.map(t => t.cat))), []);
  const allPays = useMemo(() => Array.from(new Set(TXN_DATA.map(t => t.pay))), []);

  const filtered = useMemo(() => {
    return TXN_DATA.filter(t => {
      if (type !== "all" && t.type !== type) return false;
      if (cat !== "all" && t.cat !== cat) return false;
      if (pay !== "all" && t.pay !== pay) return false;
      if (q) {
        const s = (t.label + " " + t.note + " " + t.memo + " " + t.cat).toLowerCase();
        if (!s.includes(q.toLowerCase())) return false;
      }
      return true;
    });
  }, [q, type, cat, pay]);

  // Group by date
  const grouped = useMemo(() => {
    const map = {};
    filtered.forEach(t => { (map[t.date] ||= []).push(t); });
    return Object.entries(map).sort((a, b) => b[0].localeCompare(a[0]));
  }, [filtered]);

  const sumIn = filtered.filter(t => t.type === "in").reduce((a, t) => a + t.amount, 0);
  const sumOut = filtered.filter(t => t.type === "out").reduce((a, t) => a + Math.abs(t.amount), 0);
  const active = TXN_DATA.find(t => t.id === activeId) || filtered[0];
  const fmt = (n) => (n < 0 ? "-" : n > 0 ? "+" : "") + "₩" + Math.abs(n).toLocaleString();

  const dateLabel = (d) => {
    const today = "2026-05-02";
    const yest  = "2026-05-01";
    if (d === today) return "오늘 · " + d.slice(5).replace("-", ".");
    if (d === yest)  return "어제 · " + d.slice(5).replace("-", ".");
    const dt = new Date(d);
    const dow = ["일","월","화","수","목","금","토"][dt.getDay()];
    return d.slice(5).replace("-", ".") + " " + dow;
  };

  return (
    <div data-screen-label="07 거래내역">
      <div className="page-head">
        <div>
          <div className="crumb">메뉴 · 가계부 · 거래내역</div>
          <h1 className="page-title">거래내역 <span className="hand-sub">— 모든 흐름을 자세히</span></h1>
          <div className="page-sub">총 {TXN_DATA.length}건 · 검색 결과 <b>{filtered.length}건</b></div>
        </div>
        <div className="row" style={{ gap: 8 }}>
          <button className="timer-btn">CSV</button>
          <button className="timer-btn" onClick={() => setReceiptOpen(true)}>
            <Icon name="note" size={13} /> 영수증 첨부
          </button>
          <button className="timer-btn primary" onClick={() => onAdd && onAdd()}>+ 내역 추가</button>
        </div>
      </div>

      {/* Big search bar */}
      <div className="txn-search-bar">
        <Icon name="search" size={18} />
        <input
          placeholder="가게 이름, 메모, 카테고리, 결제수단 검색…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        {q && <button className="txn-clear" onClick={() => setQ("")}><Icon name="x" size={14} /></button>}
        <div className="txn-search-stats">
          <span className="row" style={{ gap: 6 }}><span className="ts-dot in" />수입 <b>{fmt(sumIn)}</b></span>
          <span className="row" style={{ gap: 6 }}><span className="ts-dot out" />지출 <b>-{fmt(sumOut).replace("₩","₩")}</b></span>
        </div>
      </div>

      {/* Filter chips */}
      <div className="txn-filters">
        <div className="txn-filter-group">
          <span className="txn-filter-label">유형</span>
          {[["all","전체"],["in","수입"],["out","지출"]].map(([k,l]) => (
            <span key={k} className={"cat-chip" + (type === k ? " on" : "")} onClick={() => setType(k)}>{l}</span>
          ))}
        </div>
        <div className="txn-filter-group">
          <span className="txn-filter-label">기간</span>
          {[["week","이번 주"],["month","이번 달"],["3m","3개월"],["all","전체"]].map(([k,l]) => (
            <span key={k} className={"cat-chip" + (range === k ? " on" : "")} onClick={() => setRange(k)}>{l}</span>
          ))}
        </div>
        <div className="txn-filter-group">
          <span className="txn-filter-label">카테고리</span>
          <span className={"cat-chip" + (cat === "all" ? " on" : "")} onClick={() => setCat("all")}>전체</span>
          {allCats.map(c => (
            <span key={c} className={"cat-chip" + (cat === c ? " on" : "")} onClick={() => setCat(c)}
                  style={cat === c ? null : { borderLeft: `3px solid ${CAT_COLOR[c]}` }}>{c}</span>
          ))}
        </div>
        <div className="txn-filter-group">
          <span className="txn-filter-label">결제</span>
          <span className={"cat-chip" + (pay === "all" ? " on" : "")} onClick={() => setPay("all")}>전체</span>
          {allPays.map(p => (
            <span key={p} className={"cat-chip" + (pay === p ? " on" : "")} onClick={() => setPay(p)}>{p}</span>
          ))}
        </div>
      </div>

      {/* Two-pane layout */}
      <div className="txn-detail-layout">
        {/* List */}
        <div className="txn-list-card">
          <div className="txn-list-head">
            <div className="thl-col date">날짜 · 시간</div>
            <div className="thl-col label">내역</div>
            <div className="thl-col cat">카테고리</div>
            <div className="thl-col pay">결제</div>
            <div className="thl-col amt">금액</div>
          </div>

          {grouped.length === 0 && (
            <div className="memo-empty large">
              <div className="hand" style={{ fontSize: 22 }}>검색 결과가 없어요</div>
              <div>다른 키워드나 필터를 시도해보세요.</div>
            </div>
          )}

          {grouped.map(([date, items]) => {
            const dayIn = items.filter(t => t.type === "in").reduce((a, t) => a + t.amount, 0);
            const dayOut = items.filter(t => t.type === "out").reduce((a, t) => a + Math.abs(t.amount), 0);
            return (
              <div key={date} className="txn-day">
                <div className="txn-day-head">
                  <div className="txn-day-label">{dateLabel(date)}</div>
                  <div className="txn-day-sums">
                    {dayIn > 0 && <span className="td-in">+₩{dayIn.toLocaleString()}</span>}
                    {dayOut > 0 && <span className="td-out">-₩{dayOut.toLocaleString()}</span>}
                  </div>
                </div>
                {items.map(t => (
                  <div
                    key={t.id}
                    className={"txn-row" + (activeId === t.id ? " on" : "")}
                    onClick={() => setActiveId(t.id)}
                  >
                    <div className="thl-col date">
                      <div className="tr-time">{t.time}</div>
                    </div>
                    <div className="thl-col label">
                      <div className="tr-ico"><Icon name={t.icon} size={14} /></div>
                      <div className="tr-text">
                        <div className="tr-label">{t.label}</div>
                        <div className="tr-note">{t.note}</div>
                      </div>
                    </div>
                    <div className="thl-col cat">
                      <span className="tr-cat-tag" style={{ background: CAT_COLOR[t.cat] || "var(--ink-soft)" }}>{t.cat}</span>
                    </div>
                    <div className="thl-col pay">{t.pay}</div>
                    <div className={"thl-col amt " + t.type}>{fmt(t.amount)}</div>
                  </div>
                ))}
              </div>
            );
          })}

          <div className="txn-list-foot">
            <span>{filtered.length}건 표시 · 더 불러오려면 스크롤</span>
            <button className="timer-btn">더 보기</button>
          </div>
        </div>

        {/* Detail panel */}
        <aside className="txn-detail">
          {!active ? (
            <div className="memo-empty large"><div className="hand">거래를 선택하세요 →</div></div>
          ) : (
            <>
              <div className="txn-detail-head">
                <div className={"txn-detail-amt " + active.type}>{fmt(active.amount)}</div>
                <div className="txn-detail-name">{active.label}</div>
                <div className="txn-detail-note">{active.note}</div>
                <span className="folder-chip" style={{ background: CAT_COLOR[active.cat], color: "#fff", marginTop: 10 }}>{active.cat}</span>
              </div>

              <ul className="txn-detail-rows">
                <li><span>일시</span><b>{active.date} · {active.time}</b></li>
                <li><span>결제수단</span><b>{active.pay}</b></li>
                <li><span>유형</span><b>{active.type === "in" ? "수입" : "지출"}</b></li>
                <li><span>카테고리</span><b>{active.cat}</b></li>
                <li><span>고정/변동</span><b>{active.pay === "자동이체" ? "고정 지출" : "변동 지출"}</b></li>
              </ul>

              <div className="txn-memo-block">
                <div className="qs-label">메모</div>
                <textarea
                  className="memo-body"
                  style={{ minHeight: 80, fontSize: 13, lineHeight: 1.5, background: "var(--bg-paper)", border: "1px solid var(--line)", borderRadius: 8, padding: 10 }}
                  defaultValue={active.memo}
                  placeholder="이 거래에 대한 메모…"
                />
              </div>

              <div className="txn-receipt">
                <div className="receipt-tape" />
                <div className="receipt-h">RECEIPT</div>
                <div className="receipt-row"><span>{active.label}</span><b>{fmt(active.amount).replace("+","")}</b></div>
                <div className="receipt-row small"><span>{active.note}</span></div>
                <div className="receipt-divider">- - - - - - - - - - - - - - - - - - - -</div>
                <div className="receipt-row"><span>합계</span><b>{fmt(active.amount).replace("+","")}</b></div>
                <div className="receipt-row small"><span>{active.pay}</span><span>{active.time}</span></div>
                <div className="receipt-foot">
                  <button className="receipt-attach-btn" onClick={() => setReceiptOpen(true)}>
                    + 영수증 첨부하기
                  </button>
                </div>
              </div>

              <div className="txn-detail-actions">
                <button className="timer-btn" onClick={() => onAdd && onAdd({ ...active, id: undefined, date: new Date().toISOString().slice(0,10), label: active.label + " (복제)" })}>
                  <Icon name="copy" size={13} />복제
                </button>
                <button className="timer-btn ghost-danger"><Icon name="trash" size={13} />삭제</button>
                <button className="timer-btn primary" style={{ marginLeft: "auto" }} onClick={() => onEditTxn && onEditTxn(active)}>
                  <Icon name="note" size={13} />수정
                </button>
              </div>
            </>
          )}
        </aside>
      </div>

      <ReceiptUploadModal
        open={receiptOpen}
        onClose={() => setReceiptOpen(false)}
        onAttach={(data) => console.log("attached", data)}
      />
    </div>
  );
}

window.TxnsPage = TxnsPage;
