# TC Collectibles MVP — SETUP GUIDE

## Phase 1: Local Development Setup (30 mins)

### 1️⃣ GitHub Repo
```bash
# Create repo (public or private)
# Clone locally
git clone https://github.com/YOUR-ORG/tc-collectibles.git
cd tc-collectibles

# Initialize monorepo structure
mkdir -p apps/web
cd apps/web
```

### 2️⃣ Next.js Project
```bash
# Bootstrap Next.js with TypeScript
npx create-next-app@latest . \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --skip-git

# Install Supabase client
npm install @supabase/supabase-js

# Install utilities
npm install dotenv next-auth zustand
```

### 3️⃣ Environment Setup
Create `.env.local`:
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVICE_KEY

# Gmail SMTP (for Phase 1, use mock)
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=noreply@tccollectibles.com

# PromptPay (will add in checkout phase)
PROMPTPAY_ACCOUNT_NAME="Your Name"
PROMPTPAY_QR_IMAGE_URL="https://..."
```

### 4️⃣ Supabase Setup

#### Create Free Supabase Project:
1. Go to [supabase.com](https://supabase.com)
2. Sign up (free tier)
3. Create new project (Region: Southeast Asia recommended)
4. Copy `SUPABASE_URL` and `ANON_KEY` → `.env.local`

#### Create Database Schema:

**Table: users (auto-created by Supabase Auth)**

**Table: products**
```sql
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  grade TEXT, -- "PSA 10", "PSA 9", etc.
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  image_url TEXT,
  quantity INTEGER DEFAULT 0,
  available BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);
```

**Table: orders**
```sql
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  total DECIMAL(10, 2) NOT NULL,
  status TEXT DEFAULT 'pending_payment', -- pending_payment, shipped, delivered, cancelled
  shipping_address TEXT,
  phone TEXT,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);
```

**Table: order_items**
```sql
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id),
  quantity INTEGER NOT NULL,
  price_at_purchase DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT now()
);
```

**Table: payments**
```sql
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  method TEXT DEFAULT 'promptpay', -- promptpay
  proof_image_url TEXT,
  status TEXT DEFAULT 'pending', -- pending, verified, rejected
  verified_at TIMESTAMP,
  admin_notes TEXT,
  created_at TIMESTAMP DEFAULT now()
);
```

**Set Row-Level Security (RLS):**
```sql
-- Enable RLS on all tables
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Products: Everyone can read, only admins can write
CREATE POLICY "Public read products" ON products FOR SELECT USING (true);

-- Orders: Users see own orders only
CREATE POLICY "Users see own orders" ON orders FOR SELECT USING (auth.uid() = user_id);

-- Payments: Users see own, admins see all
CREATE POLICY "Users see own payments" ON payments FOR SELECT 
USING (order_id IN (SELECT id FROM orders WHERE user_id = auth.uid()));
```

---

## Phase 2: Project Structure (10 mins)

```
tc-collectibles/
├── apps/web/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx (home)
│   │   ├── products/
│   │   │   ├── page.tsx (browse)
│   │   │   └── [id]/
│   │   │       └── page.tsx (detail)
│   │   ├── cart/
│   │   │   └── page.tsx
│   │   ├── checkout/
│   │   │   └── page.tsx
│   │   ├── orders/
│   │   │   └── page.tsx (user account)
│   │   ├── admin/
│   │   │   ├── page.tsx (dashboard)
│   │   │   ├── products/
│   │   │   ├── orders/
│   │   │   └── payments/
│   │   └── auth/
│   │       ├── login/page.tsx
│   │       └── signup/page.tsx
│   ├── lib/
│   │   ├── supabase.ts (client)
│   │   ├── supabaseServer.ts (server)
│   │   ├── auth.ts (auth helpers)
│   │   └── types.ts (TypeScript types)
│   ├── components/
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   ├── ProductCard.tsx
│   │   └── Cart.tsx
│   ├── styles/
│   │   └── globals.css
│   ├── .env.local
│   ├── .env.example
│   ├── next.config.ts
│   ├── tsconfig.json
│   ├── tailwind.config.ts
│   └── package.json
└── README.md
```

---

## Phase 3: Core Supabase Client Setup

File: `lib/supabase.ts`
```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

// Types
export type Product = {
  id: string;
  title: string;
  grade: string;
  price: number;
  image_url: string;
  quantity: number;
  available: boolean;
  created_at: string;
};

export type Order = {
  id: string;
  user_id: string;
  total: number;
  status: 'pending_payment' | 'shipped' | 'delivered' | 'cancelled';
  shipping_address: string;
  phone: string;
  created_at: string;
};

export type Payment = {
  id: string;
  order_id: string;
  method: 'promptpay';
  proof_image_url: string;
  status: 'pending' | 'verified' | 'rejected';
  verified_at: string | null;
  admin_notes: string | null;
  created_at: string;
};
```

---

## Phase 4: Deploy to Vercel

### 1. Connect GitHub to Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### 2. Add Environment Variables in Vercel Dashboard
- Project Settings → Environment Variables
- Add: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, etc.

### 3. Set Up Auto-Deploy
- Vercel auto-deploys on GitHub push (main branch)

---

## Phase 5: Payment & Messaging Setup

### PromptPay QR Image
**Before checkout launch:**
1. Generate PromptPay QR code (use online generator: promptpay.io)
2. Upload to Supabase storage: `/public/promptpay-qr.png`
3. Add URL to `.env.local`

### Gmail SMTP Setup
1. Enable 2FA on Gmail account
2. Generate "App Password" (google.com/app-passwords)
3. Add to `.env.local`: `SMTP_PASS=your-app-password`

---

## Testing Checklist

- [ ] npm run dev → app loads at localhost:3000
- [ ] Supabase tables created + RLS enabled
- [ ] Auth pages render
- [ ] Environment variables loaded (check console)
- [ ] Products page displays (mock data or empty)
- [ ] Admin panel accessible (auth check)

---

## Ready for Week 1 Development

Once this setup is complete, you're ready to:
1. Build marketplace browse + filters
2. Implement product detail page
3. Build cart + checkout
4. Integrate PromptPay

**Estimated setup time:** 45 mins - 1 hour
