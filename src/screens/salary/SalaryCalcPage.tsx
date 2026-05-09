import { useState, useMemo } from "react";
import { Icon } from "@/components/Icon";
import { formatWon } from "@/lib/format";
import styles from "./SalaryCalcPage.module.css";

// ============================================================
// SALARY CALCULATOR PAGE — 연봉 계산기
// ============================================================
// 2025년 기준 4대보험 공제율 + 간이세액표 적용. 로직은
// worklife-dashboard 의 salaryCalculator 와 동기화 (2026-05-09).

// 2025년 기준 공제율
const RATES = {
  NATIONAL_PENSION: 0.045,
  HEALTH_INSURANCE: 0.03545,
  LONG_TERM_CARE_RATE: 0.1295, // 건강보험료의 12.95%
  EMPLOYMENT_INSURANCE: 0.009,
  LOCAL_INCOME_TAX_RATE: 0.1,
  SMALL_COMPANY_TAX_REDUCTION: 0.9,
};

// 국민연금 상한 (2025년: 월 590만원)
const NATIONAL_PENSION_MAX = 5900000;
// 건강보험 상한 (실무상 거의 적용 안 됨 — 안전 가드)
const HEALTH_INSURANCE_MAX = 100000000;

function calcSalary({
  grossYearly,
  severanceIncluded,
  nonTaxYearly,
  dependents,
  kids8to20,
  smeReduction,
}: {
  grossYearly: number;
  severanceIncluded: boolean;
  nonTaxYearly: number;
  dependents: number;
  kids8to20: number;
  smeReduction: boolean;
}) {
  // 1. 퇴직금 포함이면 연봉의 1/13 으로 분리 (Dayflow 고유 기능 유지)
  const baseYearly = severanceIncluded
    ? Math.floor((grossYearly * 12) / 13)
    : grossYearly;
  const monthlyGross = Math.max(0, Math.floor(baseYearly / 12));
  const monthlyNonTax = Math.max(0, Math.floor(nonTaxYearly / 12));
  const taxableMonthly = Math.max(0, monthlyGross - monthlyNonTax);

  // 2. 4대 보험 (상한 적용)
  const npBase = Math.min(taxableMonthly, NATIONAL_PENSION_MAX);
  const hiBase = Math.min(taxableMonthly, HEALTH_INSURANCE_MAX);
  const np = Math.floor(npBase * RATES.NATIONAL_PENSION);
  const hi = Math.floor(hiBase * RATES.HEALTH_INSURANCE);
  const ltc = Math.floor(hi * RATES.LONG_TERM_CARE_RATE);
  const ei = Math.floor(taxableMonthly * RATES.EMPLOYMENT_INSURANCE);
  const insurance = np + hi + ltc + ei;

  // 3. 간이세액표 — 4대보험 공제 후 금액 기준 (2025년)
  const afterInsurance = taxableMonthly - insurance;
  let baseIncomeTax = 0;
  if (afterInsurance > 0) {
    if (afterInsurance <= 1060000) {
      baseIncomeTax = afterInsurance * 0.04;
    } else if (afterInsurance <= 2220000) {
      baseIncomeTax = 42400 + (afterInsurance - 1060000) * 0.05;
    } else if (afterInsurance <= 4220000) {
      baseIncomeTax = 100400 + (afterInsurance - 2220000) * 0.07;
    } else if (afterInsurance <= 6220000) {
      baseIncomeTax = 240400 + (afterInsurance - 4220000) * 0.1;
    } else if (afterInsurance <= 10000000) {
      baseIncomeTax = 440400 + (afterInsurance - 6220000) * 0.15;
    } else if (afterInsurance <= 15000000) {
      baseIncomeTax = 1007400 + (afterInsurance - 10000000) * 0.2;
    } else {
      baseIncomeTax = 2007400 + (afterInsurance - 15000000) * 0.25;
    }
  }
  // 부양가족(본인 제외) + 자녀 공제 — 1인당 12,500원
  const depDeduct =
    Math.max(0, dependents - 1) * 12500 + Math.max(0, kids8to20) * 12500;
  let incomeTax = Math.max(0, Math.floor(baseIncomeTax - depDeduct));

  // 4. 중소기업 취업자 소득세 감면 (90%)
  if (smeReduction) {
    const reduction = Math.floor(incomeTax * RATES.SMALL_COMPANY_TAX_REDUCTION);
    incomeTax = incomeTax - reduction;
  }

  // 5. 지방소득세 — 감면 후 소득세의 10%
  const localTax = Math.floor(incomeTax * RATES.LOCAL_INCOME_TAX_RATE);

  const totalDeduct = insurance + incomeTax + localTax;
  const net = monthlyGross - totalDeduct;

  return {
    monthlyGross,
    monthlyNonTax,
    taxableMonthly,
    np,
    hi,
    ltc,
    ei,
    insurance,
    baseIncomeTax: Math.floor(baseIncomeTax),
    incomeTax,
    localTax,
    totalDeduct,
    net,
  };
}

