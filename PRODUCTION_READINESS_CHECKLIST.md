# TC Collectibles - Production Readiness Checklist

**Target Launch Date:** May 16, 2026 (14 days from May 2)  
**Project:** TC Collectibles x TechCraft Lab  
**Phase:** 1 - MVP Marketplace

---

## 📋 Pre-Deployment Tasks

### Development & Testing (Task #1) ✅
- [x] Unit tests created (cart, email, payment API)
- [x] Integration tests for checkout flow
- [x] Jest configuration (jest.config.js, jest.setup.js)
- [x] Testing documentation (TESTING_GUIDE.md)
- [ ] **TODO:** Run `npm test` and verify all tests pass
- [ ] **TODO:** Generate coverage report (`npm run test:coverage`)
- [ ] **TODO:** Verify coverage ≥ 85%

### Code Quality
- [ ] **TODO:** Run `npm run type-check` - should have 0 errors
- [ ] **TODO:** Run `npm run lint` - should have 0 errors
- [ ] **TODO:** Run `npm run build` - build succeeds
- [ ] **TODO:** Test locally: `npm run dev` and verify no console errors
- [ ] **TODO:** Verify all dark mode styles work on mobile
- [ ] **TODO:** Test responsive design (mobile, tablet, desktop)

### Version Control
- [ ] **TODO:** Create GitHub repository (if not done)
- [ ] **TODO:** Commit all code to main branch
- [ ] **TODO:** Verify .gitignore excludes node_modules, .env.local, .next
- [ ] **TODO:** Create `.env.example` with all required variables (without secrets)

---

## 🚀 Deployment Tasks (Task #2)

### Infrastructure Setup
- [ ] **TODO:** Create Vercel account (if needed)
- [ ] **TODO:** Create production Supabase project
  - [ ] Project name: "TC Collectibles Production"
  - [ ] Region: ap-southeast-1 (Singapore - closest to Thailand)
  - [ ] Database password: [SECURE]
- [ ] **TODO:** Get Supabase production credentials:
  - [ ] NEXT_PUBLIC_SUPABASE_URL
  - [ ] NEXT_PUBLIC_SUPABASE_ANON_KEY
  - [ ] SUPABASE_SERVICE_ROLE_KEY
- [ ] **TODO:** Migrate database schema to production
  - [ ] Create products table
  - [ ] Create orders table
  - [ ] Create order_items table
  - [ ] Create payments table
  - [ ] Set up RLS policies
  - [ ] Create indexes for performance

### Email Service Configuration
- [ ] **TODO:** Enable Gmail 2-Step Verification (if not done)
- [ ] **TODO:** Generate Gmail App Password
- [ ] **TODO:** Test SMTP locally (with app password)
- [ ] **TODO:** Verify confirmation email is received
- [ ] **TODO:** Verify email formatting is correct
- [ ] **TODO:** Add SMTP credentials to production environment

### PromptPay Setup
- [ ] **TODO:** Verify merchant phone number is correct
- [ ] **TODO:** Update PROMPTPAY_PHONE in .env.production
- [ ] **TODO:** Update PROMPTPAY_NAME with business name
- [ ] **TODO:** Test QR code generation locally
- [ ] **TODO:** Verify QR code can be scanned

### Domain Configuration
- [ ] **TODO:** Register domain (or use existing)
- [ ] **TODO:** Add domain to Vercel project
- [ ] **TODO:** Configure DNS records:
  - [ ] Option A: Update nameservers to Vercel
  - [ ] Option B: Add CNAME record
- [ ] **TODO:** Verify domain is accessible
- [ ] **TODO:** Verify HTTPS certificate is valid (🔒 icon)

### Vercel Deployment
- [ ] **TODO:** Connect GitHub repository to Vercel
- [ ] **TODO:** Configure build settings:
  - [ ] Framework: Next.js
  - [ ] Build Command: `npm run build`
  - [ ] Output Directory: `.next`
- [ ] **TODO:** Add all environment variables to Vercel (Production scope)
- [ ] **TODO:** Deploy to production
- [ ] **TODO:** Verify build succeeds (green checkmark)
- [ ] **TODO:** Verify deployment is live

---

## ✅ Production Verification

