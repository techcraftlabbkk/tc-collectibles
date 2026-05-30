import type { Metadata } from 'next';
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
        {children}
      </body>
    </html>
  );
}
