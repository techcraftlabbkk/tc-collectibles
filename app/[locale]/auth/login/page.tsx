'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';
import { signIn, signInWithMagicLink } from '@/lib/auth';
import { useToast } from '@/lib/hooks/useToast';
import Card from '@/components/Card';
import Button from '@/components/Button';
import Input from '@/components/Input';

type LoginMode = 'magic' | 'password';

export default function LoginPage() {
  const locale = useLocale();
  const t = useTranslations('pages.auth.login');
  const tToasts = useTranslations('toasts');
  const { toast } = useToast();
  const router = useRouter();

  const [mode, setMode] = useState<LoginMode>('magic');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [magicLinkSent, setMagicLinkSent] = useState(false);

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) { setError('Email is required'); return; }
    if (!password) { setError('Password is required'); return; }

    setLoading(true);
    try {
      const { data, error: authError } = await signIn(email, password);
      if (authError) {
        const msg = authError instanceof Error ? authError.message : 'Invalid email or password';
        setError(msg);
        toast.error(tToasts('auth.login_failed.message'), {
          description: tToasts('auth.login_failed.description'),
        });
        setLoading(false);
        return;
      }
      if (data?.session) {
        toast.success(tToasts('auth.login_success'));
        router.push(`/${locale}`);
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
      setLoading(false);
    }
  };

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) { setError('Email is required'); return; }
    if (!email.includes('@')) { setError('Please enter a valid email'); return; }

    setLoading(true);
    try {
      const { error: authError } = await signInWithMagicLink(email);
      if (authError) {
        const msg = authError instanceof Error ? authError.message : 'Failed to send magic link';
        setError(msg);
        toast.error(tToasts('auth.magic_link_failed'));
        setLoading(false);
        return;
      }
      toast.success(tToasts('auth.magic_link_sent'));
      setMagicLinkSent(true);
      setLoading(false);
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
      setLoading(false);
    }
  };

  // Magic link success state
  if (magicLinkSent) {
    return (
      <div className="min-h-screen flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          <Card shadow="lg">
            <div className="text-center py-4">
              <div className="text-6xl mb-4">✉️</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('magic_link_sent')}</h2>
              <p className="text-gray-600 mb-6">{t('magic_link_sent_desc')}</p>
              <p className="text-sm text-gray-500 mb-6">
                {locale === 'en' ? 'Sent to:' : 'ส่งไปยัง:'} <strong>{email}</strong>
              </p>
              <button
                onClick={() => { setMagicLinkSent(false); setEmail(''); }}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium underline"
              >
                {t('back_to_login')}
              </button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <Card shadow="lg">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">{t('title')}</h1>
            <p className="text-gray-600 mt-2">{t('subtitle')}</p>
          </div>

          {/* Mode tabs */}
          <div className="flex rounded-lg border border-gray-200 overflow-hidden mb-6">
            <button
              onClick={() => { setMode('magic'); setError(''); }}
              className={`flex-1 py-2 text-sm font-semibold transition-colors ${
                mode === 'magic'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              ✨ {t('magic_link_tab')}
            </button>
            <button
              onClick={() => { setMode('password'); setError(''); }}
              className={`flex-1 py-2 text-sm font-semibold transition-colors ${
                mode === 'password'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              🔑 {t('password_tab')}
            </button>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Magic Link Form */}
          {mode === 'magic' && (
            <form onSubmit={handleMagicLink} className="space-y-4">
              <Input
                label={t('email')}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                disabled={loading}
              />
              <p className="text-xs text-gray-500">
                {locale === 'en'
                  ? "We'll send you a secure link — click it to sign in instantly."
                  : 'เราจะส่งลิงก์ที่ปลอดภัยให้คุณ — คลิกเพื่อเข้าสู่ระบบทันที'}
              </p>
              <Button
                type="submit"
                className="w-full"
                size="lg"
                isLoading={loading}
                disabled={loading}
              >
                {t('magic_link_button')}
              </Button>
            </form>
          )}

          {/* Password Form */}
          {mode === 'password' && (
            <form onSubmit={handlePasswordLogin} className="space-y-4">
              <Input
                label={t('email')}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                disabled={loading}
              />
              <div>
                <Input
                  label={t('password')}
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  disabled={loading}
                />
                <div className="text-right mt-1">
                  <button
                    type="button"
                    onClick={() => setMode('magic')}
                    className="text-xs text-blue-600 hover:underline"
                  >
                    {t('forgot_password')}
                  </button>
                </div>
              </div>
              <Button
                type="submit"
                className="w-full"
                size="lg"
                isLoading={loading}
                disabled={loading}
              >
                {t('login_button')}
              </Button>
            </form>
          )}

          {/* Sign up link */}
          <div className="mt-6 text-center">
            <p className="text-gray-600 text-sm">
              {t('no_account')}{' '}
              <Link
                href={`/${locale}/auth/signup`}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
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
