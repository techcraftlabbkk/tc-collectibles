# TC Collectibles - Production Deployment Guide

**Project:** TC Collectibles x TechCraft Lab  
**Target Launch:** May 16, 2026  
**Environment:** Vercel + Supabase (Production)  
**User:** techcraftlab.bkk@gmail.com

---

## Pre-Deployment Checklist

### Phase 1 Testing ✅
- [x] Unit tests created (cart, email, API)
- [x] Integration tests for checkout flow
- [x] Test configuration (jest.config.js)
- [x] Mock setup (jest.setup.js)
- [ ] Run all tests locally and verify passing
- [ ] Coverage report reviewed (target: 85%+)

### Code Preparation
- [ ] Type checking passes: `npm run type-check`
- [ ] Linting passes: `npm run lint`
- [ ] Build succeeds locally: `npm run build`
- [ ] No console errors in dev mode
- [ ] All environment variables configured

### Environment Configuration
- [ ] Production `.env.production` created
- [ ] Supabase production credentials obtained
- [ ] SMTP credentials configured (Gmail App Password)
- [ ] PromptPay merchant account number updated
- [ ] Domain name registered and verified

---

## Step 1: Prepare Vercel for Deployment

### 1.1 Create Vercel Account (if needed)
1. Go to https://vercel.com/signup
2. Sign up with GitHub, GitLab, or Bitbucket
3. Authorize Vercel to access your repositories

### 1.2 Install Vercel CLI (Optional but Recommended)
```bash
npm install -g vercel
```

### 1.3 Authenticate with Vercel
```bash
vercel login
# Follow prompts to authenticate
```

---

## Step 2: Prepare GitHub Repository

### 2.1 Create GitHub Repository (if not already done)
```bash
cd /Users/stoyreo/Documents/Claude/Projects/TC\ Collectibles\ x\ TechCraft\ Lab

# Initialize git if not already done
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial TC Collectibles MVP Phase 1 commit"

# Create main branch
git branch -M main

# Add remote (replace YOUR_USERNAME and YOUR_REPO)
git remote add origin https://github.com/YOUR_USERNAME/tc-collectibles.git

# Push to GitHub
git push -u origin main
```

### 2.2 Required Files in Root
Ensure these files exist:
- [x] `package.json` - Dependencies and scripts
- [x] `next.config.js` - Next.js configuration
- [x] `tsconfig.json` - TypeScript configuration
- [x] `tailwind.config.ts` - Tailwind CSS config
- [x] `postcss.config.js` - PostCSS configuration
- [x] `.gitignore` - Exclude node_modules, .next, .env.local
- [ ] `.env.example` - Example environment variables (no secrets!)

---

## Step 3: Set Up Production Supabase Project

### 3.1 Create Production Supabase Project
1. Go to https://app.supabase.com
2. Click "New Project"
3. Configure:
   - **Name:** TC Collectibles Production
   - **Database Password:** [Generate strong password]
   - **Region:** [Select closest to Thailand: ap-southeast-1 Singapore]
   - **Pricing Plan:** Free tier for MVP

### 3.2 Get Production Credentials
After project creation, obtain:
- **Project URL:** `https://[project-id].supabase.co`
- **Anon Key:** Public key for client-side auth
- **Service Role Key:** Admin key (keep secret!)
- **Database URL:** For server-side connections

### 3.3 Migrate Database Schema
1. Go to **SQL Editor** in Supabase console
2. Copy schema from your development project
3. Or run migrations:

```sql
-- Run all migrations from: /database/migrations/
-- Each file contains table definitions and indexes
```

**Tables to create:**
- `products` - PSA card inventory
- `orders` - Customer orders
- `order_items` - Line items per order
- `payments` - Payment records with proof images
- `users` (via auth) - Supabase Auth handles this

### 3.4 Enable Auth in Production
1. **Supabase Console** → **Authentication**
2. **Providers** → Enable Email/Password
3. **Policies** → Set up Row Level Security (RLS)
4. **Email Templates** → Review and customize

---

## Step 4: Configure Email Service (Gmail SMTP)

### 4.1 Enable Gmail App Password
1. Go to https://myaccount.google.com/security
2. **2-Step Verification:** Ensure enabled
3. **App passwords:** Create new app password
   - App: Mail
   - Device: Windows Computer (or your device)
   - Generate password (copy this!)

### 4.2 Update Environment Variables
Create `.env.production` in project root:

