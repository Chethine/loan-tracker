-- Add initial_amount column to loans table
-- Run in: Supabase Dashboard → SQL Editor → New Query

ALTER TABLE public.loans
  ADD COLUMN IF NOT EXISTS initial_amount NUMERIC(15,2) NOT NULL DEFAULT 0;
