'use client';

import { useCartStore } from '@/stores/cart-store';
import { useUIStore } from '@/stores/ui-store';
import { Button } from '@repo/ui';
import { AnimatePresence, motion } from 'framer-motion';
import { Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export function CartDrawer() {
  const { isCartOpen, closeCart } = useUIStore();
  const { items, removeItem, updateQuantity, total } = useCartStore();
  const router = useRouter();

  const handleCheckout = () => {
    closeCart();
    router.push('/checkout');
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-[#121212] border-l border-white/10 shadow-2xl z-[101] flex flex-col"
          >
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <h2 className="text-xl font-black text-white flex items-center gap-2">
                <ShoppingBag className="text-brand-yellow" />
                YOUR CART
                <span className="text-sm font-medium text-slate-500 ml-2">
                  ({items.length} items)
                </span>
              </h2>
              <button
                type="button"
                onClick={closeCart}
                className="p-2 hover:bg-white/10 rounded-full transition-colors text-slate-400 hover:text-white"
              >
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center">
                    <ShoppingBag size={32} className="text-slate-600" />
                  </div>
                  <p className="text-slate-400 text-lg">Your cart is empty</p>
                  <Button
                    onClick={closeCart}
                    variant="outline"
                    className="mt-4 border-white/20 text-white hover:bg-white/10"
                  >
                    Start Shopping
                  </Button>
                </div>
              ) : (
                items.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 bg-white/5 p-4 rounded-2xl border border-white/5"
                  >
                    <div className="relative w-20 h-20 bg-white rounded-xl overflow-hidden shrink-0">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="font-bold text-white leading-tight line-clamp-1">
                          {item.title}
                        </h4>
                        {item.attributes && (
                          <p className="text-xs text-slate-500 mt-1">
                            {Object.entries(item.attributes)
                              .map(([_k, v]) => `${v}`)
                              .join(', ')}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-brand-yellow font-bold">
                          {new Intl.NumberFormat('en-IQ').format(item.price)}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col justify-between items-end">
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="text-slate-500 hover:text-red-500 p-1"
                      >
                        <Trash2 size={16} />
                      </button>
                      <div className="flex items-center gap-3 bg-black/20 rounded-lg p-1">
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          className="p-1 text-slate-400 hover:text-white disabled:opacity-50"
                          disabled={item.quantity <= 1}
                        >
                          <Minus size={14} />
                        </button>
                        <span className="text-sm font-bold text-white w-4 text-center">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          className="p-1 text-slate-400 hover:text-white"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {items.length > 0 && (
              <div className="p-6 bg-[#121212] border-t border-white/10 space-y-4">
                <div className="flex justify-between items-center text-slate-400">
                  <span>Subtotal</span>
                  <span>{new Intl.NumberFormat('en-IQ').format(total)} IQD</span>
                </div>
                <div className="flex justify-between items-center text-xl font-black text-white">
                  <span>Total</span>
                  <span>{new Intl.NumberFormat('en-IQ').format(total)} IQD</span>
                </div>
                <Button
                  onClick={handleCheckout}
                  className="w-full h-14 bg-brand-yellow text-brand-dark font-bold text-lg hover:bg-white"
                >
                  Checkout
                </Button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
