'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { X, Plus, Minus, Trash2, ChevronLeft } from 'lucide-react';
import { useCartStore } from '@/lib/store';
import { formatPrice } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import type { CartItem as CartItemType } from '@/lib/types';

export function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, getSubtotal, getItemCount } = useCartStore();
  const subtotal = getSubtotal();
  const itemCount = getItemCount();

  if (!isOpen) return null;

  return (
    <>
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 bg-mm-black/60 backdrop-blur-sm"
          onClick={closeCart}
          aria-hidden="true"
        />
      </AnimatePresence>
      <AnimatePresence>
        {isOpen && (
          <motion.aside
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed right-0 top-0 h-full z-50 w-full max-w-md bg-mm-black-soft border-l border-mm-gray-border flex flex-col"
          role="dialog"
          aria-modal="true"
          aria-label="Panier"
        >
          <div className="flex items-center justify-between p-4 border-b border-mm-gray-border">
            <h2 className="text-heading-md font-chillax font-bold">Panier</h2>
            <button
              onClick={closeCart}
              className="p-2 text-mm-white/70 hover:text-mm-white transition-colors"
              aria-label="Fermer le panier"
            >
              <X className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-12">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring', stiffness: 100 }}
                  className="mb-4 p-4 rounded-full bg-mm-gray"
                >
                  <svg className="h-10 w-10 text-mm-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a2 2 0 00-2-2H6a2 2 0 00-2 2v4m0 0l-4 4m4-4h18m-4 4v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4m16 0l4-4" />
                  </svg>
                </motion.div>
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-body-lg text-mm-white/70 mb-2"
                >
                  Votre panier est vide
                </motion.p>
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-body-sm text-mm-white/50 mb-6 max-w-xs"
                >
                  Ajoutez des produits pour commencer votre commande
                </motion.p>
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  onClick={() => closeCart()}
                  className="btn-primary"
                >
                  Continuer vos achats
                </motion.button>
              </div>
            ) : (
              <ul className="space-y-4" role="list">
                {items.map((item, index) => (
                  <CartItem key={item.id} item={item} index={index} onRemove={removeItem} onUpdateQuantity={updateQuantity} />
                ))}
              </ul>
            )}
          </div>

          {items.length > 0 && (
            <div className="border-t border-mm-gray-border p-4 space-y-4">
              <div className="flex items-center justify-between text-body-md">
                <span className="text-mm-white/70">Sous-total ({itemCount} article{itemCount > 1 ? 's' : ''})</span>
                <span className="text-mm-white font-medium">{formatPrice(subtotal)}</span>
              </div>

              <p className="text-body-sm text-mm-white/50">
                La livraison sera calculée à l'étape suivante
              </p>

              <Button
                onClick={closeCart}
                variant="primary"
                size="lg"
                className="w-full"
              >
                Commander
              </Button>

              <Button
                onClick={closeCart}
                variant="secondary"
                size="lg"
                className="w-full"
              >
                Continuer vos achats
              </Button>
            </div>
          )}
        </motion.aside>
      )}
    </AnimatePresence>
  </>
  );
}

function CartItem({ item, index, onRemove, onUpdateQuantity }: { item: CartItemType; index: number; onRemove: (id: string) => void; onUpdateQuantity: (id: string, qty: number) => void }) {
  return (
    <motion.li
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30, height: 0, padding: 0, margin: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="relative flex gap-4 p-3 bg-mm-black rounded-lg border border-mm-gray-border group"
    >
      <div className="relative h-20 w-20 flex-shrink-0 rounded-md overflow-hidden bg-mm-gray">
        <Image
          src={item.snapshot.image}
          alt={item.snapshot.name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="80px"
        />
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="text-body-md font-medium text-mm-white truncate">{item.snapshot.name}</h3>
        <p className="text-body-sm text-mm-red mt-1">{item.snapshot.variantName}</p>
        <p className="text-body-sm text-mm-white/70 mt-1">{formatPrice(item.snapshot.price)}</p>

        {Object.keys(item.selectedOptions).length > 0 && (
          <p className="text-caption text-mm-white/50 mt-1 truncate">
            {Object.entries(item.selectedOptions).map(([k, v]) => `${k}: ${v}`).join(' • ')}
          </p>
        )}

        <div className="flex items-center gap-3 mt-3">
          <button
            onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
            disabled={item.quantity <= 1}
            className="flex h-8 w-8 items-center justify-center rounded-md bg-mm-gray text-mm-white/70 hover:bg-mm-gray-light hover:text-mm-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label="Diminuer la quantité"
          >
            <Minus className="h-4 w-4" aria-hidden="true" />
          </button>

          <span className="text-body-md font-medium text-mm-white w-8 text-center">{item.quantity}</span>

          <button
            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
            className="flex h-8 w-8 items-center justify-center rounded-md bg-mm-gray text-mm-white/70 hover:bg-mm-gray-light hover:text-mm-white transition-colors"
            aria-label="Augmenter la quantité"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
          </button>

          <button
            onClick={() => onRemove(item.id)}
            className="ml-auto flex h-8 w-8 items-center justify-center rounded-md bg-transparent text-mm-white/50 hover:text-mm-red hover:bg-mm-red/10 transition-colors"
            aria-label="Supprimer l'article"
          >
            <Trash2 className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>

      <div className="text-right">
        <p className="text-body-md font-bold text-mm-white">
          {formatPrice(item.snapshot.price * item.quantity)}
        </p>
      </div>
    </motion.li>
  );
}