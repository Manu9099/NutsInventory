import { Link } from 'react-router-dom'
import {
  ArrowLeft,
  Minus,
  Plus,
  ShoppingCart,
  Trash2,
} from 'lucide-react'
import { useCart } from '../../features/cart/hooks/useCart'

export function CartPage() {
  const {
    items,
    removeItem,
    clearCart,
    subtotal,
    totalItems,
    incrementItem,
    decrementItem,
  } = useCart()

  const shipping = totalItems > 0 ? 10 : 0
  const total = subtotal + shipping

  return (
    <div className="bg-stone-50">
      <section className="border-b border-stone-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <Link
            to="/catalog"
            className="inline-flex items-center gap-2 text-sm font-medium text-stone-600 transition hover:text-stone-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Seguir comprando
          </Link>

          <div className="mt-4 flex items-start gap-3">
            <div className="rounded-2xl bg-stone-100 p-3 text-stone-700">
              <ShoppingCart className="h-6 w-6" />
            </div>

            <div>
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-stone-500">
                Compra
              </p>
              <h1 className="mt-1 text-3xl font-bold tracking-tight text-stone-900">
                Carrito
              </h1>
              <p className="mt-2 text-sm text-stone-600">
                Revisa tus productos antes de pasar al checkout.
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {items.length === 0 ? (
          <div className="-rounded-[2rem] border border-stone-200 bg-white p-10 text-center shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-stone-100 text-stone-700">
              <ShoppingCart className="h-6 w-6" />
            </div>

            <h2 className="mt-5 text-2xl font-semibold text-stone-900">
              Tu carrito está vacío
            </h2>
            <p className="mt-3 text-sm leading-6 text-stone-600">
              Agrega productos desde el catálogo para comenzar tu compra.
            </p>

            <Link
              to="/catalog"
              className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-stone-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-stone-800"
            >
              Ir al catálogo
            </Link>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1.6fr_0.9fr]">
            <section className="space-y-4">
              {items.map((item) => (
                <article
                  key={item.productId}
                  className="-rounded-[2rem] border border-stone-200 bg-white p-5 shadow-sm"
                >
                  <div className="flex flex-col gap-5 sm:flex-row">
                    <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-stone-100">
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

                    <div className="flex min-w-0 flex-1 flex-col justify-between gap-4">
                      <div>
                        <h2 className="text-xl font-semibold text-stone-900">
                          {item.name}
                        </h2>
                        <p className="mt-2 text-sm text-stone-600">
                          Precio unitario: S/ {item.price.toFixed(2)}
                        </p>
                        <p className="mt-1 text-sm font-medium text-stone-800">
                          Subtotal: S/ {(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>

                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="inline-flex w-fit items-center rounded-2xl border border-stone-200 bg-stone-50 p-1">
                          <button
                            type="button"
                            onClick={() => decrementItem(item.productId)}
                            className="inline-flex h-10 w-10 items-center justify-center rounded-xl text-stone-700 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"
                            disabled={item.quantity <= 1}
                            aria-label={`Disminuir cantidad de ${item.name}`}
                          >
                            <Minus className="h-4 w-4" />
                          </button>

                          <span className="-min-w-[3rem] text-center text-sm font-semibold text-stone-900">
                            {item.quantity}
                          </span>

                          <button
                            type="button"
                            onClick={() => incrementItem(item.productId)}
                            className="inline-flex h-10 w-10 items-center justify-center rounded-xl text-stone-700 transition hover:bg-white"
                            aria-label={`Aumentar cantidad de ${item.name}`}
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeItem(item.productId)}
                          className="inline-flex items-center gap-2 rounded-xl border border-red-200 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                          Eliminar
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              ))}

              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={clearCart}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-stone-300 bg-white px-5 py-3 text-sm font-semibold text-stone-700 transition hover:bg-stone-100"
                >
                  <Trash2 className="h-4 w-4" />
                  Vaciar carrito
                </button>

                <Link
                  to="/catalog"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-stone-300 bg-white px-5 py-3 text-sm font-semibold text-stone-700 transition hover:bg-stone-100"
                >
                  Agregar más productos
                </Link>
              </div>
            </section>

            <aside className="h-fit -rounded-[2rem] border border-stone-200 bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-semibold text-stone-900">
                Resumen de compra
              </h2>

              <div className="mt-6 space-y-4 text-sm">
                <div className="flex items-center justify-between text-stone-600">
                  <span>Productos</span>
                  <span>{totalItems}</span>
                </div>

                <div className="flex items-center justify-between text-stone-600">
                  <span>Tipos de producto</span>
                  <span>{items.length}</span>
                </div>

                <div className="flex items-center justify-between text-stone-600">
                  <span>Subtotal</span>
                  <span>S/ {subtotal.toFixed(2)}</span>
                </div>

                <div className="flex items-center justify-between text-stone-600">
                  <span>Envío</span>
                  <span>S/ {shipping.toFixed(2)}</span>
                </div>

                <div className="border-t border-stone-200 pt-4">
                  <div className="flex items-center justify-between text-base font-semibold text-stone-900">
                    <span>Total</span>
                    <span>S/ {total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <Link
                to="/checkout"
                className="mt-6 inline-flex w-full items-center justify-center rounded-2xl bg-stone-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-stone-800"
              >
                Continuar al checkout
              </Link>

              <p className="mt-4 text-xs leading-5 text-stone-500">
                El cálculo de envío y pago puede refinarse cuando conectemos el checkout real.
              </p>
            </aside>
          </div>
        )}
      </div>
    </div>
  )
}