# 🚀 TC Collectibles - Live Deployment Guide
## Production Launch - May 2, 2026

**GitHub Username:** techcraftlabbkk  
**Repository:** https://github.com/techcraftlabbkk/tc-collectibles  
**Deployment Target:** Vercel  
**Domain:** tc-collectibles.vercel.app (+ custom domain optional)  
**Timeline:** ~1-2 hours for deployment, 24-48 hours monitoring

---

## ✅ STEP 1: Create GitHub Repository (5 minutes)

### Action Items
- [ ] Go to https://github.com/new
- [ ] Repository name: `tc-collectibles`
- [ ] Description: "TC Collectibles - Premium PSA Pokemon Marketplace"
- [ ] Set to **Public** (required for Vercel)
- [ ] Click **"Create repository"**

### Copy Repository URL
After creation, you'll see the HTTPS URL:
```
https://github.com/techcraftlabbkk/tc-collectibles.git
```

---

## ✅ STEP 2: Push Code to GitHub (5 minutes)

### Open Terminal & Run These Commands

Navigate to project:
```bash
cd "/Users/stoyreo/Documents/Claude/Projects/TC Collectibles x TechCraft Lab"
```

Initialize Git (if not done):
```bash
git init
git branch -M main
```

Add all files:
```bash
git add .
```

Commit:
```bash
git commit -m "Initial TC Collectibles MVP Phase 1 - Ready for Production"
```

Add GitHub remote:
```bash
git remote add origin https://github.com/techcraftlabbkk/tc-collectibles.git
```

Push to GitHub:
```bash
git push -u origin main
```

### Expected Output
```
Enumerating objects: XXX, done.
Counting objects: 100% (XXX/XXX), done.
...
To https://github.com/techcraftlabbkk/tc-collectibles.git
 * [new branch]      main -> main
Branch 'main' set up to track remote branch 'main' from 'origin'.
```

✅ **GitHub Step Complete** - Code is now on GitHub!

---

## ✅ STEP 3: Create Supabase Production Project (10 minutes)

### Action Items
1. Go to https://app.supabase.com
2. Click **"New Project"**
3. Configure:
   - **Name:** `TC Collectibles Production`
   - **Database Password:** [Generate strong 16+ char password]
   - **Region:** `ap-southeast-1 (Singapore)` ← Choose this (closest to Thailand)
   - **Pricing:** Free tier
4. Click **"Create new project"**
5. **Wait 5-10 minutes** for project to initialize

### Get Production Credentials

Once project is ready:
1. Go to **Settings** → **API**
2. Copy these values and **save them**:

```
NEXT_PUBLIC_SUPABASE_URL = https://[project-id].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = eyJ...
SUPABASE_SERVICE_ROLE_KEY = eyJ...
```

⚠️ **Keep these secret!** Never share or commit to Git.

✅ **Supabase Step Complete** - Production database ready!

---

## ✅ STEP 4: Configure Email Service (5 minutes)

### Gmail Setup

1. Go to https://myaccount.google.com/security
2. Verify **2-Step Verification** is enabled
3. Go to https://myaccount.google.com/apppasswords
4. Select:
   - **App:** `Mail`
   - **Device:** `Windows Computer` (or your device)
