# TC Collectibles - Link Audit Fix Guide

**Date:** May 12, 2026  
**Status:** 3/4 Issues Fixed ✅

---

## 📊 Summary of Fixes

| Issue | Status | Fix |
|-------|--------|-----|
| ✅ Create Terms & Conditions page | **DONE** | `/app/[locale]/terms/page.tsx` created |
| ✅ Create Privacy Policy page | **DONE** | `/app/[locale]/privacy/page.tsx` created |
| ✅ Update Footer links | **DONE** | Footer.tsx updated with proper links |
| ✅ Create About Us page | **DONE** | `/app/[locale]/about/page.tsx` created |
| ✅ Fix product links (redirect) | **DONE** | Products page now uses `/${locale}/products/${id}` |
| ❌ Fix HTTP 500 on login page | **PENDING** | Requires Supabase environment variables |

---

## 🔴 CRITICAL: Fix Login Page HTTP 500 Error

### Root Cause
The login page is failing because **Supabase environment variables are missing** in Vercel.

### How to Fix

#### Step 1: Get Your Supabase Credentials
1. Go to your Supabase project: https://supabase.com
2. Click on your project
3. Go to **Settings → API**
4. Copy these values:
   - `Project URL` (this is your `NEXT_PUBLIC_SUPABASE_URL`)
   - `Anon public` key (this is your `NEXT_PUBLIC_SUPABASE_ANON_KEY`)

#### Step 2: Add Environment Variables to Vercel
1. Go to **Vercel Dashboard** → Your Project → **Settings**
2. Click **Environment Variables**
3. Add these two variables:

```
NEXT_PUBLIC_SUPABASE_URL = [your-project-url]
NEXT_PUBLIC_SUPABASE_ANON_KEY = [your-anon-key]
```

⚠️ **IMPORTANT:** These are public variables (prefix with `NEXT_PUBLIC_`), so they can be exposed in the browser. This is normal for Supabase.

#### Step 3: Redeploy
1. Go to **Vercel → Deployments**
2. Click the three dots on the latest deployment
3. Select **Redeploy**
4. Wait for the deployment to complete

#### Step 4: Test
1. Go to https://tc-collectibles.vercel.app/en/auth/login
2. Try logging in or sending a magic link
3. The page should now work without HTTP 500 error

---

## ✅ Completed Fixes

### 1. Terms & Conditions Page
**File:** `/app/[locale]/terms/page.tsx`
- ✅ Created new page with full Terms & Conditions content
- ✅ Supports English and Thai translations
- ✅ Includes back link to homepage
- ✅ Responsive design

### 2. Privacy Policy Page
**File:** `/app/[locale]/privacy/page.tsx`
- ✅ Created new page with Privacy Policy content
- ✅ Supports English and Thai translations
- ✅ Covers data collection, security, and user rights
- ✅ Includes contact information

### 3. About Us Page
**File:** `/app/[locale]/about/page.tsx`
- ✅ Created new page introducing TC Collectibles
- ✅ Highlights mission and unique value propositions
- ✅ Company story and background
- ✅ Contact information
- ✅ Professional design with gradient header

### 4. Updated Footer Links
**File:** `components/Footer.tsx`
```diff
- "About Us" → / (homepage)
+ "About Us" → /[locale]/about

- "Terms & Conditions" → # (placeholder)
+ "Terms & Conditions" → /[locale]/terms

- "Privacy Policy" → # (placeholder)
+ "Privacy Policy" → /[locale]/privacy
```

### 5. Fixed Product Links (Removed Redirects)
**File:** `/app/[locale]/products/page.tsx`
```diff
- href={`/products/${product.id}`}
+ href={`/${locale}/products/${product.id}`}
```

This eliminates the redirect from `/products/uuid` to `/en/products/uuid`.

---

## 🚀 Deployment Checklist

Before pushing to production:

- [ ] Add Supabase credentials to Vercel environment variables
- [ ] Test login page at `/en/auth/login`
- [ ] Test magic link login
- [ ] Test password login (if you have test credentials)
- [ ] Click Terms & Conditions link in footer
- [ ] Click Privacy Policy link in footer
- [ ] Click About Us link in footer
- [ ] Verify product card links work without extra redirects
- [ ] Test on mobile and desktop

---

## 📋 Commands to Deploy

```bash
# Commit all fixes
git add .
git commit -m "Fix: Create missing pages and update footer links"

# Push to production
git push origin main

# Vercel will auto-deploy, then:
# 1. Go to Vercel dashboard
# 2. Add environment variables
# 3. Redeploy
```

---

## 🎯 Next Steps

1. **URGENT:** Add Supabase credentials to Vercel (see CRITICAL section above)
2. Redeploy the application
3. Test all pages and links
4. Monitor for any errors in Vercel logs

---

## 📞 Support

If you encounter any issues:
- Check Vercel logs: Vercel Dashboard → Deployments → Logs
- Check browser console: Press F12 → Console tab
- Verify environment variables are set correctly

