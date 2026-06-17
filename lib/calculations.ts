import { differenceInDays, differenceInMonths } from "date-fns";
import type { PaymentResult, EmiBreakdown } from "@/types";

/**
 * Calculate interest accrued from `lastPaymentDate` to today.
 *
 * Formula: Principal × (Rate / 100) × (Days / 365)
 */
export function calcAccruedInterest(
  principal: number,
  annualRatePercent: number,
  lastPaymentDate: Date | string
): number {
  const from = new Date(lastPaymentDate);
  const to = new Date();
  const days = Math.max(differenceInDays(to, from), 0);
  return principal * (annualRatePercent / 100) * (days / 365);
}

/**
 * Days elapsed since the last payment date.
 */
export function daysElapsed(lastPaymentDate: Date | string): number {
  return Math.max(differenceInDays(new Date(), new Date(lastPaymentDate)), 0);
}

/**
 * Process a payment against a loan.
 *
 * Order of operations (per spec):
 *  1. Calculate accrued interest up to today.
 *  2. Add accrued interest to total_historical_interest_paid.
 *  3. Deduct the remainder (payment − interest) from principal.
 *  4. Caller must update last_payment_date → now.
 *
 * Note: if payment < accrued interest the principal stays unchanged
 * (the entire payment goes toward interest).
 */
export function processPayment(
  paymentAmount: number,
  principal: number,
  annualRatePercent: number,
  lastPaymentDate: Date | string,
  totalHistoricalInterestPaid: number
): PaymentResult {
  const accruedInterest = calcAccruedInterest(
    principal,
    annualRatePercent,
    lastPaymentDate
  );

  const principalReduction = Math.max(paymentAmount - accruedInterest, 0);
  const newPrincipal = Math.max(principal - principalReduction, 0);
  const newTotalInterestPaid = totalHistoricalInterestPaid + accruedInterest;

  return {
    accumulated_interest: accruedInterest,
    principal_reduction: principalReduction,
    new_principal: newPrincipal,
    new_total_interest_paid: newTotalInterestPaid,
  };
}

/**
 * Daily interest cost for a single loan.
 * Formula: Principal × (Rate / 100) / 365
 */
export function dailyCost(
  principal: number,
  annualRatePercent: number
): number {
  return principal * (annualRatePercent / 100) / 365;
}

/**
 * Monthly EMI breakdown for a housing loan.
 *
 * - dailyInterest      = principal × (rate/100) / 365
 * - interestPortion    = dailyInterest × 30.4167   (average days per month)
 * - principalPortion   = monthlyEmi − interestPortion
 * - tenureLeftMonths   = tenureMonths − monthsElapsed(startDate → today)  (min 0)
 */
export function calcEmiBreakdown(
  principal: number,
  annualRatePercent: number,
  monthlyEmi: number,
  startDate: Date | string,
  tenureMonths: number
): EmiBreakdown {
  const daily = dailyCost(principal, annualRatePercent);
  const interestPortion = daily * 30.4167;
  const principalPortion = Math.max(monthlyEmi - interestPortion, 0);

  const monthsElapsed = Math.max(
    differenceInMonths(new Date(), new Date(startDate)),
    0
  );
  const tenureLeftMonths = Math.max(tenureMonths - monthsElapsed, 0);

  return { dailyInterest: daily, interestPortion, principalPortion, tenureLeftMonths };
}

/**
 * Reverse-engineer annual interest rate from accrued interest and days elapsed.
 *
 * Formula: rate = (accruedInterest / (principal × (days / 365))) × 100
 *
 * Returns null when inputs are invalid (zero principal or zero days).
 */
export function reverseCalcRate(
  accruedInterest: number,
  principal: number,
  days: number
): number | null {
  if (principal <= 0 || days <= 0 || accruedInterest <= 0) return null;
  return (accruedInterest / (principal * (days / 365))) * 100;
}

/**
 * Interest-as-%-of-original-loan ratio.
 * Returns a value like 0.9 (meaning 0.9%).
 */
export function calcInterestRatio(
  totalInterestSoFar: number,
  originalLoanValue: number
): number {
  if (originalLoanValue <= 0) return 0;
  return (totalInterestSoFar / originalLoanValue) * 100;
}

/**
 * Format a number as LKR currency — always two decimal places, no abbreviations.
 * e.g. 150000 → "LKR 150,000.00"
 */
export function formatLKR(amount: number): string {
  return (
    "LKR " +
    amount.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  );
}

/**
 * Format a number with Rs. prefix — used in housing-loan EMI panels.
 * e.g. 82583 → "Rs. 82,583.00"
 */
export function formatRs(amount: number): string {
  return (
    "Rs. " +
    amount.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  );
}
