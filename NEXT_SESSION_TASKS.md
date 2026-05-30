# Quick Task List for Next Session

## 🚀 IMMEDIATE ACTIONS (Start Here)

### 1. Verify Deployment is Live
- [ ] Check https://tc-collectibles.vercel.app loads
- [ ] No 500 errors or server exceptions
- [ ] Homepage renders correctly

### 2. Test Core User Flows
- [ ] Browse products page works
- [ ] Filter/search functionality works
- [ ] Add product to cart works
- [ ] View cart shows correct items
- [ ] Checkout form accepts input

### 3. Test Payment Flow
- [ ] Proceed to checkout creates order
- [ ] PromptPay QR code displays
- [ ] Order appears in admin dashboard

### 4. Email Configuration
- [ ] Set SMTP credentials in Vercel environment:
  - `SMTP_FROM` = techcraftlab.bkk@gmail.com
  - `SMTP_PASSWORD` = (get from user)
- [ ] Send test order and verify email arrives

### 5. Admin Testing
- [ ] Login to admin dashboard (/admin)
- [ ] View orders list
- [ ] View order details
- [ ] Try product management (add/edit/delete)

---

## 📋 STATUS INDICATORS

| Component | Status | Notes |
|-----------|--------|-------|
| Build | ✅ PASS | Deployment 7M8jQJMeY Ready Latest |
| Homepage | ✅ LIVE | App is running at vercel.app |
| Products Page | ? TEST | Need to verify in browser |
| Cart | ? TEST | Need to verify add/remove |
| Checkout | ? TEST | Critical path - highest priority |
| Payment QR | ? TEST | Must verify PromptPay generation |
| Emails | ? CONFIG | Need SMTP credentials set |
| Admin | ? TEST | Need to verify dashboard works |
| Database | ? TEST | Verify orders/items stored correctly |

---

## 🔧 GITHUB REFERENCE

```bash
# To pull latest changes in next session:
git clone https://github.com/techcraftlabbkk/tc-collectibles.git
cd tc-collectibles
git checkout main
# Latest commit: caedd9a
```

---

## 📍 CRITICAL FILES TO REVIEW

1. `HANDOFF_NEXT_SESSION.md` ← Full context doc
2. `app/checkout/page.tsx` - Order creation logic
3. `app/payment/[orderId]/page.tsx` - QR code display
4. `lib/emailService.ts` - Email configuration
5. `app/admin/page.tsx` - Admin dashboard

---

## ⚠️ BLOCKERS TO WATCH FOR

- ❌ If email doesn't send → Check SMTP env vars in Vercel
- ❌ If QR code blank → Check PromptPay phone in env vars
- ❌ If orders not appearing → Check Supabase connection
- ❌ If 500 errors → Check browser console and Vercel logs

---

## 💡 SUCCESS CRITERIA FOR THIS SESSION

All of these should show green:
- ✅ App loads without errors
- ✅ Products can be browsed
- ✅ Cart works (add/remove items)
- ✅ Checkout can complete (creates order)
- ✅ Orders visible in admin
- ✅ Emails send successfully (if SMTP configured)

---

**Handoff Document:** `/HANDOFF_NEXT_SESSION.md`  
**Live App:** `https://tc-collectibles.vercel.app`  
**Ready to Test:** ✅ YES
