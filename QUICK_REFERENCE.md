# TC Collectibles - Quick Reference Guide

**For developers working on migrating remaining pages**

---

## 🚀 Getting Started (5 minutes)

```bash
# 1. Install dependencies
npm install

# 2. Run development server
npm run dev

# 3. Open browser
# - English: http://localhost:3000/en
# - Thai: http://localhost:3000/th
```

---

## 📝 Common Patterns

### Using Translations
```typescript
'use client';
import { useTranslations } from 'next-intl';

export default function MyComponent() {
  const t = useTranslations('pages.products'); // Match JSON key
  
  return <h1>{t('title')}</h1>;
}
```

### Getting Current Locale
```typescript
import { useLocale } from 'next-intl';

const locale = useLocale(); // Returns: 'en' or 'th'
```

### Creating Links with Locale
```typescript
import Link from 'next/link';
import { useLocale } from 'next-intl';

const MyLink = () => {
  const locale = useLocale();
  return <Link href={`/${locale}/products`}>Browse</Link>;
};
```

### Using Components
```typescript
import Button from '@/components/Button';
import Input from '@/components/Input';
import Card from '@/components/Card';

export default function MyPage() {
  return (
    <>
      <Card hover>
        <Input label="Name" placeholder="Enter name" />
        <Button variant="primary" size="lg">Submit</Button>
      </Card>
    </>
  );
}
```

---

## 🎨 Component Variants

### Button
```typescript
// Variants: primary | secondary | outline | ghost | danger
// Sizes: sm | md | lg
// States: disabled, isLoading

<Button variant="primary" size="md">Click me</Button>
<Button isLoading>Processing...</Button>
```

### Input
```typescript
// With label, error, helper text
<Input 
  label="Email"
  type="email"
  error="Invalid email"
  helperText="We'll never share your email"
/>
```

### Card
```typescript
// With hover effect and shadow
<Card hover shadow="lg">Content</Card>
```

---

## 📋 Migration Checklist for Each Page

When migrating a page from `/app/page.tsx` to `/app/[locale]/page.tsx`:

1. [ ] Create file at `/app/[locale]/path/page.tsx`
2. [ ] Add `'use client'` directive if it's a client component
3. [ ] Import translations: `import { useTranslations } from 'next-intl'`
4. [ ] Replace hardcoded strings with `t('key')`
5. [ ] Update all links to include locale: `href={`/${locale}/path`}`
6. [ ] Update routing (e.g., `useRouter` → `useRouter()` with locale)
7. [ ] Test both EN and TH versions
8. [ ] Check responsive design on mobile

### Example Migration
**Before:**
```typescript
// app/products/page.tsx
export default function ProductsPage() {
  return <h1>Products</h1>;
}
```

**After:**
```typescript
// app/[locale]/products/page.tsx
'use client';
import { useTranslations } from 'next-intl';

export default function ProductsPage() {
  const t = useTranslations('pages.products');
  return <h1>{t('title')}</h1>;
}
```

---

## 🔗 Routing Guide

### How Routing Works
```
/                      → Redirects to /en (default locale)
/en/products           → English products page
/th/products           → Thai products page
/en/checkout           → English checkout page
/th/checkout           → Thai checkout page
```

### Creating Links
```typescript
// Always include locale in href
<Link href={`/${locale}/products`}>Browse</Link>

// Dynamic routes
<Link href={`/${locale}/payment/${orderId}`}>Pay</Link>

// External navigation
router.push(`/${locale}/cart`);
```

---

## 🌐 Translation Keys Structure

Check `/messages/en.json` for available keys:

```json
{
  "common": { ... },
  "navigation": { ... },
  "pages": {
    "home": { ... },
    "products": { ... },
    "cart": { ... },
    "checkout": { ... },
    "auth": { ... },
    "admin": { ... }
  },
  "errors": { ... },
  "success": { ... }
}
```

### Using Nested Keys
```typescript
const t = useTranslations('pages.products');
t('title')        // pages.products.title
t('add_to_cart')  // pages.products.add_to_cart

const tErr = useTranslations('errors');
tErr('required_field') // errors.required_field
```

---

## 🎯 Common Tasks

### Add a New Page
1. Create folder: `/app/[locale]/newpage/`
2. Create file: `page.tsx`
3. Add translations to both `en.json` and `th.json`
4. Use `useTranslations` and `useLocale` in component
5. Update header navigation if needed

### Update Translations
1. Open `/messages/en.json`
2. Add/modify translation key
3. Open `/messages/th.json`
4. Add corresponding Thai translation
5. Use in component: `t('key')`

### Change Button Style
```typescript
// Use variant prop
<Button variant="outline">Outline Button</Button>
<Button variant="danger">Delete</Button>

// Use size prop
<Button size="sm">Small</Button>
<Button size="lg">Large</Button>

// Combine
<Button variant="primary" size="lg">Primary Large</Button>
```

---

## ⚠️ Common Mistakes to Avoid

### ❌ Don't
```typescript
// Wrong - hardcoded text
<h1>Products</h1>

// Wrong - wrong translation scope
const t = useTranslations();
t('products.title') // throws error if key doesn't exist

// Wrong - missing locale in link
<Link href="/products">Browse</Link>

// Wrong - importing from old location
import { Header } from '@/app/layout'
```

### ✅ Do
```typescript
// Right - use translations
const t = useTranslations('pages.products');
<h1>{t('title')}</h1>

// Right - correct scope
const t = useTranslations('pages.products');
t('title')

// Right - include locale
<Link href={`/${locale}/products`}>Browse</Link>

// Right - import from components
import Header from '@/components/Header'
```

---

## 🧪 Testing Checklist

For each page you migrate:

- [ ] Test page loads without errors
- [ ] Test English version (localhost:3000/en/...)
- [ ] Test Thai version (localhost:3000/th/...)
- [ ] Click language switcher - should switch language
- [ ] Check responsive design on mobile (375px width)
- [ ] Check all links work and include locale
- [ ] Verify all text is translated (no English appearing in Thai mode)
- [ ] Test form submissions if applicable
- [ ] Check console for errors

---

## 📞 Getting Help

**Check existing pages:**
- Homepage: `/app/[locale]/page.tsx` ✅
- Products: `/app/[locale]/products/page.tsx` ✅
- Cart: `/app/[locale]/cart/page.tsx` ✅
- Checkout: `/app/[locale]/checkout/page.tsx` ✅

**Read full docs:**
- `IMPLEMENTATION_PLAN_i18n_UX.md` - Complete strategy
- `IMPLEMENTATION_STATUS.md` - Current progress
- `IMPLEMENTATION_SETUP_GUIDE.md` - Technical setup

---

## 🔄 Useful Commands

```bash
# Development
npm run dev                 # Start dev server
npm run build              # Build for production
npm start                  # Run production build

# Type checking
npm run type-check         # Check TypeScript

# Testing
npm test                   # Run tests
npm run test:watch         # Watch mode

# Linting
npm run lint               # Run ESLint
```

---

## 📊 Progress Tracking

**Completed:**
- ✅ Infrastructure setup
- ✅ Component library
- ✅ 4 main pages (Home, Products, Cart, Checkout)
- ✅ Translations (200+ keys)

**In Progress:**
- 🔄 Auth pages (login/signup)
- 🔄 Orders page
- 🔄 Admin dashboard
- 🔄 Payment page

**To Do:**
- ⬜ Form validation enhancements
- ⬜ Loading states
- ⬜ Error handling pages
- ⬜ Accessibility audit

---

**Last Updated:** May 3, 2026  
**Version:** 1.0  
**Status:** Ready to Use
