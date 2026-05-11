'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { supabase } from '@/lib/supabase';

export default function AuthCallbackPage() {
  const router = useRouter();
  const locale = useLocale();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Verifying your login...');

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Check for PKCE code in URL query params (Supabase v2 default)
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const errorParam = urlParams.get('error');
        const errorDescription = urlParams.get('error_description');

        if (errorParam) {
          setStatus('error');
          setMessage(errorDescription || 'Authentication failed. Please try again.');
          setTimeout(() => router.push(`/${locale}/auth/login`), 3000);
          return;
        }

        if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(code);
          if (error) {
            setStatus('error');
            setMessage('Could not verify your login. The link may have expired.');
            setTimeout(() => router.push(`/${locale}/auth/login`), 3000);
            return;
          }
          setStatus('success');
          setMessage('Login successful! Redirecting...');
          setTimeout(() => router.push(`/${locale}`), 1500);
          return;
        }

        // Fallback: check if session already exists (hash-based implicit flow)
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          setStatus('success');
          setMessage('Login successful! Redirecting...');
          setTimeout(() => router.push(`/${locale}`), 1500);
        } else {
          setStatus('error');
          setMessage('No authentication token found. Please try logging in again.');
          setTimeout(() => router.push(`/${locale}/auth/login`), 3000);
        }
      } catch {
        setStatus('error');
        setMessage('Something went wrong. Please try again.');
        setTimeout(() => router.push(`/${locale}/auth/login`), 3000);
      }
    };

    handleCallback();
  }, [locale, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center max-w-sm mx-auto px-4">
        {status === 'loading' && (
          <>
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-600">{message}</p>
          </>
        )}
        {status === 'success' && (
          <>
            <div className="text-5xl mb-4">✓</div>
            <p className="text-green-600 font-semibold">{message}</p>
          </>
        )}
        {status === 'error' && (
          <>
            <div className="text-5xl mb-4">✗</div>
            <p className="text-red-600 font-semibold mb-2">Authentication Failed</p>
            <p className="text-gray-500 text-sm">{message}</p>
          </>
        )}
      </div>
    </div>
  );
}