```env
# Supabase Production
NEXT_PUBLIC_SUPABASE_URL=https://[your-project].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ... [your-anon-key]
SUPABASE_SERVICE_ROLE_KEY=eyJ... [your-service-role-key]

# Email Configuration
SMTP_FROM=techcraftlab.bkk@gmail.com
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=techcraftlab.bkk@gmail.com
SMTP_PASSWORD=[your-app-password] # From step 4.1

# PromptPay Configuration
PROMPTPAY_PHONE=09XXXXXXXXX # Your actual merchant phone
PROMPTPAY_NAME="TC Collectibles" # Your business name

# Admin Email
ADMIN_EMAIL=techcraftlab.bkk@gmail.com
```

### 4.3 Test Email Configuration Locally
```bash
# Update .env.local with production values
cp .env.production .env.local

# Run test email
npm run dev
# Navigate to /payment/test-email
```

**Expected Result:** Confirmation email should arrive in inbox within 30 seconds.

---

## Step 5: Update PromptPay Configuration

### 5.1 Get Real Merchant Account (if applicable)
1. If you have a real PromptPay merchant account:
   - Update `PROMPTPAY_PHONE` in env
   - Verify phone number is registered with SCB

2. If testing with placeholder:
   - Keep current setup
   - Display notice: "Payment processing in demo mode"

### 5.2 Update QR Generation Logic
File: `app/api/payment/generate-qr/route.ts`

```typescript
// Verify merchant phone is configured
if (!process.env.PROMPTPAY_PHONE) {
  return NextResponse.json(
    { error: 'PromptPay not configured' },
    { status: 500 }
  )
}
```

---

## Step 6: Deploy to Vercel

### Option A: Deploy via Vercel CLI

```bash
# From project root
vercel --prod

# Follow prompts:
# ? Set up and deploy "~/...tc-collectibles"? [Y/n] → Y
# ? Which scope to deploy to? → Your-Username
# ? Link to existing project? [y/N] → y (if existing)
# ? Which existing project? → tc-collectibles
# ? In which directory is your code? → . (current)
```

### Option B: Deploy via GitHub (Recommended)

1. **Connect GitHub to Vercel:**
   - Go to https://vercel.com/dashboard
   - Click **"Add New..." → "Project"**
   - Select your GitHub repository
   - Click **"Import"**

2. **Configure Build Settings:**
   - **Framework:** Next.js (auto-detected)
   - **Build Command:** `npm run build`
   - **Output Directory:** `.next`
   - **Install Command:** `npm install`

3. **Add Environment Variables:**
   - Click **"Environment Variables"**
   - Add all variables from `.env.production`
   - Select scope: **Production**

4. **Deploy:**
   - Click **"Deploy"**
   - Wait for build to complete (2-5 minutes)
   - Verify green checkmark

---

## Step 7: Configure Custom Domain

### 7.1 Register Domain (if not done)
Popular providers:
- Namecheap.com
- Domain.com
- GoDaddy.com
- Thai domain registrar: DomainThailand.com

**Recommended domain examples:**
- tccollectibles.com
- pokemoncards.thai
- tcpokemarket.com

### 7.2 Add Domain to Vercel
1. **Vercel Dashboard** → Your Project
2. **Settings** → **Domains**
3. **Add Domain**
4. Enter your domain name
5. Follow Vercel's DNS instructions:

**Option A: Point Nameservers (Recommended)**
```
ns1.vercel-dns.com
ns2.vercel-dns.com
```
- Update at your domain registrar
- Wait for DNS propagation (up to 48 hours)

**Option B: Add CNAME Record**
```
CNAME: your-domain.com → [project-id].vercel.app
```

### 7.3 Verify Domain
- Click **"Verify"** in Vercel
- Wait for green checkmark
- Navigate to your domain in browser
- Should show your deployed site

---

## Step 8: Verify Production Deployment

### 8.1 Test Main Features
- [ ] Product catalog loads
- [ ] Add to cart works
- [ ] Login/signup functions
- [ ] Checkout flow completes
- [ ] Email notifications send
- [ ] PromptPay QR generates
- [ ] Admin dashboard accessible

### 8.2 Test with Real Data
1. Create test account via signup
2. Add products to cart
3. Complete checkout
4. Verify order in admin dashboard
5. Check email confirmation arrived
6. Mark payment approved in admin
7. Verify payment email sent

### 8.3 Monitor Deployment
- **Vercel Analytics:** Check build logs, performance metrics
- **Supabase:** Monitor database queries and auth
- **Email:** Verify SMTP is sending (Gmail settings → Security → Apps)

