'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useState } from 'react';

// biome-ignore lint/suspicious/noExplicitAny: Rental data
export default function RentalsList({ rentals }: { rentals: any[] }) {
  const t = useTranslations('Account');
  const [selectedRental, setSelectedRental] = useState<string | null>(null);

  if (!rentals || rentals.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow border border-slate-100 text-center text-slate-500">
        {t('no_rentals')}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {rentals.map((rental) => (
        <div
          key={rental.id}
          className="bg-white p-6 rounded-lg shadow border border-slate-100"
        >
          <div className="flex items-center gap-4 mb-4">
            {rental.product?.image_url && (
              <div className="relative w-16 h-16 rounded overflow-hidden">
                <Image
                  src={rental.product.image_url}
                  alt={rental.product?.name || 'Product Image'}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <div>
              <h3 className="font-semibold text-lg">{rental.product?.name}</h3>
              <p className="text-sm text-slate-500">
                {t('rented_on')} {new Date(rental.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="flex justify-between items-center text-sm">
            <span
              className={`px-3 py-1 rounded-full ${
                rental.status === 'active'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-slate-100 text-slate-700'
              }`}
            >
              {rental.status}
            </span>
            {rental.status === 'active' && (
              <button
                type="button"
                onClick={() => setSelectedRental(rental.id)}
                className="text-blue-600 hover:underline font-medium"
              >
                {t('return_item')}
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
