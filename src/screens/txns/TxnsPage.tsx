import { useState, useMemo } from "react";
import { Icon } from "@/components/Icon";
import { formatSignedWon } from "@/lib/format";
import { DOW } from "@/lib/date";
import { TRANSACTION_CATEGORIES } from "@/lib/categories";
import { ReceiptUploadModal } from "@/screens/ledger/ReceiptUploadModal";
import { useTransactions } from "@/data/transactions";
import { inferIcon } from "@/data/transactions";
import type { Txn } from "@/types";
import styles from "./TxnsPage.module.css";
import "@/styles/flows-extra.css";

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
  const [activeId, setActiveId] = useState<string | number>(1);
  const [receiptOpen, setReceiptOpen] = useState(false);

  const allCats = useMemo(
    () =>
      Array.from(
        new Set(TXN_DATA.map((t) => t.cat).filter((c): c is string => !!c)),
      ),
    [TXN_DATA],
  );
  const allPays = useMemo(
    () =>
      Array.from(
        new Set(TXN_DATA.map((t) => t.pay).filter((p): p is string => !!p)),
      ),
    [TXN_DATA],
  );

  const filtered = useMemo(() => {
    return TXN_DATA.filter((t) => {
      if (type !== "all" && t.type !== type) return false;
      if (cat !== "all" && t.cat !== cat) return false;
      if (pay !== "all" && t.pay !== pay) return false;
      if (q) {
        const s = (
          t.label +
          " " +
          t.note +
          " " +
          t.memo +
          " " +
          t.cat
        ).toLowerCase();
        if (!s.includes(q.toLowerCase())) return false;
      }
      return true;
    });
  }, [TXN_DATA, q, type, cat, pay]);

  // Group by date
  const grouped = useMemo(() => {
    const map: Record<string, Txn[]> = {};
    filtered.forEach((t) => {
      (map[t.date] ||= []).push(t);
    });
    return Object.entries(map).sort((a, b) => b[0].localeCompare(a[0]));
  }, [filtered]);

  const sumIn = filtered
    .filter((t) => t.type === "in")
    .reduce((a, t) => a + t.amount, 0);
  const sumOut = filtered
    .filter((t) => t.type === "out")
    .reduce((a, t) => a + Math.abs(t.amount), 0);
  const active = TXN_DATA.find((t) => t.id === activeId) || filtered[0];
  const fmt = formatSignedWon;

  const dateLabel = (d) => {
    const today = "2026-05-02";
    const yest = "2026-05-01";
    if (d === today) return "오늘 · " + d.slice(5).replace("-", ".");
    if (d === yest) return "어제 · " + d.slice(5).replace("-", ".");
    const dt = new Date(d);
    const dow = DOW[dt.getDay()];
    return d.slice(5).replace("-", ".") + " " + dow;
  };

  return (
    <div data-screen-label="07 거래내역">
      <div className="page-head">
        <div>
          <div className="crumb">메뉴 · 가계부 · 거래내역</div>
          <h1 className="page-title">
            거래내역 <span className="hand-sub">— 모든 흐름을 자세히</span>
          </h1>
          <div className="page-sub">
            총 {TXN_DATA.length}건 · 검색 결과 <b>{filtered.length}건</b>
          </div>
        </div>
        <div className="row" style={{ gap: 8 }}>
          <button className="timer-btn">CSV</button>
          <button className="timer-btn" onClick={() => setReceiptOpen(true)}>
            <Icon name="note" size={13} /> 영수증 첨부
          </button>
          <button
            className="timer-btn primary"
            onClick={() => onAdd && onAdd()}
          >
            + 내역 추가
          </button>
        </div>
      </div>

      {/* Big search bar */}
      <div className={styles.txnSearchBar}>
        <Icon name="search" size={18} />
        <input
          placeholder="가게 이름, 메모, 카테고리, 결제수단 검색…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        {q && (
          <button className={styles.txnClear} onClick={() => setQ("")}>
            <Icon name="x" size={14} />
          </button>
        )}
        <div className={styles.txnSearchStats}>
          <span className="row" style={{ gap: 6 }}>
            <span className={`${styles.tsDot} ${styles.in}`} />
            수입 <b>{fmt(sumIn)}</b>
          </span>
          <span className="row" style={{ gap: 6 }}>
            <span className={`${styles.tsDot} ${styles.out}`} />
            지출 <b>-{fmt(sumOut).replace("₩", "₩")}</b>
          </span>
        </div>
      </div>

      {/* Filter chips */}
      <div className={styles.txnFilters}>
        <div className={styles.txnFilterGroup}>
          <span className={styles.txnFilterLabel}>유형</span>
          {[
            ["all", "전체"],
            ["in", "수입"],
            ["out", "지출"],
          ].map(([k, l]) => (
            <span
              key={k}
              className={"cat-chip" + (type === k ? " on" : "")}
              onClick={() => setType(k)}
            >
              {l}
            </span>
          ))}
        </div>
        <div className={styles.txnFilterGroup}>
          <span className={styles.txnFilterLabel}>기간</span>
          {[
            ["week", "이번 주"],
            ["month", "이번 달"],
            ["3m", "3개월"],
            ["all", "전체"],
          ].map(([k, l]) => (
            <span
              key={k}
              className={"cat-chip" + (range === k ? " on" : "")}
              onClick={() => setRange(k)}
            >
              {l}
            </span>
          ))}
        </div>
        <div className={styles.txnFilterGroup}>
          <span className={styles.txnFilterLabel}>카테고리</span>
          <span
            className={"cat-chip" + (cat === "all" ? " on" : "")}
            onClick={() => setCat("all")}
          >
            전체
          </span>
          {allCats.map((c) => (
            <span
              key={c}
              className={"cat-chip" + (cat === c ? " on" : "")}
              onClick={() => setCat(c)}
              style={
                cat === c
                  ? undefined
                  : {
                      borderLeft: `3px solid ${(TRANSACTION_CATEGORIES as Record<string, string>)[c]}`,
                    }
              }
            >
              {c}
            </span>
          ))}
        </div>
        <div className={styles.txnFilterGroup}>
          <span className={styles.txnFilterLabel}>결제</span>
          <span
            className={"cat-chip" + (pay === "all" ? " on" : "")}
            onClick={() => setPay("all")}
          >
            전체
          </span>
          {allPays.map((p) => (
            <span
              key={p}
              className={"cat-chip" + (pay === p ? " on" : "")}
              onClick={() => setPay(p)}
            >
              {p}
            </span>
          ))}
        </div>
      </div>

      {/* Two-pane layout */}
      <div className={styles.txnDetailLayout}>
        {/* List */}
        <div className={styles.txnListCard}>
          <div className={styles.txnListHead}>
            <div className={styles.thlCol}>날짜 · 시간</div>
            <div className={`${styles.thlCol} ${styles.label}`}>내역</div>
            <div className={styles.thlCol}>카테고리</div>
            <div className={`${styles.thlCol} ${styles.pay}`}>결제</div>
            <div className={`${styles.thlCol} ${styles.amt}`}>금액</div>
          </div>

          {grouped.length === 0 && (
            <div className="memo-empty large">
              <div className="hand" style={{ fontSize: 22 }}>
                검색 결과가 없어요
              </div>
              <div>다른 키워드나 필터를 시도해보세요.</div>
            </div>
          )}

          {grouped.map(([date, items]) => {
            const dayIn = items
              .filter((t) => t.type === "in")
              .reduce((a, t) => a + t.amount, 0);
            const dayOut = items
              .filter((t) => t.type === "out")
              .reduce((a, t) => a + Math.abs(t.amount), 0);
            return (
              <div key={date} className={styles.txnDay}>
                <div className={styles.txnDayHead}>
                  <div className={styles.txnDayLabel}>{dateLabel(date)}</div>
                  <div className={styles.txnDaySums}>
                    {dayIn > 0 && (
                      <span className={styles.tdIn}>
                        +₩{dayIn.toLocaleString()}
                      </span>
                    )}
                    {dayOut > 0 && (
                      <span className={styles.tdOut}>
                        -₩{dayOut.toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>
                {items.map((t) => (
                  <div
                    key={t.id}
                    className={
                      activeId === t.id
                        ? `${styles.txnRow} ${styles.on}`
                        : styles.txnRow
                    }
                    onClick={() => setActiveId(t.id)}
                  >
                    <div className={styles.thlCol}>
                      <div className="tr-time">{t.time}</div>
                    </div>
                    <div className={`${styles.thlCol} ${styles.label}`}>
                      <div className={styles.trIco}>
                        <Icon name={inferIcon(t)} size={14} />
                      </div>
                      <div className={styles.trText}>
                        <div className={styles.trLabel}>{t.label}</div>
                        <div className={styles.trNote}>{t.note}</div>
                      </div>
                    </div>
                    <div className={styles.thlCol}>
                      <span
                        className={styles.trCatTag}
                        style={{
                          background:
                            (t.cat &&
                              (
                                TRANSACTION_CATEGORIES as Record<string, string>
                              )[t.cat]) ||
                            "var(--ink-soft)",
                        }}
                      >
                        {t.cat}
                      </span>
                    </div>
                    <div className={`${styles.thlCol} ${styles.pay}`}>
                      {t.pay}
                    </div>
                    <div
                      className={`${styles.thlCol} ${styles.amt} ${
                        t.type === "in" ? styles.in : styles.out
                      }`}
                    >
                      {fmt(t.amount)}
                    </div>
                  </div>
                ))}
              </div>
            );
          })}

          <div className={styles.txnListFoot}>
            <span>{filtered.length}건 표시 · 더 불러오려면 스크롤</span>
            <button className="timer-btn">더 보기</button>
          </div>
        </div>

        {/* Detail panel */}
        <aside className={styles.txnDetail}>
          {!active ? (
            <div className="memo-empty large">
              <div className="hand">거래를 선택하세요 →</div>
            </div>
          ) : (
            <>
              <div className={styles.txnDetailHead}>
                <div
                  className={`${styles.txnDetailAmt} ${
                    active.type === "in" ? styles.in : styles.out
                  }`}
                >
                  {fmt(active.amount)}
                </div>
                <div className={styles.txnDetailName}>{active.label}</div>
                <div className={styles.txnDetailNote}>{active.note}</div>
                <span
                  className="folder-chip"
                  style={{
                    background: active.cat
                      ? (TRANSACTION_CATEGORIES as Record<string, string>)[
                          active.cat
                        ]
                      : undefined,
                    color: "#fff",
                    marginTop: 10,
                  }}
                >
                  {active.cat}
                </span>
              </div>

              <ul className={styles.txnDetailRows}>
                <li>
                  <span>일시</span>
                  <b>
                    {active.date} · {active.time}
                  </b>
                </li>
                <li>
                  <span>결제수단</span>
                  <b>{active.pay}</b>
                </li>
                <li>
                  <span>유형</span>
                  <b>{active.type === "in" ? "수입" : "지출"}</b>
                </li>
                <li>
                  <span>카테고리</span>
                  <b>{active.cat}</b>
                </li>
                <li>
                  <span>고정/변동</span>
                  <b>{active.pay === "자동이체" ? "고정 지출" : "변동 지출"}</b>
                </li>
              </ul>

              <div className={styles.txnMemoBlock}>
                <div className="qs-label">메모</div>
                <textarea
                  className="memo-body"
                  style={{
                    minHeight: 80,
                    fontSize: 13,
                    lineHeight: 1.5,
                    background: "var(--bg-paper)",
                    border: "1px solid var(--line)",
                    borderRadius: 8,
                    padding: 10,
                  }}
                  defaultValue={active.memo}
                  placeholder="이 거래에 대한 메모…"
                />
              </div>

              <div className={styles.txnReceipt}>
                <div className={styles.receiptTape} />
                <div className={styles.receiptH}>RECEIPT</div>
                <div className={styles.receiptRow}>
                  <span>{active.label}</span>
                  <b>{fmt(active.amount).replace("+", "")}</b>
                </div>
                <div className={`${styles.receiptRow} ${styles.small}`}>
                  <span>{active.note}</span>
                </div>
                <div className={styles.receiptDivider}>
                  - - - - - - - - - - - - - - - - - - - -
                </div>
                <div className={styles.receiptRow}>
                  <span>합계</span>
                  <b>{fmt(active.amount).replace("+", "")}</b>
                </div>
                <div className={`${styles.receiptRow} ${styles.small}`}>
                  <span>{active.pay}</span>
                  <span>{active.time}</span>
                </div>
                <div className={styles.receiptFoot}>
                  <button
                    className="receipt-attach-btn"
                    onClick={() => setReceiptOpen(true)}
                  >
                    + 영수증 첨부하기
                  </button>
                </div>
              </div>

              <div className={styles.txnDetailActions}>
                <button
                  className="timer-btn"
                  onClick={() =>
                    onAdd &&
                    onAdd({
                      ...active,
                      id: undefined,
                      date: new Date().toISOString().slice(0, 10),
                      label: active.label + " (복제)",
                    })
                  }
                >
                  <Icon name="copy" size={13} />
                  복제
                </button>
                <button className="timer-btn ghost-danger">
                  <Icon name="trash" size={13} />
                  삭제
                </button>
                <button
                  className="timer-btn primary"
                  style={{ marginLeft: "auto" }}
                  onClick={() => onEditTxn && onEditTxn(active)}
                >
                  <Icon name="note" size={13} />
                  수정
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
