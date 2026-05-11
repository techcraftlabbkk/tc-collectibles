# DELIVERABLES TRACKER — TC Collectibles MVP

**Target Launch:** May 16, 2026 (2 weeks from May 2)  
**Status:** 🔴 Not started  
**Progress:** 0% → 100%

---

## ⚡ WEEK 1: FOUNDATION + MARKETPLACE

### INFRASTRUCTURE (Days 1-2)
- [ ] GitHub repo created + cloned
- [ ] Next.js project scaffolded (TypeScript, Tailwind, App Router)
- [ ] Supabase project created + free tier enabled
- [ ] Environment variables configured (.env.local, Vercel secrets)
- [ ] Vercel project connected + auto-deploy enabled
- [ ] ESLint + Prettier configured
- [ ] Initial commit pushed

**Status:** 🔴 Not started | **Target:** May 2-3

---

### DATABASE SCHEMA (Days 1-2)
- [ ] Supabase tables created (products, orders, order_items, payments)
- [ ] RLS policies configured
- [ ] Storage bucket for payment proofs created
- [ ] Mock product data inserted (10-20 sample PSA cards)

**Status:** 🔴 Not started | **Target:** May 2-3

---

### AUTHENTICATION (Days 2-3)
- [ ] Supabase Auth configured
- [ ] Sign up page (email/password)
- [ ] Sign in page (email/password)
- [ ] Magic link option (optional)
- [ ] Protected routes middleware
- [ ] Session management (cookies/tokens)
- [ ] Sign out functionality
- [ ] User profile context

**Status:** 🔴 Not started | **Target:** May 3-4

---

### MARKETPLACE — BROWSE (Days 3-5)
- [ ] Products listing page
- [ ] Grid layout (responsive: 1 col mobile → 4 cols desktop)
- [ ] Product cards with image, title, grade, price
- [ ] "Add to Cart" button
- [ ] Link to product detail page
- [ ] Loading states + skeleton loader
- [ ] Image optimization (Next.js Image)

**Status:** 🔴 Not started | **Target:** May 4-5

---

### MARKETPLACE — FILTERS (Days 3-5)
- [ ] Filter by PSA grade (10, 9, 8, 7, etc.)
- [ ] Filter by price range (slider)
- [ ] Search by card name
- [ ] Sort by: newest, price low-to-high, price high-to-low
- [ ] Active filter badge display
- [ ] Clear all filters button
- [ ] Filter results update in real-time

**Status:** 🔴 Not started | **Target:** May 4-5

---

### MARKETPLACE — PRODUCT DETAIL (Days 5-6)
- [ ] Product detail page layout
- [ ] Large product image (zoomable or gallery)
- [ ] Product specs (title, grade, condition, edition)
- [ ] Price display
- [ ] Quantity available display
- [ ] "Add to Cart" with quantity selector
- [ ] "Stock unavailable" message if out of stock
- [ ] Related products (optional)
- [ ] Back button to browse

**Status:** 🔴 Not started | **Target:** May 5-6

---

### CART MANAGEMENT (Days 6-7)
- [ ] Cart state management (Zustand or Context)
- [ ] Add to cart functionality
- [ ] Remove from cart
- [ ] Update quantity
- [ ] Cart summary (item count, subtotal)
- [ ] Persistent cart (localStorage or DB)
- [ ] Empty cart message
- [ ] "Proceed to Checkout" button

**Status:** 🔴 Not started | **Target:** May 6-7

---

## 📦 WEEK 2: CHECKOUT + ADMIN + DEPLOY

### CHECKOUT FLOW (Days 1-2)
- [ ] Checkout page layout
- [ ] Shipping address form
  - [ ] Address line 1, 2
  - [ ] Province/District
  - [ ] Postal code
  - [ ] Phone number
