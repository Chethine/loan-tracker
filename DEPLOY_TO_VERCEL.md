# Deploy to Vercel — Step-by-Step Guide

## What You Need
- A [GitHub](https://github.com) account (free)
- A [Vercel](https://vercel.com) account (free) — sign up with your GitHub account
- Your Supabase URL and anon key (already set up)

---

## Step 1 — Push the Project to GitHub

### 1a. Install Git (if not already installed)
Download from [git-scm.com](https://git-scm.com/downloads) and install.

### 1b. Open Terminal in your project folder
On Mac: right-click the `Loan` folder → **New Terminal at Folder**
On Windows: open the folder, click the address bar, type `cmd`, press Enter

### 1c. Run these commands one by one

```bash
git init
git add .
git commit -m "Initial commit"
```

### 1d. Create a new repository on GitHub
1. Go to [github.com](https://github.com) → click **+** (top right) → **New repository**
2. Name it `loan-tracker` (or anything you like)
3. Set it to **Private**
4. **Do NOT** tick "Add a README" — leave everything unchecked
5. Click **Create repository**

### 1e. Connect and push your code
GitHub will show you commands after creating the repo. Run these (replace `YOUR_USERNAME`):

```bash
git remote add origin https://github.com/YOUR_USERNAME/loan-tracker.git
git branch -M main
git push -u origin main
```

Your code is now on GitHub. ✅

---

## Step 2 — Import the Project into Vercel

1. Go to [vercel.com](https://vercel.com) and log in
2. Click **Add New…** → **Project**
3. Under **Import Git Repository**, find `loan-tracker` and click **Import**
4. Vercel auto-detects Next.js — **do not change any build settings**

---

## Step 3 — Add Environment Variables

Before clicking Deploy, scroll down to **Environment Variables** and add these two:

| Name | Value |
|------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://xxxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJ...your-anon-key...` |

> **Where to find these:** Supabase Dashboard → your project → **Settings** → **API**

After adding both, click **Deploy**.

Vercel will build the app (takes ~1–2 minutes). When it finishes you'll get a live URL like:
```
https://loan-tracker-abc123.vercel.app
```

---

## Step 4 — Configure Supabase Auth Redirect URLs

Your deployed URL needs to be whitelisted in Supabase so login redirects work correctly.

1. Go to **Supabase Dashboard** → **Authentication** → **URL Configuration**
2. Set **Site URL** to your Vercel URL:
   ```
   https://loan-tracker-abc123.vercel.app
   ```
3. Under **Redirect URLs**, add:
   ```
   https://loan-tracker-abc123.vercel.app/**
   http://localhost:3000/**
   ```
4. Click **Save**

---

## Step 5 — Test the Live App

1. Open your Vercel URL in a browser
2. Register a new account
3. Add a loan — confirm it saves and displays correctly
4. Open the same URL on your phone — data should sync instantly

---

## Step 6 — Set Up a Custom Domain (Optional)

If you want a custom domain like `loans.yourdomain.com`:

1. In Vercel → your project → **Settings** → **Domains**
2. Click **Add Domain** and enter your domain
3. Vercel will give you DNS records to add to your domain registrar (GoDaddy, Namecheap, etc.)
4. DNS changes take 10–60 minutes to propagate

---

## Future Updates — How to Redeploy

Every time you make code changes and want to update the live app:

```bash
git add .
git commit -m "Describe what you changed"
git push
```

Vercel automatically detects the push and redeploys in ~1 minute. No manual steps needed.

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| Build fails with `Module not found` | Run `npm install` locally, commit `package-lock.json`, push again |
| "Invalid API key" error on live site | Double-check the env vars in Vercel → project → **Settings** → **Environment Variables** |
| Login redirects to wrong URL | Re-check the Redirect URLs in Supabase Auth settings (Step 4) |
| Data not showing after login | Make sure the Supabase schema SQL was run and RLS policies are in place |
| Changes not appearing after push | Go to Vercel dashboard → your project → **Deployments** and check the latest build log |

---

## Quick Reference — Your Keys

Fill this in for your own reference:

```
Vercel URL:          https://______________________.vercel.app
Supabase Project:    https://______________________.supabase.co
GitHub Repo:         https://github.com/____________/loan-tracker
```