### 8.4 SSL Certificate
- Vercel automatically provisions SSL
- Check browser: URL should show 🔒 lock icon
- All pages should be HTTPS

---

## Step 9: Set Up Monitoring & Logging

### 9.1 Enable Vercel Analytics
1. **Vercel Dashboard** → Project → **Analytics**
2. Monitor:
   - Page load times
   - Core Web Vitals
   - Error rates

### 9.2 Check Supabase Logs
1. **Supabase Console** → **Database**
2. Monitor:
   - Query performance
   - Authentication events
   - API usage

### 9.3 Email Delivery Monitoring
1. **Gmail Inbox** → Search for TC emails
2. Check:
   - Delivery rate
   - Bounce rate (should be 0%)
   - Spam folder (should be empty)

---

## Step 10: Production Checklist & Launch

### Pre-Launch Final Check
- [ ] All tests passing locally (`npm test`)
- [ ] Build succeeds locally (`npm run build`)
- [ ] Type checking passes (`npm run type-check`)
- [ ] No console errors in production
- [ ] Domain configured and accessible
- [ ] HTTPS certificate valid
- [ ] Email service tested and working
- [ ] Supabase production data migrated
- [ ] Admin account created and tested
- [ ] PromptPay phone number updated
- [ ] Database backups scheduled
- [ ] Error monitoring enabled

### Launch Readiness
- [ ] Product catalog populated
- [ ] Test payment processed
- [ ] Customer receives confirmation email
- [ ] Admin receives order notification
- [ ] Team trained on admin dashboard
- [ ] Support email monitored
- [ ] Uptime monitoring configured

### Go-Live Announcement
1. **Social Media:** Announce launch
2. **Email:** Send to waitlist
3. **Domain:** Ensure landing page ready
4. **Team:** Brief all support staff

---

## Post-Deployment Maintenance

### Daily (Automated)
- Monitor error rates
- Check database performance
- Review failed email deliveries

### Weekly
- Review user feedback
- Check admin order queue
- Verify backup integrity
- Monitor Vercel analytics

### Monthly
- Review infrastructure costs
- Plan feature enhancements
- Update security configurations
- Analysis payment volume trends

---

## Rollback Procedure (if needed)

### Vercel Rollback
1. **Vercel Dashboard** → Deployments
2. Find previous successful deployment
3. Click **"Promote to Production"**
4. Verify previous version is live

### Database Rollback
1. **Supabase Console** → Backups
2. Restore from latest backup
3. Verify data integrity
4. Notify team of rollback

---

## Cost Estimates (Monthly)

| Service | Free Tier | Production Estimated |
|---------|-----------|----------------------|
| Vercel | $0-20 | $20-50 |
| Supabase | $0-25 | $25-100 |
| Gmail SMTP | $0 | $0 |
| Domain | $10-15 | $10-15 |
| **Total** | **$10-60** | **$55-165** |

*Costs scale with traffic; free tier sufficient for MVP launch*

---

## Troubleshooting

### Deployment Fails
```bash
# Check build locally
npm run build

# Check for TypeScript errors
npm run type-check

# Check dependencies
npm install
```

### Emails Not Sending
1. Verify SMTP credentials in Vercel env
2. Check Gmail 2FA app password
3. Allow "Less secure apps" in Gmail (if needed)
4. Check email logs: Supabase → Database → query

### Database Connection Issues
1. Verify Supabase URL and keys
2. Check Network tab: Vercel can reach Supabase
3. Review Supabase logs for errors
4. Verify RLS policies allow access

### Domain Not Resolving
1. Wait up to 48 hours for DNS propagation
2. Clear browser cache (Ctrl+Shift+Delete)
3. Verify DNS records in domain registrar
4. Use https://dnschecker.org to verify

---

## Support & Questions

**Email:** techcraftlab.bkk@gmail.com  
**Project Folder:** `/Users/stoyreo/Documents/Claude/Projects/TC Collectibles x TechCraft Lab/`

**Resources:**
- [Vercel Docs](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Supabase Guide](https://supabase.com/docs)
- [Gmail SMTP Setup](https://support.google.com/mail/answer/185833)

---

## Deployment Status

**Status:** ✅ Guide Complete - Ready for Deployment  
**Next Step:** Execute deployment following this guide  
**Target Date:** May 16, 2026

Created: May 2, 2026
