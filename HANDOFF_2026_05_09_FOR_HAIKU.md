# TC Collectibles — Haiku Handoff
## Date: 2026-05-09 | Deadline: May 16, 2026

---

## ONE THING TO DO FIRST

The user has not yet run the git push. All fixes are saved to disk but not deployed. Remind the user to run this in Terminal:

```bash
cd "/Users/stoyreo/Documents/Claude/Projects/TC Collectibles x TechCraft Lab"
rm .git/index.lock
git add -A
git commit -m "fix: all bug fixes from session 5 - PromptPay QR, auth, cart hydration, orders UX, admin image upload, homepage"
git push origin main
```

Vercel auto-deploys ~2 min after push.

---

## PROJECT OVERVIEW

**What it is:** TC Collectibles — PSA Pokémon card marketplace. Buyers browse cards, add to cart, checkout, pay via PromptPay QR code. Admin manages orders and products.

**Stack:** Next.js 14 + TypeScript, Supabase (auth + DB + storage), Tailwind CSS, nodemailer (Gmail SMTP), PromptPay QR generation.

**Live URL:** https://tc-collectibles.vercel.app  
**GitHub:** https://github.com/techcraftlabbkk/tc-collectibles  
**Project folder:** `/Users/stoyreo/Documents/Claude/Projects/TC Collectibles x TechCraft Lab`

---

## ROUTE SYSTEM — IMPORTANT

The app has TWO parallel route systems. It is unclear which Vercel actually serves (both have been fixed):

| Route | Non-locale file | Locale file |
|---|---|---|
| `/` or `/en/` | `app/page.tsx` | `app/[locale]/page.tsx` |
| `/products` → `/en/products` | `app/products/page.tsx` | `app/[locale]/products/page.tsx` |
| `/cart` → `/en/cart` | `app/cart/page.tsx` | `app/[locale]/cart/page.tsx` |
| `/checkout` → `/en/checkout` | `app/checkout/page.tsx` | `app/[locale]/checkout/page.tsx` |
| `/orders` → `/en/orders` | `app/orders/page.tsx` | `app/[locale]/orders/page.tsx` |
| `/admin` → `/en/admin` | `app/admin/page.tsx` | `app/[locale]/admin/page.tsx` |

The middleware (`middleware.ts`) uses `localePrefix: 'always'` so `/products` redirects to `/en/products`.

---

## FIXES MADE THIS SESSION (not yet deployed)

All files below have been edited and are saved to disk:

### Critical
- **`app/api/payment/generate-qr/route.ts`** — PromptPay now generates a real EMVCo/BOT-spec payload with CRC-16 checksum. Previous version returned junk (`phone|amount`) that banking apps couldn't scan.

### Auth & Navigation  
- **`app/auth/login/page.tsx`** — After login, redirects back to `?redirect=` param (e.g., back to `/checkout`) instead of always going to `/orders`.
- **`app/checkout/page.tsx`** — Redirects to `/auth/login` if no session, shows real Supabase error messages, adds auth loading state.
- **`app/[locale]/checkout/page.tsx`** — Same auth redirect + cart rehydration fix.

### Cart Hydration (both route systems fixed)
- **`lib/cartStore.ts`** — `skipHydration: true` prevents React SSR hydration mismatch.
- **`app/cart/page.tsx`** — Calls `rehydrate()` on mount.
- **`app/[locale]/cart/page.tsx`** — Same rehydration fix added.

### Orders Page (both route systems fixed)
- **`app/orders/page.tsx`** — Product names now show (Supabase join `products(title, grade)`). "Complete Payment" button now links to `/payment/${order.id}`.
- **`app/[locale]/orders/page.tsx`** — Same product name join fix.

### Admin
- **`app/admin/page.tsx`** — Image upload added (was only in locale version). Shows product image thumbnails, upload/replace button per product.
- **`app/api/products/upload-image/route.ts`** — Preserves actual file type (PNG/WebP/etc.) instead of always saving as JPEG.

### Homepage
- **`app/page.tsx`** — "Featured Cards" section now loads real products from Supabase. Cart rehydration added. Previously showed permanent skeleton placeholders.

---

## WHAT STILL NEEDS TO BE DONE

