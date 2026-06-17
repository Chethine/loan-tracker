-- ============================================================
--  Housing Loan Fields Migration
--  Run in: Supabase Dashboard → SQL Editor → New Query
--  Safe to re-run (uses IF NOT EXISTS guards throughout)
-- ============================================================

-- Ensure columns added in earlier sessions exist (guard for fresh installs)
ALTER TABLE public.loans
  ADD COLUMN IF NOT EXISTS branch       TEXT          NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS ticket_no    TEXT          NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS initial_amount  NUMERIC(15,2) NOT NULL DEFAULT 0
                                           CHECK (initial_amount >= 0),
  ADD COLUMN IF NOT EXISTS start_date   TIMESTAMPTZ;

-- ── New housing-specific columns ──────────────────────────────
ALTER TABLE public.loans
  ADD COLUMN IF NOT EXISTS monthly_emi         NUMERIC(15,2),
  ADD COLUMN IF NOT EXISTS loan_tenure_months  INTEGER,
  ADD COLUMN IF NOT EXISTS property_collateral TEXT;

-- ============================================================
--  Done. All housing fields are now present.
--  No data is changed; existing rows get NULL for new columns.
-- ============================================================
