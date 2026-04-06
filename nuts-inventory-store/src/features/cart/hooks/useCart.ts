import { useCartStore } from '../store/cart.store'

export function useCart() {
  const items = useCartStore((state) => state.items)
  const addItem = useCartStore((state) => state.addItem)
  const removeItem = useCartStore((state) => state.removeItem)
  const clearCart = useCartStore((state) => state.clearCart)
  const setQuantity = useCartStore((state) => state.setQuantity)
  const incrementItem = useCartStore((state) => state.incrementItem)
  const decrementItem = useCartStore((state) => state.decrementItem)
  const getItemQuantity = useCartStore((state) => state.getItemQuantity)

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0)
  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0)
  const distinctItems = items.length

  return {
    items,
    addItem,
    removeItem,
    clearCart,
    setQuantity,
    incrementItem,
    decrementItem,
    getItemQuantity,
    subtotal,
    totalItems,
    distinctItems,
  }
}