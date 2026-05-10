'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';

export default function Payment({ params }: { params: { orderId: string } }) {
  const t = useTranslations();
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="w-full px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">{t('payment.title')}</h1>

        <div className="bg-white border rounded-lg p-8">
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4">{t('payment.promptpay')}</h2>
            <p className="text-gray-600 mb-4">{t('payment.scanQR')}</p>

            {qrCode ? (
              <div className="flex justify-center mb-8">
                <div className="bg-gray-100 p-4 rounded-lg">
                  <div className="w-48 h-48 bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-400">{t('common.loading')}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex justify-center mb-8">
                <div className="bg-gray-200 w-48 h-48 rounded-lg flex items-center justify-center">
                  <span className="text-gray-400">{t('common.loading')}</span>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4 border-t pt-6">
            <div className="flex justify-between">
              <span className="font-semibold">{t('payment.reference')}:</span>
              <span className="font-mono">{params.orderId}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">{t('payment.amount')}:</span>
              <span>฿0</span>
            </div>
          </div>

          <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-900">
            <p className="font-semibold mb-2">{t('payment.promptpay')} {t('common.loading')}</p>
            <ul className="list-disc list-inside space-y-1 text-xs">
              <li>Use your banking app to scan the QR code above</li>
              <li>Verify the amount and reference number</li>
              <li>Complete the payment</li>
              <li>Your order will be updated once payment is received</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
