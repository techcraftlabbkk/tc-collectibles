'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useParams } from 'next/navigation';
import Link from 'next/link';

export default function WalletSuccessPage() {
  const searchParams = useSearchParams();
  const params = useParams();
  const locale = params?.locale ?? 'en';
  const sessionId = searchParams.get('session_id');

  const [balance, setBalance] = useState<number | null>(null);

  useEffect(() => {
    // Poll balance until it updates (webhook may take a second)
    let attempts = 0;
    const poll = setInterval(async () => {
      attempts++;
      const res = await fetch('/api/3d/wallet/balance');
      if (res.ok) {
        const d = await res.json();
        setBalance(d.balance);
        if (d.balance > 0 || attempts >= 5) clearInterval(poll);
      }
    }, 1500);
    return () => clearInterval(poll);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg p-10 max-w-md w-full text-center">
        <div className="text-5xl mb-4">🎉</div>
        <h1 className="text-2xl font-black text-gray-900 mb-2">Payment Successful!</h1>
        <p className="text-gray-600 mb-4">Your tokens have been added to your wallet.</p>
        {balance !== null ? (
          <div className="bg-purple-50 border border-purple-200 rounded-xl py-4 px-6 mb-6 inline-block">
            <div className="text-xs font-semibold text-purple-500 uppercase tracking-wide mb-1">New Balance</div>
            <div className="text-4xl font-black text-purple-700">⚡ {balance}</div>
          </div>
        ) : (
          <div className="text-gray-400 text-sm mb-6 animate-pulse">Updating balance...</div>
        )}
        <div className="flex gap-3 justify-center">
          <Link href={`/${locale}/3d-studio`}
            className="bg-purple-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-purple-700 transition-colors">
            Start Printing
          </Link>
          <Link href={`/${locale}/3d-studio/wallet`}
            className="bg-gray-100 text-gray-700 px-6 py-3 rounded-xl font-bold hover:bg-gray-200 transition-colors">
            View Wallet
          </Link>
        </div>
      </div>
    </div>
  );
}
