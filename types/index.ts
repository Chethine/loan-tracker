export type LoanType = 'GOLD_PAWN' | 'HOUSING';

export interface Loan {
  id: string;
  user_id: string;
  bank_name: string;
  branch: string;
  ticket_no: string;
  loan_type: LoanType;
  initial_amount: number;          // original advanced/loan amount
  start_date: string;              // date the loan was originally taken
  last_payment_date: string;       // ISO timestamp of most recent payment
  annual_interest_rate: number;    // e.g. 14.84 means 14.84%
  current_principal_remaining: number;
  total_historical_interest_paid: number;
  created_at: string;
}

export interface NewLoanPayload {
  bank_name: string;
  branch: string;
  ticket_no: string;
  loan_type: LoanType;
  initial_amount: number;
  start_date: string;
  last_payment_date: string;
  annual_interest_rate: number;
  current_principal_remaining: number;
  opening_accrued_interest: number; // interest already accrued at time of entry
}

export interface PaymentResult {
  accumulated_interest: number;
  principal_reduction: number;
  new_principal: number;
  new_total_interest_paid: number;
}

export interface CategoryStats {
  totalPrincipal: number;
  totalInterestPaid: number;
  totalAccruedNow: number;
  count: number;
}

export interface DashboardStats {
  overall: CategoryStats;
  goldPawn: CategoryStats;
  housing: CategoryStats;
}
