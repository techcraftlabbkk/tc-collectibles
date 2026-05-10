# TC Collectibles - Phase 2 Implementation Plan
## Multi-Language (EN/TH) Support + UI/UX Enhancement

**Document Version:** 1.0  
**Last Updated:** May 3, 2026  
**Status:** Planning Phase  
**Priority:** High - Phase 2 Kickoff

---

## Overview

This document outlines the comprehensive strategy for implementing:
1. **Multi-language support** (English/Thai) using `next-intl`
2. **UI/UX improvements** across all pages with modern design patterns
3. **Seamless language switching** with proper routing and persistence

**Scope:** All customer-facing pages + Admin dashboard  
**Timeline Estimate:** 2-3 weeks (depends on design complexity)

---

## Part 1: Multi-Language Infrastructure Setup

### 1.1 Dependencies Installation

```bash
npm install next-intl
npm install -D i18next-browser-languagedetector  # Optional: auto-detect browser language
```

### 1.2 Project Structure with i18n

New file structure for translations:

```
/messages
  /en.json          # English translations
  /th.json          # Thai translations

/app
  /[locale]
    /layout.tsx     # Root layout with language context
    /page.tsx       # Homepage (en/th)
    /products
      /page.tsx
    /cart
      /page.tsx
    /checkout
      /page.tsx
    /orders
      /page.tsx
    /auth
      /login
        /page.tsx
      /signup
        /page.tsx
    /admin
      /page.tsx
    /payment
      /[orderId]
        /page.tsx

/middleware.ts      # Handle locale detection & routing
/lib
  /i18n.ts          # i18n configuration
  /useTranslation.ts # Custom hook for translations
```

### 1.3 Configuration Files

#### middleware.ts
Routes requests to correct locale, handles redirects, and persists language preference.

#### i18n/config.ts
Centralizes i18n settings:
- Supported locales: `['en', 'th']`
- Default locale: `'en'`
- Namespace configuration
- Language detection strategy

#### next.config.js
Update to support dynamic route localization.

---

## Part 2: Translation File Structure

### 2.1 Translation Files (/messages)

#### en.json (English)
```json
{
  "common": {
    "language": "Language",
    "en": "English",
    "th": "ไทย",
    "loading": "Loading...",
    "error": "Something went wrong",
    "retry": "Try again"
  },
  "navigation": {
    "home": "Home",
    "products": "Products",
    "cart": "Shopping Cart",
    "orders": "My Orders",
    "admin": "Admin",
    "logout": "Logout",
    "login": "Login",
    "signup": "Sign Up"
  },
  "pages": {
    "home": {
      "title": "Premium PSA Pokémon Cards",
      "subtitle": "Curated Collection of Graded Trading Cards",
      "hero_cta": "Browse Collection",
      "featured": "Featured Cards"
    },
    "products": {
      "title": "Our Collection",
      "search_placeholder": "Search cards...",
      "filter": "Filter",
      "sort": "Sort by",
      "no_results": "No cards found",
      "in_stock": "In Stock",
      "out_of_stock": "Out of Stock",
      "add_to_cart": "Add to Cart",
      "view_details": "View Details"
    },
    "cart": {
      "title": "Shopping Cart",
      "empty": "Your cart is empty",
      "continue_shopping": "Continue Shopping",
      "subtotal": "Subtotal",
      "shipping": "Shipping",
      "total": "Total",
      "checkout": "Proceed to Checkout",
      "remove": "Remove",
      "quantity": "Quantity"
    },
    "checkout": {
      "title": "Checkout",
      "billing_info": "Billing Information",
      "shipping_info": "Shipping Information",
      "payment_method": "Payment Method",
      "order_summary": "Order Summary",
      "place_order": "Place Order",
      "same_as_billing": "Same as billing address",
      "phone": "Phone Number",
      "email": "Email Address"
    },
    "auth": {
      "login": {
        "title": "Login",
        "email": "Email",
        "password": "Password",
        "forgot_password": "Forgot password?",
        "submit": "Login",
        "no_account": "Don't have an account?",
        "signup_link": "Sign up here"
      },
      "signup": {
        "title": "Create Account",
        "name": "Full Name",
        "email": "Email",
        "password": "Password",
        "confirm_password": "Confirm Password",
        "submit": "Sign Up",
        "have_account": "Already have an account?",
        "login_link": "Login here"
      }
    },
    "admin": {
      "title": "Admin Dashboard",
      "dashboard": "Dashboard",
      "orders": "Orders",
      "products": "Products",
      "total_revenue": "Total Revenue",
      "total_orders": "Total Orders",
      "pending_payment": "Pending Payment",
      "view_details": "View Details",
      "update_status": "Update Status"
    }
  },
  "errors": {
    "required_field": "This field is required",
    "invalid_email": "Please enter a valid email",
    "password_mismatch": "Passwords do not match",
    "network_error": "Network error. Please try again.",
    "unauthorized": "You are not authorized to access this page"
  },
  "success": {
    "order_placed": "Order placed successfully!",
    "product_added": "Product added to cart",
    "account_created": "Account created successfully",
    "login_success": "Logged in successfully"
  }
}
```

