// @ts-nocheck
import { useState, useMemo } from 'react';
import { Icon } from '@/components/icons';
import { formatWon } from '@/lib/format';

// ============================================================
// SALARY CALCULATOR PAGE — 연봉 계산기
// ============================================================
// 2026년 기준 한국 4대보험 + 소득세 간단 계산기
// (실제 세무 계산이 아닌, UI 데모용 근사치)

function calcSalary({ grossYearly, severanceIncluded, nonTaxYearly, dependents, kids8to20, smeReduction }) {
  // 퇴직금 포함이면 연봉의 1/13으로 분리
  const baseYearly = severanceIncluded ? Math.floor(grossYearly * 12 / 13) : grossYearly;
  const monthlyGross = Math.max(0, Math.floor(baseYearly / 12));
  const monthlyNonTax = Math.max(0, Math.floor(nonTaxYearly / 12));
  const taxableMonthly = Math.max(0, monthlyGross - monthlyNonTax);

  // 4대 보험 (2026년 기준 근사치)
  const np = Math.floor(taxableMonthly * 0.045);             // 국민연금 4.5%
  const hi = Math.floor(taxableMonthly * 0.03545);            // 건강보험 3.545%
  const ltc = Math.floor(hi * 0.1295);                        // 장기요양 12.95% of 건강
  const ei = Math.floor(taxableMonthly * 0.009);              // 고용보험 0.9%
  const insurance = np + hi + ltc + ei;

  // 간이세액 (아주 단순화)
  let baseIncomeTax = 0;
  if (taxableMonthly > 1060000) {
    const t = taxableMonthly;
    if (t <= 1500000) baseIncomeTax = (t - 1060000) * 0.06;
    else if (t <= 3000000) baseIncomeTax = 26400 + (t - 1500000) * 0.15;
    else if (t <= 4500000) baseIncomeTax = 251400 + (t - 3000000) * 0.24;
    else if (t <= 7000000) baseIncomeTax = 611400 + (t - 4500000) * 0.35;
    else if (t <= 12000000) baseIncomeTax = 1486400 + (t - 7000000) * 0.38;
    else baseIncomeTax = 3386400 + (t - 12000000) * 0.40;
  }
  // 부양가족 공제 (간이)
  const depDeduct = Math.max(0, dependents - 1) * 12500 + kids8to20 * 12500;
  let incomeTax = Math.max(0, Math.floor(baseIncomeTax - depDeduct));
  // 중소기업 청년 감면 90% (간이)
  if (smeReduction) incomeTax = Math.floor(incomeTax * 0.1);
  const localTax = Math.floor(incomeTax * 0.1);

  const totalDeduct = insurance + incomeTax + localTax;
  const net = monthlyGross - totalDeduct;

  return {
    monthlyGross, monthlyNonTax, taxableMonthly,
    np, hi, ltc, ei, insurance,
    baseIncomeTax: Math.floor(baseIncomeTax), incomeTax, localTax,
    totalDeduct, net,
  };
}

const won = (n) => formatWon(Math.max(0, n));

function NumStepper({ value, onChange, suffix = "명", min = 0 }) {
  return (
    <div className="num-stepper">
      <button onClick={() => onChange(Math.max(min, value - 1))} type="button">−</button>
      <span>{value}{suffix}</span>
      <button onClick={() => onChange(value + 1)} type="button">+</button>
    </div>
  );
}

