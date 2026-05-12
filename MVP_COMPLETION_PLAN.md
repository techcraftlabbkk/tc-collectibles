# MVP Completion Plan - TC Collectibles Marketplace

**Target Launch Date**: May 16, 2026  
**Days Remaining**: 13 days  
**Status**: Starting Critical Implementation

---

## 🎯 MVP Completion Checklist

### Critical Path (Must Complete)

#### 1. Email Notification System 🔴 CRITICAL
**Timeline**: Days 1-2  
**Deliverables**:
- [ ] Set up Gmail SMTP via Supabase Edge Functions
- [ ] Create email templates
  - [ ] Order confirmation email
  - [ ] Payment received notification
  - [ ] Shipping notification
- [ ] Integrate with checkout flow
- [ ] Notify admin of new orders and pending payments

**Implementation**:
```typescript
// lib/email.ts - Email service
export async function sendOrderConfirmation(order: Order) {
  // Send to customer with order details, PromptPay instructions
}

export async function sendPaymentVerified(order: Order) {
  // Notify customer payment was verified
}

export async function notifyAdminNewPayment(order: Order) {
  // Alert admin to verify payment proof
}
```

#### 2. PromptPay QR Code Integration 🔴 CRITICAL
**Timeline**: Day 1  
**Deliverables**:
- [ ] Get user's PromptPay QR image/data
- [ ] Display on payment page
- [ ] Include payment instructions
- [ ] Payment reference generation

**Implementation**:
```typescript
// In payment/[orderId]/page.tsx
const PROMPTPAY_QR = process.env.NEXT_PUBLIC_PROMPTPAY_QR_URL
const PROMPTPAY_ACCOUNT = process.env.NEXT_PUBLIC_PROMPTPAY_ACCOUNT

export default function PaymentPage({ params }: Props) {
  return (
    <div>
      <img src={PROMPTPAY_QR} alt="PromptPay QR Code" />
      <p>Account: {PROMPTPAY_ACCOUNT}</p>
      <p>Amount: ฿{order.total_thb}</p>
      <p>Reference: {order.id}</p>
    </div>
  )
}
```

#### 3. Payment Verification Workflow 🔴 CRITICAL
**Timeline**: Days 2-3  
**Deliverables**:
- [ ] Admin can see pending payments
- [ ] Upload/view payment proof images
- [ ] Approve/reject payments with notes
- [ ] Auto-update order status when payment approved
- [ ] Send verification email to customer

**Components Needed**:
- Payment proof image upload (using Supabase Storage)
- Admin payment verification table
- Payment status tracking in database

```typescript
// Admin payment verification
<table>
  <tr>
    <td>Order ID</td>
    <td>Amount</td>
    <td>Proof Image</td>
    <td>Status</td>
    <td>Actions</td>
  </tr>
  {pendingPayments.map(payment => (
    <tr>
      <td>{payment.order_id}</td>
      <td>฿{payment.amount_thb}</td>
      <td><img src={payment.proof_image_url} /></td>
      <td>{payment.status}</td>
      <td>
        <button onClick={() => approvePayment(payment.id)}>Approve</button>
        <button onClick={() => rejectPayment(payment.id)}>Reject</button>
      </td>
    </tr>
  ))}
</table>
```

#### 4. Product Image Management 🟡 IMPORTANT
**Timeline**: Days 3-4  
**Deliverables**:
- [ ] Set up Supabase Storage bucket for product images
- [ ] Admin product image upload
- [ ] Display product images on products page
- [ ] Product detail page images

**Schema Update**:
```sql
ALTER TABLE products 
ADD COLUMN image_url TEXT,
ADD COLUMN image_storage_path TEXT;
```

#### 5. Data Validation & Edge Cases 🟡 IMPORTANT
**Timeline**: Days 4-5  
**Deliverables**:
- [ ] Validate checkout required fields
- [ ] Cart quantity limits (max inventory)
- [ ] Price calculations (no negative totals)
- [ ] Order status transitions (prevent invalid states)
- [ ] Payment state validation

