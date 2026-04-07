import { useCartStore } from '../store/cart.store'

export function useCart() {
  const items = useCartStore((state) => state.items)
  const isCartDrawerOpen = useCartStore((state) => state.isCartDrawerOpen)
  const cartNotice = useCartStore((state) => state.cartNotice)
  const addItem = useCartStore((state) => state.addItem)
  const removeItem = useCartStore((state) => state.removeItem)
  const clearCart = useCartStore((state) => state.clearCart)
  const setQuantity = useCartStore((state) => state.setQuantity)
  const incrementItem = useCartStore((state) => state.incrementItem)
  const decrementItem = useCartStore((state) => state.decrementItem)
  const getItemQuantity = useCartStore((state) => state.getItemQuantity)
  const openCartDrawer = useCartStore((state) => state.openCartDrawer)
  const closeCartDrawer = useCartStore((state) => state.closeCartDrawer)
  const toggleCartDrawer = useCartStore((state) => state.toggleCartDrawer)
  const setCartNotice = useCartStore((state) => state.setCartNotice)
  const clearCartNotice = useCartStore((state) => state.clearCartNotice)

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0)
  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0)
  const distinctItems = items.length

  return {
    items,
    isCartDrawerOpen,
    cartNotice,
    addItem,
    removeItem,
    clearCart,
    setQuantity,
    incrementItem,
    decrementItem,
    getItemQuantity,
    openCartDrawer,
    closeCartDrawer,
    toggleCartDrawer,
    setCartNotice,
    clearCartNotice,
    subtotal,
    totalItems,
    distinctItems,
  }
}