#### th.json (Thai)
```json
{
  "common": {
    "language": "ภาษา",
    "en": "English",
    "th": "ไทย",
    "loading": "กำลังโหลด...",
    "error": "มีบางอย่างผิดพลาด",
    "retry": "ลองอีกครั้ง"
  },
  "navigation": {
    "home": "หน้าแรก",
    "products": "สินค้า",
    "cart": "ตะกร้าสินค้า",
    "orders": "คำสั่งซื้อของฉัน",
    "admin": "ผู้จัดการ",
    "logout": "ออกจากระบบ",
    "login": "เข้าสู่ระบบ",
    "signup": "สมัครสมาชิก"
  },
  "pages": {
    "home": {
      "title": "การ์ด Pokémon ที่มีใบรับรองคุณภาพสูง",
      "subtitle": "คอลเลกชั่นการ์ดที่มีการให้เกรดอย่างระมัดระวัง",
      "hero_cta": "เรียกดูคอลเลกชั่น",
      "featured": "สินค้าแนะนำ"
    },
    "products": {
      "title": "คอลเลกชั่นของเรา",
      "search_placeholder": "ค้นหาการ์ด...",
      "filter": "กรองข้อมูล",
      "sort": "เรียงลำดับ",
      "no_results": "ไม่พบการ์ด",
      "in_stock": "มีสินค้า",
      "out_of_stock": "สินค้าหมด",
      "add_to_cart": "เพิ่มไปยังตะกร้า",
      "view_details": "ดูรายละเอียด"
    },
    "cart": {
      "title": "ตะกร้าสินค้า",
      "empty": "ตะกร้าของคุณว่างเปล่า",
      "continue_shopping": "เลือกสินค้าต่อ",
      "subtotal": "รวมย่อย",
      "shipping": "ค่าจัดส่ง",
      "total": "รวมทั้งหมด",
      "checkout": "ไปที่การชำระเงิน",
      "remove": "ลบ",
      "quantity": "จำนวน"
    },
    "checkout": {
      "title": "การชำระเงิน",
      "billing_info": "ข้อมูลการเรียกเก็บเงิน",
      "shipping_info": "ข้อมูลการจัดส่ง",
      "payment_method": "วิธีการชำระเงิน",
      "order_summary": "สรุปคำสั่งซื้อ",
      "place_order": "วางสั่งซื้อ",
      "same_as_billing": "เหมือนกับที่อยู่การเรียกเก็บเงิน",
      "phone": "เบอร์โทรศัพท์",
      "email": "ที่อยู่อีเมล"
    },
    "auth": {
      "login": {
        "title": "เข้าสู่ระบบ",
        "email": "อีเมล",
        "password": "รหัสผ่าน",
        "forgot_password": "ลืมรหัสผ่านหรือ?",
        "submit": "เข้าสู่ระบบ",
        "no_account": "ไม่มีบัญชีหรือ?",
        "signup_link": "สมัครสมาชิกที่นี่"
      },
      "signup": {
        "title": "สร้างบัญชี",
        "name": "ชื่อเต็ม",
        "email": "อีเมล",
        "password": "รหัสผ่าน",
        "confirm_password": "ยืนยันรหัสผ่าน",
        "submit": "สมัครสมาชิก",
        "have_account": "มีบัญชีแล้วหรือ?",
        "login_link": "เข้าสู่ระบบที่นี่"
      }
    },
    "admin": {
      "title": "แดชบอร์ดผู้จัดการ",
      "dashboard": "แดชบอร์ด",
      "orders": "คำสั่งซื้อ",
      "products": "สินค้า",
      "total_revenue": "รายได้รวม",
      "total_orders": "จำนวนคำสั่งซื้อ",
      "pending_payment": "รอการชำระเงิน",
      "view_details": "ดูรายละเอียด",
      "update_status": "อัพเดตสถานะ"
    }
  },
  "errors": {
    "required_field": "จำเป็นต้องกรอกฟิลด์นี้",
    "invalid_email": "โปรดป้อนอีเมลที่ถูกต้อง",
    "password_mismatch": "รหัสผ่านไม่ตรงกัน",
    "network_error": "ข้อผิดพลาดของเครือข่าย โปรดลองอีกครั้ง",
    "unauthorized": "คุณไม่มีสิทธิ์เข้าถึงหน้านี้"
  },
  "success": {
    "order_placed": "วางสั่งซื้อสำเร็จแล้ว!",
    "product_added": "เพิ่มสินค้าไปยังตะกร้าแล้ว",
    "account_created": "สร้างบัญชีสำเร็จแล้ว",
    "login_success": "เข้าสู่ระบบสำเร็จแล้ว"
  }
}
```

