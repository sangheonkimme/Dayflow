import { useState, useMemo } from "react";
import { PartnerLinks } from "@/components/PartnerLinks";
import styles from "./LoanSearch.module.css";

// ============================================================
// LOAN CALCULATOR — 대출 이자 계산기
// 원리금균등 / 원금균등 / 만기일시
// ============================================================

function calcLoan({ principal, annualRate, months, graceMonths, type }) {
  const r = annualRate / 100 / 12;
  const n = months;
  const g = Math.min(graceMonths, n);
  const payMonths = n - g;
  const schedule: { no: number; pay: number; principalPart: number; interest: number; balance: number }[] = [];

  if (principal <= 0 || n <= 0) {
    return {
      schedule,
      totalInterest: 0,
      totalPay: 0,
      monthlyAvg: 0,
      firstPay: 0,
      fixedPay: 0,
    };
  }

  // 거치기간: 이자만 납부
  let balance = principal;
  for (let i = 1; i <= g; i++) {
    const interest = Math.round(balance * r);
    schedule.push({
      no: i,
      pay: interest,
      principalPart: 0,
      interest,
      balance,
    });
  }

  if (type === "equal-payment") {
    // 원리금균등: 매달 동일 납입금
    const pay =
      payMonths > 0 && r > 0
        ? Math.round(
            (balance * r * Math.pow(1 + r, payMonths)) /
              (Math.pow(1 + r, payMonths) - 1),
          )
        : Math.round(balance / payMonths);
    for (let i = 1; i <= payMonths; i++) {
      const interest = Math.round(balance * r);
      const principalPart = pay - interest;
      balance = Math.max(0, balance - principalPart);
      schedule.push({ no: g + i, pay, principalPart, interest, balance });
    }
  } else if (type === "equal-principal") {
    // 원금균등: 매달 원금 동일
    const principalPart = Math.round(balance / payMonths);
    for (let i = 1; i <= payMonths; i++) {
      const interest = Math.round(balance * r);
      const pay = principalPart + interest;
      balance = Math.max(0, balance - principalPart);
      schedule.push({ no: g + i, pay, principalPart, interest, balance });
    }
  } else {
    // 만기일시: 이자만 매달, 만기에 원금
    for (let i = 1; i <= payMonths; i++) {
      const interest = Math.round(balance * r);
      const isLast = i === payMonths;
      const principalPart = isLast ? balance : 0;
      const pay = interest + principalPart;
      const newBalance = isLast ? 0 : balance;
      schedule.push({
        no: g + i,
        pay,
        principalPart,
        interest,
        balance: newBalance,
      });
      balance = newBalance;
    }
  }

  const totalInterest = schedule.reduce((s, x) => s + x.interest, 0);
  const totalPay = schedule.reduce((s, x) => s + x.pay, 0);
  const monthlyAvg = Math.round(totalPay / n);
  const firstPay = schedule[0]?.pay || 0;
  const fixedPay = schedule[g]?.pay || firstPay;

  return { schedule, totalInterest, totalPay, monthlyAvg, firstPay, fixedPay };
}

const _won = (n) => Math.max(0, Math.floor(n)).toLocaleString() + "원";