#### 6. Admin Dashboard Completion 🟡 IMPORTANT
**Timeline**: Days 5-6  
**Deliverables**:
- [ ] Revenue calculation (sum of verified payments)
- [ ] Pending orders count
- [ ] Pending payments count
- [ ] Product inventory tracking
- [ ] Order search/filter
- [ ] Export orders to CSV

#### 7. Real Supabase Setup Verification 🟢 GOOD
**Timeline**: Day 6-7  
**Deliverables**:
- [ ] Verify all tables created with correct schema
- [ ] Set up Row Level Security (RLS) policies
- [ ] Auth email confirmation (if needed)
- [ ] Database backups configured
- [ ] Vercel environment variables set

#### 8. Testing & QA 🟢 GOOD
**Timeline**: Days 8-11  
**Deliverables**:
- [ ] E2E test: Browse → Add to Cart → Checkout → Payment
- [ ] E2E test: Admin approve payment
- [ ] E2E test: Email notifications sent
- [ ] Mobile responsiveness check
- [ ] PromptPay display verification
- [ ] Admin payment verification flow
- [ ] All forms validation

#### 9. Deployment & Production Setup 🟢 GOOD
**Timeline**: Days 11-13  
**Deliverables**:
- [ ] Vercel deployment configured
- [ ] Environment variables set (.env.local)
- [ ] Supabase production database
- [ ] SSL/HTTPS verified
- [ ] Domain configured (if applicable)
- [ ] Email service verified
- [ ] Payment system tested end-to-end

---

## 📊 Priority Matrix

### Must Have (MVP Launch)
1. ✅ Marketplace pages (products, cart, checkout) - DONE
2. ✅ Admin dashboard - DONE
3. ✅ Authentication - DONE
4. 🔴 **Email notifications** - TODO
5. 🔴 **PromptPay QR display** - TODO
6. 🔴 **Payment verification workflow** - TODO
7. 🟡 Product images - TODO
8. 🟡 Real data validation - TODO

### Should Have (Before Launch)
- Admin dashboard polish
- Supabase RLS policies
- Error handling
- Loading states

### Nice to Have (Phase 2+)
- Dark mode
- Component library enhancements
- Analytics
- Advanced admin features
- 3D printing system

---

## 🛠️ Technical Implementation Details

### Email Service Setup

```typescript
// lib/services/email.ts
import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASSWORD, // App-specific password
  },
})

export async function sendOrderConfirmation(order: Order, customer: User) {
  const emailContent = `
    <h1>Order Confirmation</h1>
    <p>Order ID: ${order.id}</p>
    <p>Total: ฿${order.total_thb}</p>
    <p>Please transfer amount to PromptPay account below:</p>
    <p>${process.env.PROMPTPAY_ACCOUNT}</p>
    <p>Upload proof image in your account to verify payment.</p>
  `

  await transporter.sendMail({
    from: process.env.GMAIL_USER,
    to: customer.email,
    subject: `Order Confirmation - ${order.id}`,
    html: emailContent,
  })
}
```

### Payment Verification Schema

```typescript
// Types for payment verification
interface Payment {
  id: string
  order_id: string
  amount_thb: number
  proof_image_url: string
  status: 'pending' | 'verified' | 'rejected'
  admin_notes: string
  verified_at: string
  verified_by: string
}

interface Order {
  id: string
  user_id: string
  items: OrderItem[]
  total_thb: number
  shipping_address: Address
  payment_status: 'pending' | 'verified' | 'failed'
  order_status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  created_at: string
}
```

### Admin Payment Verification Page