### Feature Testing in Production
- [ ] **TODO:** Product catalog loads from production database
- [ ] **TODO:** Product images display correctly
- [ ] **TODO:** Add to cart works
- [ ] **TODO:** Cart total updates correctly
- [ ] **TODO:** Create new user account
- [ ] **TODO:** Login with new credentials
- [ ] **TODO:** Logout clears session
- [ ] **TODO:** Protected pages redirect to login
- [ ] **TODO:** Checkout form submission creates order
- [ ] **TODO:** Order confirmation email arrives (check inbox)
- [ ] **TODO:** Email contains correct order details and total
- [ ] **TODO:** Payment page displays PromptPay QR code
- [ ] **TODO:** QR code is scannable
- [ ] **TODO:** Admin dashboard is accessible
- [ ] **TODO:** Admin can view pending orders
- [ ] **TODO:** Admin can mark payment as approved
- [ ] **TODO:** Payment email is triggered after approval
- [ ] **TODO:** Admin can update order status
- [ ] **TODO:** Shipment email is triggered
- [ ] **TODO:** Delivery email is triggered

### Performance & Monitoring
- [ ] **TODO:** Check Vercel Analytics
  - [ ] First Contentful Paint (FCP) < 2s
  - [ ] Largest Contentful Paint (LCP) < 2.5s
  - [ ] Cumulative Layout Shift (CLS) < 0.1
- [ ] **TODO:** Verify database performance (Supabase dashboard)
- [ ] **TODO:** Check error rates (should be near 0%)
- [ ] **TODO:** Monitor API response times
- [ ] **TODO:** Verify backups are scheduled

### Security Checklist
- [ ] **TODO:** HTTPS enabled (verify URL shows 🔒)
- [ ] **TODO:** Environment variables NOT visible in source code
- [ ] **TODO:** .env.local NOT committed to Git
- [ ] **TODO:** Service role key only used server-side (API routes)
- [ ] **TODO:** No API keys exposed in frontend code
- [ ] **TODO:** Verify RLS policies on Supabase (users can only access own orders)
- [ ] **TODO:** Verify admin routes are protected
- [ ] **TODO:** Confirm SMTP credentials are not logged

