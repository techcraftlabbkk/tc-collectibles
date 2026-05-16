import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales } from '@/i18n/config';

export default getRequestConfig(async ({ requestLocale }) => {
  // Use the new next-intl v3.22+ requestLocale API
  const locale = await requestLocale;

  // Validate that the incoming `locale` is valid
  if (!locale || !locales.includes(locale as any)) {
    notFound();
  }

  return {
    locale,
    messages: (await import(`@/messages/${locale}.json`)).default,
    timeZone: 'Asia/Bangkok',
    now: new Date()
  };
});
