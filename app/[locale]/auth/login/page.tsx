'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useState } from 'react';

export default function Login() {
  const t = useTranslations();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Login logic will be added
    setIsLoading(false);
  };

  return (
    <div className="w-full px-4 py-12">
      <div className="max-w-md mx-auto">
        <div className="bg-white border rounded-lg p-8">
          <h1 className="text-3xl font-bold mb-8 text-center">{t('auth.login')}</h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-2">
                {t('auth.email')}
              </label>
              <input
                type="email"
                className="w-full border rounded px-3 py-2"
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">
                {t('auth.password')}
              </label>
              <input
                type="password"
                className="w-full border rounded px-3 py-2"
                required
                disabled={isLoading}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition disabled:bg-gray-400"
            >
              {isLoading ? t('common.loading') : t('auth.loginButton')}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600 text-sm">
              {t('auth.noAccount')}{' '}
              <Link href="/auth/signup" className="text-blue-600 hover:underline font-semibold">
                {t('auth.signupButton')}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
