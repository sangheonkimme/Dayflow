import { useState, useMemo } from "react";
import { openTxnDetail } from "@/screens/mobile/shared/TxnDetailBridge";
import { DOW, MONTHS } from "@/lib/date";
import {
  useTransactions,
  groupByDay,
  inferIcon,
  inferPayday,
  currentMonthSummary,
  monthlyTotals,
  categoryShare,
} from "@/data/transactions";
import { TRANSACTION_CATEGORIES } from "@/lib/categories";
import { Ico } from "@/screens/mobile/shared/Ico";
import { SectionHeader } from "@/screens/mobile/shared/SectionHeader";
import { SwipeRow } from "@/screens/mobile/shared/SwipeRow";
import { pressable } from "@/lib/a11y";
import styles from "@/screens/mobile/mobile.module.css";

const catColor = (c: string) => TRANSACTION_CATEGORIES[c] ?? "#c9bd9f";

export const MobileLedger = () => {
  const [scope, setScope] = useState("all"); // all | out | in | sub | uncat
  const { all: ledgerTxns, remove: removeTxn } = useTransactions();

  // 이번 달 요약 — PC LedgerPage 와 동일 셀렉터. 이번 달 거래가 없으면
  // 월급(3.2M) fallback 으로 헤드라인 숫자를 유지(Home/MoneyFlow 와 동일 정책).
  const hero = useMemo(() => {
    const now = new Date();
    const m = now.getMonth();
    const summary = currentMonthSummary(ledgerTxns);
    const paydaySum = ledgerTxns
      .filter((t) => t.date.startsWith(summary.key) && inferPayday(t))
      .reduce((s, t) => s + t.amount, 0);
    const income = paydaySum || 3_200_000;
    const expense = summary.expense;
    const balance = income - expense;

    // 전월 잔액 대비 증감률
    const prev = new Date(now.getFullYear(), m - 1, 1);
    const prevKey = `${prev.getFullYear()}-${String(prev.getMonth() + 1).padStart(2, "0")}`;
    let prevIn = 0;
    let prevOut = 0;
    for (const t of ledgerTxns) {
      if (!t.date.startsWith(prevKey)) continue;
      if (t.type === "in") prevIn += t.amount;
      else prevOut += Math.abs(t.amount);
    }
    const prevBalance = (prevIn || 3_200_000) - prevOut;
    const deltaPct =
      prevBalance !== 0
        ? Math.round(((balance - prevBalance) / Math.abs(prevBalance)) * 100)
        : 0;

    const inCount = ledgerTxns.filter(
      (t) => t.date.startsWith(summary.key) && t.type === "in",
    ).length;
    const outCount = ledgerTxns.filter(
      (t) => t.date.startsWith(summary.key) && t.type === "out",
    ).length;

    // 다음 월급일(매월 25일)까지 D-day
    const today = now.getDate();
    const payday =
      today <= 25
        ? new Date(now.getFullYear(), m, 25)
        : new Date(now.getFullYear(), m + 1, 25);
    const dPay = Math.max(
      0,
      Math.ceil(
        (payday.getTime() - new Date(now.getFullYear(), m, today).getTime()) /
          86_400_000,
      ),
    );

    return {
      monthLabel: MONTHS[m],
      year: now.getFullYear(),
      income,
      expense,
      balance,
      deltaPct,
      inCount,
      outCount,
      dPay,
    };
  }, [ledgerTxns]);

  // 월별 추이 (만원 단위)
  const trend = useMemo(() => {
    const { in: tin, out: tout, months } = monthlyTotals(ledgerTxns);
    const max = Math.max(90, ...tin, ...tout);
    const nowKey = MONTHS[new Date().getMonth()];
    return { tin, tout, months, max, nowKey };
  }, [ledgerTxns]);

  // 카테고리별 지출 (이번 달)
  const cats = useMemo(
    () => categoryShare(ledgerTxns, "expense").slice(0, 6),
    [ledgerTxns],
  );
  const catTotal = cats.reduce((a, c) => a + c.amount, 0);

  // donut geometry
  const r = 42;
  const cx = 55;
  const cy = 55;
  const stroke = 14;
  const C = 2 * Math.PI * r;

  const counts = useMemo(
    () => ({
      all: ledgerTxns.length,
      out: ledgerTxns.filter((t) => t.type === "out").length,
      in: ledgerTxns.filter((t) => t.type === "in").length,
      sub: ledgerTxns.filter((t) => t.cat === "구독").length,
      uncat: ledgerTxns.filter((t) => !t.cat || t.cat === "기타").length,
    }),
    [ledgerTxns],
  );

  // 일자별 거래 그룹 — scope 필터 적용, 최근순 최대 6일.
  const days = useMemo(() => {
    const scoped = ledgerTxns.filter((t) => {
      if (scope === "out") return t.type === "out";
      if (scope === "in") return t.type === "in";
      if (scope === "sub") return t.cat === "구독";
      if (scope === "uncat") return !t.cat || t.cat === "기타";
      return true;
    });
    const grouped = groupByDay(scoped);
    const d = new Date();
    const todayKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    const out: {
      date: string;
      dow: string;
      total: number;
      items: (typeof ledgerTxns)[number][];
    }[] = [];
    let count = 0;
    for (const [date, items] of grouped) {
      if (count >= 6) break;
      count++;
      const dt = new Date(date);
      const md = `${dt.getMonth() + 1}월 ${dt.getDate()}일`;
      const dow = (date === todayKey ? "오늘 · " : "") + DOW[dt.getDay()];
      const total = items.reduce((a, t) => a + t.amount, 0);
      out.push({ date: md, dow, total, items: [...items] });
    }
    return out;
  }, [ledgerTxns, scope]);

  const chips: [string, string, number][] = [
    ["all", "전체", counts.all],
    ["out", "지출", counts.out],
    ["in", "수입", counts.in],
    ["sub", "정기", counts.sub],
    ["uncat", "미분류", counts.uncat],
  ];

  return (
    <>
      {/* HERO */}
      <div className={styles.dfmLedHero}>
        <div className={styles.dfmLedMonth}>
          <span>
            <b>
              {hero.year} · {hero.monthLabel}
            </b>
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <Ico name="chevL" size={12} /> {hero.monthLabel}{" "}
            <Ico name="chevR" size={12} />
          </span>
        </div>
        <div className={styles.dfmLedBalance}>
          <span className={styles.won}>₩</span>
          {hero.balance.toLocaleString()}
        </div>
        <div className={styles.dfmLedSub}>
          전월 대비{" "}
          <b>
            {hero.deltaPct > 0 ? "+" : ""}
            {hero.deltaPct}%
          </b>{" "}
          · 월급일까지 D-{hero.dPay}
        </div>

        <div className={styles.dfmLedStats}>
          <div className={`${styles.dfmLedStat} ${styles.in}`}>
            <div className={styles.lbl}>수입</div>
            <div className={styles.val}>
              +{(hero.income / 10000).toFixed(0)}만
            </div>
            <div className={styles.delta}>↗ {hero.inCount}건</div>
          </div>
          <div className={styles.dfmLedDivider} />
          <div className={`${styles.dfmLedStat} ${styles.out}`}>
            <div className={styles.lbl}>지출</div>
            <div className={styles.val}>
              -{(hero.expense / 10000).toFixed(0)}만
            </div>
            <div className={styles.delta}>↘ {hero.outCount}건</div>
          </div>
        </div>

        <div className={styles.dfmTrend}>
          <div className={styles.dfmTrendHead}>
            <span>월별 흐름 · {trend.months.length}개월</span>
            <div className={styles.dfmTrendLegend}>
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
          <div className={styles.dfmTrendBars}>
            {trend.months.map((m, i) => (
              <div
                key={i}
                className={`${styles.dfmTrendCol} ${m === trend.nowKey ? styles.now : ""}`}
              >
                <div
                  className={styles.bIn}
                  style={{ height: `${((trend.tin[i] ?? 0) / trend.max) * 100}%` }}
                />
                <div
                  className={styles.bOut}
                  style={{
                    height: `${((trend.tout[i] ?? 0) / trend.max) * 100}%`,
                  }}
                />
              </div>
            ))}
          </div>
          <div className={styles.dfmTrendLabels}>
            {trend.months.map((m, i) => (
              <span key={i} className={m === trend.nowKey ? styles.now : ""}>
                {m.replace("월", "")}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* CATEGORY DONUT */}
      <SectionHeader title="카테고리 분석" />
      <div className={styles.dfmCatsCard}>
        <div className={styles.dfmDonutWrap}>
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
                const len = catTotal > 0 ? (c.amount / catTotal) * C : 0;
                const dashoffset = -off;
                off += len;
                return (
                  <circle
                    key={i}
                    cx={cx}
                    cy={cy}
                    r={r}
                    fill="none"
                    stroke={catColor(c.cat)}
                    strokeWidth={stroke}
                    strokeDasharray={`${len} ${C - len}`}
                    strokeDashoffset={dashoffset}
                  />
                );
              });
            })()}
          </svg>
          <div className={styles.dfmDonutCenter}>
            <div>
              <div className={styles.lbl}>총 지출</div>
              <div className={styles.val}>
                {(hero.expense / 10000).toFixed(0)}만
              </div>
            </div>
          </div>
        </div>
        <div className={styles.dfmCatList}>
          {cats.length === 0 && (
            <div
              style={{
                fontSize: 12,
                color: "var(--ink-mute)",
                padding: "8px 0",
              }}
            >
              이번 달 지출 내역이 없어요
            </div>
          )}
          {cats.slice(0, 5).map((c, i) => (
            <div key={i} className={styles.dfmCatRow}>
              <span
                className={styles.swatch}
                style={{ background: catColor(c.cat) }}
              />
              <span className={styles.name}>{c.cat}</span>
              <span className={styles.pct}>
                {catTotal > 0 ? Math.round((c.amount / catTotal) * 100) : 0}%
              </span>
              <span className={styles.amt}>
                {(c.amount / 10000).toFixed(0)}만
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* TXN LIST */}
      <SectionHeader title="거래 내역" />

      <div className={styles.dfmChips}>
        {chips.map(([key, label, count]) => (
          <button
            key={key}
            type="button"
            className={`${styles.dfmChip} ${scope === key ? styles.on : ""}`}
            onClick={() => setScope(key)}
          >
            {label} <span className={styles.count}>{count}</span>
          </button>
        ))}
      </div>

      {days.length === 0 && (
        <div
          className={styles.dfmCard}
          style={{
            padding: "24px 16px",
            textAlign: "center",
            fontSize: 13,
            color: "var(--ink-mute)",
          }}
        >
          해당 조건의 거래가 없어요
        </div>
      )}

      {days.map((d, di) => (
        <div key={di} className={styles.dfmDay}>
          <div className={styles.dfmDayHead}>
            <div className={styles.date}>
              {d.date}
              <small>{d.dow}</small>
            </div>
            <div
              className={`${styles.total} ${d.total < 0 ? styles.expense : ""}`}
            >
              {d.total > 0 ? "+" : ""}
              {d.total.toLocaleString()}
            </div>
          </div>
          <div className={styles.dfmDayRows}>
            {d.items.map((t, i) => {
              // ReceiptSheet 는 모바일 adapted 형태(name/amt/cat)를 읽으므로
              // 상세 열기엔 adapted 객체를, 삭제엔 실제 t.id 를 쓴다.
              const detail = { name: t.label, amt: t.amount, cat: t.cat || "" };
              return (
              <SwipeRow
                key={i}
                actions={[
                  {
                    label: "수정",
                    color: "edit",
                    icon: "edit",
                    onClick: () => openTxnDetail(detail),
                  },
                  {
                    label: "삭제",
                    color: "delete",
                    icon: "trash",
                    onClick: () => removeTxn(t.id),
                  },
                ]}
              >
                <div
                  className={styles.dfmMoneyRow}
                  {...pressable(() => openTxnDetail(detail))}
                >
                  <div className={styles.ico}>
                    <Ico name={inferIcon(t)} size={16} />
                  </div>
                  <div className={styles.who}>
                    {t.label}
                    <small>
                      {[t.time, t.cat].filter(Boolean).join(" · ")}
                    </small>
                  </div>
                  <div
                    className={`${styles.val} ${t.type === "in" ? styles.income : styles.expense}`}
                  >
                    {t.amount > 0 ? "+" : ""}
                    {t.amount.toLocaleString()}
                  </div>
                </div>
              </SwipeRow>
              );
            })}
          </div>
        </div>
      ))}
    </>
  );
};
