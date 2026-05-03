/**
 * i18n Configuration
 * Centralized settings for next-intl
 */

export const defaultLocale = 'en';
export const locales = ['en', 'th'] as const;

export type Locale = (typeof locales)[number];

export const localeLabels: Record<Locale, string> = {
  en: 'English',
  th: 'ไทย'
};

export const localeNames: Record<Locale, { native: string; english: string }> = {
  en: { native: 'English', english: 'English' },
  th: { native: 'ไทย', english: 'Thai' }
};

export const pathnames = {
  '/': '/',
  '/products': {
    en: '/products',
    th: '/products'
  },
  '/cart': {
    en: '/cart',
    th: '/cart'
  },
  '/checkout': {
    en: '/checkout',
    th: '/checkout'
  },
  '/orders': {
    en: '/orders',
    th: '/orders'
  },
  '/auth/login': {
    en: '/auth/login',
    th: '/auth/login'
  },
  '/auth/signup': {
    en: '/auth/signup',
    th: '/auth/signup'
  },
  '/admin': {
    en: '/admin',
    th: '/admin'
  }
} as const;
