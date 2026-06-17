"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import CurrencyInput from "@/components/CurrencyInput";
import type { Loan } from "@/types";

interface Props {
  loan: Loan;
  onClose: () => void;
  onSaved: () => void;
}

interface EditForm {
  bank_name: string;
  branch: string;
  ticket_no: string;
  annual_interest_rate: number;
  current_principal_remaining: number;
  initial_amount: number;
  last_payment_date: string;
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="section-label">{children}</p>
  );
}

export default function EditLoanModal({ loan, onClose, onSaved }: Props) {
  const toDateInput = (iso: string) => {
    try { return new Date(iso).toISOString().slice(0, 10); } catch { return ""; }
  };

  const [form, setForm] = useState<EditForm>({
    bank_name:                   loan.bank_name,
    branch:                      loan.branch ?? "",
    ticket_no:                   loan.ticket_no ?? "",
    annual_interest_rate:        loan.annual_interest_rate,
    current_principal_remaining: loan.current_principal_remaining,
    initial_amount:              loan.initial_amount ?? 0,
    last_payment_date:           toDateInput(loan.last_payment_date),
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function setText(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  }

  function setNum(field: keyof EditForm) {
    return (v: number) => setForm((p) => ({ ...p, [field]: v }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!form.bank_name.trim())               { setError("Bank name is required."); return; }
    if (form.current_principal_remaining < 0) { setError("Principal cannot be negative."); return; }
    if (form.annual_interest_rate <= 0)       { setError("Interest rate must be > 0."); return; }

    setLoading(true);
    const supabase = createClient();

    const { error: dbError } = await supabase
      .from("loans")
      .update({
        bank_name:                   form.bank_name.trim(),
        branch:                      form.branch.trim(),
        ticket_no:                   form.ticket_no.trim(),
        annual_interest_rate:        form.annual_interest_rate,
        current_principal_remaining: form.current_principal_remaining,
        initial_amount:              form.initial_amount,
        last_payment_date:           form.last_payment_date
                                       ? new Date(form.last_payment_date).toISOString()
                                       : loan.last_payment_date,
      })
      .eq("id", loan.id);

    if (dbError) { setError(dbError.message); setLoading(false); return; }
    onSaved();
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

        <div className="mb-5">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Edit Account</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            {loan.bank_name} · {loan.loan_type === "GOLD_PAWN" ? "🪙 Gold Pawn" : "🏠 Housing"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* ── Bank details ── */}
          <SectionLabel>Bank / Lender</SectionLabel>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">
                Bank / Lender
              </label>
              <input
                name="bank_name"
                required
                value={form.bank_name}
                onChange={setText}
                className="input-field"
                placeholder="e.g. BOC, HNB…"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">
                Branch
              </label>
              <input
                name="branch"
                value={form.branch}
                onChange={setText}
                className="input-field"
                placeholder="e.g. Colombo 03"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">
              Account / Ticket No.
            </label>
            <input
              name="ticket_no"
              value={form.ticket_no}
              onChange={setText}
              className="input-field"
              placeholder="e.g. 0650191591"
            />
          </div>

          {/* ── Amounts ── */}
          <SectionLabel>Loan Amounts</SectionLabel>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">
                Original Loan Value (LKR)
              </label>
              <CurrencyInput
                value={form.initial_amount}
                onChange={setNum("initial_amount")}
                className="input-field"
                placeholder="e.g. 1,300,000"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">
                Current Principal (LKR)
              </label>
              <CurrencyInput
                value={form.current_principal_remaining}
                onChange={setNum("current_principal_remaining")}
                className="input-field"
                placeholder="e.g. 1,136,805.38"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">
              Annual Interest Rate (%)
            </label>
            <input
              type="number"
              name="annual_interest_rate"
              required
              min={0.01}
              step={0.01}
              value={form.annual_interest_rate}
              onChange={(e) => setForm((p) => ({ ...p, annual_interest_rate: parseFloat(e.target.value) || 0 }))}
              className="input-field"
              placeholder="e.g. 14.84"
            />
          </div>

          {/* ── Date ── */}
          <SectionLabel>Last Payment Date</SectionLabel>

          <div>
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">
              Last Payment Date
            </label>
            <input
              type="date"
              name="last_payment_date"
              value={form.last_payment_date}
              onChange={setText}
              className="input-field"
            />
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
              Interest accrues from this date to today.
            </p>
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700
                            text-red-700 dark:text-red-400 text-sm rounded-lg px-4 py-3">
              {error}
            </div>
          )}

          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn-primary flex-1">
              {loading ? "Saving…" : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
