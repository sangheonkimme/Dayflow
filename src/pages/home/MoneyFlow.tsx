// @ts-nocheck
import { useMemo } from 'react';
import { Icon } from '@/components/Icon';
import { formatWon, formatSignedWon } from '@/lib/format';
import {
  useTransactions,
  monthlyTotals,
  currentMonthSummary,
  recent as selectRecent,
  inferIcon,
  inferPayday,
} from '@/data/transactions';

export function MoneyFlow({ onAdd, onOpenLedger, onEditTxn }) {
  const { all: txnsAll } = useTransactions();

  const { in: dataIn, out: dataOut, months } = useMemo(
    () => monthlyTotals(txnsAll),
    [txnsAll],
  );
  const data = dataIn.map((v, i) => ({ in: v, out: dataOut[i] ?? 0 }));
  const max = Math.max(90, ...dataIn, ...dataOut);

  const summary = useMemo(() => currentMonthSummary(txnsAll), [txnsAll]);
  const txns = useMemo(() => selectRecent(txnsAll, 4), [txnsAll]);

  const income = summary.income || 3200000;
  const expense = summary.expense;
  const balance = summary.net;
  const budgetPct = income > 0 ? Math.round((expense / income) * 100) : 0;
  const daysToPayday = 28;

  const fmt = formatSignedWon;
  const won = formatWon;

  return (
    <div className="money-card col-7">
      <div className="card-head">
        <div>
          <div className="card-title"><Icon name="wallet" size={16} />가계부 — {months[months.length - 1]}</div>
          <div className="card-sub">월급일까지 D-{daysToPayday} · 이번 달 흐름을 한눈에</div>
        </div>
        <button className="timer-btn primary" onClick={onAdd}>+ 내역 추가</button>
      </div>

      <div className="money-summary">
        <div className="money-stat income">
          <div className="lbl">월급 (실수령)</div>
          <div className="val">{won(income)}</div>
          <div style={{ fontSize: 10, color: "var(--ink-mute)", marginTop: 2 }}>매월 25일 입금</div>
        </div>
        <div className="money-stat expense">
          <div className="lbl">이번 달 지출</div>
          <div className="val">{won(expense)}</div>
          <div style={{ fontSize: 10, color: "var(--ink-mute)", marginTop: 2 }}>예산 {budgetPct}% 사용</div>
        </div>
        <div className="money-stat">
          <div className="lbl">남은 예산</div>
          <div className="val" style={{ color: balance > 500000 ? "#2d7a3a" : "var(--red)" }}>{won(balance)}</div>
          <div style={{ fontSize: 10, color: "var(--ink-mute)", marginTop: 2 }}>D-{daysToPayday}까지 사용 가능</div>
        </div>
      </div>

      <div className="budget-meter">
        <div className="budget-meter-track">
          <div className="budget-meter-fill" style={{ width: budgetPct + "%" }} />
        </div>
        <div className="budget-meter-labels">
          <span>0</span>
          <span><b>{budgetPct}%</b> 사용 중</span>
          <span>{won(income)}</span>
        </div>
      </div>

      <div className="bars">
        {data.map((d, i) => (
          <div key={i} style={{ flex: 1, height: "100%", display: "flex", flexDirection: "column", gap: 2, alignItems: "stretch", justifyContent: "flex-end" }}>
            <div className="bar in" style={{ height: `${(d.in / max) * 60}%` }} />
            <div className="bar out" style={{ height: `${(d.out / max) * 40}%` }} />
          </div>
        ))}
      </div>
      <div className="bars-axis">
        {months.map(m => <span key={m}>{m}</span>)}
      </div>

      <div className="txns">
        {txns.map(t => (
          <div key={t.id} className="txn">
            <div className="txn-ico"><Icon name={inferIcon(t)} size={14} /></div>
            <div className="txn-label">
              {t.label} {inferPayday(t) && <span className="tag" style={{ background: "#e6f4ea", borderColor: "#9ed1ad", color: "#2d7a3a", marginLeft: 4 }}>월급</span>}
              <small>{t.note}</small>
            </div>
            <div className={"txn-amount " + t.type}>{fmt(t.amount)}</div>
            <button className="txn-edit-btn" onClick={() => onEditTxn && onEditTxn(t)} title="수정">
              <Icon name="note" size={12} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
