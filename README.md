# TC Collectibles — Premium PSA Pokémon Marketplace

> Full-stack marketplace for graded Pokémon cards. Built with Next.js, Supabase, Vercel. Launch: May 16, 2026.

**Live Demo:** (coming May 16)  
**Admin Dashboard:** (after launch)

---

## 🎯 Project Overview

**TC Collectibles x TechCraft Lab** is a two-phase product:

### Phase 1: PSA Pokémon Card Marketplace (MVP — Weeks 1-2)
- Browse & filter graded PSA Pokémon cards
- Shopping cart + checkout with PromptPay
- Final sale, no refunds/returns
- Admin payment verification
- Email notifications

### Phase 2: 3D Printing Service (Later)
- Token wallet system
- Meshy AI integration
- 3D project uploads
- Token ledger (immutable)

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ & npm
- Supabase account (free tier)
- Gmail account (for SMTP, optional)

### 1. Clone & Install
```bash
git clone https://github.com/YOUR-ORG/tc-collectibles.git
cd tc-collectibles
npm install
```

### 2. Setup Environment
```bash
cp .env.example .env.local
# Edit .env.local with your Supabase credentials
```

### 3. Setup Database
1. Create Supabase project at [supabase.com](https://supabase.com)
2. Copy Supabase URL & keys to `.env.local`
3. In Supabase SQL Editor, run:
   - `database/001_create_tables.sql`
   - `database/002_create_rls_policies.sql`
   - `database/003_sample_products.sql`

### 4. Run Locally
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 5. Deploy to Vercel
```bash
npm i -g vercel
vercel --prod
```

Add environment variables in Vercel dashboard → redeploy.

---

## 📚 Documentation

- **[BOOTSTRAP_COMPLETE.md](./BOOTSTRAP_COMPLETE.md)** — Setup checklist & next steps
- **[MVP_ROADMAP.md](./MVP_ROADMAP.md)** — Phase 1/2/3 breakdown
- **[SETUP_GUIDE.md](./SETUP_GUIDE.md)** — Detailed setup with SQL scripts
- **[DELIVERABLES_TRACKER.md](./DELIVERABLES_TRACKER.md)** — Week 1-2 task checklist

---

## 🏗️ Architecture

### Tech Stack
- **Frontend:** Next.js 14, React 18, TypeScript, Tailwind CSS
- **Backend:** Supabase (PostgreSQL, Auth, Storage)
- **Hosting:** Vercel
- **Payment:** PromptPay (manual)
- **Email:** Gmail SMTP (mock in Phase 1)

### Database Schema
```
products
  ├── id (UUID, PK)
  ├── title, grade, price, image_url
  ├── quantity, available
  └── timestamps

orders
  ├── id (UUID, PK)
  ├── user_id (FK → auth.users)
  ├── total, status, shipping_address, phone
  └── timestamps

order_items
  ├── id (UUID, PK)
  ├── order_id, product_id (FKs)
  ├── quantity, price_at_purchase

payments
  ├── id (UUID, PK)
  ├── order_id (FK, unique)
  ├── method (promptpay)
  ├── proof_image_url, status
  ├── verified_at, admin_notes
```

### Folder Structure
```
app/
├── auth/          # Login & signup
├── products/      # Browse & filters
├── cart/          # Shopping cart
├── checkout/      # Payment flow (to build)
├── orders/        # My orders (to build)
├── admin/         # Admin dashboard (to build)
├── layout.tsx     # Root layout
├── globals.css    # Tailwind + utilities
└── page.tsx       # Home

lib/
├── types.ts       # TypeScript types
├── supabase.ts    # Client setup
├── auth.ts        # Auth helpers
└── storage.ts     # File uploads

database/
├── 001_create_tables.sql
├── 002_create_rls_policies.sql
└── 003_sample_products.sql
```

---

## 🔐 Authentication

### User Flow
1. Sign up → verify email
2. Sign in → Supabase session
3. Browse products (public)
4. Add to cart (client-side state)
5. Checkout → create order
6. Upload payment proof
7. Admin verifies → order complete

### Admin Access
- Set `user_metadata.role = 'admin'` in Supabase
- Access `/admin/*` pages
- Manage products, orders, payments

---

## 💳 Payment Flow

### PromptPay (Manual)
1. User proceeds to checkout
2. Display PromptPay QR code
3. User scans & pays on their phone
4. User uploads screenshot of payment
5. Admin reviews screenshot
6. Admin approves → order status changes to `payment_received`

### No Automation
- No payment API integration (manual for MVP)
- No automatic webhooks
- Simple CSV export for accounting

---

## 📦 Features

### Phase 1 MVP (Weeks 1-2)
✅ Product listing + filters  
✅ Product detail page  
✅ Shopping cart  
✅ Checkout flow  
✅ PromptPay QR + proof upload  
✅ Order history  
✅ Admin dashboard  
✅ Email notifications  
✅ Responsive design  
✅ Dark theme UI  
✅ Row-level security  

### Phase 2 (Weeks 3-4)
🔜 Token system (wallet, ledger)  
🔜 Meshy AI integration  
🔜 3D project uploads  
🔜 3D costing (grams + hours)  
🔜 AI image injection  

### Phase 3+ (Future)
🔜 Auto-listing system  
🔜 Confidence scoring  
🔜 Multi-language UI  
🔜 Advanced reporting  
🔜 Support tickets  
🔜 TikTok content ideas  

---

## 🚀 Deployment

### Vercel (Free)
1. Connect GitHub repo to Vercel
2. Add environment variables
3. Auto-deploys on push to main

### Custom Domain (Optional)
1. Buy domain
2. Add DNS records to Vercel
3. SSL auto-configured

### Supabase (Free Tier)
- 500k rows
- 1GB storage
- Real-time subscriptions
- Full PostgreSQL

---

## 🧪 Testing

### Local Testing
```bash
npm run dev
# Visit http://localhost:3000
# Test: signup → signin → browse → cart → checkout
```

### QA Checklist
- [ ] Auth works (signup, signin, signout)
- [ ] Products load + filters work
- [ ] Cart adds/removes items
- [ ] Checkout form validates
- [ ] PromptPay QR displays
- [ ] Payment proof uploads
- [ ] Admin can verify payments
- [ ] Emails send (or log)
- [ ] Mobile responsive
- [ ] No console errors

---

## 🚨 Important Notes

### Security
- Never commit `.env.local` to git
- Service role key is secret (server-side only)
- RLS policies enforce access control
- Passwords hashed by Supabase Auth

### Performance
- Images optimized with `next/image`
- Tailwind purges unused CSS
- Vercel edge caching enabled
- Supabase connection pooling

### Mobile-First
- Design starts on mobile (375px)
- Scales to tablet (768px) & desktop (1024px)
- Touch-friendly buttons (44px min)
- Dark theme throughout

---

## 📞 Support

### During Development
- Check `BOOTSTRAP_COMPLETE.md` for setup help
- Review `MVP_ROADMAP.md` for features
- Use `DELIVERABLES_TRACKER.md` to track progress

### After Launch
- Admin reviews payment proofs manually
- Email support: support@tccollectibles.com
- Support ticket system (Phase 2)

---

## 📝 License

Private — TC Collectibles x TechCraft Lab

---

## 👥 Contributors

- **You** — Full-stack development
- **TechCraft Lab** — Product & design

---

## 🎯 Timeline

| Phase | Timeline | Status |
|-------|----------|--------|
| **Phase 1: MVP** | Weeks 1-2 (by May 16) | 🔴 In development |
| **Phase 2: 3D** | Weeks 3-4 | ⚪ Planned |
| **Phase 3: Advanced** | Ongoing | ⚪ Future |

---

**Built with ❤️ for collectors. Launched May 16, 2026.**
