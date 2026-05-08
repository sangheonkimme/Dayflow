import { useState, useEffect, useMemo } from "react";
import { Icon } from "@/components/Icon";
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
            <label>대출 금액</label>
            <div className={styles.loanInputWrap}>
              <input
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
            <label>연이자율</label>
            <div className={styles.loanInputWrap}>
              <input
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
            <label>기간 (년)</label>
            <div className={styles.loanInputWrap}>
              <input
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
            <label>기간 (개월)</label>
            <div className={styles.loanInputWrap}>
              <input
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
            <label>거치기간 (개월)</label>
            <div className={styles.loanInputWrap}>
              <input
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

// ============================================================
// SEARCH OVERLAY — 대시보드 / 글로벌 검색
// ============================================================
function SearchOverlay({ open, onClose, onNavigate }) {
  const [q, setQ] = useState("");

  // Static index of searchable destinations + sample data
  const index = [
    {
      type: "page",
      id: "home",
      label: "대시보드",
      sub: "오늘의 한눈에",
      icon: "home",
    },
    {
      type: "page",
      id: "ledger",
      label: "가계부",
      sub: "수입 · 지출 · 통계",
      icon: "wallet",
    },
    {
      type: "page",
      id: "txns",
      label: "거래내역",
      sub: "전체 검색 · 상세",
      icon: "cash",
    },
    {
      type: "page",
      id: "subs",
      label: "정기구독",
      sub: "구독 관리",
      icon: "repeat",
    },
    {
      type: "page",
      id: "calendar",
      label: "캘린더",
      sub: "일정 · 이벤트",
      icon: "cal",
    },
    { type: "page", id: "memo", label: "메모", sub: "장문 메모", icon: "note" },
    {
      type: "page",
      id: "salary",
      label: "연봉 계산기",
      sub: "실수령액 계산",
      icon: "coin",
    },
    {
      type: "page",
      id: "loan",
      label: "대출 이자 계산기",
      sub: "원리금/원금 균등",
      icon: "cash",
    },
    {
      type: "page",
      id: "crop",
      label: "이미지 자르기",
      sub: "비율 / 크롭",
      icon: "crop",
    },
    {
      type: "page",
      id: "pdf",
      label: "이미지 → PDF",
      sub: "한번에 변환",
      icon: "pdf",
    },
    {
      type: "page",
      id: "settings",
      label: "환경설정",
      sub: "테마 · 계정",
      icon: "settings",
    },

    {
      type: "txn",
      id: "ledger",
      label: "11월 급여",
      sub: "₩3,200,000 · 정기 입금",
      icon: "cash",
    },
    {
      type: "txn",
      id: "ledger",
      label: "월세 자동이체",
      sub: "-₩850,000 · 매월 1일",
      icon: "home",
    },
    {
      type: "txn",
      id: "ledger",
      label: "스타벅스 강남점",
      sub: "-₩6,800 · 식비",
      icon: "coffee",
    },
    {
      type: "txn",
      id: "subs",
      label: "넷플릭스",
      sub: "₩17,000/월 · 구독",
      icon: "repeat",
    },
    {
      type: "txn",
      id: "subs",
      label: "유튜브 프리미엄",
      sub: "₩14,900/월 · 구독",
      icon: "repeat",
    },

    {
      type: "event",
      id: "calendar",
      label: "팀 스탠드업",
      sub: "오늘 오후 3:00",
      icon: "cal",
    },
    {
      type: "event",
      id: "calendar",
      label: "디자인 리뷰",
      sub: "11.07 토 14:00",
      icon: "cal",
    },
    {
      type: "event",
      id: "calendar",
      label: "포트폴리오 마감",
      sub: "11.28 23:59",
      icon: "cal",
    },

    {
      type: "memo",
      id: "memo",
      label: "주간 회고",
      sub: "회고 · 메모",
      icon: "note",
    },
    {
      type: "memo",
      id: "memo",
      label: "프로젝트 아이디어",
      sub: "메모 · 9개 항목",
      icon: "note",
    },
  ];

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const ql = q.trim().toLowerCase();
  const filtered = ql
    ? index.filter((it) => (it.label + " " + it.sub).toLowerCase().includes(ql))
    : index.filter((it) => it.type === "page").slice(0, 6);

  const groups = filtered.reduce((acc, it) => {
    const k = it.type;
    if (!acc[k]) acc[k] = [];
    acc[k].push(it);
    return acc;
  }, {});
  const groupOrder = ["page", "txn", "event", "memo"];
  const groupLabels = {
    page: "페이지",
    txn: "거래내역",
    event: "일정",
    memo: "메모",
  };

  const handlePick = (it) => {
    onNavigate && onNavigate(it.id);
    onClose();
    setQ("");
  };

  return (
    <div className={styles.searchOverlay} onClick={onClose}>
      <div className={styles.searchModal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.searchInputWrap}>
          <Icon name="search" size={18} />
          <input
            autoFocus
            placeholder="페이지, 거래, 일정, 메모 검색..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <kbd>ESC</kbd>
        </div>

        <div className={styles.searchResults}>
          {filtered.length === 0 && (
            <div className={styles.searchEmpty}>
              <div className={styles.searchEmptyMark}>🔍</div>
              <b>검색 결과가 없어요</b>
              <small>다른 키워드로 시도해보세요</small>
            </div>
          )}

          {groupOrder.map(
            (g) =>
              groups[g] && (
                <div key={g} className={styles.searchGroup}>
                  <div className={styles.searchGroupLabel}>
                    {ql ? groupLabels[g] : "바로가기"}
                  </div>
                  {groups[g].map((it, i) => (
                    <div
                      key={i}
                      className={styles.searchItem}
                      onClick={() => handlePick(it)}
                    >
                      <div className={styles.searchItemIco}>
                        <Icon name={it.icon} size={14} />
                      </div>
                      <div className={styles.searchItemBody}>
                        <b>{it.label}</b>
                        <small>{it.sub}</small>
                      </div>
                      <span className={styles.searchItemType}>
                        {groupLabels[it.type]}
                      </span>
                      <span className={styles.searchItemArrow}>↵</span>
                    </div>
                  ))}
                </div>
              ),
          )}
        </div>

        <div className={styles.searchFoot}>
          <span>
            <kbd>↵</kbd> 이동
          </span>
          <span>
            <kbd>ESC</kbd> 닫기
          </span>
          <span className={styles.searchFootTip}>⌘K로 다시 열기</span>
        </div>
      </div>
    </div>
  );
}

export { LoanCalcPage, SearchOverlay };
