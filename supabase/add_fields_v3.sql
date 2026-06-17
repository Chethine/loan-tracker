-- Migration v3: add branch, ticket_no, start_date columns
-- Run in: Supabase Dashboard → SQL Editor → New Query

ALTER TABLE public.loans
  ADD COLUMN IF NOT EXISTS branch    TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS ticket_no TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS start_date TIMESTAMPTZ;
