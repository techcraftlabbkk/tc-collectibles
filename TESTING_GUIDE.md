# TC Collectibles Phase 1 Testing Guide

## Overview
Comprehensive testing suite for the TC Collectibles MVP Phase 1 marketplace, covering unit tests, integration tests, and API endpoint verification.

## Testing Architecture

### Test Structure
```
__tests__/
├── lib/                    # Unit tests for business logic
│   ├── cartStore.test.ts   # Shopping cart functionality
│   └── emailService.test.ts # Email notification system
├── api/                    # API endpoint tests
│   └── payment.test.ts     # PromptPay QR generation
└── integration/            # End-to-end workflow tests
    └── checkout.test.ts    # Complete purchase flow
```

### Test Categories

#### 1. Unit Tests - Cart Management (`lib/cartStore.test.ts`)
**Tests cart state management using Zustand:**
- ✓ Initialize empty cart
- ✓ Add items to cart
- ✓ Handle duplicate items (quantity increment)
- ✓ Remove items from cart
- ✓ Update item quantities
- ✓ Clear entire cart
- ✓ Calculate correct totals

**Key Assertions:**
```typescript
- Cart starts empty
- Adding item increases count and total
- Same item twice increases quantity, not count
- Remove operations work correctly
- Total calculated: SUM(price × quantity)
```

#### 2. Unit Tests - Email Service (`lib/emailService.test.ts`)
**Tests email notification system:**
- ✓ Send order confirmation emails
- ✓ Send payment received notifications
- ✓ Send order shipped alerts
- ✓ Send delivery confirmation emails
- ✓ Include order details in templates
- ✓ Format currency correctly (Thai Baht: ฿)
- ✓ Handle SMTP errors gracefully

**Email Template Validation:**
```typescript
- Confirmation: Order ID, customer name, items, total
- Payment: Transaction confirmed, payment details
- Shipped: Tracking info, expected delivery
- Delivered: Confirmation, customer support info
```

#### 3. API Tests - Payment QR Generation (`api/payment.test.ts`)
**Tests PromptPay QR code endpoint:**
- ✓ Generate valid QR code for valid amounts
- ✓ Include order details in QR payload
- ✓ Reject missing required fields (amount, orderId)
- ✓ Validate amount > 0
- ✓ Generate unique QR codes for different orders
- ✓ Return proper error responses (400, 500)

**Expected Behavior:**
```typescript
POST /api/payment/generate-qr
Request: { amount: number, orderId: string, customerName: string }
Response: { qrCode: string, expiresAt?: timestamp }
Errors: { error: string, status: 400 | 500 }
```

#### 4. Integration Tests - Checkout Flow (`integration/checkout.test.ts`)
**Tests complete purchase workflow:**

**Phase 1: Browse & Add to Cart**
- Browse product catalog
- Click "Add to Cart"
- Verify item appears in cart
- Check total updates

**Phase 2: Review Cart**
- View all items
- See quantities and prices
- Verify total calculation
- Allow quantity modifications

**Phase 3: Checkout**
- Require user authentication
- Collect shipping information:
  - Full name
  - Email address
  - Phone number
  - Shipping address (street, subdistrict, district, province, postal code)
- Require "Final Sale" checkbox acceptance
- Create order in database

**Phase 4: Payment**
- Generate PromptPay QR code
- Display order summary
- Show payment instructions (5 steps)
- Provide test payment button (dev only)

**Phase 5: Confirmation**
- Send order confirmation email
- Redirect to order tracking page
- Mark order status as "pending_payment"
- Wait for admin approval

## Running Tests

### Installation
```bash
npm install
```

### Run All Tests
```bash
npm test
```

### Run Tests in Watch Mode
```bash
npm run test:watch
```

### Generate Coverage Report
```bash
npm run test:coverage
```

### Run Specific Test File
```bash
npm test -- cartStore.test.ts
```

## Test Coverage Targets

| Component | Coverage Target | Current |
|-----------|-----------------|---------|
| Cart Store | 95% | Pending |
| Email Service | 90% | Pending |
| Payment API | 85% | Pending |
| Checkout Flow | 80% | Pending |
| Overall | 85% | Pending |

## Mocked Dependencies

### Supabase
- `supabase.auth.*` (signUp, signInWithPassword, signOut, getUser)
- `supabase.from()` (CRUD operations)
- Configured in `jest.setup.js`

### Next.js
- `next/navigation` (useRouter, usePathname, useSearchParams)
- `next/server` (NextResponse, NextRequest)
- Automatically mocked by Jest

### Email Service
- `nodemailer.createTransport()` mocked
- Allows testing without real SMTP
- Returns mock message IDs

## Manual Testing Checklist

### Product Catalog
- [ ] Browse products list
- [ ] Filter by grade (if implemented)
- [ ] View product details
- [ ] See product images
- [ ] Check availability/quantity

### Shopping Cart
- [ ] Add product to cart
- [ ] See cart total update
- [ ] Modify quantities
- [ ] Remove items
- [ ] View cart summary

### Authentication
- [ ] Sign up new account
- [ ] Login with credentials
- [ ] Logout
- [ ] Redirect to login on checkout (no auth)
- [ ] Remember login state

### Checkout
- [ ] Checkout requires authentication
- [ ] Form validation works
- [ ] All required fields enforced
- [ ] Email format validation
- [ ] Phone number validation
- [ ] Final sale checkbox required
- [ ] Order created in database
- [ ] Confirmation email sent

### Payment Page
- [ ] PromptPay QR code displays
- [ ] Order summary shows correctly
- [ ] 5-step instructions are clear
- [ ] Test payment button works (dev)
- [ ] Page accessible via order ID

### Admin Dashboard
- [ ] Login as admin
- [ ] View pending orders
- [ ] View pending payments
- [ ] Mark payment as approved
- [ ] Payment email triggered
- [ ] Mark order as shipped
- [ ] Shipment email triggered
- [ ] Mark as delivered
- [ ] Delivery email triggered

### Email Delivery
- [ ] Order confirmation receives email
- [ ] Email contains order ID
- [ ] Email contains order items
- [ ] Email contains total (₿ formatted)
- [ ] Payment received email arrives
- [ ] Shipment email has tracking info
- [ ] Delivery email confirms arrival

## Known Test Limitations

1. **Authentication**: Full auth flow requires Supabase credentials
2. **Email**: Real SMTP testing requires credentials in `.env.local`
3. **Database**: Uses mocks; real data flow tested in staging
4. **Payment**: PromptPay QR validation tested at API level
5. **UI Components**: Component rendering tests not yet implemented

## Continuous Integration

Tests run automatically on:
- [ ] Push to development branch
- [ ] Pull requests
- [ ] Before production deployment

## Debugging Tests

### Run with debugging output
```bash
DEBUG=* npm test
```

### Run single test with verbose output
```bash
npm test -- --verbose cartStore.test.ts
```

### Check test file paths
```bash
npm test -- --listTests
```

## Future Test Improvements

- [ ] Add React component rendering tests (@testing-library/react)
- [ ] E2E tests with Playwright or Cypress
- [ ] API integration tests with real Supabase
- [ ] Performance benchmarks
- [ ] Visual regression testing
- [ ] Load testing for checkout flow
- [ ] Security testing (OWASP top 10)

## Contact & Support

For testing issues or questions:
- Email: techcraftlab.bkk@gmail.com
- Project: TC Collectibles x TechCraft Lab
