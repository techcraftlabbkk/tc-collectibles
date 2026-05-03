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
  );
}
