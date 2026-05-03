import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { locales } from '@/i18n/config';
import './globals.css';

export const metadata: Metadata = {
  title: 'TC Collectibles - Premium PSA Pokémon Cards',
  description: 'Buy and sell graded PSA Pokémon cards. Premium marketplace for collectors.',
  icons: {
    icon: '/favicon.ico',
  },
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
      <body className="bg-white text-gray-900 min-h-screen flex flex-col">
        {children}
      </body>
    </html>
  );
}