```typescript
// app/[locale]/admin/payments/page.tsx
export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([])
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null)

  useEffect(() => {
    // Fetch pending payments
    fetchPendingPayments()
  }, [])

  const handleApprovePayment = async (paymentId: string, notes: string) => {
    // 1. Update payment status to 'verified'
    // 2. Update order status to 'processing'
    // 3. Send verification email to customer
    // 4. Refresh payments list
  }

  const handleRejectPayment = async (paymentId: string, notes: string) => {
    // 1. Update payment status to 'rejected'
    // 2. Send rejection email to customer with instructions
    // 3. Refresh payments list
  }

  return (
    <div>
      <h1>Payment Verification</h1>
      
      {/* Pending Payments Table */}
      <table>
        {/* Payment rows with approve/reject buttons */}
      </table>

      {/* Payment Detail Modal */}
      {selectedPayment && (
        <Modal isOpen={!!selectedPayment} onClose={() => setSelectedPayment(null)}>
          <img src={selectedPayment.proof_image_url} alt="Payment proof" />
          <textarea placeholder="Admin notes..." />
          <button onClick={() => handleApprovePayment(selectedPayment.id, notes)}>
            Approve
          </button>
          <button onClick={() => handleRejectPayment(selectedPayment.id, notes)}>
            Reject
          </button>
        </Modal>
      )}
    </div>
  )
}
```

---

## 📋 Day-by-Day Implementation Schedule

### Day 1 (May 3)
- [ ] Set up Gmail SMTP
- [ ] Get PromptPay QR image from user
- [ ] Implement PromptPay display on payment page
- [ ] Create email templates

### Day 2 (May 4)
- [ ] Implement email sending service
- [ ] Integrate with checkout (send confirmation)
- [ ] Integrate with admin payment approval

### Day 3 (May 5)
- [ ] Create payment verification admin page
- [ ] Implement payment proof image upload
- [ ] Create approve/reject payment functions
- [ ] Payment status tracking

### Day 4 (May 6)
- [ ] Set up Supabase Storage for images
- [ ] Admin product image upload
- [ ] Product image display on pages

### Day 5 (May 7)
- [ ] Form validation enhancements
- [ ] Quantity limits and inventory checks
- [ ] Edge case handling

### Day 6 (May 8)
- [ ] Admin dashboard revenue calculations
- [ ] Order export to CSV
- [ ] Supabase RLS policies

### Day 7 (May 9)
- [ ] Full data verification
- [ ] Environment setup
- [ ] Database backups

### Days 8-11 (May 10-13)
- [ ] Full E2E testing
- [ ] Mobile responsiveness
- [ ] Bug fixes
- [ ] Performance optimization

### Days 12-13 (May 14-15)
- [ ] Final deployment
- [ ] Production verification
- [ ] Monitoring setup

---

## 🔐 Environment Variables Needed

```bash
# Gmail
GMAIL_USER=techcraftlab.bkk@gmail.com
GMAIL_PASSWORD=<app-specific-password>

# PromptPay
NEXT_PUBLIC_PROMPTPAY_QR_URL=<user-provided-qr>
NEXT_PUBLIC_PROMPTPAY_ACCOUNT=<user-account-name>

# Supabase
NEXT_PUBLIC_SUPABASE_URL=<your-project-url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key>
SUPABASE_SERVICE_ROLE_KEY=<service-role-key>

# Admin Email
ADMIN_EMAIL=techcraftlab.bkk@gmail.com
```

---

## ✅ Success Criteria for MVP Launch

- [ ] Users can browse products
- [ ] Users can add to cart and checkout
- [ ] Users receive order confirmation email
- [ ] PromptPay QR displayed on payment page
- [ ] Admin can view pending payments with proofs
- [ ] Admin can approve/reject payments
- [ ] Payment approval triggers shipping email
- [ ] All critical pages responsive on mobile
- [ ] No console errors
- [ ] Deployed to Vercel and accessible

---

## 📞 Blockers/Questions for User

Need to confirm before starting:
1. PromptPay QR image - do you have it ready?
2. PromptPay account name - what should we display?
3. Gmail setup - confirm Gmail password (app-specific)?
4. Admin email - where should notifications go?
5. Product data - do you have existing products or should we use sample data?

---

**Status**: Ready to begin Critical Path implementation  
**Confidence**: High (13 days is sufficient for MVP)  
**Risk**: Email setup timing (Gmail auth can be tricky)  
**Next**: Confirm blockers and start Day 1 tasks
