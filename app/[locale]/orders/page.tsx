'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';

export default function Orders() {
  const t = useTranslations();
  const [orders] = useState([]);

  return (
    <div className="w-full px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">{t('orders.title')}</h1>

        {orders.length === 0 ? (
          <div className="bg-white border rounded-lg p-8 text-center">
            <p className="text-gray-600">{t('orders.noOrders')}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-bold">{t('orders.orderId')}</th>
                  <th className="text-left py-3 px-4 font-bold">{t('orders.date')}</th>
                  <th className="text-left py-3 px-4 font-bold">{t('orders.total')}</th>
                  <th className="text-left py-3 px-4 font-bold">{t('orders.status')}</th>
                  <th className="text-left py-3 px-4 font-bold">{t('orders.viewDetails')}</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order: any) => (
                  <tr key={order.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">{order.id}</td>
                    <td className="py-3 px-4">{order.date}</td>
                    <td className="py-3 px-4">฿{order.total}</td>
                    <td className="py-3 px-4">
                      <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-sm">
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <button className="text-blue-600 hover:underline">
                        {t('orders.viewDetails')}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
