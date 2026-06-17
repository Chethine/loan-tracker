"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import CurrencyInput from "@/components/CurrencyInput";
import type { LoanType, NewLoanPayload } from "@/types";

interface Props {
  defaultType?: LoanType;
  onClose: () => void;
  onAdded: () => void;
}

const LOAN_TYPES: { value: LoanType; label: string; emoji: string; sub: string }[] = [
  { value: "GOLD_PAWN", label: "Gold Pawn", emoji: "🪙", sub: "Pawn ticket" },
  { value: "HOUSING",   label: "House Loan", emoji: "🏠", sub: "Mortgage / EMI" },
];

const DEFAULT_RATES: Record<LoanType, number> = {
  GOLD_PAWN: 18,
  HOUSING: 12,
};

const today = new Date().toISOString().slice(0, 10);

const EMPTY_FORM = (type: LoanType): NewLoanPayload => ({
  bank_name: "",
  branch: "",
  ticket_no: "",
  loan_type: type,
  initial_amount: 0,
  start_date: today,
  last_payment_date: "",
  annual_interest_rate: DEFAULT_RATES[type],
  current_principal_remaining: 0,
  opening_accrued_interest: 0,
});

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <p className="section-label">{children}</p>;
}

export default function AddLoanModal({ defaultType = "GOLD_PAWN", onClose, onAdded }: Props) {
  const [form, setForm] = useState<NewLoanPayload>(EMPTY_FORM(defaultType));
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function setText(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  }

  function setNum(field: keyof NewLoanPayload) {
    return (v: number) => setForm((p) => ({ ...p, [field]: v }));
  }

  function handleTypeChange(type: LoanType) {
    setForm((p) => ({ ...p, loan_type: type, annual_interest_rate: DEFAULT_RATES[type] }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!form.bank_name.trim())                    { setError("Bank / Lender is required.");            return; }
    if (form.initial_amount <= 0)                  { setError("Original loan value must be > 0.");       return; }
    if (form.current_principal_remaining <= 0)     { setError("Current amount due must be > 0.");        return; }
    if (!form.start_date)                          { setError("Start date is required.");                 return; }

    setLoading(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setError("Not authenticated."); setLoading(false); return; }

    const { error: dbError } = await supabase.from("loans").insert({
      user_id:                        user.id,
      bank_name:                      form.bank_name.trim(),
      branch:                         form.branch.trim(),
      ticket_no:                      form.ticket_no.trim(),
      loan_type:                      form.loan_type,
      initial_amount:                 form.initial_amount,
      start_date:                     new Date(form.start_date).toISOString(),
      last_payment_date:              form.last_payment_date
                                        ? new Date(form.last_payment_date).toISOString()
                                        : new Date(form.start_date).toISOString(),
      annual_interest_rate:           form.annual_interest_rate,
      current_principal_remaining:    form.current_principal_remaining,
      total_historical_interest_paid: form.opening_accrued_interest,
    });

    if (dbError) { setError(dbError.message); setLoading(false); return; }
    onAdded();
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/50 backdrop-blur-sm">
      <div className="modal-panel max-w-md w-full">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 btn-ghost text-xl leading-none px-2 py-0"
        >
          ✕
        </button>

        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-5">Add Account</h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* ── Loan type ── */}
          <div className="grid grid-cols-2 gap-2">
            {LOAN_TYPES.map((t) => (
              <button
                key={t.value}
                type="button"
                onClick={() => handleTypeChange(t.value)}
                className={`flex flex-col items-center gap-1 px-3 py-3 rounded-xl border-2 text-sm transition-all ${
                  form.loan_type === t.value
                    ? "border-amber-500 bg-amber-50 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-500"
                    : "border-gray-200 text-gray-500 hover:border-gray-300 dark:border-gray-600 dark:text-gray-400 dark:hover:border-gray-500"
                }`}
              >
                <span className="text-2xl">{t.emoji}</span>
                <span className="font-semibold">{t.label}</span>
                <span className="text-xs opacity-70">{t.sub}</span>
              </button>
            ))}
          </div>

          {/* ── Bank details ── */}
          <SectionLabel>Bank / Lender</SectionLabel>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">
                Bank / Lender
              </label>
              <input name="bank_name" required value={form.bank_name} onChange={setText}
                     className="input-field" placeholder="e.g. BOC, HNB, Sampath…" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">
                Branch
              </label>
              <input name="branch" value={form.branch} onChange={setText}
                     className="input-field" placeholder="e.g. Colombo 03" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">
              Account / Ticket No.
            </label>
            <input name="ticket_no" value={form.ticket_no} onChange={setText}
                   className="input-field" placeholder="e.g. 0650191591" />
          </div>

          {/* ── Amounts ── */}
          <SectionLabel>Loan Amounts (LKR)</SectionLabel>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">
                Original Loan Value
              </label>
              <CurrencyInput value={form.initial_amount} onChange={setNum("initial_amount")}
                             className="input-field" placeholder="e.g. 1,300,000" required />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">
                Current Amount Due
              </label>
              <CurrencyInput value={form.current_principal_remaining}
                             onChange={setNum("current_principal_remaining")}
                             className="input-field" placeholder="e.g. 1,136,805" required />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">
                Annual Interest Rate (%)
              </label>
              <input type="number" name="annual_interest_rate" required min={0.01} step={0.01}
                     value={form.annual_interest_rate} className="input-field" placeholder="e.g. 14.84"
                     onChange={(e) => setForm((p) => ({ ...p, annual_interest_rate: parseFloat(e.target.value) || 0 }))} />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">
                Accrued Interest{" "}
                <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <CurrencyInput value={form.opening_accrued_interest}
                             onChange={setNum("opening_accrued_interest")}
                             className="input-field" placeholder="e.g. 7,412" />
            </div>
          </div>

          {/* ── Dates ── */}
          <SectionLabel>Dates</SectionLabel>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">
                Start Date
              </label>
              <input type="date" name="start_date" required value={form.start_date}
                     onChange={setText} className="input-field" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">
                Last Payment Date{" "}
                <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <input type="date" name="last_payment_date" value={form.last_payment_date}
                     onChange={setText} className="input-field" />
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Blank = use start date</p>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700
                            text-red-700 dark:text-red-400 text-sm rounded-lg px-4 py-3">
              {error}
            </div>
          )}

          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">Cancel</button>
            <button type="submit" disabled={loading} className="btn-primary flex-1">
              {loading ? "Saving…" : "Save Account"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