function LoanCalcPage() {
  const [principal, setPrincipal] = useState(100000000);
  const [rate, setRate] = useState(4.5);
  const [years, setYears] = useState(10);
  const [extraMonths, setExtraMonths] = useState(0);
  const [grace, setGrace] = useState(0);
  const [type, setType] = useState("equal-payment");
  const [showAll, setShowAll] = useState(false);

  const totalMonths = years * 12 + extraMonths;
  const r = useMemo(
    () =>
      calcLoan({
        principal,
        annualRate: rate,
        months: totalMonths,
        graceMonths: grace,
        type,
      }),
    [principal, rate, totalMonths, grace, type],
  );

  const visibleRows = showAll ? r.schedule : r.schedule.slice(0, 8);

  return (
    <div data-screen-label="06 대출 이자 계산기">
      <div className="page-head">
        <div>
          <div className="crumb">메뉴 · 도구</div>
          <h1 className="page-title">
            대출 이자 계산기 <span className="hand-sub">— 한눈에 비교하기</span>
          </h1>
          <div className="page-sub">
            월 납입금과 총 이자를 한눈에 비교하고, 거치기간이 있을 때의 변화를
            확인할 수 있습니다.
          </div>
        </div>
      </div>

      {/* ===== 대출 조건 ===== */}
      <div className={`card card-pad ${styles.loanCard}`}>
        <h3 className={styles.loanH3}>대출 조건</h3>

        <div className={styles.loanGrid2}>
          <div className={styles.loanField}>
            <label htmlFor="loan-principal">대출 금액</label>
            <div className={styles.loanInputWrap}>
              <input
                id="loan-principal"
                type="text"
                inputMode="numeric"
                value={principal.toLocaleString()}
                onChange={(e) => {
                  const v = parseInt(e.target.value.replace(/[^0-9]/g, ""), 10);
                  setPrincipal(isNaN(v) ? 0 : v);
                }}
              />
              <span className={styles.loanSuffix}>원</span>
            </div>
          </div>

          <div className={styles.loanField}>
            <label htmlFor="loan-rate">연이자율</label>
            <div className={styles.loanInputWrap}>
              <input
                id="loan-rate"
                type="number"
                step="0.1"
                min="0"
                max="30"
                value={rate}
                onChange={(e) => setRate(parseFloat(e.target.value) || 0)}
              />
              <span className={styles.loanSuffix}>%</span>
            </div>
          </div>
        </div>

        <div className={styles.loanGrid3}>
          <div className={styles.loanField}>
            <label htmlFor="loan-years">기간 (년)</label>
            <div className={styles.loanInputWrap}>
              <input
                id="loan-years"
                type="number"
                min="0"
                max="50"
                value={years}
                onChange={(e) =>
                  setYears(Math.max(0, parseInt(e.target.value) || 0))
                }
              />
              <div className={styles.loanSpinner}>
                <button type="button" onClick={() => setYears(years + 1)}>
                  ▲
                </button>
                <button
                  type="button"
                  onClick={() => setYears(Math.max(0, years - 1))}
                >
                  ▼
                </button>
              </div>
            </div>
          </div>

          <div className={styles.loanField}>
            <label htmlFor="loan-extra-months">기간 (개월)</label>
            <div className={styles.loanInputWrap}>
              <input
                id="loan-extra-months"
                type="number"
                min="0"
                max="11"
                value={extraMonths}
                onChange={(e) =>
                  setExtraMonths(Math.max(0, parseInt(e.target.value) || 0))
                }
              />
              <div className={styles.loanSpinner}>
                <button
                  type="button"
                  onClick={() => setExtraMonths(Math.min(11, extraMonths + 1))}
                >
                  ▲
                </button>
                <button
                  type="button"
                  onClick={() => setExtraMonths(Math.max(0, extraMonths - 1))}
                >
                  ▼
                </button>
              </div>
            </div>
          </div>

          <div className={styles.loanField}>
            <label htmlFor="loan-grace">거치기간 (개월)</label>
            <div className={styles.loanInputWrap}>
              <input
                id="loan-grace"
                type="number"
                min="0"
                value={grace}
                onChange={(e) =>
                  setGrace(Math.max(0, parseInt(e.target.value) || 0))
                }
              />
              <div className={styles.loanSpinner}>
                <button type="button" onClick={() => setGrace(grace + 1)}>
                  ▲
                </button>
                <button
                  type="button"
                  onClick={() => setGrace(Math.max(0, grace - 1))}
                >
                  ▼
                </button>
              </div>
            </div>
            <small className={styles.loanHint}>거치기간 동안에는 이자만 납부</small>
          </div>
        </div>

        <div className={styles.loanTypeTabs}>
          {[
            ["equal-payment", "원리금균등"],
            ["equal-principal", "원금균등"],
            ["balloon", "만기일시(이자만)"],
          ].map(([k, l]) => (
            <button
              key={k}
              className={
                styles.loanTab + (type === k ? " " + styles.loanTabOn : "")
              }
              onClick={() => setType(k)}
            >
              {l}
            </button>
          ))}
        </div>
      </div>

      {/* ===== 상환 요약 ===== */}
      <div
        className={`card card-pad ${styles.loanCard}`}
        style={{ marginTop: 18 }}
      >
        <h3 className={styles.loanH3}>상환 요약</h3>

        <div className={styles.loanSummaryGrid}>
          <div className={styles.loanStat}>
            <div className={styles.lsLbl}>월 납입금</div>
            <div className={styles.lsVal}>{_won(r.fixedPay)}</div>
            <div className={styles.lsSub}>
              {type === "equal-principal"
                ? "첫 회 납입액"
                : type === "balloon"
                  ? "월 이자"
                  : "거치 종료 후 고정 납입액"}
            </div>
          </div>
          <div className={styles.loanStat}>
            <div className={styles.lsLbl}>총 이자</div>
            <div className={styles.lsVal}>{_won(r.totalInterest)}</div>
            <div className={styles.lsSub}>전체 기간 동안 납부할 이자 합계</div>
          </div>
          <div className={styles.loanStat}>
            <div className={styles.lsLbl}>총 상환액</div>
            <div className={styles.lsVal}>{_won(r.totalPay)}</div>
            <div className={styles.lsSub}>원금 + 이자</div>
          </div>
          <div className={styles.loanStat}>
            <div className={styles.lsLbl}>월 평균 납입금</div>
            <div className={styles.lsVal}>{_won(r.monthlyAvg)}</div>
            <div className={styles.lsSub}>총 상환액 ÷ 전체 개월 수</div>
          </div>
        </div>

        <div className={styles.loanChips}>
          <span className={styles.loanChip}>연이율 {rate}%</span>
          <span className={styles.loanChip}>총 {totalMonths}개월</span>
          {grace > 0 && (
            <span className={styles.loanChip}>거치 {grace}개월</span>
          )}
        </div>
        <p className={styles.loanDisclaimer}>
          실제 금융기관 조건과 차이가 있을 수 있으며 참고용으로만 사용해주세요.
        </p>
      </div>

      {/* ===== 제휴 링크 — 총 이자 확인 직후가 금리 비교 의향이 가장 높은 시점 ===== */}
      <PartnerLinks
        surface="loan"
        title="이자 줄이는 법, 여기서 비교해보세요"
        className={styles.loanPartners}
      />

      {/* ===== 월별 상환 일정 ===== */}
      <div
        className={`card card-pad ${styles.loanCard}`}
        style={{ marginTop: 18 }}
      >
        <div className={styles.loanScheduleHead}>
          <div>
            <h3 className={styles.loanH3} style={{ marginBottom: 4 }}>
              월별 상환 일정
            </h3>
            <small className={styles.loanHint}>
              모든 금액은 반올림된 값이며 마지막 회차는 소폭 차이가 날 수
              있습니다.
            </small>
          </div>
          <button
            className={styles.loanToggleAll}
            onClick={() => setShowAll(!showAll)}
          >
            {showAll ? "처음 8개월만 보기" : `총 ${totalMonths}개월 모두 보기`}
          </button>
        </div>

        <div className={styles.loanTableWrap}>
          <table className={styles.loanTable}>
            <thead>
              <tr>
                <th style={{ width: 60 }}>회차</th>
                <th>납입금</th>
                <th>원금</th>
                <th>이자</th>
                <th>잔액</th>
              </tr>
            </thead>
            <tbody>
              {visibleRows.map((row) => (
                <tr key={row.no}>
                  <td className={styles.loanNo}>#{row.no}</td>
                  <td className={styles.loanNum}>
                    <b>{_won(row.pay)}</b>
                  </td>
                  <td className={styles.loanNum}>{_won(row.principalPart)}</td>
                  <td className={`${styles.loanNum} ${styles.loanNumOrange}`}>
                    {_won(row.interest)}
                  </td>
                  <td className={`${styles.loanNum} ${styles.loanNumMuted}`}>
                    {_won(row.balance)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export { LoanCalcPage };
