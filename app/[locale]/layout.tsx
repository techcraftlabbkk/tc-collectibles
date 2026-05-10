<<<<<<< HEAD
'use client';

import { ReactNode } from 'react';
import { useLocale } from 'next-intl';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { locales } from '@/i18n/config';

export default function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: { locale: string };
}) {
  const locale = useLocale();

  // Validate locale
  if (!locales.includes(locale as any)) {
    return null;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
=======
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ToastProvider } from '@/lib/hooks/useToast';
import { ReactNode } from 'react';

interface LocaleLayoutProps {
  children: ReactNode;
}

export default function LocaleLayout({ children }: LocaleLayoutProps) {
  return (
    <ToastProvider>
      <Header />
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {children}
      </main>
      <Footer />
    </ToastProvider>
>>>>>>> 5ba90b22ffae258d62b7ff24ca18b56f04f361e7
  );
}
