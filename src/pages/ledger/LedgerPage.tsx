/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import { useState, useMemo } from "react";
import { Icon } from "@/components/Icon";
import { formatSignedWon, formatWon } from "@/lib/format";
import { DOW } from "@/lib/date";
import { TRANSACTION_CATEGORIES } from "@/lib/categories";
import { useTransactions } from "@/data/transactions";
import { inferIcon } from "@/data/transactions";
import {
  monthlyTotals,
  currentMonthSummary,
  categoryShare,
  groupByDay,
} from "@/data/transactions";

export const LedgerPage = ({ onAdd, onEditTxn }: any) => {
  const [filter, setFilter] = useState("all");
  const { all: txnsAll } = useTransactions();

  const summary = useMemo(() => currentMonthSummary(txnsAll), [txnsAll]);
  const trend = useMemo(() => monthlyTotals(txnsAll), [txnsAll]);
  const catShares = useMemo(() => categoryShare(txnsAll, "expense"), [txnsAll]);
  const grouped = useMemo(() => groupByDay(txnsAll), [txnsAll]);

  const won = formatWon;
  const stats = [
    {
      lbl: "이번 달 수입",
      val: won(summary.income),
      delta: "이번 달 누적",
      up: true,
      color: "#2d7a3a",
    },
    {
      lbl: "이번 달 지출",
      val: won(summary.expense),
      delta: "이번 달 누적",
      up: false,
      color: "var(--red)",
    },
    {
      lbl: "잔액",
      val: won(summary.net),
      delta: "수입 - 지출",
      up: summary.net >= 0,
      color: "var(--ink)",
    },
    {
      lbl: "거래 건수",
      val: `${txnsAll.length}건`,
      delta: "전체 데이터",
      up: null,
      color: "var(--ink-soft)",
    },
  ];

  // Top 6 categories with TRANSACTION_CATEGORIES color mapping.
  const cats = catShares.slice(0, 6).map((c) => ({
    name: c.cat,
    amount: c.amount,
    color: TRANSACTION_CATEGORIES[c.cat] || "#c9bd9f",
    pct: c.pct.toFixed(1),
  }));

  // Transform grouped Map → array shape used by render below.
  const txns = useMemo(() => {
    const out = [];
    for (const [date, items] of grouped) {
      const md = date.slice(5).replace("-", ".");
      const dt = new Date(date);
      const dow = DOW[dt.getDay()];
      out.push({ d: `${md} ${dow}`, items });
      if (out.length >= 5) break;
    }
    return out;
  }, [grouped]);

  const fmt = formatSignedWon;

  return (
    <div data-screen-label="02 가계부">
      <div className="page-head">
        <div>
          <div className="crumb">메뉴 · 가계부</div>
          <h1 className="page-title">
            가계부 <span className="hand-sub">— 돈의 흐름을 한눈에</span>
          </h1>
          <div className="page-sub">2026년 11월 · 4주차</div>
        </div>
        <div className="row" style={{ gap: 8 }}>
          <button className="timer-btn">내보내기</button>
          <button className="timer-btn primary" onClick={onAdd}>
            + 내역 추가
          </button>
        </div>
      </div>

      <div className="stats-grid">
        {stats.map((s) => (
          <div key={s.lbl} className="stat-card">
            <div className="lbl">{s.lbl}</div>
            <div className="val" style={{ color: s.color }}>
              {s.val}
            </div>
            <div
              className={
                "delta " + (s.up === true ? "up" : s.up === false ? "down" : "")
              }
            >
              {s.up === true && <Icon name="arrowUp" size={11} />}
              {s.up === false && <Icon name="arrowDown" size={11} />}
              {s.delta}
            </div>
          </div>
        ))}
      </div>

      <div className="grid" style={{ marginTop: 18 }}>
        <div className="card card-pad col-7">
          <div className="card-head">
            <div>
              <div className="card-title">
                <Icon name="wallet" size={16} />
                월별 추이
              </div>
              <div className="card-sub">최근 11개월간 수입 vs 지출</div>
            </div>
            <div className="row" style={{ gap: 8, fontSize: 11 }}>
              <span className="row" style={{ gap: 4 }}>
                <span
                  style={{
                    width: 10,
                    height: 10,
                    background: "#4a8d5a",
                    borderRadius: 2,
                  }}
                />
                수입
              </span>
              <span className="row" style={{ gap: 4 }}>
                <span
                  style={{
                    width: 10,
                    height: 10,
                    background: "var(--red)",
                    opacity: 0.7,
                    borderRadius: 2,
                  }}
                />
                지출
              </span>
            </div>
          </div>
          <div className="bars" style={{ height: 180 }}>
            {trend.in.map((inV, i) => {
              const maxV = Math.max(90, ...trend.in, ...trend.out);
              const o = trend.out[i] ?? 0;
              return (
                <div
                  key={i}
                  style={{
                    flex: 1,
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    gap: 3,
                    alignItems: "stretch",
                    justifyContent: "flex-end",
                  }}
                >
                  <div
                    className="bar in"
                    style={{ height: `${(inV / maxV) * 60}%` }}
                  />
                  <div
                    className="bar out"
                    style={{ height: `${(o / maxV) * 40}%` }}
                  />
                </div>
              );
            })}
          </div>
          <div className="bars-axis">
            {trend.months.map((m) => (
              <span key={m}>{m}</span>
            ))}
          </div>
        </div>

        <div className="card card-pad col-5">
          <div className="card-head">
            <div>
              <div className="card-title">
                <Icon name="target" size={16} />
                카테고리별 지출
              </div>
              <div className="card-sub">
                이번 달 · 총 {won(summary.expense)}
              </div>
            </div>
          </div>
          <div className="cat-bar-stack">
            {cats.map((c) => (
              <div
                key={c.name}
                style={{ width: c.pct + "%", background: c.color }}
                title={`${c.name} ${c.pct}%`}
              />
            ))}
          </div>
          <div className="cats">
            {cats.map((c) => (
              <div key={c.name} className="cat-row">
                <span className="cat-dot" style={{ background: c.color }} />
                <span className="cat-name">{c.name}</span>
                <span className="cat-pct">{c.pct}%</span>
                <span className="cat-amount">₩{c.amount.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card card-pad" style={{ marginTop: 18 }}>
        <div className="card-head">
          <div>
            <div className="card-title">
              <Icon name="cash" size={16} />
              최근 거래내역
            </div>
            <div className="card-sub">최근 7일</div>
          </div>
          <div className="filter-tabs">
            {[
              ["all", "전체"],
              ["in", "수입"],
              ["out", "지출"],
            ].map(([k, l]) => (
              <span
                key={k}
                className={"filter-tab" + (filter === k ? " on" : "")}
                onClick={() => setFilter(k)}
              >
                {l}
              </span>
            ))}
          </div>
        </div>
        <div className="txn-groups">
          {txns.map((g) => (
            <div key={g.d} className="txn-group">
              <div className="txn-date">{g.d}</div>
              <div>
                {g.items
                  .filter((t) => filter === "all" || t.type === filter)
                  .map((t, i) => (
                    <div key={i} className="txn">
                      <div className="txn-ico">
                        <Icon name={inferIcon(t)} size={14} />
                      </div>
                      <div className="txn-label">
                        {t.label}
                        <small>{t.note}</small>
                      </div>
                      <span className="tag" style={{ marginRight: 8 }}>
                        {t.cat}
                      </span>
                      <div className={"txn-amount " + t.type}>
                        {fmt(t.amount)}
                      </div>
                      <button
                        className="txn-edit-btn"
                        onClick={() => onEditTxn && onEditTxn(t)}
                        title="수정"
                      >
                        <Icon name="note" size={12} />
                      </button>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
