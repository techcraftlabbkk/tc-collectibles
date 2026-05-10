#!/bin/bash

# TC Collectibles - Master Automation Script
# Runs all automation in sequence
# Usage: bash scripts/run-all.sh [phase]
# Phases: verify, test, deploy, all

set -e

echo "╔════════════════════════════════════════════╗"
echo "║   TC COLLECTIBLES - MASTER AUTOMATION      ║"
echo "║        Complete Testing & Deployment      ║"
echo "╚════════════════════════════════════════════╝"
echo ""

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Get phase from argument or default to "all"
PHASE="${1:-all}"

MASTER_REPORT="automation-report-$(date +%Y%m%d-%H%M%S).md"

cat > "$MASTER_REPORT" << EOF
# TC Collectibles - Master Automation Report
**Generated:** $(date)
**Phase:** $PHASE

---

## Execution Log

EOF

# Function to run a step
run_step() {
    local name="$1"
    local script="$2"
    local description="$3"

    echo ""
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${YELLOW}▶ $name${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""

    echo "## $name" >> "$MASTER_REPORT"
    echo "$description" >> "$MASTER_REPORT"
    echo "" >> "$MASTER_REPORT"

    if [ -f "$script" ]; then
        if bash "$script" >> "$MASTER_REPORT" 2>&1; then
            echo -e "${GREEN}✓ $name completed successfully${NC}"
            echo "**Status:** ✅ PASSED" >> "$MASTER_REPORT"
        else
            echo -e "${RED}✗ $name failed${NC}"
            echo "**Status:** ❌ FAILED" >> "$MASTER_REPORT"
        fi
    else
        echo -e "${RED}✗ Script not found: $script${NC}"
        echo "**Status:** ❌ SCRIPT NOT FOUND" >> "$MASTER_REPORT"
    fi

    echo "" >> "$MASTER_REPORT"
}

# Phase: Verify
if [ "$PHASE" = "verify" ] || [ "$PHASE" = "all" ]; then
    echo ""
    echo -e "${YELLOW}📋 PHASE 1: VERIFICATION${NC}"
    echo ""

    echo "# PHASE 1: VERIFICATION" >> "$MASTER_REPORT"
    echo "" >> "$MASTER_REPORT"

    # Run verify setup
    echo -e "${YELLOW}Running setup verification...${NC}"
    if node scripts/verify-setup.js; then
        echo -e "${GREEN}✓ Setup verification passed${NC}"
    else
        echo -e "${RED}✗ Setup verification failed${NC}"
        echo "Fix the issues above before proceeding."
        exit 1
    fi

    echo "" >> "$MASTER_REPORT"
    echo "---" >> "$MASTER_REPORT"
    echo "" >> "$MASTER_REPORT"
fi

# Phase: Test
if [ "$PHASE" = "test" ] || [ "$PHASE" = "all" ]; then
    echo ""
    echo -e "${YELLOW}🧪 PHASE 2: TESTING PREPARATION${NC}"
    echo ""

    echo "# PHASE 2: TESTING PREPARATION" >> "$MASTER_REPORT"
    echo "" >> "$MASTER_REPORT"

    run_step \
        "Testing Preparation" \
        "scripts/automated-testing.sh" \
        "Automated environment setup and testing preparation"

    echo "" >> "$MASTER_REPORT"
    echo "---" >> "$MASTER_REPORT"
    echo "" >> "$MASTER_REPORT"

    echo ""
    echo -e "${YELLOW}📝 TESTING INSTRUCTIONS:${NC}"
    echo ""
    echo "Your environment is ready for testing!"
    echo ""
    echo "Next steps:"
    echo "  1. Start dev server: npm run dev"
    echo "  2. Open browser: http://localhost:3000"
    echo "  3. Follow REALTIME_EXECUTION.md for manual testing"
    echo "  4. Test all 10 checkpoints"
    echo "  5. Verify both emails arrive"
    echo ""
    echo -e "${YELLOW}⏰ ESTIMATED TIME: 3-4 hours${NC}"
    echo ""
    echo "After testing completes, run: bash scripts/run-all.sh deploy"
    echo ""
fi

# Phase: Deploy
if [ "$PHASE" = "deploy" ] || [ "$PHASE" = "all" ]; then
    # Only show deployment info if test passed
    if [ "$PHASE" = "deploy" ] || [ "$PHASE" = "all" ]; then
        echo ""
        echo -e "${YELLOW}🚀 PHASE 3: DEPLOYMENT${NC}"
        echo ""

        echo "# PHASE 3: DEPLOYMENT" >> "$MASTER_REPORT"
        echo "" >> "$MASTER_REPORT"

        run_step \
            "Automated Deployment" \
            "scripts/automated-deploy.sh" \
            "Automates git commit, push, and deployment preparation"

        echo "" >> "$MASTER_REPORT"
        echo "---" >> "$MASTER_REPORT"
        echo "" >> "$MASTER_REPORT"

        echo ""
        echo -e "${YELLOW}🌐 DEPLOYMENT COMPLETE!${NC}"
        echo ""
        echo "Next steps:"
        echo "  1. Go to: https://vercel.com/dashboard/tc-collectibles"
        echo "  2. Check Deployments tab"
        echo "  3. Wait for ✓ Deployment successful"
        echo "  4. Test on: https://tc-collectibles.vercel.app"
        echo ""
        echo -e "${RED}⚠️  CRITICAL: Environment Variables on Vercel${NC}"
        echo "Go to Project Settings → Environment Variables"
        echo ""
        echo "Must be set:"
        echo "  - NEXT_PUBLIC_SUPABASE_URL"
        echo "  - NEXT_PUBLIC_SUPABASE_ANON_KEY"
        echo "  - SUPABASE_SERVICE_ROLE_KEY"
        echo "  - SMTP_USER"
        echo "  - SMTP_PASS"
        echo "  - SMTP_FROM"
        echo "  - PROMPTPAY_PHONE"
        echo "  - NEXT_PUBLIC_PROMPTPAY_ACCOUNT_NAME"
        echo ""
    fi
fi

# Final Summary
echo ""
echo "╔════════════════════════════════════════════╗"
echo "║         AUTOMATION COMPLETE                ║"
echo "╚════════════════════════════════════════════╝"
echo ""
echo -e "${GREEN}✓ All automated tasks completed${NC}"
echo ""
echo "Report saved to: $MASTER_REPORT"
echo ""

# Append final summary to report
cat >> "$MASTER_REPORT" << EOF

---

## Summary

### Timeline
- **Phase 1 (Verify):** Environment validation
- **Phase 2 (Test):** Testing preparation & manual execution
- **Phase 3 (Deploy):** Automated deployment

### Next Actions
1. For Phase 2 (Testing): Follow REALTIME_EXECUTION.md
2. For Phase 3 (Deploy): Run \`bash scripts/run-all.sh deploy\`

### Status
✅ Automation preparation complete
⏳ Manual testing phase (3-4 hours)
⏳ Automated deployment (30 minutes)

### Launch Timeline
- Today: Phase 1 & 2 (Testing)
- Tomorrow: Phase 3 (Deployment)
- May 16: 🚀 LAUNCH

---
**Generated:** $(date)
**Status:** READY FOR EXECUTION
EOF

echo "Start testing now:"
echo "  npm run dev"
echo ""
