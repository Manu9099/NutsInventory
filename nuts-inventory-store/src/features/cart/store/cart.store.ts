import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import type { CartItem } from '../types/cart.types'

interface CartState {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (productId: number) => void
  clearCart: () => void
  setQuantity: (productId: number, quantity: number) => void
  incrementItem: (productId: number) => void
  decrementItem: (productId: number) => void
  getItemQuantity: (productId: number) => number
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) =>
        set((state) => {
          const existing = state.items.find((x) => x.productId === item.productId)

          if (existing) {
            return {
              items: state.items.map((x) =>
                x.productId === item.productId
                  ? { ...x, quantity: x.quantity + item.quantity }
                  : x,
              ),
            }
          }

          return {
            items: [...state.items, item],
          }
        }),

      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((x) => x.productId !== productId),
        })),

      clearCart: () => set({ items: [] }),

      setQuantity: (productId, quantity) =>
        set((state) => {
          if (quantity <= 0) {
            return {
              items: state.items.filter((x) => x.productId !== productId),
            }
          }

          return {
            items: state.items.map((x) =>
              x.productId === productId ? { ...x, quantity } : x,
            ),
          }
        }),

      incrementItem: (productId) =>
        set((state) => ({
          items: state.items.map((x) =>
            x.productId === productId ? { ...x, quantity: x.quantity + 1 } : x,
          ),
        })),

      decrementItem: (productId) =>
        set((state) => ({
          items: state.items
            .map((x) =>
              x.productId === productId ? { ...x, quantity: x.quantity - 1 } : x,
            )
            .filter((x) => x.quantity > 0),
        })),

      getItemQuantity: (productId) => {
        const item = get().items.find((x) => x.productId === productId)
        return item?.quantity ?? 0
      },
    }),
    {
      name: 'nutsinventory-cart',
      storage: createJSONStorage(() => localStorage),
    },
  ),
)