5. Click **"Generate"**
6. **Copy the 16-character password** (you'll need this next)

### Email Credentials to Save

```
SMTP_FROM = techcraftlab.bkk@gmail.com
SMTP_USER = techcraftlab.bkk@gmail.com
SMTP_PASSWORD = [your-16-char-password]
SMTP_HOST = smtp.gmail.com
SMTP_PORT = 587
```

✅ **Email Step Complete** - SMTP configured!

---

## ✅ STEP 5: Connect GitHub to Vercel (5 minutes)

### Action Items

1. Go to https://vercel.com/dashboard
2. Click **"Add New"** → **"Project"**
3. Click **"Import Git Repository"**
4. Paste your repository URL:
   ```
   https://github.com/techcraftlabbkk/tc-collectibles.git
   ```
5. Click **"Continue"**
6. Vercel will detect it as a **Next.js** project (auto)
7. Set **Project Name:** `tc-collectibles`
8. Click **"Continue"**

### Build Settings (Should auto-detect)
- **Framework:** Next.js ✓
- **Build Command:** `npm run build` ✓
- **Output Directory:** `.next` ✓
- **Install Command:** `npm install` ✓

### ✅ Click "Deploy" - BUT WAIT!
**Don't click deploy yet** - we need to add environment variables first!

Go to **"Environment Variables"** section

---

## ✅ STEP 6: Add Environment Variables (5 minutes)

### In Vercel Dashboard Environment Variables Section

Add these variables (select **Production** scope):

```
NEXT_PUBLIC_SUPABASE_URL=https://[your-project].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[your-anon-key]
SUPABASE_SERVICE_ROLE_KEY=[your-service-role-key]
SMTP_FROM=techcraftlab.bkk@gmail.com
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=techcraftlab.bkk@gmail.com
SMTP_PASSWORD=[your-16-char-app-password]
PROMPTPAY_PHONE=09XXXXXXXXX
PROMPTPAY_NAME=TC Collectibles
ADMIN_EMAIL=techcraftlab.bkk@gmail.com
```

⚠️ **Each variable must be added individually** - click "Add" after each one

### Verification
- [ ] All 11 variables added
- [ ] Scope set to **"Production"**
- [ ] No typos in values

✅ **Environment Variables Complete** - Ready to deploy!

---

## ✅ STEP 7: Deploy to Vercel (2-5 minutes)

### Action Items

1. Return to main deployment page
2. Click **"Deploy"**
3. Watch the build progress on screen
4. **Wait for green checkmark** ✓

### Expected Timeline
- Deployment starts: < 1 minute
- Building code: 2-3 minutes
- Total: 2-5 minutes

### Success Indicator
```
✓ Production deployment successful
  URL: https://tc-collectibles.vercel.app
```

**Save this URL** - this is your live marketplace!

✅ **Deployment Complete** - App is live!

---

## ✅ STEP 8: Verify Production Deployment (10 minutes)

### Test Your Live Site

1. **Visit:** https://tc-collectibles.vercel.app
2. **In browser console** (F12), verify no red errors

### Feature Testing

- [ ] **Product Catalog** loads
  - See products list
  - Images display correctly
  
- [ ] **Add to Cart** works
  - Click "Add to Cart"
  - See cart total update
  
- [ ] **Authentication** works
  - Try signup (new email)
  - Try login
  - Try logout
  
- [ ] **Checkout** works
  - Click checkout
  - Form displays
  - All fields required
  
- [ ] **Payment Page** displays
  - See PromptPay QR code
  - See 5-step instructions
  - See order summary

### Email Testing

1. Complete a test checkout with real email
2. **Check email inbox** (wait up to 1 minute)
3. Verify **Confirmation email received**
   - [ ] Contains Order ID
   - [ ] Shows order items
   - [ ] Shows total (฿ symbol)
   - [ ] Professional formatting

### Admin Testing

1. Go to **https://tc-collectibles.vercel.app/admin**
2. Login with admin credentials
3. Verify dashboard loads:
   - [ ] See pending orders
   - [ ] Can view order details
   - [ ] Can see pending payments

### Performance Check

1. Open **Vercel Dashboard**
2. Check **Deployment Status:** Green ✓
3. Check **Build Logs:** No errors
4. Check **Environment Variables:** All set ✓

---

## ✅ STEP 9: 24-Hour Monitoring (Ongoing)

### Daily Checks (First 3 Days)

**Morning Check:**
- [ ] Visit site - no errors
- [ ] Check Vercel dashboard for issues
- [ ] Check Supabase dashboard for errors

**Send Test Order:**
- [ ] Complete test purchase
- [ ] Verify email arrives
- [ ] Check Supabase for order record

**Monitor Errors:**
- [ ] Vercel → Deployments → Logs
- [ ] Supabase → Logs
- [ ] Check Gmail for failed sends

### Weekly Monitoring

- [ ] Review analytics (Vercel dashboard)
- [ ] Check error rates
- [ ] Monitor database performance
- [ ] Review email delivery logs

---

## 🎯 Success Checklist

### Deployment Success
- [x] GitHub repository created
- [x] Code pushed to GitHub
- [x] Supabase production project created
- [x] Email service configured
- [x] Environment variables added to Vercel
- [x] Deployed to Vercel
- [x] Green checkmark on deployment
- [x] Site accessible at vercel.app domain

### Feature Verification
- [x] Product catalog loads
- [x] Shopping cart works
- [x] Authentication works
- [x] Checkout completes
- [x] Payment page displays QR
- [x] Confirmation email arrives
- [x] Admin dashboard accessible
- [x] No console errors

### Production Readiness
- [x] HTTPS certificate (automatic)
- [x] All environment variables set
- [x] Email delivery confirmed
- [x] Database connected
- [x] Monitoring enabled
- [x] No critical errors

---

## 🚀 Go-Live Announcement

### You're Live! 🎉

**Share these links:**

**Public Site:**
```
https://tc-collectibles.vercel.app
```

**Admin Access:**
```
https://tc-collectibles.vercel.app/admin
(Login with your credentials)
```

### Team Notification Template

```
🚀 TC Collectibles Phase 1 is LIVE!

Marketplace: https://tc-collectibles.vercel.app

Features Live:
✓ Premium PSA Pokemon card marketplace
✓ Shopping cart system
✓ Secure checkout with PromptPay
✓ Email notifications
✓ Admin dashboard

Admin Access: https://tc-collectibles.vercel.app/admin

Please test and provide feedback!
```

---

## ⚠️ Troubleshooting

### Deployment Failed
- Check: All environment variables set correctly
- Check: No typos in URLs or keys
- Check: GitHub repository is public
- Solution: Redeploy from Vercel dashboard

### Site Shows Error
- Check: Environment variables in Vercel dashboard
- Check: Supabase project is active
- Check: Build logs for specific errors
- Solution: View Vercel logs, fix issue, redeploy

### Emails Not Sending
- Check: SMTP credentials are correct
- Check: Gmail 2FA app password is 16 characters
- Check: SMTP_FROM matches Gmail account
- Solution: Update variables in Vercel, redeploy

### Can't Access Admin
- Check: User is logged in
- Check: Database has admin role set
- Solution: Update user role in Supabase

---

## 📞 Need Help?

**Refer to:**
- DEPLOYMENT_GUIDE.md - Detailed explanation of each step
- PRODUCTION_READINESS_CHECKLIST.md - Comprehensive verification checklist
- Test files in __tests__/ - Code quality validation

**Contact:** techcraftlab.bkk@gmail.com

---

## 📊 Deployment Status

| Step | Task | Status | Duration |
|------|------|--------|----------|
| 1 | GitHub Repository | [ ] | 5 min |
| 2 | Push to GitHub | [ ] | 5 min |
| 3 | Supabase Production | [ ] | 10 min |
| 4 | Email Service | [ ] | 5 min |
| 5 | Connect to Vercel | [ ] | 5 min |
| 6 | Environment Variables | [ ] | 5 min |
| 7 | Deploy | [ ] | 5 min |
| 8 | Verify | [ ] | 10 min |
| 9 | Monitor | [ ] | Ongoing |
| **TOTAL** | | | **~55 min** |

---

**Status: Ready to Launch** 🚀

**Next: Follow steps 1-9 in order above**

Created: May 2, 2026
