# TC Collectibles - Deployment Fix Summary
**Date:** May 10, 2026  
**Issue:** HTTP 404 errors on all Vercel routes  
**Root Cause:** Missing i18n configuration and app directory structure  

---

## 🔴 Problem Identified

The deployed app was returning 404 for all routes because:

1. **Missing i18n configuration files:**
   - `i18n/config.ts` (referenced by middleware.ts)
   - `app/i18n.ts` (referenced by next.config.js)
   - `messages/en.json` and `messages/th.json` (translation files)

2. **Missing Next.js app structure:**
   - `app/layout.tsx` (root layout)
   - `app/page.tsx` (root redirect)
   - `app/[locale]/` directory with all route pages

3. **Missing styles:**
   - `app/globals.css` (global Tailwind CSS)

**Impact:** Next.js build was failing to compile because of missing imports, resulting in incomplete/broken deployment.

---

## ✅ Solution Implemented

### Files Created This Session

#### I18n Configuration (3 files)
- **`i18n/config.ts`** - Locale configuration (en, th)
- **`app/i18n.ts`** - next-intl request configuration
- **`messages/en.json`** - English translations (navigation, products, cart, auth, checkout, orders, payments, admin, common)
- **`messages/th.json`** - Thai translations (complete i18n support)

#### App Structure (11 files)
- **`app/layout.tsx`** - Root layout
- **`app/globals.css`** - Global styles
- **`app/page.tsx`** - Root page with redirect to /en
- **`app/[locale]/layout.tsx`** - Localized layout with Header, Footer, ToastProvider
- **`app/[locale]/page.tsx`** - Home page with featured cards section
- **`app/[locale]/products/page.tsx`** - Products browse page with filters
- **`app/[locale]/cart/page.tsx`** - Shopping cart page
- **`app/[locale]/checkout/page.tsx`** - Checkout form page
- **`app/[locale]/orders/page.tsx`** - Customer orders page
- **`app/[locale]/admin/page.tsx`** - Admin dashboard (orders, payments, products tabs)
- **`app/[locale]/auth/login/page.tsx`** - Login page
- **`app/[locale]/payment/[orderId]/page.tsx`** - Payment page with PromptPay QR

### Architecture
```
Root Layout (app/layout.tsx)
  ↓
Locale Layout (app/[locale]/layout.tsx)
  ├── Header (localized)
  ├── Main Content (localized pages)
  └── Footer (localized)

Middleware (middleware.ts)
  → Detects locale from URL
  → Loads locale-specific messages
  → Routes to /en/* or /th/*
```

---

## 🚀 Deployment Steps

### 1. Verify Files Locally
```bash
# Check that all new files exist
ls -la i18n/
ls -la app/
ls -la messages/
```

### 2. Commit Changes
```bash
cd "/Users/stoyreo/Documents/Claude/Projects/TC Collectibles x TechCraft Lab"

# Add all new files
git add -A

# Commit with clear message
git commit -m "fix: add missing i18n config and app structure - resolves 404 errors

- Create i18n/config.ts with locale configuration
- Create app/i18n.ts with next-intl setup
- Create messages/en.json and messages/th.json
- Create complete app/[locale] directory structure
- Add root layout, globals.css, and page redirects
- Fixes Next.js build by resolving import errors"
```

### 3. Push to GitHub
```bash
git push origin main
```

### 4. Verify Vercel Deployment
- Vercel webhook will trigger automatically
- Check: https://vercel.com/techcraftlabbkk-7072s-projects/tc-collectibles/deployments
- Expected: New deployment should show "Ready" with successful build logs
- Test: https://tc-collectibles.vercel.app/en

---

## 🧪 Testing After Deployment

### Test Routes
```
✅ Homepage: https://tc-collectibles.vercel.app/en
✅ Products: https://tc-collectibles.vercel.app/en/products
✅ Cart: https://tc-collectibles.vercel.app/en/cart
✅ Checkout: https://tc-collectibles.vercel.app/en/checkout
✅ Orders: https://tc-collectibles.vercel.app/en/orders
✅ Admin: https://tc-collectibles.vercel.app/en/admin
✅ Login: https://tc-collectibles.vercel.app/en/auth/login
✅ Payment: https://tc-collectibles.vercel.app/en/payment/1

✅ Thai locale: https://tc-collectibles.vercel.app/th
✅ Automatic redirect: https://tc-collectibles.vercel.app → https://tc-collectibles.vercel.app/en
```

### Verify in Browser Console
- [ ] No JavaScript errors
- [ ] CSS loads correctly (Tailwind styling visible)
- [ ] Navigation links work
- [ ] Language switcher works
- [ ] No 404 responses in Network tab

---

## 📝 What Still Needs Implementation

The skeleton pages are now functional. These features need to be connected to real data/functionality:

### Frontend Pages (Need Supabase Connection)
- [ ] Products page - fetch from Supabase, display images
- [ ] Cart - load from cart store, persist state
- [ ] Checkout - form validation, create orders in Supabase
- [ ] Orders - fetch user's orders from Supabase
- [ ] Admin - display pending orders, payments, products
- [ ] Login - connect to Supabase Auth
- [ ] Payment - generate PromptPay QR via API

### Backend APIs (Should Already Exist)
- [ ] `/api/payment/generate-qr` - PromptPay QR generation
- [ ] `/api/orders/send-confirmation` - Order confirmation email
- [ ] `/api/products/` - Product endpoints

---

## 🔍 Vercel Build Logs to Check

When pushing to GitHub, watch the Vercel build:

1. **Expected success output:**
```
✓ Next.js compilation successful
✓ Static pages: 2
✓ Server-side rendered pages: 8
✓ API routes: X
```

2. **Watch for these errors:**
```
❌ Module not found: Can't resolve 'next-intl/middleware'
❌ Cannot find module './i18n/config'
❌ Cannot find module './messages/en.json'
```
(If you see these, the files weren't committed properly)

---

## 📦 Commit Contents

```
Files Added: 16
- i18n/config.ts (1 file)
- messages/en.json, messages/th.json (2 files)
- app/layout.tsx
- app/globals.css
- app/page.tsx
- app/[locale]/layout.tsx
- app/[locale]/page.tsx
- app/[locale]/products/page.tsx
- app/[locale]/cart/page.tsx
- app/[locale]/checkout/page.tsx
- app/[locale]/orders/page.tsx
- app/[locale]/admin/page.tsx
- app/[locale]/auth/login/page.tsx
- app/[locale]/payment/[orderId]/page.tsx
(12 files in app directory)
```

---

## ✨ Next Session Tasks

After successful deployment:

1. **Connect real data:**
   - Fetch products from Supabase
   - Wire up Supabase auth to login page
   - Create orders functionality

2. **Test payment flow:**
   - Verify PromptPay QR generation
   - Test payment verification admin workflow

3. **Polish UI:**
   - Add product images
   - Improve loading states
   - Add error handling

---

**Status:** 🟢 Ready for deployment  
**Actions Required:** Run git push on Mac to trigger Vercel build
