'use client';

import { signIn } from '@/lib/auth';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { useToast } from '@/lib/hooks/useToast';
import Link from 'next/link';
import Card from '@/components/Card';
import Button from '@/components/Button';
import Input from '@/components/Input';

export default function LoginPage() {
  const locale = useLocale();
  const t = useTranslations('pages.auth.login');
  const tErr = useTranslations('errors');
  const tToasts = useTranslations('toasts');
  const { toast } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data, error: authError } = await signIn(email, password);

      if (authError) {
        const message = authError instanceof Error ? authError.message : tErr('network_error');
        setError(message);
        toast.error(tToasts('auth.login_failed.message'), { description: tToasts('auth.login_failed.description') });
        setLoading(false);
        return;
      }

      if (data?.user) {
        toast.success(tToasts('auth.login_success'));
        router.push(`/${locale}/orders`);
      }
    } catch (err: any) {
      const message = err.message || tErr('network_error');
      setError(message);
      toast.error(tToasts('auth.login_error.message'), { description: tToasts('auth.login_error.description') });
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <Card shadow="lg">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">{t('title')}</h1>
            <p className="text-gray-600 mt-2">{t('subtitle')}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg text-sm">
                {error}
              </div>
            )}

            <Input
              label={t('email')}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />

            <Input
              label={t('password')}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input type="checkbox" className="rounded" />
                <span className="ml-2 text-sm text-gray-600">{t('remember_me')}</span>
              </label>
              <a href="#" className="text-sm text-blue-600 hover:text-blue-700">
                {t('forgot_password')}
              </a>
            </div>

            <Button
              type="submit"
              className="w-full"
              size="lg"
              isLoading={loading}
              disabled={loading}
            >
              {t('submit')}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600 text-sm">
              {t('no_account')}{' '}
              <Link href={`/${locale}/auth/signup`} className="text-blue-600 hover:text-blue-700 font-medium">
                {t('signup_link')}
              </Link>
            </p>
          </div>
        </Card>

        <p className="text-center text-gray-500 text-xs mt-6">
          {locale === 'en'
            ? '© 2026 TC Collectibles. All rights reserved.'
            : '© 2026 TC Collectibles สงวนสิทธิ์'}
        </p>
      </div>
    </div>
  );
}
