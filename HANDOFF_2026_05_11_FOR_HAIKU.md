# TC Collectibles — Handoff to Haiku (May 11, 2026)

## What Was Done This Session (Sonnet)

All code changes are saved locally. They have NOT been pushed to GitHub yet — that is the first task below.

### Files Modified
| File | Change |
|------|--------|
| `app/i18n.ts` | Fixed next-intl v3 compatibility (requestLocale + fallback) |
| `middleware.ts` | Simplified matcher to `['/((?!api\|_next\|_vercel\|.*\\..*).*)']` |
| `app/[locale]/layout.tsx` | Added ToastProvider wrapper |
| `app/[locale]/orders/page.tsx` | Fixed `router.push('/auth/login')` → locale-aware |
| `app/[locale]/checkout/page.tsx` | Fixed auth redirect + payment redirect to use locale |
| `app/[locale]/admin/page.tsx` | Fixed `router.push('/auth/login')` → locale-aware |
| `app/[locale]/auth/login/page.tsx` | Fixed post-login redirect to use locale |
| `components/Header.tsx` | Full rewrite: cart badge, auth dropdown, user menu |
| `app/[locale]/page.tsx` | Full homepage redesign |
| `app/[locale]/products/page.tsx` | Full redesign: PSA badges, skeleton loaders, mobile drawer |
| `app/[locale]/cart/page.tsx` | Full redesign: empty state, sticky summary, trust badges |

### Files Created
| File | Purpose |
|------|---------|
| `app/[locale]/products/[id]/page.tsx` | **NEW** product detail page |
| `scripts/seed-products.js` | Seeds 10 PSA Pokémon cards to Supabase |

---

## Remaining Tasks — In Priority Order

### P1 — MUST DO BEFORE LAUNCH

#### 1. Git Push (triggers Vercel redeploy)
```bash
cd "C:\Users\USER\Desktop\Claude Project\TC Collectibles x TechCraft Lab"
git add -A
git commit -m "feat: ui/ux overhaul, routing fixes, product detail page, seed script"
git push origin main
```
- After push, Vercel auto-deploys (takes ~1 min)
- Live URL: https://tc-collectibles.vercel.app/en
- Verify the homepage loads without 404

#### 2. Seed Products Database
```bash
cd "C:\Users\USER\Desktop\Claude Project\TC Collectibles x TechCraft Lab"
node scripts/seed-products.js
```
- Requires `@supabase/supabase-js` and `dotenv` to be installed (already in package.json)
- Reads credentials from `.env.local`
- Seeds 10 PSA Pokémon cards (Charizard, Pikachu Illustrator, Mewtwo, Lugia, etc.)
- Script is idempotent — safe to run once (skips if table already has data)
- After seeding, verify products appear at https://tc-collectibles.vercel.app/en/products

#### 3. Set SMTP Credentials in Vercel
- Go to: https://vercel.com/techcraftlabbkk-7072s-projects/tc-collectibles/settings/environment-variables
- Add/update these two variables (Production):
  - `SMTP_FROM` = `techcraftlab.bkk@gmail.com`
  - `SMTP_PASSWORD` = Gmail App Password (16-char, generated at myaccount.google.com → Security → App Passwords)
- After saving, redeploy: Settings → Deployments → Redeploy latest

---

### P2 — TEST END-TO-END

#### 4. Full Checkout Flow Test
Test this exact path on the LIVE site (https://tc-collectibles.vercel.app):
1. `/en` → Hero loads, featured cards visible
2. `/en/products` → Products grid loads with PSA grade badges
3. Click a card → `/en/products/[id]` → Detail page loads
4. Click "Add to Cart" → Cart badge in header shows count
5. `/en/cart` → Cart shows items + order summary
6. `/en/checkout` → Auth check: if not logged in, redirects to `/en/auth/login`
7. Login → redirects back to `/en/checkout`
8. Fill form → Place Order → redirects to `/en/payment/[orderId]`
9. QR code displays → Take screenshot of QR
10. Go to `/en/admin` → Order appears in list

#### 5. Test Email Confirmations
- Place a real order from step 4 above
- Verify customer receives order confirmation email
- If email fails: check Vercel function logs for SMTP errors

---

### P3 — POLISH (nice-to-have before launch)

#### 6. Upload Real Card Images to Supabase Storage
- Upload card images to Supabase Storage bucket `images`
- Copy the public URL for each image
- Update `image_url` column in `products` table via Supabase Table Editor
- Format: `https://[project].supabase.co/storage/v1/object/public/images/[filename]`

#### 7. Update Contact Email in Footer
- File: `components/Footer.tsx` line ~30
- Change `support@tccollectibles.com` to the real support email

#### 8. Verify Language Switching (EN ↔ TH)
- Switch to Thai at `/th/products` — all text should be in Thai
- Check product detail page at `/th/products/[id]`

---

## Key URLs

| Resource | URL |
|----------|-----|
| Live Site | https://tc-collectibles.vercel.app/en |
| Vercel Dashboard | https://vercel.com/techcraftlabbkk-7072s-projects/tc-collectibles |
| Vercel Env Vars | https://vercel.com/techcraftlabbkk-7072s-projects/tc-collectibles/settings/environment-variables |
| Supabase Dashboard | (check .env.local for the project URL) |
| GitHub Repo | https://github.com/techcraftlabbkk/tc-collectibles |

---

## Credentials Location
All credentials are in `.env.local` at the project root. Do not commit this file.
```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...     ← needed for seed script
SMTP_USER=...
SMTP_PASS=...
SMTP_FROM=...
PROMPTPAY_PHONE=...
NEXT_PUBLIC_PROMPTPAY_ACCOUNT_NAME=...
```

---

## Tech Stack Reminder
- **Framework**: Next.js 14 App Router + TypeScript
- **Styling**: Tailwind CSS
- **Auth + DB**: Supabase (supabase.auth, supabase.from)
- **Cart State**: Zustand with persist middleware
- **i18n**: next-intl v3 (EN + TH, locales: `en`, `th`)
- **Payment**: PromptPay QR via `/api/payment/generate-qr`
- **Email**: Nodemailer via Gmail SMTP
- **Deployment**: Vercel (auto-deploys on git push to main)

---

## Important Notes for Haiku

1. **Do NOT re-run the seed script** if products already exist in the DB — it checks for existing rows and exits safely.
2. **Locale is always in the URL** — all internal links must use `/${locale}/path`. Never `/path` without locale.
3. **The `app/[locale]/` folder** is the main app. The `app/auth/`, `app/admin/` etc. (without locale) are legacy stubs — ignore them.
4. **PromptPay phone** is in the Vercel env var `PROMPTPAY_PHONE` — do not hardcode it.
5. **Admin page** has no role check yet — any logged-in user can access `/en/admin`. This is acceptable for MVP.

---

**Last Updated**: May 11, 2026  
**Session**: Sonnet — UI/UX Overhaul + Routing Fixes  
**Next Session**: Haiku — Git push, seed, SMTP config, E2E testing  
**Launch Target**: May 16, 2026
