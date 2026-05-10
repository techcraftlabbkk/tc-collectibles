import type { Metadata } from 'next';
<<<<<<< HEAD
import { ReactNode } from 'react';
import './globals.css';

export const metadata: Metadata = {
  title: 'TC Collectibles - PSA Pokémon Cards Marketplace',
  description: 'Buy and sell graded PSA Pokémon trading cards online',
  keywords: ['pokemon', 'cards', 'psa', 'collectibles', 'trading cards', 'graded'],
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html suppressHydrationWarning>
      <body className="bg-white text-gray-900">
=======
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
>>>>>>> 5ba90b22ffae258d62b7ff24ca18b56f04f361e7
        {children}
      </body>
    </html>
  );
}
