#!/bin/bash

# TC Collectibles - Automated Testing Suite
# This script automates all Phase 1 testing
# Usage: bash scripts/automated-testing.sh

set -e

echo "🚀 TC COLLECTIBLES - AUTOMATED TESTING SUITE"
echo "=============================================="
echo ""

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Get timestamp
TIMESTAMP=$(date +"%Y-%m-%d %H:%M:%S")
REPORT_FILE="test-report-$(date +%Y%m%d-%H%M%S).md"

# Start report
cat > "$REPORT_FILE" << EOF
# TC Collectibles - Automated Test Report
**Generated:** $TIMESTAMP

## Test Results
EOF

echo -e "${YELLOW}[1/5] Checking Environment Variables...${NC}"
if [ -f .env.local ]; then
    echo "✓ .env.local found"

    # Check required variables
    required_vars=("SMTP_USER" "SMTP_PASS" "SMTP_FROM" "PROMPTPAY_PHONE" "NEXT_PUBLIC_SUPABASE_URL")
    missing_vars=()

    for var in "${required_vars[@]}"; do
        if ! grep -q "^$var=" .env.local; then
            missing_vars+=("$var")
        fi
    done

    if [ ${#missing_vars[@]} -eq 0 ]; then
        echo -e "${GREEN}✓ All required environment variables present${NC}"
        echo "- SMTP_USER: $(grep SMTP_USER .env.local | cut -d= -f2)"
        echo "- SMTP_FROM: $(grep SMTP_FROM .env.local | cut -d= -f2)"
        echo "- PROMPTPAY_PHONE: $(grep PROMPTPAY_PHONE .env.local | cut -d= -f2)"
        echo "- SUPABASE_URL: Configured"
        echo "" >> "$REPORT_FILE"
        echo "### Environment Check: ✅ PASSED" >> "$REPORT_FILE"
    else
        echo -e "${RED}✗ Missing variables: ${missing_vars[@]}${NC}"
        echo "" >> "$REPORT_FILE"
        echo "### Environment Check: ❌ FAILED - Missing: ${missing_vars[@]}" >> "$REPORT_FILE"
    fi
else
    echo -e "${RED}✗ .env.local not found${NC}"
    echo "" >> "$REPORT_FILE"
    echo "### Environment Check: ❌ FAILED - .env.local missing" >> "$REPORT_FILE"
fi

echo ""
echo -e "${YELLOW}[2/5] Clearing Next.js Cache...${NC}"
if [ -d ".next" ]; then
    rm -rf .next
    echo "✓ Cache cleared"
else
    echo "✓ Cache already clean"
fi

echo ""
echo -e "${YELLOW}[3/5] Installing Dependencies...${NC}"
if npm install > /dev/null 2>&1; then
    echo "✓ Dependencies installed"
    echo "" >> "$REPORT_FILE"
    echo "### Dependency Check: ✅ PASSED" >> "$REPORT_FILE"
else
    echo -e "${RED}✗ npm install failed${NC}"
    echo "" >> "$REPORT_FILE"
    echo "### Dependency Check: ❌ FAILED" >> "$REPORT_FILE"
fi

echo ""
echo -e "${YELLOW}[4/5] TypeScript Compilation Check...${NC}"
if npm run build > /tmp/build.log 2>&1; then
    echo -e "${GREEN}✓ TypeScript compilation successful${NC}"
    echo "" >> "$REPORT_FILE"
    echo "### TypeScript Check: ✅ PASSED" >> "$REPORT_FILE"
else
    echo -e "${RED}✗ TypeScript compilation failed${NC}"
    echo "See /tmp/build.log for details"
    echo "" >> "$REPORT_FILE"
    echo "### TypeScript Check: ❌ FAILED" >> "$REPORT_FILE"
    echo "Check /tmp/build.log for errors" >> "$REPORT_FILE"
fi

echo ""
echo -e "${YELLOW}[5/5] Environment Ready for Testing${NC}"

# Summary
echo ""
echo "=============================================="
echo -e "${GREEN}✓ AUTOMATION SETUP COMPLETE${NC}"
echo "=============================================="
echo ""
echo "Next Steps:"
echo "1. Start dev server: npm run dev"
echo "2. Open browser: http://localhost:3000"
echo "3. Run manual tests following REALTIME_EXECUTION.md"
echo ""
echo "Test Report: $REPORT_FILE"
echo ""

# Append final summary
cat >> "$REPORT_FILE" << EOF

## Summary
Automated environment validation complete.
Ready to proceed with Phase 1 testing.

## Next Steps
1. Start dev server: npm run dev
2. Open http://localhost:3000
3. Follow REALTIME_EXECUTION.md for manual testing
4. Monitor email delivery
5. Verify all checkpoints pass

## Test Execution
**Phase:** 1 - Local Testing
**Status:** Ready to Begin
**Duration:** 3-4 hours
**Start Time:** $(date)

---
EOF

echo "Report saved to: $REPORT_FILE"
