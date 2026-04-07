import { Link } from 'react-router-dom'
import { PackageCheck, ShoppingBag } from 'lucide-react'

import { useMyOrders } from '../../features/orders/hooks/useMyOrders'

function formatCurrency(value: number) {
  return `S/ ${value.toFixed(2)}`
}

function formatDate(value: string) {
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) return value

  return date.toLocaleDateString('es-PE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

function getStatusClasses(status: string) {
  const normalized = status.trim().toLowerCase()

  if (
    normalized.includes('entregado') ||
    normalized.includes('delivered') ||
    normalized.includes('completed') ||
    normalized.includes('completado')
  ) {
    return 'bg-lime-100 text-lime-700'
  }

  if (
    normalized.includes('proceso') ||
    normalized.includes('process') ||
    normalized.includes('pending') ||
    normalized.includes('pendiente')
  ) {
    return 'bg-amber-100 text-amber-700'
  }

  if (
    normalized.includes('cancel') ||
    normalized.includes('rechaz') ||
    normalized.includes('failed')
  ) {
    return 'bg-red-100 text-red-700'
  }

  return 'bg-stone-100 text-stone-700'
}

export function OrdersPage() {
  const { data: orders = [], isLoading, isError, error } = useMyOrders()

  if (isLoading) {
    return (
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-stone-200">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-stone-500">
            Cliente
          </p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight text-stone-900">
            Mis pedidos
          </h1>
          <p className="mt-3 text-stone-600">Cargando historial de compras...</p>
        </div>
      </section>
    )
  }

  if (isError) {
    return (
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-stone-200">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-stone-500">
            Cliente
          </p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight text-stone-900">
            Mis pedidos
          </h1>
          <p className="mt-3 text-red-600">
            {(error as Error)?.message || 'No se pudieron cargar tus pedidos.'}
          </p>

          <Link
            to="/catalog"
            className="mt-6 inline-flex rounded-xl bg-stone-900 px-5 py-3 text-sm font-semibold text-white transition hover:opacity-95"
          >
            Ir al catálogo
          </Link>
        </div>
      </section>
    )
  }

  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <div>
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-stone-500">
          Cliente
        </p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight text-stone-900">
          Mis pedidos
        </h1>
        <p className="mt-3 text-stone-600">
          Revisa el historial, el estado de tus compras y el impacto de tus puntos.
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="mt-8 rounded-3xl bg-white p-8 shadow-sm ring-1 ring-stone-200">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-stone-100">
            <ShoppingBag className="h-6 w-6 text-stone-700" />
          </div>

          <h2 className="mt-5 text-2xl font-semibold text-stone-900">
            Aún no tienes pedidos
          </h2>
          <p className="mt-3 text-stone-600">
            Cuando completes una compra, aparecerá aquí con su estado y resumen.
          </p>

          <Link
            to="/catalog"
            className="mt-6 inline-flex rounded-xl bg-stone-900 px-5 py-3 text-sm font-semibold text-white transition hover:opacity-95"
          >
            Ir al catálogo
          </Link>
        </div>
      ) : (
        <div className="mt-8 space-y-6">
          {orders.map((order) => {
            const productsCount = order.items.reduce(
              (acc, item) => acc + item.quantity,
              0,
            )

            return (
              <article
                key={order.id}
                className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-stone-200"
              >
                <div className="flex flex-col gap-4 border-b border-stone-100 p-6 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-stone-100">
                        <PackageCheck className="h-5 w-5 text-stone-700" />
                      </div>

                      <div>
                        <p className="text-sm text-stone-500">Pedido #{order.id}</p>
                        <h2 className="text-xl font-semibold text-stone-900">
                          {formatDate(order.orderDate)}
                        </h2>
                      </div>
                    </div>

                    <p className="mt-4 text-sm text-stone-600">
                      {productsCount} producto{productsCount === 1 ? '' : 's'} en la orden
                    </p>
                  </div>

                  <div className="flex flex-col items-start gap-3 sm:items-end">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusClasses(order.status)}`}
                    >
                      {order.status}
                    </span>

                    <div className="text-left sm:text-right">
                      <p className="text-xs uppercase tracking-[0.15em] text-stone-500">
                        Total pagado
                      </p>
                      <p className="text-2xl font-bold text-stone-900">
                        {formatCurrency(order.totalAmount)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl bg-stone-50 p-4">
                <p className="text-xs font-medium uppercase tracking-[0.15em] text-stone-500">
                  Puntos usados
                </p>
                <p className="mt-2 text-2xl font-semibold text-stone-900">
                  {order.loyaltyPointsRedeemed}
                </p>
                <p className="mt-1 text-sm text-stone-600">
                  Canjeados en esta compra.
                </p>
              </div>

              <div className="rounded-2xl bg-stone-50 p-4">
                <p className="text-xs font-medium uppercase tracking-[0.15em] text-stone-500">
                  Descuento por puntos
                </p>
                <p className="mt-2 text-2xl font-semibold text-stone-900">
                  - {formatCurrency(order.discountApplied)}
                </p>
                <p className="mt-1 text-sm text-stone-600">
                  Se aplicó como reducción del pedido.
                </p>
              </div>

              <div className="rounded-2xl bg-stone-50 p-4">
                <p className="text-xs font-medium uppercase tracking-[0.15em] text-stone-500">
                  Puntos ganados
                </p>
                <p className="mt-2 text-2xl font-semibold text-stone-900">
                  {order.loyaltyPointsEarned}
                </p>
                <p className="mt-1 text-sm text-stone-600">
                  Acumulados por esta compra.
                </p>
              </div>
</div>
                  <div className="mt-6">
                    <h3 className="text-sm font-semibold uppercase tracking-[0.15em] text-stone-500">
                      Productos
                    </h3>

                    <div className="mt-3 space-y-3">
                      {order.items.map((item) => (
                        <div
                          key={`${order.id}-${item.productId}`}
                          className="flex items-start justify-between gap-4 rounded-2xl border border-stone-200 p-4"
                        >
                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-stone-900">
                              {item.productName}
                            </p>
                            <p className="mt-1 text-sm text-stone-600">
                              {item.quantity} x {formatCurrency(item.unitPrice)}
                            </p>
                          </div>

                          <p className="whitespace-nowrap text-sm font-semibold text-stone-900">
                            {formatCurrency(item.subtotal)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      )}
    </section>
  )
}