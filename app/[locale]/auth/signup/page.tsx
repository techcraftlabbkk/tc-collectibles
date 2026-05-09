'use client';

import { signUp } from '@/lib/auth';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { useToast } from '@/lib/hooks/useToast';
import Link from 'next/link';
import Card from '@/components/Card';
import Button from '@/components/Button';
import Input from '@/components/Input';

export default function SignupPage() {
  const locale = useLocale();
  const t = useTranslations('pages.auth.signup');
  const tErr = useTranslations('errors');
  const tToasts = useTranslations('toasts');
  const { toast } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const router = useRouter();

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!fullName.trim()) errors.fullName = tErr('required_field');
    if (!email.trim()) errors.email = tErr('required_field');
    if (!email.includes('@')) errors.email = tErr('invalid_email');
    if (!password) errors.password = tErr('required_field');
    if (password.length < 6) errors.password = tErr('password_too_short');
    if (password !== confirmPassword) errors.confirmPassword = tErr('password_mismatch');

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const { data: _data, error: authError } = await signUp(email, password, fullName);

      if (authError) {
        const message = authError instanceof Error ? authError.message : tErr('network_error');
        setError(message);
        toast.error(tToasts('auth.signup_failed.message'), { description: tToasts('auth.signup_failed.description') });
        setLoading(false);
        return;
      }

      toast.success(tToasts('auth.signup_success'));
      setSuccess(true);
      setTimeout(() => {
        router.push(`/${locale}/auth/login`);
      }, 2000);
    } catch (err: any) {
      const message = err.message || tErr('network_error');
      setError(message);
      toast.error(tToasts('auth.signup_error.message'), { description: tToasts('auth.signup_error.description') });
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <Card className="max-w-md w-full text-center">
          <div className="text-6xl mb-4">✓</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {locale === 'en' ? 'Account Created!' : 'สร้างบัญชีสำเร็จแล้ว!'}
          </h2>
          <p className="text-gray-600 mb-6">
            {locale === 'en'
              ? 'Check your email to confirm your account. You will be redirected to login.'
              : 'ตรวจสอบอีเมลของคุณเพื่อยืนยันบัญชี คุณจะถูกนำไปยังหน้าเข้าสู่ระบบ'}
          </p>
          <Link href={`/${locale}/auth/login`}>
            <Button className="w-full">{locale === 'en' ? 'Go to Login' : 'ไปยังการเข้าสู่ระบบ'}</Button>
          </Link>
        </Card>
      </div>
    );
  }

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
              label={t('name')}
              type="text"
              value={fullName}
              onChange={(e) => {
                setFullName(e.target.value);
                if (formErrors.fullName) {
                  setFormErrors((prev) => ({ ...prev, fullName: '' }));
                }
              }}
              error={formErrors.fullName}
              placeholder={locale === 'en' ? 'John Doe' : 'นามสกุล นาม'}
            />

            <Input
              label={t('email')}
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (formErrors.email) {
                  setFormErrors((prev) => ({ ...prev, email: '' }));
                }
              }}
              error={formErrors.email}
              placeholder="you@example.com"
            />

            <Input
              label={t('password')}
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (formErrors.password) {
                  setFormErrors((prev) => ({ ...prev, password: '' }));
                }
              }}
              error={formErrors.password}
              placeholder="••••••••"
              helperText={locale === 'en' ? 'At least 6 characters' : 'อย่างน้อย 6 ตัวอักษร'}
            />

            <Input
              label={t('confirm_password')}
              type="password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (formErrors.confirmPassword) {
                  setFormErrors((prev) => ({ ...prev, confirmPassword: '' }));
                }
              }}
              error={formErrors.confirmPassword}
              placeholder="••••••••"
            />

            <label className="flex items-start">
              <input type="checkbox" className="mt-1" required />
              <span className="ml-2 text-sm text-gray-600">
                {t('terms')}
              </span>
            </label>

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
              {t('have_account')}{' '}
              <Link href={`/${locale}/auth/login`} className="text-blue-600 hover:text-blue-700 font-medium">
                {t('login_link')}
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
