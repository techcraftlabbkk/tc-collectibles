# Test Running Guide

## Quick Start

### Prerequisites
```bash
npm install
```

### Run All Tests
```bash
npm run test
```

## Running Specific Tests

### Run Unit Tests Only
```bash
npm run test -- __tests__/components
```

### Run Integration Tests Only
```bash
npm run test -- __tests__/integration
```

### Run Single Test File
```bash
npm run test -- Button.test.tsx
npm run test -- auth.integration.test.ts
npm run test -- cart-flow.test.ts
```

### Run Tests Matching Pattern
```bash
npm run test -- --testNamePattern="should render"
npm run test -- --testNamePattern="Button"
```

## E2E Testing with Playwright

### Install Playwright browsers (first time only)
```bash
npx playwright install
```

### Run All E2E Tests
```bash
npm run test:e2e
```

### Run Specific E2E Test File
```bash
npm run test:e2e e2e/auth.spec.ts
npm run test:e2e e2e/products.spec.ts
npm run test:e2e e2e/checkout.spec.ts
npm run test:e2e e2e/payment.spec.ts
npm run test:e2e e2e/admin.spec.ts
```

### Run E2E Tests with UI
```bash
npm run test:e2e -- --ui
```

### Run E2E Tests in Headed Mode (see browser)
```bash
npm run test:e2e -- --headed
```

### Run E2E Tests in Specific Browser
```bash
npm run test:e2e -- --project=chromium
npm run test:e2e -- --project=firefox
npm run test:e2e -- --project=webkit
npm run test:e2e -- --project="Mobile Chrome"
npm run test:e2e -- --project="Mobile Safari"
```

### Run E2E Tests with Debug Mode
```bash
npm run test:e2e -- --debug
```

### Run Single E2E Test
```bash
npm run test:e2e e2e/auth.spec.ts -g "should login"
```

## Coverage Reports

### Generate Coverage Report
```bash
npm run test -- --coverage
```

### View Coverage Report
```bash
open coverage/lcov-report/index.html
```

### Coverage by File
```bash
npm run test -- --coverage --coverage-reporters=text
```

## Watch Mode

### Run Tests in Watch Mode
```bash
npm run test -- --watch
```

### Run Tests in Watch Mode with UI
```bash
npm run test:e2e -- --ui
```

## Debugging Tests

### Debug Jest Tests
```bash
node --inspect-brk node_modules/.bin/jest --runInBand
```

Then open `chrome://inspect` in Chrome

### Debug E2E Tests
```bash
npm run test:e2e -- --debug
```

### Debug Single E2E Test
```bash
npm run test:e2e e2e/auth.spec.ts --debug -g "should login"
```

## CI/CD Testing

### Run Tests as if in CI
```bash
CI=true npm run test
CI=true npm run test:e2e
```

## Test Organization

### Component Tests
```
__tests__/components/
├── Button.test.tsx
├── Input.test.tsx
├── Card.test.tsx
├── Header.test.tsx
├── Footer.test.tsx
└── LanguageSwitcher.test.tsx
```

### Integration Tests
```
__tests__/integration/
├── cart-flow.test.ts
├── auth.integration.test.ts
└── order-management.integration.test.ts
```

### E2E Tests
```
e2e/
├── auth.spec.ts          # Login, signup, language switching
├── checkout.spec.ts      # Browse → Cart → Checkout → Payment
├── payment.spec.ts       # Payment page, PromptPay QR, confirmation
├── admin.spec.ts         # Dashboard, orders, products management
└── products.spec.ts      # Product filtering, search, sorting
```

## Common Commands

### Full Test Suite (Unit + Integration + E2E)
```bash
npm run test && npm run test:e2e
```

### Quick Smoke Tests
```bash
npm run test -- Button.test.tsx Input.test.tsx
npm run test:e2e e2e/auth.spec.ts
```

### Full Coverage Report with All Tests
```bash
npm run test -- --coverage --collectCoverageFrom="src/**/*.{ts,tsx}"
npm run test:e2e
```

### Run Tests and Generate HTML Report
```bash
npm run test -- --coverage --reporters=default --reporters=html
npm run test:e2e -- --reporter=html
```

## Troubleshooting

### Tests Failing: Module not found
```bash
npm install
# or if using specific versions:
npm ci
```

### E2E Tests Failing: Server not running
```bash
# Terminal 1: Start dev server
npm run dev

# Terminal 2: Run E2E tests
npm run test:e2e
```

### Playwright browser not found
```bash
npx playwright install
```

### Clear Jest cache
```bash
npm run test -- --clearCache
```

### Clear all test caches
```bash
rm -rf node_modules/.cache
npx playwright install
npm run test -- --clearCache
```

## Performance Tips

### Run tests in parallel (default)
- Jest: Already parallel by default
- Playwright: Set workers in playwright.config.ts

### Run tests in serial (slower but useful for debugging)
```bash
npm run test -- --runInBand
npm run test:e2e -- --workers=1
```

### Run only changed tests
```bash
npm run test -- --onlyChanged
```

### Run tests matching a pattern
```bash
npm run test -- --testNamePattern="Button|Input"
```

## Viewing Test Results

### JSON Report
```bash
npm run test -- --json > test-results.json
```

### HTML Report
```bash
npm run test:e2e -- --reporter=html
# Open: playwright-report/index.html
```

### Console Output
```bash
npm run test -- --verbose
```

## Continuous Integration

### GitHub Actions Example
```yaml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run test -- --coverage
      - run: npm run test:e2e
```

## Notes

- **Browser Start Time**: First run may take longer as browsers are initialized
- **Flaky Tests**: E2E tests may be flaky due to timing; use appropriate waits
- **Mocking**: All external APIs (Supabase, email, etc.) are mocked in tests
- **Language Tests**: Tests verify both English (/en) and Thai (/th) paths
- **Mobile Testing**: Playwright tests mobile viewports with Pixel 5 and iPhone 12

## Test Maintenance

### Update Snapshots
```bash
npm run test -- --updateSnapshot
```

### Update Playwright Snapshots
```bash
npm run test:e2e -- --update-snapshots
```

## Need Help?

- **Jest Docs**: https://jestjs.io/docs/getting-started
- **React Testing Library**: https://testing-library.com/docs/react-testing-library/intro
- **Playwright Docs**: https://playwright.dev/docs/intro

---

**Last Updated**: Phase 3 Complete
