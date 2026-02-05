'use client';

import { addItem, useUIStore } from '@/stores/ui-store';
import React from 'react';

// biome-ignore lint/suspicious/noExplicitAny: Product structure is complex
export default function MegastorePage({ products }: { products: any[] }) {
  const { openCart } = useUIStore();

  // biome-ignore lint/suspicious/noExplicitAny: Product structure is complex
  const handleQuickAdd = (e: React.MouseEvent, product: any) => {
    e.preventDefault(); // Prevent navigation
    addItem({
      id: product.id,
      productId: product.id,
      quantity: 1,
    });
    openCart();
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {products.map((product) => (
        <div key={product.id} className="border p-4 rounded-lg bg-brand-surface">
          <h2 className="text-xl font-bold">{product.title}</h2>
          <button
            type="button"
            onClick={(e) => handleQuickAdd(e, product)}
            className="mt-2 bg-blue-600 text-white px-4 py-2 rounded"
          >
            Quick Add
          </button>
        </div>
      ))}
    </div>
  );
}
