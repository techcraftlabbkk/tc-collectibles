#!/bin/bash
# TC Collectibles - Production Deployment Commands
# User: techcraftlab.bkk@gmail.com
# GitHub Username: techcraftlabbkk
# Created: May 2, 2026

# ============================================================
# STEP 1: Initialize & Push to GitHub
# ============================================================

echo "========================================="
echo "STEP 1: GitHub Repository Setup"
echo "========================================="

# Navigate to project directory
cd "/Users/stoyreo/Documents/Claude/Projects/TC Collectibles x TechCraft Lab"

# Check if git is already initialized
if [ -d .git ]; then
    echo "✓ Git repository already exists"
else
    echo "Initializing git repository..."
    git init
    git branch -M main
fi

# Add all files
echo "Adding files to git..."
git add .

# Create initial commit
echo "Creating initial commit..."
git commit -m "Initial TC Collectibles MVP Phase 1 - Ready for Production"

# Add GitHub remote (replace if needed)
echo ""
echo "Adding GitHub remote..."
echo "Repository URL: https://github.com/techcraftlabbkk/tc-collectibles"
echo ""
echo "IMPORTANT: Create this repository on GitHub first!"
echo "1. Go to https://github.com/new"
echo "2. Repository name: tc-collectibles"
echo "3. Description: TC Collectibles - Premium PSA Pokemon Marketplace"
echo "4. Public or Private: Public (for Vercel deployment)"
echo "5. Click 'Create repository'"
echo ""
echo "Then run these commands:"
echo ""

cat << 'EOF'
git remote add origin https://github.com/techcraftlabbkk/tc-collectibles.git
git push -u origin main
EOF

echo ""
echo "✓ Step 1 Complete: GitHub repository ready"

# ============================================================
# STEP 2: Prepare for Supabase Production
# ============================================================

echo ""
echo "========================================="
echo "STEP 2: Supabase Production Project"
echo "========================================="
echo ""
echo "1. Go to https://app.supabase.com"
echo "2. Click 'New Project'"
echo "3. Configure:"
echo "   - Name: TC Collectibles Production"
echo "   - Database Password: [Generate strong password]"
echo "   - Region: ap-southeast-1 (Singapore)"
echo "   - Pricing: Free tier"
echo "4. Wait for project creation (5-10 minutes)"
echo "5. Go to Project Settings → API"
echo "6. Copy these values:"
echo ""
echo "   - NEXT_PUBLIC_SUPABASE_URL = https://[project-id].supabase.co"
echo "   - NEXT_PUBLIC_SUPABASE_ANON_KEY = eyJ..."
echo "   - SUPABASE_SERVICE_ROLE_KEY = eyJ..."
echo ""
echo "7. Save these for STEP 4"
echo ""
echo "✓ Step 2 Complete: Supabase production project ready"

# ============================================================
# STEP 3: Gmail SMTP Configuration
# ============================================================

echo ""
echo "========================================="
echo "STEP 3: Email Service (Gmail SMTP)"
echo "========================================="
echo ""
echo "1. Go to https://myaccount.google.com/security"
echo "2. Enable '2-Step Verification' (if not done)"
echo "3. Go to https://myaccount.google.com/apppasswords"
echo "4. Select:"
echo "   - App: Mail"
echo "   - Device: Windows Computer (or your device)"
echo "5. Click 'Generate'"
echo "6. Copy the 16-character password"
echo ""
echo "7. You'll need these for STEP 5:"
echo "   - SMTP_FROM = techcraftlab.bkk@gmail.com"
echo "   - SMTP_USER = techcraftlab.bkk@gmail.com"
echo "   - SMTP_PASSWORD = [your-16-char-password]"
echo "   - SMTP_HOST = smtp.gmail.com"
echo "   - SMTP_PORT = 587"
echo ""
echo "✓ Step 3 Complete: Email service configured"

# ============================================================
# STEP 4: Vercel Deployment Setup
# ============================================================

