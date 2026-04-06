import { useCartStore } from '../store/cart.store'

export function useCart() {
  const items = useCartStore((state) => state.items)
  const addItem = useCartStore((state) => state.addItem)
  const removeItem = useCartStore((state) => state.removeItem)
  const clearCart = useCartStore((state) => state.clearCart)

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0)

  return {
    items,
    addItem,
    removeItem,
    clearCart,
    subtotal,
  }
}