import { getRequestConfig } from 'next-intl/server';
import { locales } from '@/i18n/config';

export default getRequestConfig(async ({ locale }) => {
  // Validate that the incoming `locale` is valid
  if (!locales.includes(locale as any)) {
    throw new Error(`Invalid locale: ${locale}`);
  }

  return {
    messages: (await import(`@/messages/${locale}.json`)).default,
<<<<<<< HEAD
    timeZone: 'Asia/Bangkok',
    now: new Date()
=======
>>>>>>> 5ba90b22ffae258d62b7ff24ca18b56f04f361e7
  };
});
