import { Link } from 'react-router-dom'
import { Minus, Plus, ShoppingCart, Trash2, X } from 'lucide-react'
import { useCart } from '../../features/cart/hooks/useCart'

export function CartDrawer() {
  const {
    items,
    isCartDrawerOpen,
    closeCartDrawer,
    removeItem,
    incrementItem,
    decrementItem,
    subtotal,
    totalItems,
    clearCart,
  } = useCart()

  if (!isCartDrawerOpen) return null

  const shipping = totalItems > 0 ? 10 : 0
  const total = subtotal + shipping

  return (
    <div className="fixed inset-0 z-[60]-">
      <button
        type="button"
        aria-label="Cerrar carrito"
        onClick={closeCartDrawer}
        className="absolute inset-0 bg-stone-900/40 backdrop-blur-[1px]"
      />

      <aside className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col border-l border-stone-200 bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-stone-200 px-5 py-4">
          <div className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5 text-stone-700" />
            <div>
              <h2 className="text-lg font-semibold text-stone-900">Tu carrito</h2>
              <p className="text-xs text-stone-500">
                {totalItems} producto{totalItems === 1 ? '' : 's'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={closeCartDrawer}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-stone-300 text-stone-700 transition hover:bg-stone-50"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
            <div className="rounded-full bg-stone-100 p-4 text-stone-700">
              <ShoppingCart className="h-6 w-6" />
            </div>
            <h3 className="mt-4 text-xl font-semibold text-stone-900">
              Tu carrito está vacío
            </h3>
            <p className="mt-2 text-sm leading-6 text-stone-600">
              Agrega productos para empezar tu compra.
            </p>

            <button
              type="button"
              onClick={closeCartDrawer}
              className="mt-6 rounded-2xl bg-stone-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-stone-800"
            >
              Seguir comprando
            </button>
          </div>
        ) : (
          <>
            <div className="flex-1 space-y-4 overflow-y-auto px-5 py-5">
              {items.map((item) => (
                <article
                  key={item.productId}
                  className="rounded-[1.5rem]- border border-stone-200 bg-stone-50 p-4"
                >
                  <div className="flex gap-4">
                    <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-white">
                      {item.imageUrl ? (
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span className="text-xs font-medium text-stone-500">
                          Sin imagen
                        </span>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="line-clamp-2 text-sm font-semibold text-stone-900">
                            {item.name}
                          </h3>
                          <p className="mt-1 text-xs text-stone-500">
                            S/ {item.price.toFixed(2)} c/u
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeItem(item.productId)}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-full text-red-600 transition hover:bg-red-50"
                          aria-label={`Eliminar ${item.name}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="mt-4 flex items-center justify-between gap-3">
                        <div className="inline-flex items-center rounded-2xl border border-stone-300 bg-white">
                          <button
                            type="button"
                            onClick={() => decrementItem(item.productId)}
                            className="inline-flex h-10 w-10 items-center justify-center rounded-l-2xl text-stone-700 transition hover:bg-stone-50"
                          >
                            <Minus className="h-4 w-4" />
                          </button>

                          <span className="min-w-[2.5rem]- border-x border-stone-300 px-3 text-center text-sm font-semibold text-stone-900">
                            {item.quantity}
                          </span>

                          <button
                            type="button"
                            onClick={() => incrementItem(item.productId)}
                            className="inline-flex h-10 w-10 items-center justify-center rounded-r-2xl text-stone-700 transition hover:bg-stone-50"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>

                        <p className="text-sm font-semibold text-stone-900">
                          S/ {(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <div className="border-t border-stone-200 px-5 py-5">
              <div className="space-y-3 text-sm text-stone-600">
                <div className="flex items-center justify-between">
                  <span>Subtotal</span>
                  <span>S/ {subtotal.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Envío</span>
                  <span>S/ {shipping.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between border-t border-stone-200 pt-3 text-base font-semibold text-stone-900">
                  <span>Total</span>
                  <span>S/ {total.toFixed(2)}</span>
                </div>
              </div>

              <div className="mt-5 grid gap-3">
                <Link
                  to="/checkout"
                  onClick={closeCartDrawer}
                  className="inline-flex items-center justify-center rounded-2xl bg-stone-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-stone-800"
                >
                  Ir al checkout
                </Link>

                <div className="grid grid-cols-2 gap-3">
                  <Link
                    to="/cart"
                    onClick={closeCartDrawer}
                    className="inline-flex items-center justify-center rounded-2xl border border-stone-300 px-4 py-3 text-sm font-semibold text-stone-700 transition hover:bg-stone-50"
                  >
                    Ver carrito
                  </Link>

                  <button
                    type="button"
                    onClick={clearCart}
                    className="inline-flex items-center justify-center rounded-2xl border border-stone-300 px-4 py-3 text-sm font-semibold text-stone-700 transition hover:bg-stone-50"
                  >
                    Vaciar
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </aside>
    </div>
  )
}