const won = (n) => formatWon(Math.max(0, n));

function NumStepper({ value, onChange, suffix = "명", min = 0 }) {
  return (
    <div className={styles.numStepper}>
      <button onClick={() => onChange(Math.max(min, value - 1))} type="button">
        −
      </button>
      <span>
        {value}
        {suffix}
      </span>
      <button onClick={() => onChange(value + 1)} type="button">
        +
      </button>
    </div>
  );
}

function SalaryCalcPage() {
  const [mode, setMode] = useState("yearly"); // yearly / monthly
  const [amount, setAmount] = useState(50000000); // 연봉 기본값
  const [severance, setSeverance] = useState("separate"); // separate / included
  const [nonTax, setNonTax] = useState(2400000);
  const [dependents, setDependents] = useState(1);
  const [kids, setKids] = useState(0);
  const [sme, setSme] = useState(false);

  const grossYearly = mode === "yearly" ? amount : amount * 12;

  const r = useMemo(
    () =>
      calcSalary({
        grossYearly,
        severanceIncluded: severance === "included",
        nonTaxYearly: nonTax,
        dependents,
        kids8to20: kids,
        smeReduction: sme,
      }),
    [grossYearly, severance, nonTax, dependents, kids, sme],
  );

  const reset = () => {
    setAmount(50000000);
    setSeverance("separate");
    setNonTax(2400000);
    setDependents(1);
    setKids(0);
    setSme(false);
    setMode("yearly");
  };

  return (
    <div data-screen-label="05 연봉 계산기">
      <div className="page-head">
        <div>
          <div className="crumb">메뉴 · 도구</div>
          <h1 className="page-title">
            연봉 계산기 <span className="hand-sub">— 실수령액이 얼마지?</span>
          </h1>
          <div className="page-sub">
            2026년 기준 4대 보험 · 소득세를 자동으로 계산해드려요
          </div>
        </div>
        <button className="timer-btn" onClick={reset}>
          <Icon name="repeat" size={13} /> 초기화
        </button>
      </div>

      <div className={styles.salaryLayout}>
        {/* ==== LEFT: INPUT ==== */}
        <div className={styles.salaryCol}>
          <div className={`card card-pad ${styles.salaryCard}`}>
            <div className={styles.salaryCardHead}>
              <h3>급여 정보 입력</h3>
              <button
                className={styles.salaryReset}
                onClick={reset}
                title="초기화"
              >
                <Icon name="repeat" size={14} />
              </button>
            </div>

            <div className={styles.salaryField}>
              <label>연봉/월급 선택</label>
              <div className={styles.salarySeg}>
                <button
                  className={mode === "yearly" ? styles.on : ""}
                  onClick={() => setMode("yearly")}
                >
                  연봉
                </button>
                <button
                  className={mode === "monthly" ? styles.on : ""}
                  onClick={() => setMode("monthly")}
                >
                  월급
                </button>
              </div>
            </div>

            <div className={styles.salaryField}>
              <label>{mode === "yearly" ? "연봉" : "월급"}</label>
              <div className={styles.salaryInputWrap}>
                <input
                  type="text"
                  inputMode="numeric"
                  value={amount.toLocaleString()}
                  onChange={(e) => {
                    const v = parseInt(
                      e.target.value.replace(/[^0-9]/g, ""),
                      10,
                    );
                    setAmount(isNaN(v) ? 0 : v);
                  }}
                />
                <span className={styles.salarySuffix}>원</span>
              </div>
            </div>
          </div>

          <div className={`card card-pad ${styles.salaryCard}`}>
            <div className={styles.salaryOptionsLabel}>추가 옵션</div>

            <div className={styles.salaryField}>
              <label>퇴직금</label>
              <div className={styles.salarySeg}>
                <button
                  className={severance === "separate" ? styles.on : ""}
                  onClick={() => setSeverance("separate")}
                >
                  별도
                </button>
                <button
                  className={severance === "included" ? styles.on : ""}
                  onClick={() => setSeverance("included")}
                >
                  포함
                </button>
              </div>
            </div>

            <div className={styles.salaryField}>
              <label>비과세액 (연간 총액)</label>
              <div className={styles.salaryInputWrap}>
                <input
                  type="text"
                  inputMode="numeric"
                  value={nonTax.toLocaleString()}
                  onChange={(e) => {
                    const v = parseInt(
                      e.target.value.replace(/[^0-9]/g, ""),
                      10,
                    );
                    setNonTax(isNaN(v) ? 0 : v);
                  }}
                />
                <span className={styles.salarySuffix}>원</span>
              </div>
              <small className={styles.salaryHint}>
                월 {Math.floor(nonTax / 12).toLocaleString()}
              </small>
            </div>

            <div className={styles.salaryField}>
              <label>부양가족수 (본인 포함)</label>
              <NumStepper value={dependents} onChange={setDependents} min={1} />
            </div>

            <div className={styles.salaryField}>
              <label>8세 이상 20세 이하 자녀수</label>
              <NumStepper value={kids} onChange={setKids} />
            </div>

            <label className={styles.salaryCheck}>
              <input
                type="checkbox"
                checked={sme}
                onChange={(e) => setSme(e.target.checked)}
              />
              <span className={styles.salaryCheckBox}></span>
              <span>중소기업 취업자 소득세 감면</span>
            </label>
          </div>
        </div>

        {/* ==== RIGHT: PAYSLIP ==== */}
        <div className={styles.salaryCol}>
          <div className={`card card-pad ${styles.salaryCard}`}>
            <h3 className={styles.payslipTitle}>급여명세서</h3>

            <div className={styles.payslipGross}>
              <div className={styles.pgLabel}>
                <small>지급내역</small>
                <b>월 급여</b>
              </div>
              <div className={styles.pgAmount}>
                {won(r.monthlyGross)} <span>원</span>
              </div>
            </div>

            <div className={styles.payslipSectionTitle}>공제내역</div>

            <div className={styles.payslipGroup}>
              <div className={`${styles.pgRow} ${styles.pgRowHead}`}>
                <span>4대 보험</span>
                <b className={styles.blue}>{won(r.insurance)} 원</b>
              </div>
              <div className={`${styles.pgRow} ${styles.sub}`}>
                <span>
                  국민연금 (4.5%) <i className={styles.qmark}>?</i>
                </span>
                <span>{won(r.np)} 원</span>
              </div>
              <div className={`${styles.pgRow} ${styles.sub}`}>
                <span>
                  건강보험 (3.545%) <i className={styles.qmark}>?</i>
                </span>
                <span>{won(r.hi)} 원</span>
              </div>
              <div className={`${styles.pgRow} ${styles.sub}`}>
                <span>
                  장기요양보험료 (12.95%) <i className={styles.qmark}>?</i>
                </span>
                <span>{won(r.ltc)} 원</span>
              </div>
              <div className={`${styles.pgRow} ${styles.sub}`}>
                <span>
                  고용보험 (0.9%) <i className={styles.qmark}>?</i>
                </span>
                <span>{won(r.ei)} 원</span>
              </div>
            </div>

            <div className={styles.payslipGroup}>
              <div className={`${styles.pgRow} ${styles.pgRowHead}`}>
                <span>소득세</span>
                <b className={styles.purple}>
                  {won(r.incomeTax + r.localTax)} 원
                </b>
              </div>
              <div className={`${styles.pgRow} ${styles.sub}`}>
                <span>
                  소득세 (기본) <i className={styles.qmark}>?</i>
                </span>
                <span>{won(r.baseIncomeTax)} 원</span>
              </div>
              <div className={`${styles.pgRow} ${styles.sub}`}>
                <span>
                  소득세 <i className={styles.qmark}>?</i>
                </span>
                <span>{won(r.incomeTax)} 원</span>
              </div>
              <div className={`${styles.pgRow} ${styles.sub}`}>
                <span>
                  지방소득세 (10%) <i className={styles.qmark}>?</i>
                </span>
                <span>{won(r.localTax)} 원</span>
              </div>
            </div>

            <div className={styles.payslipTotal}>
              <span>공제총액</span>
              <b>{won(r.totalDeduct)} 원</b>
            </div>

            <div className={styles.payslipNote}>
              <div>
                * 실제 공제액은 회사 및 개인 상황에 따라 다를 수 있습니다.
              </div>
              <div>* 2026년 기준 세율이 적용되었습니다.</div>
            </div>

            <div className={styles.payslipNet}>
              <span>실지급액</span>
              <b>
                {won(r.net)} <span>원</span>
              </b>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export { SalaryCalcPage };