### Browser & Device Testing
- [ ] **TODO:** Test on Chrome (desktop)
- [ ] **TODO:** Test on Firefox (desktop)
- [ ] **TODO:** Test on Safari (desktop)
- [ ] **TODO:** Test on Chrome (mobile - iPhone/Android)
- [ ] **TODO:** Test on Safari (mobile - iPhone)
- [ ] **TODO:** Verify dark mode CSS works
- [ ] **TODO:** Verify responsive layout on all screen sizes
- [ ] **TODO:** Test form input on mobile (keyboard doesn't hide content)
- [ ] **TODO:** Verify touch-friendly button sizes

### Payment Flow Testing (Complete End-to-End)
1. **As Customer:**
   - [ ] Browse products
   - [ ] Add items to cart
   - [ ] Navigate to checkout
   - [ ] Fill in shipping information
   - [ ] Accept final sale checkbox
   - [ ] Submit order
   - [ ] View payment page with QR code
   - [ ] Receive confirmation email

2. **As Admin:**
   - [ ] Login to admin dashboard
   - [ ] See pending order in list
   - [ ] View order details
   - [ ] See pending payment
   - [ ] Mark payment as approved
   - [ ] Confirm payment email sent to customer
   - [ ] Update order status to "shipped"
   - [ ] Confirm shipment email sent
   - [ ] Update order status to "delivered"
   - [ ] Confirm delivery email sent

---

## 📊 Performance Benchmarks

| Metric | Target | Status |
|--------|--------|--------|
| Page Load Time | < 3s | [ ] |
| First Contentful Paint | < 2s | [ ] |
| Time to Interactive | < 4s | [ ] |
| Largest Contentful Paint | < 2.5s | [ ] |
| Cumulative Layout Shift | < 0.1 | [ ] |
| Core Web Vitals | All Green | [ ] |
| API Response Time | < 200ms | [ ] |
| Database Query Time | < 100ms | [ ] |
| Image Load Time | < 1s | [ ] |
| Email Delivery | < 30s | [ ] |

---

## 📧 Email Verification Checklist

- [ ] **TODO:** Order Confirmation
  - [ ] Email arrives within 30 seconds
  - [ ] Shows order ID
  - [ ] Lists all items with quantities
  - [ ] Shows correct total (₿ formatted)
  - [ ] Includes customer name
  - [ ] Professional HTML template
  - [ ] Links are clickable
  - [ ] Not marked as spam

- [ ] **TODO:** Payment Received
  - [ ] Triggered after admin approval
  - [ ] Confirms payment received
  - [ ] Shows order status: "paid"
  - [ ] Provides next steps

- [ ] **TODO:** Order Shipped
  - [ ] Triggered after status update
  - [ ] Includes order number
  - [ ] Shows items being shipped
  - [ ] Professional formatting

- [ ] **TODO:** Order Delivered
  - [ ] Triggered after delivery status update
  - [ ] Confirms delivery
  - [ ] Provides support contact
  - [ ] Encourages feedback/review

---

## 💾 Data & Backup

- [ ] **TODO:** Initial product data loaded in production
- [ ] **TODO:** Test products have realistic prices (in Thai Baht)
- [ ] **TODO:** Test products have images
- [ ] **TODO:** Supabase automated backups configured
- [ ] **TODO:** Manual backup created before launch
- [ ] **TODO:** Backup restoration procedure documented

---

## 👥 Team & Documentation

- [ ] **TODO:** Admin account created and tested
- [ ] **TODO:** Team trained on admin dashboard
  - [ ] How to view orders
  - [ ] How to approve payments
  - [ ] How to update shipping status
  - [ ] How to handle issues
- [ ] **TODO:** Support email monitored daily
- [ ] **TODO:** Error monitoring set up (Vercel dashboard)
- [ ] **TODO:** Runbook created for common issues
- [ ] **TODO:** Rollback procedure documented

---

## 📢 Launch Preparation

- [ ] **TODO:** Website landing page ready
- [ ] **TODO:** Social media accounts set up (if applicable)
- [ ] **TODO:** Launch announcement drafted
- [ ] **TODO:** Customer email list prepared (if applicable)
- [ ] **TODO:** Terms of Service written
- [ ] **TODO:** Privacy Policy written
- [ ] **TODO:** FAQ page created
- [ ] **TODO:** Contact/Support form working

---

## 🎯 Go/No-Go Decision

### Go-Live Criteria (All must be checked)
- [ ] All critical tests passing
- [ ] Performance benchmarks met
- [ ] Security review passed
- [ ] Team training complete
- [ ] Monitoring/logging configured
- [ ] Rollback procedure documented
- [ ] Support ready

### Go-Live Decision
**Decision Date:** ___________

**Decision:** 
- [ ] GO - Launch on May 16, 2026
- [ ] NO-GO - Delay launch, continue development

**Reason:** _______________________________________________________________

**Approved By:** _________________________ **Date:** __________

---

## 🔄 Post-Launch Monitoring (First Week)

- [ ] Monitor Vercel dashboard daily
- [ ] Check Supabase performance
- [ ] Review error logs
- [ ] Verify email delivery (check Gmail)
- [ ] Monitor database storage
- [ ] Check customer feedback
- [ ] Address any urgent issues
- [ ] Daily backup verification

---

## 📞 Support Contacts

| Role | Contact | Status |
|------|---------|--------|
| Project Lead | techcraftlab.bkk@gmail.com | ✓ |
| Technical Support | techcraftlab.bkk@gmail.com | [ ] |
| Admin Email | techcraftlab.bkk@gmail.com | [ ] |
| Escalation | techcraftlab.bkk@gmail.com | [ ] |

---

## Notes & Issues

### Critical Issues Found
```
[Use this section to document any issues discovered during deployment]
```

### Resolved Issues
```
[Document fixes applied]
```

### Post-Launch Follow-ups
- [ ] Monitor for 24-48 hours continuously
- [ ] Daily checks for first week
- [ ] Weekly reviews for first month

---

## Sign-Off

**Deployed By:** _________________________ **Date:** __________

**Tested By:** _________________________ **Date:** __________

**Approved By:** _________________________ **Date:** __________

---

**Checklist Status:** 🚀 Ready to Deploy!
