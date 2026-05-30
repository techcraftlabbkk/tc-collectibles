'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { CREDIT_PACKS } from '@/lib/stripeServer';

interface LedgerEntry {
  id: string;
  amount: number;
  type: 'topup' | 'deduct' | 'refund';
  description: string;
  created_at: string;
}

export default function WalletPage() {
  const router = useRouter();
  const params = useParams();
  const locale = params?.locale ?? 'en';

  const [balance, setBalance] = useState<number | null>(null);
  const [ledger, setLedger] = useState<LedgerEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) { router.push(`/${locale}/auth/login`); return; }
      fetchWallet();
    });
  }, []);

  const fetchWallet = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/3d/wallet/balance');
      if (res.ok) { const d = await res.json(); setBalance(d.balance); setLedger(d.ledger ?? []); }
    } finally {
      setLoading(false);
    }
  };

  const handleTopUp = async (packId: string) => {
    setPurchasing(packId);
    try {
      const res = await fetch('/api/3d/wallet/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ packId, locale }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      window.location.href = data.url;
    } catch (err: any) {
      alert('Checkout failed: ' + err.message);
      setPurchasing(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href={`/${locale}/3d-studio`} className="text-purple-600 hover:underline text-sm font-medium flex items-center gap-1 mb-4">
            ← Back to 3D Studio
          </Link>
          <h1 className="text-3xl font-black text-gray-900">💳 Credit Wallet</h1>
          <p className="text-gray-500 mt-1">Purchase tokens to pay for 3D print orders</p>
        </div>

        {/* Balance card */}
        <div className="bg-gradient-to-br from-purple-600 to-indigo-700 rounded-2xl p-6 text-white mb-8 shadow-lg">
          <div className="text-sm font-semibold opacity-80 mb-1 uppercase tracking-wide">Current Balance</div>
          <div className="text-5xl font-black mb-1">
            {loading ? '...' : balance ?? 0}
          </div>
          <div className="text-purple-200 text-sm">credits available</div>
        </div>

        {/* Credit packs */}
        <div className="mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Top Up</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {CREDIT_PACKS.map(pack => (
              <div key={pack.id}
                className={`bg-white rounded-2xl border-2 p-5 relative shadow-sm ${
                  'popular' in pack && pack.popular ? 'border-purple-500' : 'border-gray-100'
                }`}>
                {'popular' in pack && pack.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                    Most Popular
                  </div>
                )}
                <div className="text-lg font-black text-gray-900 mb-1">{pack.label}</div>
                <div className="text-3xl font-black text-purple-600 mb-1">⚡ {pack.tokens}</div>
                <div className="text-sm text-gray-500 mb-1">tokens</div>
                <div className="text-xs text-gray-400 mb-4">{pack.description}</div>
                <div className="text-lg font-bold text-gray-800 mb-3">฿{pack.priceTHB}</div>
                <button onClick={() => handleTopUp(pack.id)} disabled={purchasing === pack.id}
                  className={`w-full py-2.5 rounded-xl font-bold text-sm transition-all disabled:opacity-60 ${
                    'popular' in pack && pack.popular
                      ? 'bg-purple-600 text-white hover:bg-purple-700'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}>
                  {purchasing === pack.id ? 'Redirecting...' : 'Buy Now'}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Transaction history */}
        {ledger.length > 0 && (
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-4">Transaction History</h2>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              {ledger.map((entry, i) => (
                <div key={entry.id} className={`flex items-center justify-between px-5 py-4 ${i !== ledger.length - 1 ? 'border-b border-gray-50' : ''}`}>
                  <div className="flex items-center gap-3">
                    <span className="text-xl">
                      {entry.type === 'topup' ? '⬆️' : entry.type === 'refund' ? '↩️' : '⬇️'}
                    </span>
                    <div>
                      <div className="text-sm font-medium text-gray-900">{entry.description}</div>
                      <div className="text-xs text-gray-400">
                        {new Date(entry.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                  <span className={`font-bold text-base ${entry.amount > 0 ? 'text-green-600' : 'text-red-500'}`}>
                    {entry.amount > 0 ? '+' : ''}{entry.amount}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {!loading && ledger.length === 0 && (
          <div className="text-center py-8 text-gray-400">
            <div className="text-4xl mb-2">📋</div>
            <div>No transactions yet</div>
          </div>
        )}
      </div>
    </div>
  );
}
