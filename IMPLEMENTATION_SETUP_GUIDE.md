# TC Collectibles i18n + UX Enhancement - Setup Guide

**Status:** Ready to Deploy  
**Last Updated:** May 3, 2026  
**Next Steps:** Follow this guide to implement the infrastructure

---

## Quick Start (15 minutes)

### Step 1: Install Dependencies

```bash
npm install next-intl
npm install -D i18next-browser-languagedetector
```

### Step 2: Update next.config.js

Add next-intl configuration to your `next.config.js`:

```javascript
/** @type {import('next').NextConfig} */
const createNextIntlPlugin = require('next-intl/plugin');

const withNextIntl = createNextIntlPlugin();

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    unoptimized: true,
  },
};

module.exports = withNextIntl(nextConfig);
```

### Step 3: Create i18n.ts File

Create `/app/i18n.ts`:

```typescript
import { getRequestConfig } from 'next-intl/server';
import { defaultLocale, locales, type Locale } from '@/i18n/config';

export default getRequestConfig(async ({ locale }) => {
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as Locale)) {
    return {};
  }

  return {
    messages: (await import(`@/messages/${locale}.json`)).default,
  };
});
```

### Step 4: Update Root Layout

Replace your `app/layout.tsx` with locale support:

```typescript
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { locales } from '@/i18n/config';

export const metadata: Metadata = {
  title: 'TC Collectibles',
  description: 'Premium PSA Pokémon Card Marketplace',
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

interface RootLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function RootLayout({
  children,
  params,
}: RootLayoutProps) {
  const { locale } = await params;

  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as any)) {
    notFound();
  }

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className="bg-white">
        {children}
      </body>
    </html>
  );
}
```

### Step 5: Restructure App Folder

Move your page files into the locale structure:

```bash
# Before:
/app/page.tsx
/app/products/page.tsx
/app/cart/page.tsx
# etc...

# After:
/app/[locale]/page.tsx
/app/[locale]/products/page.tsx
/app/[locale]/cart/page.tsx
# etc...
```

### Step 6: Update Links in Components

When creating links, include the locale:

```typescript
'use client';

import { useLocale } from 'next-intl';
import Link from 'next/link';

export default function Navigation() {
  const locale = useLocale();

  return (
    <nav>
      <Link href={`/${locale}`}>Home</Link>
      <Link href={`/${locale}/products`}>Products</Link>
      <Link href={`/${locale}/cart`}>Cart</Link>
    </nav>
  );
}
```

### Step 7: Use Translations in Components

```typescript
'use client';

import { useTranslations } from 'next-intl';

export default function ProductCard() {
  const t = useTranslations('pages.products');

  return (
    <div>
      <h2>{t('title')}</h2>
      <button>{t('add_to_cart')}</button>
    </div>
  );
}
```

---

## Files Created

The following files have been created in your project:

1. **i18n/config.ts** - i18n configuration and constants
2. **middleware.ts** - Next.js middleware for locale routing
3. **messages/en.json** - English translations
4. **messages/th.json** - Thai translations
5. **components/LanguageSwitcher.tsx** - Language selector component

---

## Implementation Checklist

### Infrastructure Setup
- [ ] Install next-intl dependency
- [ ] Update next.config.js with next-intl plugin
- [ ] Create i18n.ts configuration file
- [ ] Create app/[locale] folder structure
- [ ] Update root layout.tsx

### Page Migration (Sequential)
- [ ] Migrate app/page.tsx → app/[locale]/page.tsx
- [ ] Migrate app/products/* → app/[locale]/products/*
- [ ] Migrate app/cart/* → app/[locale]/cart/*
- [ ] Migrate app/checkout/* → app/[locale]/checkout/*
- [ ] Migrate app/auth/* → app/[locale]/auth/*
- [ ] Migrate app/orders/* → app/[locale]/orders/*
- [ ] Migrate app/admin/* → app/[locale]/admin/*
- [ ] Migrate app/payment/* → app/[locale]/payment/*

### Translation Integration
- [ ] Add useTranslations to all pages
- [ ] Replace hardcoded strings with translation keys
- [ ] Test EN/TH switching on all pages
- [ ] Verify no untranslated strings visible

### Component Updates
- [ ] Add LanguageSwitcher to navigation
- [ ] Update internal links to include locale
- [ ] Update API calls if they include locale
- [ ] Update form error messages with translations

### Testing
- [ ] Test language switching
- [ ] Test routing with locales (e.g., /en/products, /th/products)
- [ ] Test responsive design on mobile
- [ ] Test in different browsers
- [ ] Check console for errors
- [ ] Verify translations display correctly

### UI/UX Improvements (Phase 2)
- [ ] Update color palette and styling
- [ ] Improve form layouts
- [ ] Add loading states
- [ ] Enhance button styles
- [ ] Improve card designs
- [ ] Add animations

---

## Important Notes

### API Routes
API routes don't need the [locale] prefix. They remain at `/api/...`

### Environment Variables
No new environment variables needed for basic i18n. Keep existing `.env.local` as-is.

### Database Queries
Database queries don't change. Language is only UI-level.

### Deployment
When deploying to Vercel:
1. Push changes to main branch
2. Vercel will auto-detect next.config.js changes
3. Rebuild and deploy automatically
4. Test /en and /th routes work in production

### Fallback Language
If a user accesses a locale not in the `locales` array, they'll see a 404. Currently only EN and TH are supported.

---

## Common Issues & Solutions

### Issue: "Module next-intl not found"
**Solution:** Run `npm install next-intl` and restart dev server

### Issue: Routes showing 404
**Solution:** Ensure your pages are in `app/[locale]/` folder structure

### Issue: Translations not appearing
**Solution:** 
1. Check useTranslations is imported
2. Verify key exists in messages JSON
3. Check console for errors

### Issue: Language switcher not working
**Solution:**
1. Verify useRouter and useLocale imported from 'next-intl'
2. Check middleware.ts is in root directory
3. Ensure app/[locale] structure is correct

### Issue: Build errors
**Solution:**
1. Clear `.next` folder: `rm -rf .next`
2. Run `npm run build` again
3. Check console for specific error

---

## Next Steps After Setup

1. **Complete UI/UX Enhancements** - Follow the design improvements in IMPLEMENTATION_PLAN_i18n_UX.md
2. **Test Thoroughly** - Use the testing checklist above
3. **Deploy to Staging** - Test on Vercel staging environment first
4. **Deploy to Production** - Once confirmed working
5. **Monitor & Iterate** - Track user feedback and performance

---

## Support & Resources

- [next-intl Documentation](https://next-intl-docs.vercel.app/)
- [Next.js App Router Docs](https://nextjs.org/docs/app)
- [i18n Best Practices](https://www.smashingmagazine.com/2020/11/internationalization-localization-static-site-generation/)

---

## Estimated Timeline

- **Setup & Configuration:** 1 hour
- **Page Migration:** 2-3 hours
- **Translation Integration:** 1-2 hours
- **Testing & QA:** 2-3 hours
- **UI/UX Improvements:** 1-2 weeks (optional, depends on scope)

**Total Estimated Time:** 1-3 weeks (depending on UI/UX scope)

---

Document Version: 1.0  
Created: May 3, 2026  
Status: Ready to Implement