- [ ] Order summary (items, quantities, prices)
- [ ] Subtotal calculation
- [ ] Shipping cost (hardcoded or calculated)
- [ ] Tax calculation (optional for MVP)
- [ ] Total price display
- [ ] **FINAL SALE checkbox** (required, with warning text)
- [ ] "Proceed to Payment" button

**Status:** 🔴 Not started | **Target:** May 8-9

---

### PAYMENT — PROMPTPAY (Days 2-3)
- [ ] PromptPay QR image display
- [ ] Account name display (TH + EN)
- [ ] Instructions text (TH + EN)
- [ ] "Upload Payment Proof" section
- [ ] File upload (image/screenshot)
- [ ] Upload to Supabase storage
- [ ] Preview uploaded image
- [ ] "Submit for Verification" button
- [ ] Order status: `pending_payment`

**Status:** 🔴 Not started | **Target:** May 9-10

---

### ORDER CONFIRMATION (Days 3-4)
- [ ] Confirmation page after payment submission
- [ ] Order number display
- [ ] Total amount paid
- [ ] Estimated delivery date
- [ ] "View Order" button
- [ ] Email confirmation sent

**Status:** 🔴 Not started | **Target:** May 9-10

---

### USER ACCOUNT — MY ORDERS (Days 4-5)
- [ ] My Orders page
- [ ] List all user's orders
- [ ] Order status badge (pending payment, shipped, delivered)
- [ ] Order date, total amount
- [ ] Click to view order details
- [ ] Order detail modal/page
  - [ ] Items purchased
  - [ ] Payment status
  - [ ] Shipping address
  - [ ] Estimated delivery
- [ ] Cancel order option (if pending payment)

**Status:** 🔴 Not started | **Target:** May 10-11

---

### ADMIN PANEL — DASHBOARD (Days 5-6)
- [ ] Admin dashboard landing page
- [ ] Stats cards:
  - [ ] Total revenue (this month)
  - [ ] Total orders (this month)
  - [ ] Pending payment count
  - [ ] Total products count
- [ ] Recent orders list
- [ ] Quick links to products, orders, payments
- [ ] Admin auth check (redirect if not admin)

**Status:** 🔴 Not started | **Target:** May 11-12

---

### ADMIN PANEL — PRODUCTS (Days 5-6)
- [ ] Products list (table or grid)
- [ ] Columns: title, grade, price, quantity, available, actions
- [ ] Add Product form
  - [ ] Title, grade, description
  - [ ] Price input
  - [ ] Image upload
  - [ ] Quantity
  - [ ] Save button
- [ ] Edit Product
  - [ ] Pre-fill form
  - [ ] Update button
- [ ] Delete Product (with confirmation)
- [ ] Bulk actions (optional for Phase 2)

**Status:** 🔴 Not started | **Target:** May 11-12

---

### ADMIN PANEL — ORDERS (Days 6-7)
- [ ] Orders list (table)
- [ ] Columns: order ID, customer, total, status, date
- [ ] Filter by status
- [ ] Click order to view details
- [ ] Order detail page:
  - [ ] Items list
  - [ ] Customer info
  - [ ] Payment proof (if uploaded)
  - [ ] Status dropdown (pending → shipped → delivered)
  - [ ] Add shipping note
  - [ ] Save button
- [ ] Bulk status update (optional)

**Status:** 🔴 Not started | **Target:** May 12-13

---

### ADMIN PANEL — PAYMENTS (Days 6-7)
- [ ] Pending payments list
- [ ] Payment proof thumbnail (image)
- [ ] Order info + customer
- [ ] "Verify" button
- [ ] "Reject" button
- [ ] Admin notes field
- [ ] Mark as verified → order status changes to `payment_received`
- [ ] Verified payments history view

**Status:** 🔴 Not started | **Target:** May 12-13

---

### EMAIL SYSTEM (Days 7)
- [ ] Order confirmation email template
- [ ] Payment received email template
- [ ] Shipping notification email template
- [ ] Gmail SMTP integration
- [ ] Email sent on order creation
- [ ] Email sent on payment verification
- [ ] Email sent on order shipped
- [ ] Fallback: log to console (dev mode)

