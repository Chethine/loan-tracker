# Gold Loan Tracker — Setup & Deployment Guide

## Prerequisites
- Node.js 18+ installed
- A free [Supabase](https://supabase.com) account
- A free [Vercel](https://vercel.com) account

---

## Step 1 — Install dependencies

```bash
cd /path/to/your/project   # the folder where package.json lives
npm install
```

---

## Step 2 — Create a Supabase project

1. Go to [supabase.com](https://supabase.com) → **New Project**
2. Give it a name (e.g. `gold-loan-tracker`) and set a secure database password
3. Choose the **Singapore** region (closest to Sri Lanka)
4. Wait ~2 minutes for provisioning

---

## Step 3 — Run the database schema

1. In your Supabase project, click **SQL Editor** in the left sidebar
2. Click **New Query**
3. Open the file `supabase/schema.sql` from this project
4. Paste its contents into the editor and click **Run**
5. You should see: `Success. No rows returned`

This creates the `loans` table with Row Level Security (RLS) policies so each user can only access their own data.

---

## Step 4 — Get your Supabase API keys

1. In your Supabase project → **Settings** (gear icon) → **API**
2. Copy:
   - **Project URL** (looks like `https://xxxx.supabase.co`)
   - **Project API Keys → anon / public** (starts with `eyJ...`)

---

## Step 5 — Configure environment variables (local dev)

1. In the project root, copy the example file:
   ```bash
   cp .env.local.example .env.local
   ```
2. Open `.env.local` and fill in your values:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...your-anon-key...
   ```

---

## Step 6 — Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — you'll be redirected to the login page. Create an account and start adding loans.

---

## Step 7 — Deploy to Vercel

### Option A — Via Vercel CLI (fastest)
```bash
npm i -g vercel
vercel
```
Follow the prompts. When asked about environment variables, add:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Option B — Via Vercel Dashboard
1. Push your project to a GitHub (or GitLab / Bitbucket) repository
2. Go to [vercel.com](https://vercel.com) → **Add New Project**
3. Import your repository
4. In **Environment Variables**, add:
   | Key | Value |
   |-----|-------|
   | `NEXT_PUBLIC_SUPABASE_URL` | `https://xxxx.supabase.co` |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJ...` |
5. Click **Deploy**

Vercel auto-detects Next.js — no build configuration needed.

---

## Step 8 — Configure Supabase Auth redirect URLs (important for email confirmation)

1. Supabase Dashboard → **Authentication** → **URL Configuration**
2. Add your Vercel deployment URL to **Redirect URLs**:
   ```
   https://your-app.vercel.app/**
   ```
3. Also add `http://localhost:3000/**` for local development

---

## Optional — Disable email confirmation (simpler onboarding)

By default Supabase requires email confirmation. To disable it:

1. Supabase Dashboard → **Authentication** → **Providers** → **Email**
2. Toggle **Confirm email** → **OFF**

Users will be signed in immediately after registration.

---

## Project structure recap

```
├── app/
│   ├── (auth)/           # Login & Register pages (unauthenticated)
│   └── dashboard/        # Protected dashboard (authenticated only)
├── components/
│   ├── Navbar.tsx
│   ├── LoanCard.tsx      # Expandable per-loan card with live interest
│   ├── AddLoanModal.tsx  # Add a new loan
│   └── PaymentModal.tsx  # Log a payment with live breakdown preview
├── lib/
│   ├── supabase/         # Browser & server Supabase clients
│   └── calculations.ts   # Interest formula, payment processing, LKR formatter
├── types/index.ts        # TypeScript interfaces
├── middleware.ts          # Route protection + session refresh
└── supabase/schema.sql   # Database schema with RLS policies
```

---

## How the payment logic works

When you submit a payment of amount **P**:

1. **Accrued interest** = `Principal × (Rate / 100) × (Days since last payment / 365)`
2. **New total interest paid** += accrued interest
3. **Principal reduction** = `max(P − accrued interest, 0)`
4. **New principal** = `old principal − principal reduction`
5. **Last payment date** → updated to right now

All values are synced to Supabase in real time — opening the app on any device reflects the latest state instantly.
