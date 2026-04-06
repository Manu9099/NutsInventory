import { Link } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, Trash2 } from 'lucide-react';
import { useCart } from '../../features/cart/hooks/useCart';

export function CartPage() {
  const { items, removeItem, clearCart, subtotal } = useCart();

  const shipping = items.length > 0 ? 10 : 0;
  const total = subtotal + shipping;

  return (
    <section className="mx-auto max-w-7xl px-6 py-12">
      <Link
        to="/catalog"
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-stone-500 hover:text-stone-900"
      >
        <ArrowLeft className="h-4 w-4" />
        Seguir comprando
      </Link>

      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-wide text-stone-500">
          Compra
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">Carrito</h1>
        <p className="mt-2 text-stone-600">
          Revisa tus productos antes de pasar al checkout.
        </p>
      </div>

      {items.length === 0 ? (
        <div className="rounded-3xl bg-white p-10 text-center shadow-sm ring-1 ring-stone-200">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-stone-100">
            <ShoppingCart className="h-6 w-6 text-stone-500" />
          </div>

          <h2 className="mt-4 text-xl font-semibold">Tu carrito está vacío</h2>
          <p className="mt-2 text-stone-600">
            Agrega productos desde el catálogo para comenzar tu compra.
          </p>

          <Link
            to="/catalog"
            className="mt-6 inline-flex rounded-xl bg-stone-900 px-5 py-3 text-sm font-semibold text-white transition hover:opacity-95"
          >
            Ir al catálogo
          </Link>
        </div>
      ) : (
        <div className="grid gap-8 lg:grid-cols-[1.6fr_0.9fr]">
          <div className="space-y-4">
            {items.map((item) => (
              <article
                key={item.productId}
                className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-stone-200"
              >
                <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
                  <div className="h-28 w-full overflow-hidden rounded-2xl bg-stone-100 sm:w-28">
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-sm text-stone-400">
                        Sin imagen
                      </div>
                    )}
                  </div>

                  <div className="flex-1">
                    <h2 className="text-lg font-semibold text-stone-900">{item.name}</h2>
                    <p className="mt-1 text-sm text-stone-500">
                      Cantidad: {item.quantity}
                    </p>
                    <p className="mt-2 text-sm text-stone-600">
                      Precio unitario: S/ {item.price.toFixed(2)}
                    </p>
                    <p className="mt-1 text-base font-semibold text-stone-900">
                      Subtotal: S/ {(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>

                  <div className="flex sm:flex-col sm:items-end sm:justify-between">
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
              </article>
            ))}

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={clearCart}
                className="rounded-xl border border-stone-300 px-4 py-2 text-sm font-medium text-stone-700 transition hover:bg-stone-50"
              >
                Vaciar carrito
              </button>

              <Link
                to="/catalog"
                className="rounded-xl border border-stone-300 px-4 py-2 text-sm font-medium text-stone-700 transition hover:bg-stone-50"
              >
                Agregar más productos
              </Link>
            </div>
          </div>

          <aside className="h-fit rounded-3xl bg-white p-6 shadow-sm ring-1 ring-stone-200">
            <h2 className="text-xl font-semibold text-stone-900">Resumen de compra</h2>

            <div className="mt-6 space-y-3 text-sm text-stone-600">
              <div className="flex items-center justify-between">
                <span>Productos</span>
                <span>{items.length}</span>
              </div>

              <div className="flex items-center justify-between">
                <span>Subtotal</span>
                <span>S/ {subtotal.toFixed(2)}</span>
              </div>

              <div className="flex items-center justify-between">
                <span>Envío</span>
                <span>S/ {shipping.toFixed(2)}</span>
              </div>
            </div>

            <div className="my-5 h-px bg-stone-200" />

            <div className="flex items-center justify-between">
              <span className="text-base font-semibold text-stone-900">Total</span>
              <span className="text-xl font-bold text-stone-900">
                S/ {total.toFixed(2)}
              </span>
            </div>

            <Link
              to="/checkout"
              className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-stone-900 px-5 py-3 text-sm font-semibold text-white transition hover:opacity-95"
            >
              Continuar al checkout
            </Link>

            <p className="mt-3 text-xs text-stone-500">
              El cálculo de envío y pago puede refinarse cuando conectemos el checkout
              real.
            </p>
          </aside>
        </div>
      )}
    </section>
  );
}