echo ""
echo "========================================="
echo "STEP 4: Connect GitHub to Vercel"
echo "========================================="
echo ""
echo "1. Go to https://vercel.com/dashboard"
echo "2. Click 'Add New' → 'Project'"
echo "3. Search for: tc-collectibles"
echo "4. Click 'Import'"
echo "5. Select:"
echo "   - Framework: Next.js (auto-detected)"
echo "   - Project name: tc-collectibles"
echo "6. Click 'Continue'"
echo ""
echo "7. Configure Build Settings:"
echo "   - Build Command: npm run build"
echo "   - Output Directory: .next"
echo "   - Install Command: npm install"
echo ""
echo "8. Add Environment Variables (see STEP 5)"
echo ""
echo "✓ Step 4 Complete: Vercel project created"

# ============================================================
# STEP 5: Environment Variables
# ============================================================

echo ""
echo "========================================="
echo "STEP 5: Set Environment Variables"
echo "========================================="
echo ""
echo "Create .env.production file in project root with:"
echo ""
cat << 'EOF'
# Supabase Production
NEXT_PUBLIC_SUPABASE_URL=https://[your-project].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[your-anon-key]
SUPABASE_SERVICE_ROLE_KEY=[your-service-role-key]

# Email Configuration
SMTP_FROM=techcraftlab.bkk@gmail.com
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=techcraftlab.bkk@gmail.com
SMTP_PASSWORD=[your-16-char-app-password]

# PromptPay Configuration
PROMPTPAY_PHONE=09XXXXXXXXX
PROMPTPAY_NAME="TC Collectibles"

# Admin Email
ADMIN_EMAIL=techcraftlab.bkk@gmail.com
EOF

echo ""
echo "Then in Vercel Dashboard:"
echo "1. Go to Project Settings → Environment Variables"
echo "2. Add all variables above (select 'Production' scope)"
echo "3. Click 'Save'"
echo ""
echo "✓ Step 5 Complete: Environment variables configured"

# ============================================================
# STEP 6: Deploy
# ============================================================

echo ""
echo "========================================="
echo "STEP 6: Deploy to Vercel"
echo "========================================="
echo ""
echo "1. Push code to GitHub (from STEP 1)"
echo "2. Vercel will auto-detect the push"
echo "3. Deployment will start automatically"
echo "4. Wait for build to complete (2-5 minutes)"
echo "5. Check for green checkmark ✓"
echo ""
echo "Watch deployment at:"
echo "https://vercel.com/techcraftlabbkk/tc-collectibles"
echo ""
echo "✓ Step 6 Complete: Deployment started"

# ============================================================
# STEP 7: Verify Deployment
# ============================================================

echo ""
echo "========================================="
echo "STEP 7: Verify Production Deployment"
echo "========================================="
echo ""
echo "1. Visit your Vercel domain:"
echo "   https://tc-collectibles.vercel.app"
echo ""
echo "2. Test these features:"
echo "   ✓ Product catalog loads"
echo "   ✓ Add to cart works"
echo "   ✓ Create account / Login works"
echo "   ✓ Checkout form displays"
echo "   ✓ Payment page shows PromptPay QR"
echo "   ✓ Confirmation email arrives"
echo "   ✓ Admin dashboard is accessible"
echo ""
echo "3. Check Vercel dashboard:"
echo "   ✓ Deployment green"
echo "   ✓ No build errors"
echo "   ✓ All environment variables set"
echo ""
echo "4. Monitor first 24 hours:"
echo "   ✓ Error rate (should be ~0%)"
echo "   ✓ Email delivery"
echo "   ✓ Database performance"
echo ""
echo "✓ Step 7 Complete: Deployment verified"

echo ""
echo "========================================="
echo "🎉 DEPLOYMENT COMPLETE!"
echo "========================================="
echo ""
echo "Your application is now live!"
echo "Domain: https://tc-collectibles.vercel.app"
echo ""
echo "Next steps:"
echo "1. Share link with team"
echo "2. Run comprehensive testing"
echo "3. Add custom domain (optional)"
echo "4. Begin Phase 2 planning"
echo ""
