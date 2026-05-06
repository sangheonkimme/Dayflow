// 연봉 계산기 — 2025년 기준 4대보험 + 간이 소득세
// 원본: worklife-dashboard/client/src/utils/salaryCalculator.ts 포팅

export type SalaryType = "annual" | "monthly";

export interface SalaryInput {
  salaryType: SalaryType;
  amount: number; // 연봉 또는 월급 (입력 모드에 따름)
  nonTaxableAmount: number; // 연 비과세액
  dependents: number; // 본인 포함 부양가족 수
  childrenUnder20: number; // 20세 이하 자녀 수
  isSmallCompany: boolean; // 중소기업 청년 감면
}

export interface InsuranceDeductions {
  nationalPension: number;
  healthInsurance: number;
  longTermCare: number;
  employmentInsurance: number;
  total: number;
}

export interface TaxDeductions {
  incomeTax: number;
  incomeTaxReduction: number;
  finalIncomeTax: number;
  localIncomeTax: number;
  total: number;
}

export interface TotalDeductions {
  insurance: InsuranceDeductions;
  tax: TaxDeductions;
  total: number;
}

export interface SalaryResult {
  monthlyGrossSalary: number;
  monthlyTaxableIncome: number;
  deductions: TotalDeductions;
  monthlyNetSalary: number;
  annualGrossSalary: number;
  annualNetSalary: number;
}

const RATES = {
  NATIONAL_PENSION: 0.045,
  HEALTH_INSURANCE: 0.03545,
  LONG_TERM_CARE_RATE: 0.1295,
  EMPLOYMENT_INSURANCE: 0.009,
  LOCAL_INCOME_TAX_RATE: 0.1,
  SMALL_COMPANY_TAX_REDUCTION: 0.9,
} as const;

const NATIONAL_PENSION_MAX = 5_900_000; // 월 590만원 상한
const HEALTH_INSURANCE_MAX = 100_000_000;

function calcNationalPension(monthly: number) {
  return Math.floor(
    Math.min(monthly, NATIONAL_PENSION_MAX) * RATES.NATIONAL_PENSION,
  );
}
function calcHealthInsurance(monthly: number) {
  return Math.floor(
    Math.min(monthly, HEALTH_INSURANCE_MAX) * RATES.HEALTH_INSURANCE,
  );
}
function calcLongTermCare(health: number) {
  return Math.floor(health * RATES.LONG_TERM_CARE_RATE);
}
function calcEmploymentInsurance(monthly: number) {
  return Math.floor(monthly * RATES.EMPLOYMENT_INSURANCE);
}

export function calcInsurance(monthlyTaxable: number): InsuranceDeductions {
  const nationalPension = calcNationalPension(monthlyTaxable);
  const healthInsurance = calcHealthInsurance(monthlyTaxable);
  const longTermCare = calcLongTermCare(healthInsurance);
  const employmentInsurance = calcEmploymentInsurance(monthlyTaxable);
  return {
    nationalPension,
    healthInsurance,
    longTermCare,
    employmentInsurance,
    total:
      nationalPension + healthInsurance + longTermCare + employmentInsurance,
  };
}

// 간이세액표 (2025년 근사)
function calcIncomeTax(
  monthlyTaxable: number,
  dependents: number,
  childrenUnder20: number,
): number {
  const insurance = calcInsurance(monthlyTaxable);
  const afterInsurance = monthlyTaxable - insurance.total;

  let tax = 0;
  if (afterInsurance <= 1_060_000) {
    tax = afterInsurance * 0.04;
  } else if (afterInsurance <= 2_220_000) {
    tax = 42_400 + (afterInsurance - 1_060_000) * 0.05;
  } else if (afterInsurance <= 4_220_000) {
    tax = 100_400 + (afterInsurance - 2_220_000) * 0.07;
  } else if (afterInsurance <= 6_220_000) {
    tax = 240_400 + (afterInsurance - 4_220_000) * 0.1;
  } else if (afterInsurance <= 10_000_000) {
    tax = 440_400 + (afterInsurance - 6_220_000) * 0.15;
  } else if (afterInsurance <= 15_000_000) {
    tax = 1_007_400 + (afterInsurance - 10_000_000) * 0.2;
  } else {
    tax = 2_007_400 + (afterInsurance - 15_000_000) * 0.25;
  }

  const dependentDeduction = Math.max(0, dependents - 1) * 12_500;
  const childDeduction = childrenUnder20 * 12_500;
  return Math.max(0, Math.floor(tax - dependentDeduction - childDeduction));
}

export function calcTax(
  monthlyTaxable: number,
  dependents: number,
  childrenUnder20: number,
  isSmallCompany: boolean,
): TaxDeductions {
  const incomeTax = calcIncomeTax(monthlyTaxable, dependents, childrenUnder20);
  const incomeTaxReduction = isSmallCompany
    ? Math.floor(incomeTax * RATES.SMALL_COMPANY_TAX_REDUCTION)
    : 0;
  const finalIncomeTax = incomeTax - incomeTaxReduction;
  const localIncomeTax = Math.floor(
    finalIncomeTax * RATES.LOCAL_INCOME_TAX_RATE,
  );
  return {
    incomeTax,
    incomeTaxReduction,
    finalIncomeTax,
    localIncomeTax,
    total: finalIncomeTax + localIncomeTax,
  };
}

export function calculateSalary(input: SalaryInput): SalaryResult {
  const monthlyGrossSalary =
    input.salaryType === "annual"
      ? Math.floor(input.amount / 12)
      : input.amount;

  const monthlyNonTaxable = Math.floor(input.nonTaxableAmount / 12);
  const monthlyTaxableIncome = Math.max(
    0,
    monthlyGrossSalary - monthlyNonTaxable,
  );

  const insurance = calcInsurance(monthlyTaxableIncome);
  const tax = calcTax(
    monthlyTaxableIncome,
    input.dependents,
    input.childrenUnder20,
    input.isSmallCompany,
  );

  const deductions: TotalDeductions = {
    insurance,
    tax,
    total: insurance.total + tax.total,
  };

  const monthlyNetSalary = monthlyGrossSalary - deductions.total;
  const annualGrossSalary =
    input.salaryType === "annual" ? input.amount : monthlyGrossSalary * 12;
  const annualNetSalary = monthlyNetSalary * 12;

  return {
    monthlyGrossSalary,
    monthlyTaxableIncome,
    deductions,
    monthlyNetSalary,
    annualGrossSalary,
    annualNetSalary,
  };
}
