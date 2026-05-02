# TC Collectibles x TechCraft Lab — MVP ROADMAP

**Project:** Premium Thai-first PSA Pokémon marketplace + 3D printing service  
**Status:** Fresh start → MVP launch in 1-2 weeks  
**Approach:** Marketplace first (Phase 1) → 3D system Phase 2

---

## 🎯 PHASE 1: PSA MARKETPLACE MVP (1-2 weeks) ⚡

### DELIVERABLES — LAUNCH READY

#### ✅ INFRASTRUCTURE (Week 1, Day 1-2)
- [ ] GitHub repo initialized + .env templates
- [ ] Next.js project scaffold (TypeScript, Tailwind)
- [ ] Supabase project created + free tier tables
- [ ] Vercel deployment connected (auto-deploy on push)
- [ ] .gitignore, ESLint, Prettier configured

#### ✅ DATABASE SCHEMA (Week 1, Day 1-2)
Supabase tables:
- [ ] `products` (PSA cards: id, title, grade, price, image_url, quantity, created_at)
- [ ] `orders` (id, user_id, total, payment_method, status, created_at)
- [ ] `order_items` (id, order_id, product_id, quantity, price_at_purchase)
- [ ] `users` (id, email, name, phone, address, created_at) — Supabase Auth
- [ ] `payments` (id, order_id, method, proof_image, status, verified_at, admin_notes)

#### ✅ AUTHENTICATION (Week 1, Day 2-3)
- [ ] Supabase Auth integration (email/password + magic link)
- [ ] Protected routes (middleware)
- [ ] User session management
- [ ] "Sign up" / "Sign in" pages (mobile-first, dark UI)

#### ✅ MARKETPLACE (Week 1, Day 3 → Week 2, Day 1)
**Product Listing:**
- [ ] Browse all PSA cards
- [ ] Filter by: grade, price range, condition
- [ ] Search by card name
- [ ] Product detail page (image, specs, availability)
- [ ] Add to cart

**Cart & Checkout:**
- [ ] Shopping cart (session-based or DB)
- [ ] Checkout flow
  - [ ] Billing address capture
  - [ ] Phone number (for delivery)
  - [ ] Review order summary
- [ ] **FINAL SALE** checkbox (required) + warning text
- [ ] Order confirmation page

#### ✅ PAYMENT (Week 2, Day 1-2)
**PromptPay Integration:**
- [ ] Display PromptPay QR code at checkout
- [ ] Display account name + TH/EN instructions
- [ ] Upload proof of payment (screenshot/photo)
- [ ] Store proof in Supabase storage
- [ ] Order status: `pending_payment` → `payment_received` → `shipped`

**Manual Admin Verification:**
- [ ] Admin panel: pending payments list
- [ ] Click "approve" → order moves to "payment_received"
- [ ] Admin notes field

#### ✅ USER ACCOUNT (Week 2, Day 2)
- [ ] Order history page
- [ ] Track delivery status (manual admin update)
- [ ] Support ticket form (basic)

#### ✅ ADMIN PANEL (Week 2, Day 2-3)
**Dashboard:**
- [ ] Total revenue (this week/month)
- [ ] Pending orders count
- [ ] Pending payment verifications

**Products:**
- [ ] List all products
- [ ] Add new product (title, grade, price, image upload)
- [ ] Edit product (price, quantity, availability)
- [ ] Delete product

**Orders:**
- [ ] View all orders
- [ ] Filter by status (pending payment, shipped, delivered)
- [ ] Mark as shipped / delivered
- [ ] View payment proof
- [ ] Approve/reject payment

**Basic Reporting:**
- [ ] Export orders to CSV
- [ ] Export revenue report

#### ✅ EMAIL (Week 2, Day 3)
**Gmail SMTP (free):**
- [ ] Order confirmation email
- [ ] Payment received confirmation
- [ ] Shipping notification
- Fallback: log to console in dev

#### ✅ DEPLOYMENT (Week 2, Day 3)
- [ ] Live on Vercel
- [ ] Supabase connected in production
- [ ] Email sending via Gmail SMTP
- [ ] PromptPay QR live

#### ✅ RESPONSIVE UI (Throughout)
- [ ] Mobile-first design
- [ ] Dark mode (premium aesthetic)
- [ ] Fast loading (image optimization)
- [ ] Accessible (WCAG AA)

