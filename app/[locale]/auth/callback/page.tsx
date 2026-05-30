'use client';

import { useEffect, useState } from 'react';
import { useLocale } from 'next-intl';
import { supabase } from '@/lib/supabase';

export default function AuthCallbackPage() {
  const locale = useLocale();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Verifying your login...');

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ''));

        const errorParam = urlParams.get('error') || hashParams.get('error');
        const errorCode = urlParams.get('error_code') || hashParams.get('error_code');
        const errorDescription =
          urlParams.get('error_description') || hashParams.get('error_description');

        if (errorParam) {
          setStatus('error');
          const friendly =
            errorCode === 'otp_expired'
              ? 'This sign-in link has expired or was already used. Please request a new one.'
              : (errorDescription || 'Authentication failed. Please try again.').replace(/\+/g, ' ');
          setMessage(friendly);
          setTimeout(() => { window.location.href = `/${locale}/auth/login`; }, 3500);
          return;
        }

        // --- PKCE flow: code in query params ---
        const code = urlParams.get('code');
        if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(code);
          if (!error) {
            setStatus('success');
            setMessage('Login successful! Redirecting...');
            // Hard redirect so the full page re-mounts with the new session
            setTimeout(() => { window.location.href = `/${locale}`; }, 1200);
            return;
          }
          // PKCE exchange failed — fall through to session check below
          console.warn('exchangeCodeForSession failed:', error.message);
        }

        // --- Implicit flow: access_token in URL hash ---
        // The Supabase client auto-detects hash tokens on init (detectSessionInUrl: true).
        // Give it a moment to process, then check.
        await new Promise(r => setTimeout(r, 500));

        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          setStatus('success');
          setMessage('Login successful! Redirecting...');
          setTimeout(() => { window.location.href = `/${locale}`; }, 1200);
          return;
        }

        // Nothing worked
        setStatus('error');
        setMessage('No valid authentication token found. Please try logging in again.');
        setTimeout(() => { window.location.href = `/${locale}/auth/login`; }, 3000);
      } catch (err) {
        console.error('Auth callback error:', err);
        setStatus('error');
        setMessage('Something went wrong. Please try again.');
        setTimeout(() => { window.location.href = `/${locale}/auth/login`; }, 3000);
      }
    };

    handleCallback();
  }, [locale]);

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
