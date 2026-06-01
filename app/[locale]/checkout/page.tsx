'use client';

import { useTranslations, useLocale } from 'next-intl';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useCartStore } from '@/lib/cartStore';

type Step = 'address' | 'review';

interface FormData {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  note: string;
  agreeTerms: boolean;
}

const SHIPPING_FEE = 150;

export default function Checkout() {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const { items, getTotalPrice, clearCart } = useCartStore();

  const [step, setStep] = useState<Step>('address');
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const placedRef = useRef(false); // prevents items=0 redirect after cart cleared on success
  const errorRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const [form, setForm] = useState<FormData>({
    name: '', email: '', phone: '', address: '', city: '', postalCode: '', note: '', agreeTerms: false,
  });

  const subtotal = getTotalPrice();
  const total = subtotal + (items.length > 0 ? SHIPPING_FEE : 0);

  // Auth guard + prefill
  // NOTE: items.length intentionally excluded from deps — we only need to guard on mount/locale
  // change. Including it caused a race condition where clearCart() (called on successful order)
  // triggered this effect and router.push('/products') would race against router.push('/payment/...')
  useEffect(() => {
    // Check empty cart synchronously BEFORE any async call so placedRef is read immediately
    if (items.length === 0 && !placedRef.current) { router.push(`/${locale}/products`); return; }
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.push(`/${locale}/auth/login`); return; }
      // Pre-fill email from auth
      setForm(f => ({ ...f, email: session.user.email ?? '' }));
    };
    init();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router, locale]);

  const set = (field: keyof FormData, value: string | boolean) =>
    setForm(f => ({ ...f, [field]: value }));

  const validateAddress = (data: FormData = form) => {
    if (!data.name.trim())       return 'Full name is required';
    if (!data.email.trim())      return 'Email is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) return 'Please enter a valid email address';
    if (!data.phone.trim())      return 'Phone number is required';
    if (!data.address.trim())    return 'Address is required';
    if (!data.city.trim())       return 'City is required';
    if (!data.postalCode.trim()) return 'Postal code is required';
    return null;
  };

  const handleContinue = (data: FormData = form) => {
    const err = validateAddress(data);
    if (err) {
      setError(err);
      // Scroll the error into view so the user sees it regardless of scroll position
      setTimeout(() => errorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 50);
      return;
    }
    setError(null);
    setStep('review');
  };

  const handlePlaceOrder = async () => {
    if (!form.agreeTerms) { setError('Please agree to the terms and conditions.'); return; }
    setError(null);
    setPlacing(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.push(`/${locale}/auth/login`); return; }

      const shippingAddress = `${form.address}, ${form.city} ${form.postalCode}`;

      // 1. Create order
      // Build order payload — only include customer_name/email if the columns exist
      // (migration 20260502_add_customer_info_to_orders.sql must be run in Supabase first)
      const orderPayload: Record<string, unknown> = {
        user_id: session.user.id,
        total,
        status: 'pending_payment',
        shipping_address: shippingAddress,
        phone: form.phone,
        shipping_note: form.note || null,
      };

      // Try inserting with optional columns first, fall back without them on schema error
      let order: { id: string } | null = null;
      let orderErr: { message: string } | null = null;

      const withExtra = await supabase
        .from('orders')
        .insert({ ...orderPayload, customer_name: form.name, customer_email: form.email })
        .select()
        .single();

      if (withExtra.error?.message?.includes('schema cache') || withExtra.error?.message?.includes('customer_')) {
        // Columns not yet in DB — insert without them
        const withoutExtra = await supabase
          .from('orders')
          .insert(orderPayload)
          .select()
          .single();
        order = withoutExtra.data;
        orderErr = withoutExtra.error;
      } else {
        order = withExtra.data;
        orderErr = withExtra.error;
      }

      if (orderErr || !order) throw new Error(orderErr?.message ?? 'Failed to create order');

      // 2. Insert order items
      const { error: itemsErr } = await supabase.from('order_items').insert(
        items.map(item => ({
          order_id: order.id,
          product_id: item.product_id,
          quantity: item.quantity,
          price_at_purchase: item.price,
        }))
      );
      if (itemsErr) {
        // Clean up the orphaned order row before surfacing the error
        await supabase.from('orders').delete().eq('id', order.id);
        throw new Error(itemsErr.message);
      }

      // 3. Send order confirmation email (fire-and-forget)
      fetch('/api/orders/send-confirmation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: order.id, customerEmail: form.email, customerName: form.name, total, items }),
      }).catch(() => {});

      // 4. Clear cart and redirect to payment
      placedRef.current = true;
      clearCart();
      router.push(`/${locale}/payment/${order.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
      setPlacing(false);
    }
  };

  const inp = 'w-full px-4 py-3 border-2 border-emerald-200 rounded-xl focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 font-medium text-gray-900 placeholder-gray-400 transition';
  const label = 'block text-xs font-bold text-gray-600 uppercase tracking-widest mb-2';

  const steps = [
    { id: 'address', label: 'Shipping Info', icon: '📍' },
    { id: 'review',  label: 'Review & Pay',  icon: '✓' },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <section className="w-full px-4 py-10 bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-black">{t('checkout.title')}</h1>
          <p className="text-base text-emerald-200 mt-1">Secure checkout · PromptPay payment</p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 py-10">

        {/* Step indicator */}
        <div className="flex items-center gap-2 mb-10 max-w-xs">
          {steps.map((s, i) => {
            const done = step === 'review' && s.id === 'address';
            const active = s.id === step;
            return (
              <div key={s.id} className="flex items-center gap-2">
                <div className={`flex items-center gap-2 ${active ? 'opacity-100' : done ? 'opacity-80' : 'opacity-40'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                    done ? 'bg-green-500 text-white' : active ? 'bg-emerald-600 text-white ring-4 ring-emerald-100' : 'bg-gray-200 text-gray-500'
                  }`}>
                    {done ? '✓' : i + 1}
                  </div>
                  <span className={`text-xs font-bold ${active ? 'text-emerald-700' : 'text-gray-500'}`}>{s.label}</span>
                </div>
                {i < steps.length - 1 && <div className="w-8 h-0.5 bg-gray-200 mx-1" />}
              </div>
            );
          })}
        </div>

        {/* Error banner */}
        {error && (
          <div ref={errorRef} className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
            ⚠️ {error}
            <button onClick={() => setError(null)} className="ml-auto text-red-400 hover:text-red-600 font-bold">✕</button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ── Form ── */}
          <div className="lg:col-span-2">

            {/* STEP 1 — Address */}
            {step === 'address' && (
              <div ref={formRef} className="bg-white border-2 border-emerald-100 rounded-2xl p-8 space-y-5">
                <div className="flex items-center gap-3 pb-5 border-b-2 border-emerald-50">
                  <span className="text-2xl">📍</span>
                  <h2 className="text-xl font-black text-gray-900">{t('checkout.shippingAddress')}</h2>
                </div>

                <div>
                  <label className={label}>{t('checkout.fullName')}</label>
                  <input type="text" value={form.name} onChange={e => set('name', e.target.value)} onBlur={e => set('name', e.target.value)} autoComplete="name" placeholder="Somchai Rakdee" className={inp} />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={label}>{t('checkout.email')}</label>
                    <input type="email" value={form.email} onChange={e => set('email', e.target.value)} onBlur={e => set('email', e.target.value)} autoComplete="email" placeholder="you@email.com" className={inp} />
                  </div>
                  <div>
                    <label className={label}>{t('checkout.phone')}</label>
                    <input type="tel" value={form.phone} onChange={e => set('phone', e.target.value)} onBlur={e => set('phone', e.target.value)} autoComplete="tel" placeholder="08x-xxx-xxxx" className={inp} />
                  </div>
                </div>

                <div>
                  <label className={label}>{t('checkout.address')}</label>
                  <input type="text" value={form.address} onChange={e => set('address', e.target.value)} onBlur={e => set('address', e.target.value)} autoComplete="street-address" placeholder="123 Sukhumvit Rd, Watthana" className={inp} />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={label}>{t('checkout.city')}</label>
                    <input type="text" value={form.city} onChange={e => set('city', e.target.value)} onBlur={e => set('city', e.target.value)} autoComplete="address-level2" placeholder="Bangkok" className={inp} />
                  </div>
                  <div>
                    <label className={label}>{t('checkout.postalCode')}</label>
                    <input type="text" value={form.postalCode} onChange={e => set('postalCode', e.target.value)} onBlur={e => set('postalCode', e.target.value)} autoComplete="postal-code" placeholder="10110" className={inp} />
                  </div>
                </div>

                <div>
                  <label className={label}>Delivery Note <span className="text-gray-400 normal-case font-normal">(optional)</span></label>
                  <textarea value={form.note} onChange={e => set('note', e.target.value)} placeholder="e.g. Leave at reception" rows={2} className={`${inp} resize-none`} />
                </div>

                <button
                  type="button"
                  onClick={() => {
                    // Capture any browser-autofilled values that never fired React's
                    // onChange. Build the values synchronously so validation sees them
                    // immediately (setState is async and would otherwise lag a click).
                    const captured: FormData = { ...form };
                    if (formRef.current) {
                      const inputs = formRef.current.querySelectorAll<HTMLInputElement>('input');
                      inputs.forEach(input => {
                        const ac = input.getAttribute('autocomplete');
                        if (!input.value) return;
                        if (ac === 'name') captured.name = input.value;
                        else if (ac === 'email') captured.email = input.value;
                        else if (ac === 'tel') captured.phone = input.value;
                        else if (ac === 'street-address') captured.address = input.value;
                        else if (ac === 'address-level2') captured.city = input.value;
                        else if (ac === 'postal-code') captured.postalCode = input.value;
                      });
                      setForm(captured);
                    }
                    handleContinue(captured);
                  }}
                  className="w-full bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-gray-900 py-4 rounded-xl font-bold text-base transition-all active:scale-95 shadow-lg shadow-amber-100 mt-2"
                >
                  Review Order →
                </button>
              </div>
            )}

            {/* STEP 2 — Review + PromptPay */}
            {step === 'review' && (
              <div className="space-y-5">

                {/* Order items review */}
                <div className="bg-white border-2 border-emerald-100 rounded-2xl p-6">
                  <div className="flex items-center justify-between pb-4 border-b-2 border-emerald-50 mb-4">
                    <h2 className="text-base font-black text-gray-900">Your Items ({items.length})</h2>
                    <button onClick={() => setStep('address')} className="text-xs text-emerald-600 font-bold hover:underline">← Edit address</button>
                  </div>
                  <div className="space-y-3">
                    {items.map(item => (
                      <div key={item.product_id} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex-shrink-0 flex items-center justify-center text-lg overflow-hidden">
                          {item.image_url
                            ? <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />
                            : '🃏'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-gray-800 truncate">{item.title}</p>
                          {item.grade && <p className="text-xs text-gray-400">{item.grade} · qty {item.quantity}</p>}
                        </div>
                        <p className="text-sm font-black text-emerald-600 flex-shrink-0">฿{(item.price * item.quantity).toLocaleString()}</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 pt-3 border-t-2 border-emerald-50 space-y-1">
                    <p className="text-xs text-gray-500">Ship to: <span className="font-semibold text-gray-700">{form.name} · {form.address}, {form.city} {form.postalCode}</span></p>
                    <p className="text-xs text-gray-500">Phone: <span className="font-semibold text-gray-700">{form.phone}</span></p>
                  </div>
                </div>

                {/* PromptPay info */}
                <div className="bg-gradient-to-br from-blue-50 to-teal-50 border-2 border-blue-200 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-2xl">📱</span>
                    <h3 className="font-black text-blue-900">How you&apos;ll pay — PromptPay</h3>
                  </div>
                  <ol className="text-sm text-blue-800 space-y-2 list-decimal list-inside">
                    <li>Click <strong>Place Order</strong> below</li>
                    <li>You&apos;ll be taken to your personal PromptPay QR code</li>
                    <li>Scan with any Thai banking app and pay the exact amount</li>
                    <li>We&apos;ll confirm your order within 1–2 hours</li>
                  </ol>
                  <p className="text-xs text-blue-600 mt-3 font-medium">Account name: {process.env.NEXT_PUBLIC_PROMPTPAY_ACCOUNT_NAME || 'TC Collectibles'}</p>
                </div>

                {/* Terms + Place Order */}
                <div className="bg-white border-2 border-emerald-100 rounded-2xl p-6 space-y-4">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.agreeTerms}
                      onChange={e => set('agreeTerms', e.target.checked)}
                      className="w-4 h-4 mt-0.5 accent-emerald-600 flex-shrink-0"
                    />
                    <span className="text-sm text-gray-700">
                      {t('checkout.agreeToTerms')} — All sales are final. Graded card condition as described.{' '}
                      <Link href={`/${locale}/terms`} className="text-emerald-600 hover:underline">Terms &amp; Conditions</Link>
                    </span>
                  </label>

                  <button
                    type="button"
                    onClick={handlePlaceOrder}
                    disabled={placing || !form.agreeTerms}
                    className={`w-full py-4 rounded-xl font-bold text-base transition-all ${
                      placing || !form.agreeTerms
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-gray-900 active:scale-95 shadow-lg shadow-amber-100'
                    }`}
                  >
                    {placing ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                        </svg>
                        Placing order…
                      </span>
                    ) : (
                      `${t('checkout.placeOrder')} →`
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* ── Order Summary sidebar ── */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-200 rounded-2xl p-6 sticky top-8">
              <h2 className="text-sm font-black text-gray-700 uppercase tracking-widest mb-5">Order Summary</h2>

              <div className="space-y-3 mb-5">
                {items.map(item => (
                  <div key={item.product_id} className="flex justify-between items-center text-sm">
                    <span className="text-gray-600 truncate max-w-[140px]">{item.title} {item.quantity > 1 ? `×${item.quantity}` : ''}</span>
                    <span className="font-bold text-gray-900 flex-shrink-0">฿{(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>

              <div className="border-t-2 border-emerald-200 pt-4 space-y-2 mb-5">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-bold">฿{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-bold">฿{SHIPPING_FEE.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-baseline pt-1 border-t border-emerald-200">
                  <span className="font-black text-gray-900">Total</span>
                  <span className="text-3xl font-black text-emerald-600">฿{total.toLocaleString()}</span>
                </div>
              </div>

              <div className="space-y-2">
                {[{ icon: '🔒', text: 'Secure PromptPay' }, { icon: '📦', text: 'Safe packaging' }, { icon: '🛡️', text: 'PSA certified' }].map(b => (
                  <div key={b.text} className="flex items-center gap-2 text-xs text-gray-600 font-medium">
                    <span>{b.icon}</span>{b.text}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
