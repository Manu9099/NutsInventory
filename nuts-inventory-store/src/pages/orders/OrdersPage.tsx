import { Link } from 'react-router-dom'
import { PackageCheck, ShoppingBag } from 'lucide-react'
import { useMyOrders } from '../../features/orders/hooks/useMyOrders'

function formatDate(value: string) {
  return new Date(value).toLocaleDateString('es-PE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

function getStatusClasses(status: string) {
  switch (status.toLowerCase()) {
    case 'delivered':
    case 'entregado':
      return 'bg-lime-100 text-lime-700'
    case 'pending':
    case 'en proceso':
    case 'processing':
      return 'bg-amber-100 text-amber-700'
    case 'cancelled':
    case 'cancelado':
      return 'bg-red-100 text-red-700'
    default:
      return 'bg-stone-100 text-stone-700'
  }
}

export function OrdersPage() {
  const { data: orders = [], isLoading, isError } = useMyOrders()

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex items-start gap-4">
        <div className="rounded-2xl bg-stone-100 p-3 text-stone-700">
          <PackageCheck className="h-6 w-6" />
        </div>

        <div>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-stone-500">
            Cliente
          </p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-stone-900">
            Mis pedidos
          </h1>
          <p className="mt-3 text-sm leading-6 text-stone-600">
            Revisa el historial y estado de tus compras.
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="mt-8 grid gap-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="h-36 animate-pulse rounded-3xl border border-stone-200 bg-white"
            />
          ))}
        </div>
      ) : isError ? (
        <div className="mt-8 rounded-3xl border border-red-200 bg-red-50 p-6">
          <h2 className="text-lg font-semibold text-red-900">
            No se pudieron cargar tus pedidos
          </h2>
          <p className="mt-2 text-sm text-red-700">
            Intenta nuevamente en unos segundos.
          </p>
        </div>
      ) : orders.length === 0 ? (
        <div className="mt-8 -rounded-[2rem] border border-stone-200 bg-white p-10 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-stone-100 text-stone-700">
            <ShoppingBag className="h-6 w-6" />
          </div>

          <h2 className="mt-5 text-2xl font-semibold text-stone-900">
            Aún no tienes pedidos
          </h2>
          <p className="mt-3 text-sm leading-6 text-stone-600">
            Cuando completes una compra, aparecerá aquí.
          </p>

          <Link
            to="/catalog"
            className="mt-6 inline-flex items-center justify-center rounded-xl bg-stone-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-stone-800"
          >
            Ir al catálogo
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid gap-5">
          {orders.map((order) => (
            <article
              key={order.id}
              className="-rounded-[2rem] border border-stone-200 bg-white p-6 shadow-sm"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-sm text-stone-500">Pedido #{order.id}</p>
                  <h2 className="mt-1 text-xl font-semibold text-stone-900">
                    {formatDate(order.orderDate)}
                  </h2>
                  <p className="mt-2 text-sm text-stone-600">
                    {order.items.length} producto{order.items.length === 1 ? '' : 's'}
                  </p>
                </div>

                <span
                  className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusClasses(order.status)}`}
                >
                  {order.status}
                </span>
              </div>

              <div className="mt-5 space-y-3 border-t border-stone-100 pt-5">
                {order.items.map((item) => (
                  <div
                    key={`${order.id}-${item.productId}`}
                    className="flex items-center justify-between gap-4"
                  >
                    <div>
                      <p className="text-sm font-medium text-stone-900">
                        {item.productName}
                      </p>
                      <p className="text-xs text-stone-500">
                        {item.quantity} x S/ {item.unitPrice.toFixed(2)}
                      </p>
                    </div>

                    <p className="text-sm font-semibold text-stone-900">
                      S/ {item.subtotal.toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-5 flex flex-col gap-2 border-t border-stone-100 pt-5 text-sm text-stone-600 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p>Descuento: S/ {order.discountApplied.toFixed(2)}</p>
                  <p>Puntos ganados: {order.loyaltyPointsEarned}</p>
                </div>

                <p className="text-base font-semibold text-stone-900">
                  Total: S/ {order.totalAmount.toFixed(2)}
                </p>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}