### 1. Vercel Environment Variables (USER MUST DO — cannot be done by Claude)
Go to: https://vercel.com/dashboard → TC Collectibles → Settings → Environment Variables

Must be set:
```
SMTP_PASS = [Gmail App Password for techcraftlab.bkk@gmail.com]
SMTP_FROM = techcraftlab.bkk@gmail.com
PROMPTPAY_PHONE = 0809429441
NEXT_PUBLIC_SUPABASE_URL = https://qaitwuscmzwmtlodruwc.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = [from .env.local]
SUPABASE_SERVICE_ROLE_KEY = [from .env.local]
```

To get Gmail App Password: Google Account → Security → 2-Step Verification → App Passwords → Generate for "Mail".

### 2. Supabase Email Confirmation (USER MUST DO)
New user signups require email confirmation before login works. For testing, go to:
https://supabase.com/dashboard → Project → Authentication → Users → find user → click "Confirm email manually"

OR disable email confirmation in: Authentication → Settings → "Enable email confirmations" → OFF (for testing only)

### 3. Upload Product Images
After deploying: go to `/admin` → Products tab → click "↑ Upload" next to each product. Images stored in Supabase Storage bucket `product-images` (must exist and be set to public).

### 4. Test End-to-End After Deploy
1. Browse `/products` — cards load
2. Add to cart — stays after page refresh
3. Go to `/checkout` — redirects to login if not signed in
4. Login → lands back at `/checkout`
5. Fill form → Create Order → PromptPay QR appears and is scannable with a banking app
6. Admin: `/admin` → Orders tab → Mark as Paid → email triggers

---

## KNOWN ISSUES / WATCH FOR

- **Locale routing ambiguity:** Middleware may or may not be working on Vercel. Both route systems have been fixed, so this shouldn't cause problems either way.
- **Email confirmation:** Users can't log in until email is confirmed. For launch, consider disabling confirmation in Supabase.
- **"Test: Mark as Paid" button** on the payment page — this is a dev convenience button that directly updates order status. Should be removed or hidden before public launch, or it will let buyers self-approve their own payments.
- **Admin has no authentication guard** — only a client-side redirect. Anyone who knows the URL can access `/admin` before the redirect fires. For post-launch, add proper RLS or server-side auth check.
- **Shipping cost** shows "TBD" throughout. Not implemented — orders show total without shipping. Fine for launch if you handle shipping separately.

---

## KEY FILES

```
app/page.tsx                              Homepage with live products
app/products/page.tsx                     Products browse + filter
app/cart/page.tsx                         Cart
app/checkout/page.tsx                     Checkout (non-locale)
app/[locale]/checkout/page.tsx            Checkout (locale)
app/orders/page.tsx                       My Orders (non-locale)
app/[locale]/orders/page.tsx              My Orders (locale)
app/admin/page.tsx                        Admin dashboard (non-locale)
app/[locale]/admin/page.tsx               Admin dashboard (locale, has more features)
app/payment/[orderId]/page.tsx            PromptPay QR payment page
app/api/payment/generate-qr/route.ts      QR generation (EMVCo compliant)
app/api/orders/send-confirmation/         Email: order placed
app/api/orders/send-payment-email/        Email: payment verified
app/api/orders/send-shipment-email/       Email: shipped
app/api/orders/send-delivery-email/       Email: delivered
lib/emailService.ts                       Nodemailer Gmail SMTP service
lib/cartStore.ts                          Zustand cart (with skipHydration)
lib/auth.ts                               Supabase auth helpers
middleware.ts                             next-intl locale routing
```

---

## SUPABASE SCHEMA (what tables exist)

- `products` — id, title, grade, description, price, quantity, available, image_url, created_at
- `orders` — id, user_id, total, status, shipping_address, phone, shipping_note, customer_email, customer_name, created_at
- `order_items` — id, order_id, product_id, quantity, price_at_purchase
- `payments` — id, order_id, method, proof_image_url, status, verified_at

Order status flow: `pending_payment` → `paid` → `processing` → `shipped` → `delivered`

---

**Generated:** 2026-05-09  
**For:** Haiku agent  
**Priority:** 🔴 CRITICAL — Deploy first, then Vercel env vars, then test
