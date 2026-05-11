# ⚡ Quick Deployment Steps

## What Was Fixed
The app was returning 404 errors because the i18n configuration and app structure files were missing. **All files have now been created.**

## What You Need To Do

### Step 1: Open Terminal and Navigate
```bash
cd "/Users/stoyreo/Documents/Claude/Projects/TC Collectibles x TechCraft Lab"
```

### Step 2: Commit Changes (Run in Terminal)
```bash
git add -A
git commit -m "fix: add missing i18n config and app structure - resolves 404 errors"
```

### Step 3: Push to GitHub
```bash
git push origin main
```

### Step 4: Wait for Vercel
- Vercel webhook auto-deploys after push (~1-2 minutes)
- Check status: https://vercel.com/techcraftlabbkk-7072s-projects/tc-collectibles/deployments

## ✅ Verify Deployment Success

After push, test these URLs:
- ✅ https://tc-collectibles.vercel.app/en (homepage)
- ✅ https://tc-collectibles.vercel.app/en/products (products)
- ✅ https://tc-collectibles.vercel.app/en/cart (cart)

**If you see content instead of blank pages, deployment is successful!**

---

## 📋 Files Created
- `i18n/config.ts` - Locale config
- `app/i18n.ts` - i18n setup
- `messages/en.json` + `messages/th.json` - Translations
- `app/layout.tsx` - Root layout
- `app/globals.css` - Global styles
- `app/page.tsx` - Root redirect
- `app/[locale]/layout.tsx` - Localized layout
- `app/[locale]/page.tsx` - Home page
- `app/[locale]/products/page.tsx` - Products
- `app/[locale]/cart/page.tsx` - Cart
- `app/[locale]/checkout/page.tsx` - Checkout
- `app/[locale]/orders/page.tsx` - Orders
- `app/[locale]/admin/page.tsx` - Admin
- `app/[locale]/auth/login/page.tsx` - Login
- `app/[locale]/payment/[orderId]/page.tsx` - Payment

**That's 16 new files total.**

## 🚨 If Build Fails
Check Vercel logs for errors related to:
- `next-intl` imports
- Missing message files
- TypeScript compilation

All imports should resolve now that the files exist.

---

**Ready to deploy? Run:** `git push origin main`
