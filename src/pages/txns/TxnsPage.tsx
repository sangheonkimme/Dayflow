// @ts-nocheck
import { useState, useMemo } from 'react';
import { Icon } from '@/components/Icon';
import { formatSignedWon } from '@/lib/format';
import { DOW } from '@/lib/date';
import { TRANSACTION_CATEGORIES } from '@/lib/categories';
import { ReceiptUploadModal } from '@/pages/ledger/ReceiptUploadModal';
import { useTransactions } from '@/data/transactions';
import { inferIcon } from '@/data/transactions';

// ============================================================
// TRANSACTIONS PAGE — 거래내역 detail
// Detailed list with search, filters, range, detail panel
// ============================================================

function TxnsPage({ onAdd, onEditTxn }) {
  const { all: TXN_DATA } = useTransactions();
  const [q, setQ] = useState("");
  const [type, setType] = useState("all"); // all | in | out
  const [cat, setCat] = useState("all");
  const [pay, setPay] = useState("all");
  const [range, setRange] = useState("month"); // week | month | 3m
  const [activeId, setActiveId] = useState(1);
  const [receiptOpen, setReceiptOpen] = useState(false);

  const allCats = useMemo(() => Array.from(new Set(TXN_DATA.map(t => t.cat))), [TXN_DATA]);
  const allPays = useMemo(() => Array.from(new Set(TXN_DATA.map(t => t.pay))), [TXN_DATA]);

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
  }, [TXN_DATA, q, type, cat, pay]);

  // Group by date
  const grouped = useMemo(() => {
    const map = {};
    filtered.forEach(t => { (map[t.date] ||= []).push(t); });
    return Object.entries(map).sort((a, b) => b[0].localeCompare(a[0]));
  }, [filtered]);

  const sumIn = filtered.filter(t => t.type === "in").reduce((a, t) => a + t.amount, 0);
  const sumOut = filtered.filter(t => t.type === "out").reduce((a, t) => a + Math.abs(t.amount), 0);
  const active = TXN_DATA.find(t => t.id === activeId) || filtered[0];
  const fmt = formatSignedWon;

  const dateLabel = (d) => {
    const today = "2026-05-02";
    const yest  = "2026-05-01";
    if (d === today) return "오늘 · " + d.slice(5).replace("-", ".");
    if (d === yest)  return "어제 · " + d.slice(5).replace("-", ".");
    const dt = new Date(d);
    const dow = DOW[dt.getDay()];
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
                  style={cat === c ? null : { borderLeft: `3px solid ${TRANSACTION_CATEGORIES[c]}` }}>{c}</span>
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
                      <div className="tr-ico"><Icon name={inferIcon(t)} size={14} /></div>
                      <div className="tr-text">
                        <div className="tr-label">{t.label}</div>
                        <div className="tr-note">{t.note}</div>
                      </div>
                    </div>
                    <div className="thl-col cat">
                      <span className="tr-cat-tag" style={{ background: TRANSACTION_CATEGORIES[t.cat] || "var(--ink-soft)" }}>{t.cat}</span>
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
                <span className="folder-chip" style={{ background: TRANSACTION_CATEGORIES[active.cat], color: "#fff", marginTop: 10 }}>{active.cat}</span>
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

export { TxnsPage };