/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import { useState, useMemo } from "react";
import { openTxnDetail } from "@/pages/mobile/shared/TxnDetailBridge";
import { DOW } from "@/lib/date";
import { useTransactions } from "@/data/transactions";
import { groupByDay } from "@/data/transactions";
import { inferIcon } from "@/data/transactions";
import { Ico } from "@/pages/mobile/shared/Ico";
import { SectionHeader } from "@/pages/mobile/shared/SectionHeader";
import { SwipeRow } from "@/pages/mobile/shared/SwipeRow";

export const MobileLedger = () => {
  const [scope, setScope] = useState("all"); // all | out | in

  // 11월 데이터 (실수령 ₩3,200,000 기준 시나리오)
  const income = 3650000;
  const expense = 1847200;
  const balance = income - expense;
  const lastMonthBalance = 1602000;
  const deltaPct = Math.round(
    ((balance - lastMonthBalance) / lastMonthBalance) * 100,
  );

  // 11개월 추이 (만원 단위)
  const trend = [
    { m: "1", in: 280, out: 215 },
    { m: "2", in: 285, out: 198 },
    { m: "3", in: 285, out: 240 },
    { m: "4", in: 300, out: 225 },
    { m: "5", in: 320, out: 250 },
    { m: "6", in: 285, out: 212 },
    { m: "7", in: 300, out: 268 },
    { m: "8", in: 340, out: 228 },
    { m: "9", in: 285, out: 198 },
    { m: "10", in: 330, out: 230 },
    { m: "11", in: 365, out: 185, now: true },
  ];
  const trendMax = 400;

  // 카테고리별 지출
  const cats = [
    { name: "식비", color: "#ffd84d", val: 482100 },
    { name: "주거", color: "#1f1d18", val: 850000 },
    { name: "교통", color: "#ffb38a", val: 188400 },
    { name: "쇼핑", color: "#d4c1f0", val: 155100 },
    { name: "구독", color: "#a8d4e3", val: 89000 },
    { name: "건강", color: "#b9e7c9", val: 82600 },
  ];
  const catTotal = cats.reduce((a, c) => a + c.val, 0);

  // donut path generation
  const r = 42,
    cx = 55,
    cy = 55,
    stroke = 14;
  const C = 2 * Math.PI * r;

  // 일자별 거래 그룹 — derived from real txns (most-recent first).
  const { all: ledgerTxns } = useTransactions();
  const days = useMemo(() => {
    const grouped = groupByDay(ledgerTxns);
    const out = [];
    const todayKey = (() => {
      const d = new Date();
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    })();
    let count = 0;
    for (const [date, items] of grouped) {
      if (count >= 4) break;
      count++;
      const dt = new Date(date);
      const md = `${dt.getMonth() + 1}월 ${dt.getDate()}일`;
      const dow = (date === todayKey ? "오늘 · " : "") + DOW[dt.getDay()];
      const adapted = items.map((t) => ({
        ico: inferIcon(t),
        name: t.label,
        sub: `${t.time || ""} · ${t.cat || ""}`,
        amt: t.amount,
        cat: t.cat || "",
        income: t.type === "in",
      }));
      const total = adapted.reduce((a, x) => a + x.amt, 0);
      out.push({ date: md, dow, total, items: adapted });
    }
    return out;
  }, [ledgerTxns]);

  // chip filter is currently visual-only

  return (
    <>
      {/* HERO */}
      <div className="dfm-led-hero">
        <div className="dfm-led-month">
          <span>
            <b>2026 · 11월</b>
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <Ico name="chevL" size={12} /> 11월 <Ico name="chevR" size={12} />
          </span>
        </div>
        <div className="dfm-led-balance">
          <span className="won">₩</span>
          {balance.toLocaleString()}
        </div>
        <div className="dfm-led-sub">
          전월 대비 <b>+{deltaPct}%</b> · 월급일까지 D-11
        </div>

        <div className="dfm-led-stats">
          <div className="dfm-led-stat in">
            <div className="lbl">수입</div>
            <div className="val">+{(income / 10000).toFixed(0)}만</div>
            <div className="delta">↗ 정기 1건</div>
          </div>
          <div className="dfm-led-divider" />
          <div className="dfm-led-stat out">
            <div className="lbl">지출</div>
            <div className="val">-{(expense / 10000).toFixed(0)}만</div>
            <div className="delta">↘ 23건</div>
          </div>
        </div>

        <div className="dfm-trend">
          <div className="dfm-trend-head">
            <span>월별 흐름 · 11개월</span>
            <div className="dfm-trend-legend">
              <span>
                <i style={{ background: "#b9e7c9" }} />
                수입
              </span>
              <span>
                <i style={{ background: "#ffb38a" }} />
                지출
              </span>
            </div>
          </div>
          <div className="dfm-trend-bars">
            {trend.map((d, i) => (
              <div key={i} className={`dfm-trend-col ${d.now ? "now" : ""}`}>
                <div
                  className="b-in"
                  style={{ height: `${(d.in / trendMax) * 100}%` }}
                />
                <div
                  className="b-out"
                  style={{ height: `${(d.out / trendMax) * 100}%` }}
                />
              </div>
            ))}
          </div>
          <div className="dfm-trend-labels">
            {trend.map((d, i) => (
              <span key={i} className={d.now ? "now" : ""}>
                {d.m}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* CATEGORY DONUT */}
      <SectionHeader title="카테고리 분석" action="자세히" />
      <div className="dfm-cats-card">
        <div className="dfm-donut-wrap">
          <svg
            width="110"
            height="110"
            viewBox="0 0 110 110"
            style={{ transform: "rotate(-90deg)" }}
          >
            <circle
              cx={cx}
              cy={cy}
              r={r}
              fill="none"
              stroke="var(--bg-paper)"
              strokeWidth={stroke}
            />
            {(() => {
              let off = 0;
              return cats.map((c, i) => {
                const len = (c.val / catTotal) * C;
                const dashoffset = -off;
                off += len;
                return (
                  <circle
                    key={i}
                    cx={cx}
                    cy={cy}
                    r={r}
                    fill="none"
                    stroke={c.color}
                    strokeWidth={stroke}
                    strokeDasharray={`${len} ${C - len}`}
                    strokeDashoffset={dashoffset}
                  />
                );
              });
            })()}
          </svg>
          <div className="dfm-donut-center">
            <div>
              <div className="lbl">총 지출</div>
              <div className="val">{(catTotal / 10000).toFixed(0)}만</div>
            </div>
          </div>
        </div>
        <div className="dfm-cat-list">
          {cats.slice(0, 5).map((c, i) => (
            <div key={i} className="dfm-cat-row">
              <span className="swatch" style={{ background: c.color }} />
              <span className="name">{c.name}</span>
              <span className="pct">
                {Math.round((c.val / catTotal) * 100)}%
              </span>
              <span className="amt">{(c.val / 10000).toFixed(0)}만</span>
            </div>
          ))}
        </div>
      </div>

      {/* TXN LIST */}
      <SectionHeader title="거래 내역" action="검색" />

      <div className="dfm-chips">
        <button
          className={`dfm-chip ${scope === "all" ? "on" : ""}`}
          onClick={() => setScope("all")}
        >
          전체 <span className="count">23</span>
        </button>
        <button
          className={`dfm-chip ${scope === "out" ? "on" : ""}`}
          onClick={() => setScope("out")}
        >
          지출 <span className="count">22</span>
        </button>
        <button
          className={`dfm-chip ${scope === "in" ? "on" : ""}`}
          onClick={() => setScope("in")}
        >
          수입 <span className="count">1</span>
        </button>
        <button className="dfm-chip">
          정기 <span className="count">3</span>
        </button>
        <button className="dfm-chip">
          미분류 <span className="count">2</span>
        </button>
      </div>

      {days.map((d, di) => (
        <div key={di} className="dfm-day">
          <div className="dfm-day-head">
            <div className="date">
              {d.date}
              <small>{d.dow}</small>
            </div>
            <div className={`total ${d.total < 0 ? "expense" : ""}`}>
              {d.total > 0 ? "+" : ""}
              {d.total.toLocaleString()}
            </div>
          </div>
          <div className="dfm-day-rows">
            {d.items.map((it, i) => (
              <SwipeRow
                key={i}
                actions={[
                  {
                    label: "수정",
                    color: "edit",
                    icon: "edit",
                    onClick: () => openTxnDetail(it),
                  },
                  {
                    label: "삭제",
                    color: "delete",
                    icon: "trash",
                    onClick: () => {},
                  },
                ]}
              >
                <div
                  className="dfm-money-row"
                  onClick={() => openTxnDetail(it)}
                >
                  <div className="ico">
                    <Ico name={it.ico} size={16} />
                  </div>
                  <div className="who">
                    {it.name}
                    <small>{it.sub}</small>
                  </div>
                  <div className={`val ${it.income ? "income" : "expense"}`}>
                    {it.amt > 0 ? "+" : ""}
                    {it.amt.toLocaleString()}
                  </div>
                </div>
              </SwipeRow>
            ))}
          </div>
        </div>
      ))}
    </>
  );
};