---

## Part 3: UI/UX Improvements Strategy

### 3.1 Design System Updates

#### Color Palette
- **Primary:** Modern blue (#2563EB) - Professional, trustworthy
- **Secondary:** Complementary purple (#7C3AED) - Premium feel
- **Success:** Green (#10B981) - Positive actions
- **Warning:** Orange (#F59E0B) - Caution, pending
- **Error:** Red (#EF4444) - Errors, critical
- **Neutral Grays:** Professional shade progression

#### Typography
- **Headings:** Inter Bold (H1-H3)
- **Body:** Inter Regular (14-16px)
- **Small:** Inter Medium (12px)
- **Status Text:** Inter SemiBold (for emphasis)

### 3.2 Component-Level Improvements

#### Navigation/Header
- [ ] Sticky navigation bar with language selector dropdown
- [ ] Mobile hamburger menu with smooth animations
- [ ] User account dropdown (login state)
- [ ] Shopping cart icon with item count badge
- [ ] Logo/branding update

#### Buttons
- [ ] Consistent button sizing (sm, md, lg)
- [ ] Hover/active/disabled states
- [ ] Loading state with spinner
- [ ] Icon support (arrow, check, etc.)

#### Forms
- [ ] Improved input styling with focus states
- [ ] Floating labels for better UX
- [ ] Error message positioning below inputs
- [ ] Form validation feedback in real-time
- [ ] Password visibility toggle

#### Cards
- [ ] Product cards with hover zoom effect
- [ ] Shadow on hover (elevation)
- [ ] Badge overlay for stock status
- [ ] Better spacing and typography

#### Modals/Dialogs
- [ ] Improved modal styling
- [ ] Smooth open/close animations
- [ ] Backdrop blur effect
- [ ] Better button layouts

### 3.3 Page-Specific Improvements

#### Homepage
- Modern hero section with gradient background
- Featured products carousel/grid
- Category showcase
- About section
- Call-to-action sections with contrasting colors
- Footer with links and contact info

#### Products Page
- Grid layout (responsive: 1 col mobile, 2 cols tablet, 3-4 cols desktop)
- Advanced filters (grade, price range, type)
- Sort options (price, newest, rating)
- Product preview modal on card hover
- Smooth loading skeleton placeholders

#### Shopping Cart
- Improved cart item layout with visual product previews
- Quantity adjuster buttons (-, +)
- Easy removal with confirmation
- Promo code input section
- Order summary sidebar (desktop) or bottom section (mobile)
- Checkout CTA button sticky at bottom (mobile)

#### Checkout
- Multi-step form with progress indicator
- Form sections collapsed/expandable
- Auto-fill suggestions
- Real-time order preview
- Address validation feedback
- Payment method selection with icons

#### Admin Dashboard
- Clean tabbed interface
- Card-based metrics display
- Data tables with sorting/filtering
- Color-coded status badges
- Action buttons in table rows
- Empty state messaging

### 3.4 Responsive Design
- Mobile-first approach
- Breakpoints: 640px (sm), 1024px (md), 1280px (lg)
- Touch-friendly button sizes (min 44x44px)
- Proper spacing on all screen sizes

### 3.5 Accessibility (A11y)
- [ ] ARIA labels on all interactive elements
- [ ] Keyboard navigation support
- [ ] Color contrast compliance (WCAG AA)
- [ ] Focus indicators visible
- [ ] Semantic HTML structure

---

## Part 4: Implementation Phases

### Phase 4.1: Setup & Infrastructure (Week 1)
1. Install and configure next-intl
2. Create middleware.ts for locale routing
3. Set up i18n configuration file
4. Create translation files (en.json, th.json)
5. Create language switcher component
6. Test locale switching and routing

### Phase 4.2: Component Refactoring (Week 1-2)
1. Update app folder structure with [locale] parameter
2. Refactor layout.tsx with i18n context
3. Create reusable UI components library:
   - Button variants
   - Input fields
   - Form containers
   - Cards
   - Modals
   - Navigation
4. Apply Tailwind styling improvements

### Phase 4.3: Page Migration (Week 2)
1. Migrate and redesign homepage
2. Migrate and redesign products page
3. Migrate and redesign cart page
4. Migrate and redesign checkout page
5. Migrate and redesign auth pages
6. Migrate and redesign admin dashboard
7. Migrate and redesign orders page

### Phase 4.4: Language Integration (Week 2-3)
1. Integrate translation hooks into all pages
2. Test EN/TH switching across all pages
3. Verify translations are accurate
4. Update email templates with language support

### Phase 4.5: Testing & Polish (Week 3)
1. Responsive design testing (mobile, tablet, desktop)
2. Cross-browser testing
3. Accessibility audit
4. Performance optimization
5. Language direction testing (RTL if needed)
6. QA on all user flows

---

## Part 5: Code Examples

### middleware.ts
```typescript
import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  // A list of all locales that are supported
  locales: ['en', 'th'],

  // Used when no locale matches
  defaultLocale: 'en'
});

export const config = {
  // Match only internationalized pathnames
  matcher: ['/', '/(en|th)/:path*']
};
```

### i18n/config.ts
```typescript
export const defaultLocale = 'en';
export const locales = ['en', 'th'];

export type Locale = typeof locales[number];

export const localeLabels: Record<Locale, string> = {
  en: 'English',
  th: 'ไทย'
};
```

### Usage in Components
```typescript
'use client';

import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';

export default function ProductCard({ product }) {
  const t = useTranslations('pages.products');
  const locale = useLocale();

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <img src={product.image} alt={product.title} />
      <h3 className="text-lg font-bold">{product.title}</h3>
      <p className="text-gray-600">{product.grade}</p>
      <p className="text-2xl font-bold text-blue-600">${product.price}</p>
      <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
        {t('add_to_cart')}
      </button>
    </div>
  );
}
```

### Language Switcher Component
```typescript
'use client';

import { useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import { locales, localeLabels } from '@/i18n/config';

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();

  return (
    <select 
      value={locale}
      onChange={(e) => router.replace(`/${e.target.value}`)}
      className="px-3 py-2 border border-gray-300 rounded-lg"
    >
      {locales.map((loc) => (
        <option key={loc} value={loc}>
          {localeLabels[loc]}
        </option>
      ))}
    </select>
  );
}
```

---

## Part 6: Testing Checklist

### Functionality Testing
- [ ] Language switcher works on all pages
- [ ] Translations display correctly (EN/TH)
- [ ] No untranslated strings appear
- [ ] URLs reflect correct locale (/en/..., /th/...)
- [ ] Browser back/forward maintains language context

### UI/UX Testing
- [ ] All pages display correctly on mobile (320px+)
- [ ] All pages display correctly on tablet (768px+)
- [ ] All pages display correctly on desktop (1280px+)
- [ ] Buttons are clickable and properly styled
- [ ] Forms validate and show errors correctly
- [ ] Modals/dialogs open and close smoothly

### Accessibility Testing
- [ ] Tab navigation works
- [ ] Screen reader compatible
- [ ] Color contrast meets WCAG AA
- [ ] Focus indicators visible
- [ ] No keyboard traps

### Performance Testing
- [ ] Page load times (target: < 3s)
- [ ] Language switch speed (instant)
- [ ] No layout shift on language change
- [ ] Images optimized and lazy-loaded

---

## Part 7: Deployment & Launch Strategy

### Pre-Launch
1. Final QA across all pages and languages
2. Performance testing and optimization
3. Create rollback plan
4. Notify admins about new UI/language features

### Launch Steps
1. Deploy to Vercel staging environment
2. Test in production-like environment
3. Deploy to production main branch
4. Monitor error logs for issues
5. Announce new language support to users

### Post-Launch
1. Monitor user feedback
2. Track language preference distribution
3. Fix any reported issues quickly
4. Gather metrics on UI improvements

---

## Part 8: Maintenance & Future

### Ongoing Tasks
- Keep translations updated as features are added
- Monitor and fix any UI/UX issues reported by users
- Regular accessibility audits
- Performance monitoring

### Future Enhancements
- Add more languages (Japanese, Vietnamese, etc.)
- Implement RTL support for Arabic (if added)
- A/B testing for design variants
- Progressive Web App (PWA) features
- Dark mode support (if needed)

---

## Resources & References

- [next-intl Documentation](https://next-intl-docs.vercel.app/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Vercel Deployment Docs](https://vercel.com/docs)
- [Web Accessibility Guide](https://www.w3.org/WAI/WCAG21/quickref/)

---

## Contact & Questions

For implementation questions or clarifications about this plan, refer to the main project documentation.

**Document Status:** Ready for implementation  
**Next Step:** Begin Phase 4.1 (Setup & Infrastructure)
