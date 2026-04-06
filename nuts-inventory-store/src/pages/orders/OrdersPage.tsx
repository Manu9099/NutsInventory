import { Link } from 'react-router-dom';
import { PackageCheck, ShoppingBag } from 'lucide-react';

export function OrdersPage() {
  const mockOrders = [
    {
      id: 'ORD-1001',
      date: '2026-04-05',
      status: 'Entregado',
      total: 78.5,
      items: 3,
    },
    {
      id: 'ORD-1002',
      date: '2026-04-03',
      status: 'En proceso',
      total: 42.0,
      items: 2,
    },
  ];

  const getStatusClasses = (status: string) => {
    switch (status) {
      case 'Entregado':
        return 'bg-lime-100 text-lime-700';
      case 'En proceso':
        return 'bg-amber-100 text-amber-700';
      case 'Cancelado':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-stone-100 text-stone-700';
    }
  };

  return (
    <section className="mx-auto max-w-7xl px-6 py-12">
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-wide text-stone-500">
          Cliente
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">Mis pedidos</h1>
        <p className="mt-2 text-stone-600">
          Revisa el historial y estado de tus compras.
        </p>
      </div>

      {mockOrders.length === 0 ? (
        <div className="rounded-3xl bg-white p-10 text-center shadow-sm ring-1 ring-stone-200">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-stone-100">
            <ShoppingBag className="h-6 w-6 text-stone-500" />
          </div>

          <h2 className="mt-4 text-xl font-semibold">Aún no tienes pedidos</h2>
          <p className="mt-2 text-stone-600">
            Cuando completes una compra, aparecerá aquí.
          </p>

          <Link
            to="/catalog"
            className="mt-6 inline-flex rounded-xl bg-stone-900 px-5 py-3 text-sm font-semibold text-white transition hover:opacity-95"
          >
            Ir al catálogo
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {mockOrders.map((order) => (
            <article
              key={order.id}
              className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-stone-200"
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-stone-100">
                    <PackageCheck className="h-6 w-6 text-stone-700" />
                  </div>

                  <div>
                    <p className="text-lg font-semibold text-stone-900">
                      Pedido {order.id}
                    </p>
                    <p className="mt-1 text-sm text-stone-500">
                      Fecha: {order.date}
                    </p>
                    <p className="mt-1 text-sm text-stone-500">
                      {order.items} producto{order.items === 1 ? '' : 's'}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-3 md:items-end">
                  <span
                    className={`inline-flex w-fit rounded-full px-3 py-1 text-xs font-semibold ${getStatusClasses(
                      order.status
                    )}`}
                  >
                    {order.status}
                  </span>

                  <p className="text-lg font-bold text-stone-900">
                    S/ {order.total.toFixed(2)}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}