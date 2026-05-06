// 대출 이자 계산기
// 원본: worklife-dashboard/client/src/components/widgets/LoanCalculatorWidget/LoanCalculatorWidget.tsx 포팅

export type LoanRepaymentType =
  | "amortized"
  | "equal_principal"
  | "interest_only";
//                              원리금균등        원금균등          만기일시(이자만)

export interface LoanInput {
  loanAmount: number; // 대출원금
  annualRate: number; // 연이율 (%)
  totalMonths: number; // 총 기간 (개월)
  graceMonths: number; // 거치기간 (개월) — interest_only일 땐 무시
  repaymentType: LoanRepaymentType;
}

export interface LoanScheduleRow {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
}

export interface LoanResult {
  schedule: LoanScheduleRow[];
  totalPayment: number;
  totalInterest: number;
  monthlyPayment: number; // 대표 월 납입액 (원리금균등=고정, 원금균등=거치직후 첫달, 만기=이자만)
  averagePayment: number;
}

export function calculateLoan(input: LoanInput): LoanResult | null {
  const { loanAmount, annualRate, totalMonths, repaymentType } = input;

  if (loanAmount <= 0 || totalMonths <= 0) return null;

  const monthlyRate = annualRate > 0 ? annualRate / 12 / 100 : 0;
  const normalizedGrace =
    repaymentType === "interest_only"
      ? 0
      : totalMonths <= 1
        ? 0
        : Math.min(Math.max(input.graceMonths, 0), totalMonths - 1);

  const amortizationMonths =
    repaymentType === "interest_only"
      ? 0
      : Math.max(totalMonths - normalizedGrace, 0);

  if (repaymentType !== "interest_only" && amortizationMonths <= 0) return null;

  const amortizedPayment =
    repaymentType === "amortized" && amortizationMonths > 0
      ? monthlyRate === 0
        ? loanAmount / amortizationMonths
        : (loanAmount *
            monthlyRate *
            Math.pow(1 + monthlyRate, amortizationMonths)) /
          (Math.pow(1 + monthlyRate, amortizationMonths) - 1)
      : 0;

  const equalPrincipal =
    repaymentType === "equal_principal" && amortizationMonths > 0
      ? loanAmount / amortizationMonths
      : 0;

  const schedule: LoanScheduleRow[] = [];
  let remaining = loanAmount;

  for (let month = 1; month <= totalMonths; month += 1) {
    const interestPayment = monthlyRate === 0 ? 0 : monthlyRate * remaining;
    let principalPayment = 0;
    let payment = 0;
    const isGraceMonth =
      repaymentType !== "interest_only" && month <= normalizedGrace;

    if (repaymentType === "interest_only") {
      if (month === totalMonths) principalPayment = remaining;
      payment = interestPayment + principalPayment;
    } else if (isGraceMonth) {
      payment = interestPayment;
    } else if (repaymentType === "amortized") {
      payment = amortizedPayment;
      principalPayment = payment - interestPayment;
    } else if (repaymentType === "equal_principal") {
      principalPayment = equalPrincipal;
      payment = principalPayment + interestPayment;
    }

    if (principalPayment > remaining) {
      principalPayment = remaining;
      payment = principalPayment + interestPayment;
    }

    remaining = Math.max(0, remaining - principalPayment);

    schedule.push({
      month,
      payment,
      principal: principalPayment,
      interest: interestPayment,
      balance: remaining,
    });
  }

  const totalPayment = schedule.reduce((s, r) => s + r.payment, 0);
  const totalInterest = schedule.reduce((s, r) => s + r.interest, 0);

  let representativeMonthlyPayment = 0;
  if (repaymentType === "amortized") {
    representativeMonthlyPayment = amortizedPayment;
  } else if (repaymentType === "equal_principal") {
    const firstAmortized = schedule.find((r) => r.month > normalizedGrace);
    representativeMonthlyPayment = firstAmortized?.payment ?? 0;
  } else {
    representativeMonthlyPayment = schedule[0]?.payment ?? 0;
  }

  return {
    schedule,
    totalPayment,
    totalInterest,
    monthlyPayment: representativeMonthlyPayment,
    averagePayment: totalPayment / totalMonths,
  };
}
