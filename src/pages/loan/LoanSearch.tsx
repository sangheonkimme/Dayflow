// @ts-nocheck
import { useState, useEffect, useMemo } from 'react';
import { Icon } from '@/shared/ui/Icon';

// ============================================================
// LOAN CALCULATOR — 대출 이자 계산기
// 원리금균등 / 원금균등 / 만기일시
// ============================================================

function calcLoan({ principal, annualRate, months, graceMonths, type }) {
  const r = annualRate / 100 / 12;
  const n = months;
  const g = Math.min(graceMonths, n);
  const payMonths = n - g;
  const schedule = [];

  if (principal <= 0 || n <= 0) {
    return { schedule, totalInterest: 0, totalPay: 0, monthlyAvg: 0, firstPay: 0, fixedPay: 0 };
  }

  // 거치기간: 이자만 납부
  let balance = principal;
  for (let i = 1; i <= g; i++) {
    const interest = Math.round(balance * r);
    schedule.push({ no: i, pay: interest, principalPart: 0, interest, balance });
  }

  if (type === "equal-payment") {
    // 원리금균등: 매달 동일 납입금
    const pay = payMonths > 0 && r > 0
      ? Math.round((balance * r * Math.pow(1 + r, payMonths)) / (Math.pow(1 + r, payMonths) - 1))
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
      schedule.push({ no: g + i, pay, principalPart, interest, balance: newBalance });
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
  const r = useMemo(() => calcLoan({
    principal, annualRate: rate, months: totalMonths, graceMonths: grace, type,
  }), [principal, rate, totalMonths, grace, type]);

  const visibleRows = showAll ? r.schedule : r.schedule.slice(0, 8);

  return (
    <div data-screen-label="06 대출 이자 계산기">
      <div className="page-head">
        <div>
          <div className="crumb">메뉴 · 도구</div>
          <h1 className="page-title">대출 이자 계산기 <span className="hand-sub">— 한눈에 비교하기</span></h1>
          <div className="page-sub">월 납입금과 총 이자를 한눈에 비교하고, 거치기간이 있을 때의 변화를 확인할 수 있습니다.</div>
        </div>
      </div>

      {/* ===== 대출 조건 ===== */}
      <div className="card card-pad loan-card">
        <h3 className="loan-h3">대출 조건</h3>

        <div className="loan-grid-2">
          <div className="loan-field">
            <label>대출 금액</label>
            <div className="loan-input-wrap">
              <input
                type="text" inputMode="numeric"
                value={principal.toLocaleString()}
                onChange={(e) => {
                  const v = parseInt(e.target.value.replace(/[^0-9]/g, ""), 10);
                  setPrincipal(isNaN(v) ? 0 : v);
                }}
              />
              <span className="loan-suffix">원</span>
            </div>
          </div>

          <div className="loan-field">
            <label>연이자율</label>
            <div className="loan-input-wrap">
              <input
                type="number" step="0.1" min="0" max="30"
                value={rate}
                onChange={(e) => setRate(parseFloat(e.target.value) || 0)}
              />
              <span className="loan-suffix">%</span>
            </div>
          </div>
        </div>

        <div className="loan-grid-3">
          <div className="loan-field">
            <label>기간 (년)</label>
            <div className="loan-input-wrap">
              <input type="number" min="0" max="50" value={years}
                onChange={(e) => setYears(Math.max(0, parseInt(e.target.value) || 0))} />
              <div className="loan-spinner">
                <button type="button" onClick={() => setYears(years + 1)}>▲</button>
                <button type="button" onClick={() => setYears(Math.max(0, years - 1))}>▼</button>
              </div>
            </div>
          </div>

          <div className="loan-field">
            <label>기간 (개월)</label>
            <div className="loan-input-wrap">
              <input type="number" min="0" max="11" value={extraMonths}
                onChange={(e) => setExtraMonths(Math.max(0, parseInt(e.target.value) || 0))} />
              <div className="loan-spinner">
                <button type="button" onClick={() => setExtraMonths(Math.min(11, extraMonths + 1))}>▲</button>
                <button type="button" onClick={() => setExtraMonths(Math.max(0, extraMonths - 1))}>▼</button>
              </div>
            </div>
          </div>

          <div className="loan-field">
            <label>거치기간 (개월)</label>
            <div className="loan-input-wrap">
              <input type="number" min="0" value={grace}
                onChange={(e) => setGrace(Math.max(0, parseInt(e.target.value) || 0))} />
              <div className="loan-spinner">
                <button type="button" onClick={() => setGrace(grace + 1)}>▲</button>
                <button type="button" onClick={() => setGrace(Math.max(0, grace - 1))}>▼</button>
              </div>
            </div>
            <small className="loan-hint">거치기간 동안에는 이자만 납부</small>
          </div>
        </div>

        <div className="loan-type-tabs">
          {[
            ["equal-payment", "원리금균등"],
            ["equal-principal", "원금균등"],
            ["balloon", "만기일시(이자만)"],
          ].map(([k, l]) => (
            <button key={k} className={"loan-tab" + (type === k ? " on" : "")} onClick={() => setType(k)}>
              {l}
            </button>
          ))}
        </div>
      </div>

      {/* ===== 상환 요약 ===== */}
      <div className="card card-pad loan-card" style={{ marginTop: 18 }}>
        <h3 className="loan-h3">상환 요약</h3>

        <div className="loan-summary-grid">
          <div className="loan-stat">
            <div className="ls-lbl">월 납입금</div>
            <div className="ls-val">{_won(r.fixedPay)}</div>
            <div className="ls-sub">{type === "equal-principal" ? "첫 회 납입액" : type === "balloon" ? "월 이자" : "거치 종료 후 고정 납입액"}</div>
          </div>
          <div className="loan-stat">
            <div className="ls-lbl">총 이자</div>
            <div className="ls-val">{_won(r.totalInterest)}</div>
            <div className="ls-sub">전체 기간 동안 납부할 이자 합계</div>
          </div>
          <div className="loan-stat">
            <div className="ls-lbl">총 상환액</div>
            <div className="ls-val">{_won(r.totalPay)}</div>
            <div className="ls-sub">원금 + 이자</div>
          </div>
          <div className="loan-stat">
            <div className="ls-lbl">월 평균 납입금</div>
            <div className="ls-val">{_won(r.monthlyAvg)}</div>
            <div className="ls-sub">총 상환액 ÷ 전체 개월 수</div>
          </div>
        </div>

        <div className="loan-chips">
          <span className="loan-chip">연이율 {rate}%</span>
          <span className="loan-chip">총 {totalMonths}개월</span>
          {grace > 0 && <span className="loan-chip">거치 {grace}개월</span>}
        </div>
        <p className="loan-disclaimer">실제 금융기관 조건과 차이가 있을 수 있으며 참고용으로만 사용해주세요.</p>
      </div>

      {/* ===== 월별 상환 일정 ===== */}
      <div className="card card-pad loan-card" style={{ marginTop: 18 }}>
        <div className="loan-schedule-head">
          <div>
            <h3 className="loan-h3" style={{ marginBottom: 4 }}>월별 상환 일정</h3>
            <small className="loan-hint">모든 금액은 반올림된 값이며 마지막 회차는 소폭 차이가 날 수 있습니다.</small>
          </div>
          <button className="loan-toggle-all" onClick={() => setShowAll(!showAll)}>
            {showAll ? "처음 8개월만 보기" : `총 ${totalMonths}개월 모두 보기`}
          </button>
        </div>

        <div className="loan-table-wrap">
          <table className="loan-table">
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
                  <td className="loan-no">#{row.no}</td>
                  <td className="loan-num"><b>{_won(row.pay)}</b></td>
                  <td className="loan-num">{_won(row.principalPart)}</td>
                  <td className="loan-num orange">{_won(row.interest)}</td>
                  <td className="loan-num muted">{_won(row.balance)}</td>
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
    { type: "page", id: "home",     label: "대시보드",       sub: "오늘의 한눈에", icon: "home" },
    { type: "page", id: "ledger",   label: "가계부",         sub: "수입 · 지출 · 통계", icon: "wallet" },
    { type: "page", id: "txns",     label: "거래내역",       sub: "전체 검색 · 상세", icon: "cash" },
    { type: "page", id: "subs",     label: "정기구독",       sub: "구독 관리", icon: "repeat" },
    { type: "page", id: "calendar", label: "캘린더",         sub: "일정 · 이벤트", icon: "cal" },
    { type: "page", id: "memo",     label: "메모",           sub: "장문 메모", icon: "note" },
    { type: "page", id: "salary",   label: "연봉 계산기",    sub: "실수령액 계산", icon: "coin" },
    { type: "page", id: "loan",     label: "대출 이자 계산기", sub: "원리금/원금 균등", icon: "cash" },
    { type: "page", id: "crop",     label: "이미지 자르기",  sub: "비율 / 크롭", icon: "crop" },
    { type: "page", id: "pdf",      label: "이미지 → PDF",   sub: "한번에 변환", icon: "pdf" },
    { type: "page", id: "settings", label: "환경설정",       sub: "테마 · 계정", icon: "settings" },

    { type: "txn", id: "ledger", label: "11월 급여",     sub: "₩3,200,000 · 정기 입금", icon: "cash" },
    { type: "txn", id: "ledger", label: "월세 자동이체", sub: "-₩850,000 · 매월 1일", icon: "home" },
    { type: "txn", id: "ledger", label: "스타벅스 강남점", sub: "-₩6,800 · 식비", icon: "coffee" },
    { type: "txn", id: "subs",   label: "넷플릭스",     sub: "₩17,000/월 · 구독", icon: "repeat" },
    { type: "txn", id: "subs",   label: "유튜브 프리미엄", sub: "₩14,900/월 · 구독", icon: "repeat" },

    { type: "event", id: "calendar", label: "팀 스탠드업",  sub: "오늘 오후 3:00", icon: "cal" },
    { type: "event", id: "calendar", label: "디자인 리뷰",  sub: "11.07 토 14:00", icon: "cal" },
    { type: "event", id: "calendar", label: "포트폴리오 마감", sub: "11.28 23:59", icon: "cal" },

    { type: "memo", id: "memo", label: "주간 회고",     sub: "회고 · 메모", icon: "note" },
    { type: "memo", id: "memo", label: "프로젝트 아이디어", sub: "메모 · 9개 항목", icon: "note" },
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
    ? index.filter(it => (it.label + " " + it.sub).toLowerCase().includes(ql))
    : index.filter(it => it.type === "page").slice(0, 6);

  const groups = filtered.reduce((acc, it) => {
    const k = it.type;
    if (!acc[k]) acc[k] = [];
    acc[k].push(it);
    return acc;
  }, {});
  const groupOrder = ["page", "txn", "event", "memo"];
  const groupLabels = { page: "페이지", txn: "거래내역", event: "일정", memo: "메모" };

  const handlePick = (it) => {
    onNavigate && onNavigate(it.id);
    onClose();
    setQ("");
  };

  return (
    <div className="search-overlay" onClick={onClose}>
      <div className="search-modal" onClick={(e) => e.stopPropagation()}>
        <div className="search-input-wrap">
          <Icon name="search" size={18} />
          <input
            autoFocus
            placeholder="페이지, 거래, 일정, 메모 검색..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <kbd>ESC</kbd>
        </div>

        <div className="search-results">
          {filtered.length === 0 && (
            <div className="search-empty">
              <div className="search-empty-mark">🔍</div>
              <b>검색 결과가 없어요</b>
              <small>다른 키워드로 시도해보세요</small>
            </div>
          )}

          {groupOrder.map(g => groups[g] && (
            <div key={g} className="search-group">
              <div className="search-group-label">{ql ? groupLabels[g] : "바로가기"}</div>
              {groups[g].map((it, i) => (
                <div key={i} className="search-item" onClick={() => handlePick(it)}>
                  <div className="search-item-ico"><Icon name={it.icon} size={14} /></div>
                  <div className="search-item-body">
                    <b>{it.label}</b>
                    <small>{it.sub}</small>
                  </div>
                  <span className="search-item-type">{groupLabels[it.type]}</span>
                  <span className="search-item-arrow">↵</span>
                </div>
              ))}
            </div>
          ))}
        </div>

        <div className="search-foot">
          <span><kbd>↵</kbd> 이동</span>
          <span><kbd>ESC</kbd> 닫기</span>
          <span className="search-foot-tip">⌘K로 다시 열기</span>
        </div>
      </div>
    </div>
  );
}

export { LoanCalcPage, SearchOverlay };