import { useMemo } from "react";
import { Icon } from "@/components/Icon";
import { formatWon, formatSignedWon } from "@/lib/format";
import {
  useTransactions,
  monthlyTotals,
  currentMonthSummary,
  recent as selectRecent,
  inferIcon,
  inferPayday,
} from "@/data/transactions";
import styles from "./MoneyFlow.module.css";

export function MoneyFlow({ onAdd, onEditTxn }: any) {
  const { all: txnsAll } = useTransactions();

  const {
    in: dataIn,
    out: dataOut,
    months,
  } = useMemo(() => monthlyTotals(txnsAll), [txnsAll]);
  const data = dataIn.map((v, i) => ({ in: v, out: dataOut[i] ?? 0 }));
  const max = Math.max(90, ...dataIn, ...dataOut);

  const summary = useMemo(() => currentMonthSummary(txnsAll), [txnsAll]);
  const txns = useMemo(() => selectRecent(txnsAll, 4), [txnsAll]);

  // 월급(실수령) — 이번 달의 payday(급여) in-flow 만 합산.
  // summary.income 은 모든 in-flow(환급, 송금 등 포함) 라 라벨과 의미가 달라
  // 별도 selector 로 분리. 0 일 땐 시안 fallback.
  const monthlyPayday = useMemo(() => {
    return txnsAll
      .filter((t) => t.date.startsWith(summary.key) && inferPayday(t))
      .reduce((s, t) => s + t.amount, 0);
  }, [txnsAll, summary.key]);
  const income = monthlyPayday || 3200000;
  const expense = summary.expense;
  // 남은 예산 = 월급 기준. summary.net 은 (모든 in - 모든 out) 이라 부적절.
  const balance = income - expense;
  const budgetPct = income > 0 ? Math.round((expense / income) * 100) : 0;
  const daysToPayday = 28;

  const fmt = formatSignedWon;
  const won = formatWon;

  return (
    <div className={`${styles.moneyCard} col-7`}>
      <div className="card-head">
        <div>
          <div className="card-title">
            <Icon name="wallet" size={16} />
            가계부 — {months[months.length - 1]}
          </div>
          <div className="card-sub">
            월급일까지 D-{daysToPayday} · 이번 달 흐름을 한눈에
          </div>
        </div>
        <button className="timer-btn primary" onClick={onAdd}>
          + 내역 추가
        </button>
      </div>

      <div className={styles.moneySummary}>
        <div className={`${styles.moneyStat} ${styles.moneyStatIncome}`}>
          <div className="lbl">월급 (실수령)</div>
          <div className="val">{won(income)}</div>
          <div style={{ fontSize: 10, color: "var(--ink-mute)", marginTop: 2 }}>
            매월 25일 입금
          </div>
        </div>
        <div className={`${styles.moneyStat} ${styles.moneyStatExpense}`}>
          <div className="lbl">이번 달 지출</div>
          <div className="val">{won(expense)}</div>
          <div style={{ fontSize: 10, color: "var(--ink-mute)", marginTop: 2 }}>
            예산 {budgetPct}% 사용
          </div>
        </div>
        <div className={styles.moneyStat}>
          <div className="lbl">남은 예산</div>
          <div
            className="val"
            style={{ color: balance > 500000 ? "#2d7a3a" : "var(--red)" }}
          >
            {won(balance)}
          </div>
          <div style={{ fontSize: 10, color: "var(--ink-mute)", marginTop: 2 }}>
            D-{daysToPayday}까지 사용 가능
          </div>
        </div>
      </div>

      <div className={styles.budgetMeter}>
        <div className={styles.budgetMeterTrack}>
          <div
            className={styles.budgetMeterFill}
            style={{ width: budgetPct + "%" }}
          />
        </div>
        <div className={styles.budgetMeterLabels}>
          <span>0</span>
          <span>
            <b>{budgetPct}%</b> 사용 중
          </span>
          <span>{won(income)}</span>
        </div>
      </div>

      <div className={styles.bars}>
        {data.map((d, i) => (
          <div
            key={i}
            style={{
              flex: 1,
              height: "100%",
              display: "flex",
              flexDirection: "column",
              gap: 2,
              alignItems: "stretch",
              justifyContent: "flex-end",
            }}
          >
            <div
              className={`${styles.bar} ${styles.barIn}`}
              style={{ height: `${(d.in / max) * 60}%` }}
            />
            <div
              className={`${styles.bar} ${styles.barOut}`}
              style={{ height: `${(d.out / max) * 40}%` }}
            />
          </div>
        ))}
      </div>
      <div className={styles.barsAxis}>
        {months.map((m) => (
          <span key={m}>{m}</span>
        ))}
      </div>

      <div className={styles.txns}>
        {txns.map((t) => (
          <div key={t.id} className={styles.txn}>
            <div className={styles.txnIco}>
              <Icon name={inferIcon(t)} size={14} />
            </div>
            <div className={styles.txnLabel}>
              {t.label}{" "}
              {inferPayday(t) && (
                <span
                  className="tag"
                  style={{
                    background: "#e6f4ea",
                    borderColor: "#9ed1ad",
                    color: "#2d7a3a",
                    marginLeft: 4,
                  }}
                >
                  월급
                </span>
              )}
              <small>{t.note}</small>
            </div>
            <div
              className={`${styles.txnAmount} ${
                t.type === "in" ? styles.txnAmountIn : styles.txnAmountOut
              }`}
            >
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
  );
}
