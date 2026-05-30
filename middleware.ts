/**
 * Middleware for next-intl
 * Handles locale detection, routing, and persistence
 */

import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './i18n/config';

export default createMiddleware({
  // A list of all locales that are supported
  locales: locales,

  // Used when no locale matches
  defaultLocale: defaultLocale,

  // Strategy for locale detection
  localeDetection: true,

  // Prefix strategy - 'always' means /en/products, /th/products
  localePrefix: 'always'
});

export const config = {
  // Match only internationalized pathnames
  matcher: [
    '/',
    '/(en|th)/:path*',
    // Exclude internal API routes
    '/((?!api|_next|_vercel|.*\\..*|public).*)'
  ]
};
