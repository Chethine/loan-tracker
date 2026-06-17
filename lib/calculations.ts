import { differenceInDays } from "date-fns";
import type { PaymentResult } from "@/types";

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