function SalaryCalcPage() {
  const [mode, setMode] = useState("yearly");      // yearly / monthly
  const [amount, setAmount] = useState(50000000);   // 연봉 기본값
  const [severance, setSeverance] = useState("separate"); // separate / included
  const [nonTax, setNonTax] = useState(2400000);
  const [dependents, setDependents] = useState(1);
  const [kids, setKids] = useState(0);
  const [sme, setSme] = useState(false);

  const grossYearly = mode === "yearly" ? amount : amount * 12;

  const r = useMemo(() => calcSalary({
    grossYearly,
    severanceIncluded: severance === "included",
    nonTaxYearly: nonTax,
    dependents,
    kids8to20: kids,
    smeReduction: sme,
  }), [grossYearly, severance, nonTax, dependents, kids, sme]);

  const reset = () => {
    setAmount(50000000); setSeverance("separate"); setNonTax(2400000);
    setDependents(1); setKids(0); setSme(false); setMode("yearly");
  };

  return (
    <div data-screen-label="05 연봉 계산기">
      <div className="page-head">
        <div>
          <div className="crumb">메뉴 · 도구</div>
          <h1 className="page-title">연봉 계산기 <span className="hand-sub">— 실수령액이 얼마지?</span></h1>
          <div className="page-sub">2026년 기준 4대 보험 · 소득세를 자동으로 계산해드려요</div>
        </div>
        <button className="timer-btn" onClick={reset}>
          <Icon name="repeat" size={13} /> 초기화
        </button>
      </div>

      <div className="salary-layout">
        {/* ==== LEFT: INPUT ==== */}
        <div className="salary-col">
          <div className="card card-pad salary-card">
            <div className="salary-card-head">
              <h3>급여 정보 입력</h3>
              <button className="salary-reset" onClick={reset} title="초기화">
                <Icon name="repeat" size={14} />
              </button>
            </div>

            <div className="salary-field">
              <label>연봉/월급 선택</label>
              <div className="salary-seg">
                <button className={mode === "yearly" ? "on" : ""} onClick={() => setMode("yearly")}>연봉</button>
                <button className={mode === "monthly" ? "on" : ""} onClick={() => setMode("monthly")}>월급</button>
              </div>
            </div>

            <div className="salary-field">
              <label>{mode === "yearly" ? "연봉" : "월급"}</label>
              <div className="salary-input-wrap">
                <input
                  type="text"
                  inputMode="numeric"
                  value={amount.toLocaleString()}
                  onChange={(e) => {
                    const v = parseInt(e.target.value.replace(/[^0-9]/g, ""), 10);
                    setAmount(isNaN(v) ? 0 : v);
                  }}
                />
                <span className="salary-suffix">원</span>
              </div>
            </div>
          </div>

          <div className="card card-pad salary-card salary-options">
            <div className="salary-options-label">추가 옵션</div>

            <div className="salary-field">
              <label>퇴직금</label>
              <div className="salary-seg">
                <button className={severance === "separate" ? "on" : ""} onClick={() => setSeverance("separate")}>별도</button>
                <button className={severance === "included" ? "on" : ""} onClick={() => setSeverance("included")}>포함</button>
              </div>
            </div>

            <div className="salary-field">
              <label>비과세액 (연간 총액)</label>
              <div className="salary-input-wrap">
                <input
                  type="text"
                  inputMode="numeric"
                  value={nonTax.toLocaleString()}
                  onChange={(e) => {
                    const v = parseInt(e.target.value.replace(/[^0-9]/g, ""), 10);
                    setNonTax(isNaN(v) ? 0 : v);
                  }}
                />
                <span className="salary-suffix">원</span>
              </div>
              <small className="salary-hint">월 {Math.floor(nonTax / 12).toLocaleString()}</small>
            </div>

            <div className="salary-field">
              <label>부양가족수 (본인 포함)</label>
              <NumStepper value={dependents} onChange={setDependents} min={1} />
            </div>

            <div className="salary-field">
              <label>8세 이상 20세 이하 자녀수</label>
              <NumStepper value={kids} onChange={setKids} />
            </div>

            <label className="salary-check">
              <input type="checkbox" checked={sme} onChange={(e) => setSme(e.target.checked)} />
              <span className="salary-check-box"></span>
              <span>중소기업 취업자 소득세 감면</span>
            </label>
          </div>
        </div>

        {/* ==== RIGHT: PAYSLIP ==== */}
        <div className="salary-col">
          <div className="card card-pad salary-card payslip">
            <h3 className="payslip-title">급여명세서</h3>

            <div className="payslip-gross">
              <div className="pg-label">
                <small>지급내역</small>
                <b>월 급여</b>
              </div>
              <div className="pg-amount">{won(r.monthlyGross)} <span>원</span></div>
            </div>

            <div className="payslip-section-title">공제내역</div>

            <div className="payslip-group">
              <div className="pg-row pg-row-head">
                <span>4대 보험</span>
                <b className="blue">{won(r.insurance)} 원</b>
              </div>
              <div className="pg-row sub">
                <span>국민연금 (4.5%) <i className="qmark">?</i></span>
                <span>{won(r.np)} 원</span>
              </div>
              <div className="pg-row sub">
                <span>건강보험 (3.545%) <i className="qmark">?</i></span>
                <span>{won(r.hi)} 원</span>
              </div>
              <div className="pg-row sub">
                <span>장기요양보험료 (12.95%) <i className="qmark">?</i></span>
                <span>{won(r.ltc)} 원</span>
              </div>
              <div className="pg-row sub">
                <span>고용보험 (0.9%) <i className="qmark">?</i></span>
                <span>{won(r.ei)} 원</span>
              </div>
            </div>

            <div className="payslip-group">
              <div className="pg-row pg-row-head">
                <span>소득세</span>
                <b className="purple">{won(r.incomeTax + r.localTax)} 원</b>
              </div>
              <div className="pg-row sub">
                <span>소득세 (기본) <i className="qmark">?</i></span>
                <span>{won(r.baseIncomeTax)} 원</span>
              </div>
              <div className="pg-row sub">
                <span>소득세 <i className="qmark">?</i></span>
                <span>{won(r.incomeTax)} 원</span>
              </div>
              <div className="pg-row sub">
                <span>지방소득세 (10%) <i className="qmark">?</i></span>
                <span>{won(r.localTax)} 원</span>
              </div>
            </div>

            <div className="payslip-total">
              <span>공제총액</span>
              <b>{won(r.totalDeduct)} 원</b>
            </div>

            <div className="payslip-note">
              <div>* 실제 공제액은 회사 및 개인 상황에 따라 다를 수 있습니다.</div>
              <div>* 2026년 기준 세율이 적용되었습니다.</div>
            </div>

            <div className="payslip-net">
              <span>실지급액</span>
              <b>{won(r.net)} <span>원</span></b>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export { SalaryCalcPage };