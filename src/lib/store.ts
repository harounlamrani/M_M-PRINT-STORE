import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { CartItem, CartState, Product, ProductVariant } from './types';

interface CartStore extends CartState {
  addItem: (product: Product, variant: ProductVariant, quantity: number, selectedOptions: Record<string, string>) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  getItemCount: () => number;
  getSubtotal: () => number;
  getItemById: (itemId: string) => CartItem | undefined;
  hasProduct: (productId: string, variantId: string) => boolean;
}

const generateItemId = (productId: string, variantId: string, options: Record<string, string>) => {
  const optionStr = Object.entries(options).sort(([a], [b]) => a.localeCompare(b)).map(([, v]) => v).join('-');
  return `${productId}-${variantId}-${optionStr}`;
};

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (product, variant, quantity, selectedOptions) => {
        const itemId = generateItemId(product.id, variant.id, selectedOptions);
        const existingItem = get().items.find((item) => item.id === itemId);

        if (existingItem) {
          set((state) => ({
            items: state.items.map((item) =>
              item.id === itemId ? { ...item, quantity: item.quantity + quantity } : item
            ),
          }));
        } else {
          const newItem: CartItem = {
            id: itemId,
            productId: product.id,
            variantId: variant.id,
            quantity,
            selectedOptions,
            snapshot: {
              name: product.name,
              image: variant.image || product.images[0]?.src || '',
              price: variant.price,
              variantName: variant.name,
            },
          };
          set((state) => ({ items: [...state.items, newItem] }));
        }
        get().openCart();
      },

      removeItem: (itemId) => {
        set((state) => ({ items: state.items.filter((item) => item.id !== itemId) }));
      },

      updateQuantity: (itemId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(itemId);
          return;
        }
        set((state) => ({
          items: state.items.map((item) =>
            item.id === itemId ? { ...item, quantity } : item
          ),
        }));
      },

      clearCart: () => set({ items: [] }),

      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),

      getItemCount: () => get().items.reduce((sum, item) => sum + item.quantity, 0),

      getSubtotal: () => get().items.reduce((sum, item) => sum + item.snapshot.price * item.quantity, 0),

      getItemById: (itemId) => get().items.find((item) => item.id === itemId),

      hasProduct: (productId, variantId) =>
        get().items.some((item) => item.productId === productId && item.variantId === variantId),
    }),
    {
      name: 'mm-cart-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items }),
    }
  )
);