**Status:** 🔴 Not started | **Target:** May 13

---

### RESPONSIVE DESIGN (Throughout)
- [ ] Mobile-first Tailwind CSS
- [ ] Navigation responsive (hamburger on mobile)
- [ ] Product grid responsive (1 col → 2 → 4)
- [ ] Forms mobile-optimized
- [ ] Checkout flow mobile-friendly
- [ ] Admin panel accessible on tablet
- [ ] Images optimized (Next.js Image)
- [ ] Font sizes readable on all screens

**Status:** 🔴 Not started | **Target:** Throughout Week 1-2

---

### QA TESTING (Day 7)
- [ ] ✅ Sign up flow works
- [ ] ✅ Sign in flow works
- [ ] ✅ Browse products + filters work
- [ ] ✅ Product detail page loads
- [ ] ✅ Add to cart + remove works
- [ ] ✅ Checkout form validates
- [ ] ✅ PromptPay QR displays
- [ ] ✅ Payment proof upload works
- [ ] ✅ Order confirmation email sent
- [ ] ✅ Admin can verify payment
- [ ] ✅ Order status updates
- [ ] ✅ No console errors
- [ ] ✅ No 404 errors
- [ ] ✅ Mobile responsive ✓
- [ ] ✅ Fast page load (<3s)

**Status:** 🔴 Not started | **Target:** May 14-15

---

### DEPLOYMENT (Days 7)
- [ ] All environment variables set in Vercel
- [ ] Supabase production project configured
- [ ] GitHub main branch protected
- [ ] Auto-deploy enabled
- [ ] PromptPay QR image deployed
- [ ] Domain configured (if custom domain)
- [ ] SSL certificate (auto via Vercel)
- [ ] Final smoke test on production

**Status:** 🔴 Not started | **Target:** May 15-16

---

## 🎯 LAUNCH CHECKLIST (May 16)

### Pre-Launch (May 15)
- [ ] All QA tests passing
- [ ] No critical bugs
- [ ] Admin can manage products
- [ ] Payments working
- [ ] Emails sending
- [ ] Mobile responsive confirmed
- [ ] Performance acceptable

### Launch Day (May 16)
- [ ] Public announcement
- [ ] Monitor error logs (first 24h)
- [ ] Respond to customer support
- [ ] Admin monitors payment verifications

---

## 📊 PROGRESS TRACKING

| Week | Item | Status | Notes |
|------|------|--------|-------|
| **W1** | Infrastructure | 🔴 | - |
| **W1** | Database | 🔴 | - |
| **W1** | Auth | 🔴 | - |
| **W1** | Marketplace Browse | 🔴 | - |
| **W1** | Filters | 🔴 | - |
| **W1** | Product Detail | 🔴 | - |
| **W1** | Cart | 🔴 | - |
| **W2** | Checkout | 🔴 | - |
| **W2** | PromptPay | 🔴 | - |
| **W2** | Admin Dashboard | 🔴 | - |
| **W2** | Admin Products | 🔴 | - |
| **W2** | Admin Orders | 🔴 | - |
| **W2** | Admin Payments | 🔴 | - |
| **W2** | Email | 🔴 | - |
| **W2** | QA | 🔴 | - |
| **W2** | Deploy | 🔴 | - |

---

## 🔄 Update This Document

**As you complete each section:**
1. Change status from 🔴 (not started) → 🟡 (in progress) → 🟢 (complete)
2. Add any notes
3. Update progress percentage at top

**Example:**
```
### MARKETPLACE — BROWSE (Days 3-5)
- [x] Products listing page ✓
- [ ] Grid layout (responsive: 1 col mobile → 4 cols desktop)
- [ ] ...

Status: 🟡 In progress | 40% done | Target: May 4-5
```

---

**Created:** May 2, 2026  
**Last Updated:** May 2, 2026  
**Target Completion:** May 16, 2026
