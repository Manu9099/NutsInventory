import { Link } from 'react-router-dom';

export function HomePage() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-16">
      <div className="rounded-3xl bg-white p-10 shadow-sm ring-1 ring-stone-200">
        <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-stone-500">
          NutsInventory Store
        </p>

        <h1 className="text-4xl font-bold tracking-tight">
          Frutos secos de calidad, directo al cliente.
        </h1>

        <p className="mt-4 max-w-2xl text-stone-600">
          Catálogo, detalle de producto, carrito y base para checkout conectado
          a tu backend.
        </p>

        <div className="mt-6">
          <Link
            to="/catalog"
            className="rounded-xl bg-stone-900 px-5 py-3 text-sm font-semibold text-white"
          >
            Ver catálogo
          </Link>
        </div>
      </div>
    </section>
  );
}