# 3D Print Studio — Setup Guide

## 1. Install Dependencies

Run this in the project root:

```bash
npm install stripe @stripe/stripe-js
```

## 2. Environment Variables

Add these to your `.env.local` (and Vercel dashboard):

```env
# Already present
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...         # needed for webhook + admin routes
NEXT_PUBLIC_SITE_URL=https://your-domain.com

# New — Stripe
STRIPE_SECRET_KEY=sk_live_...          # from Stripe Dashboard → Developers → API Keys
STRIPE_WEBHOOK_SECRET=whsec_...        # from Stripe Dashboard → Webhooks (see step 4)

# New — Meshy AI
MESHY_API_KEY=...                      # from https://app.meshy.ai → Settings → API
```

## 3. Run the Database Migration

In the Supabase dashboard → SQL Editor, paste and run:

```
supabase/migrations/20260529_3d_printing_system.sql
```

Or using the Supabase CLI:
```bash
supabase db push
```

## 4. Set Up Stripe Webhook

1. Go to [Stripe Dashboard → Webhooks](https://dashboard.stripe.com/webhooks)
2. Click **Add endpoint**
3. URL: `https://your-domain.com/api/webhooks/stripe`
4. Events to listen for: `checkout.session.completed`
5. Copy the **Signing secret** → paste as `STRIPE_WEBHOOK_SECRET` in your env

For local testing with Stripe CLI:
```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

## 5. Set Up Meshy AI

1. Sign up at [meshy.ai](https://app.meshy.ai)
2. Go to Settings → API Keys → Create key
3. Paste as `MESHY_API_KEY`

## 6. New Routes Summary

| Route | Description |
|-------|-------------|
| `/[locale]/3d-studio` | Customer: 3D Studio (upload / AI generate / from photo) |
| `/[locale]/3d-studio/wallet` | Customer: Buy credit packs |
| `/[locale]/3d-studio/wallet/success` | Post-Stripe redirect |
| `/[locale]/3d-studio/orders` | Customer: Track print orders |
| `/[locale]/admin/3d` | Admin: Manage print order queue |
| `POST /api/3d/wallet/create-checkout` | Create Stripe checkout session |
| `GET /api/3d/wallet/balance` | Get token balance + ledger |
| `POST /api/webhooks/stripe` | Stripe webhook (credits tokens on payment) |
| `POST /api/3d/meshy/generate` | Meshy text-to-3D |
| `POST /api/3d/meshy/image-to-3d` | Meshy image-to-3D |
| `GET /api/3d/meshy/status/[jobId]` | Poll Meshy job status |
| `GET /api/3d/orders` | List user's print orders |
| `POST /api/3d/orders` | Place print order (deducts tokens) |
| `PATCH /api/3d/orders/[id]` | Admin: update status / tracking |

## 7. Credit Pack Pricing

Edit `lib/stripeServer.ts` → `CREDIT_PACKS` to adjust token amounts and THB prices.

## 8. Pricing Formula

Edit `calculateTokenCost()` in `lib/stripeServer.ts`:

```
cost = round((scaleCm / 10) × 8 × materialMultiplier × (infill / 40)) × quantity
```

Material multipliers: PLA = 1×, Resin = 2.5×, Metal = 6×