#### ✅ QA CHECKLIST
- [ ] Sign up → sign in → view products ✓
- [ ] Add to cart → checkout ✓
- [ ] PromptPay QR displays ✓
- [ ] Upload payment proof ✓
- [ ] Admin approves payment ✓
- [ ] Order confirmation email sent ✓
- [ ] Responsive on mobile/tablet/desktop ✓
- [ ] No console errors ✓

---

## 📋 PHASE 2: 3D PRINTING SYSTEM (Weeks 3-4)

### NOT IN MVP — PHASE 2 DELIVERABLES
- [ ] Token system (wallet, purchase, ledger)
- [ ] Meshy AI integration (user provides API key)
- [ ] 3D costing (grams + hours → price)
- [ ] 3D project upload + management
- [ ] AI image injector (JPG, PNG, WEBP, etc.)
- [ ] Token export (CSV + PDF)
- [ ] Meshy cost admin table
- [ ] 3D admin dashboard

---

## 🔮 PHASE 3+: ADVANCED (Later)

### NOT IN MVP — PHASE 3+ DELIVERABLES
- [ ] Auto-listing system (Level 0/1/2 modes)
- [ ] Confidence scoring + AI validation
- [ ] Batch dashboard
- [ ] Rollback system
- [ ] Multi-language (TH/EN) content management
- [ ] AI pricing suggestions
- [ ] Profit margin alerts
- [ ] TikTok content ideas
- [ ] Advanced reporting (insights, repeat customers)
- [ ] Support ticket system (full)

---

## 📊 CURRENT STATUS

| Feature | Status | Notes |
|---------|--------|-------|
| **Marketplace** | 🔴 Not started | Week 1-2 focus |
| **Checkout** | 🔴 Not started | Week 2 focus |
| **PromptPay** | 🔴 Not started | Week 2 focus |
| **Admin Panel** | 🔴 Not started | Week 2 focus |
| **3D System** | ⚪ Deferred | Phase 2 (Weeks 3-4) |
| **Token System** | ⚪ Deferred | Phase 2 |
| **Auto-listing** | ⚪ Deferred | Phase 3+ |

---

## 🚀 IMMEDIATE NEXT STEPS

**Today (Week 1, Day 1):**
1. [ ] Create GitHub repo
2. [ ] Initialize Next.js + Supabase setup
3. [ ] Create database schema
4. [ ] Bootstrap auth pages

**This Week (Week 1):**
5. [ ] Marketplace browse + filters
6. [ ] Product detail page
7. [ ] Cart logic
8. [ ] Checkout flow

**Next Week (Week 2):**
9. [ ] PromptPay integration
10. [ ] Admin payment verification
11. [ ] Admin product CRUD
12. [ ] Email setup
13. [ ] Deploy to Vercel + launch

---

## 💡 KEY DECISIONS

### What's NOT in MVP:
- 3D printing (Phase 2)
- Token system (Phase 2)
- Multi-language UI (Phase 2)
- Auto-listing (Phase 3)
- AI image injection (Phase 2)
- Advanced reporting (Phase 3)
- Support ticketing (Phase 3)

### What IS in MVP:
- Single-language (TH/EN text hardcoded, switchable Phase 2)
- Manual admin workflow (fully manual, no automation)
- Basic payment (PromptPay manual verification)
- Core marketplace (no AI validation)

### Tech Stack (FREE):
- Next.js (Vercel)
- Supabase (free tier: 500k rows, 1GB storage)
- Vercel (free hosting)
- Gmail SMTP (free email)
- PromptPay (no fees)

---

## 📈 SUCCESS METRICS (MVP Launch)

- ✅ Users can browse PSA cards
- ✅ Users can add to cart + checkout
- ✅ Payment flow works (PromptPay QR)
- ✅ Admin can verify payments
- ✅ Emails sent on order
- ✅ Responsive on mobile
- ✅ Zero critical bugs
- ✅ Live on Vercel

---

## 🎯 PHASE 2 KICKOFF (When MVP stable)

Once marketplace is live:
1. Design token system (immutable ledger)
2. Integrate Meshy AI
3. Build 3D project upload
4. Add token wallet to user account
5. Launch 3D printing as new marketplace category

---

**Created:** May 2, 2026  
**Target MVP Launch:** May 16, 2026 (2 weeks)
