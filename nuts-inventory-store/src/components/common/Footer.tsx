import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="mt-16 border-t border-stone-200 bg-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-6 py-10 md:grid-cols-3">
        <div>
          <h3 className="text-lg font-bold tracking-tight text-stone-900">
            NutsInventory
          </h3>
          <p className="mt-3 max-w-sm text-sm leading-6 text-stone-600">
            Tienda online para catálogo, compra y seguimiento de pedidos de frutos
            secos y productos relacionados.
          </p>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wide text-stone-900">
            Navegación
          </h4>
          <div className="mt-3 flex flex-col gap-2 text-sm text-stone-600">
            <Link to="/" className="transition hover:text-stone-900">
              Inicio
            </Link>
            <Link to="/catalog" className="transition hover:text-stone-900">
              Catálogo
            </Link>
            <Link to="/cart" className="transition hover:text-stone-900">
              Carrito
            </Link>
            <Link to="/orders" className="transition hover:text-stone-900">
              Mis pedidos
            </Link>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wide text-stone-900">
            Cliente
          </h4>
          <div className="mt-3 flex flex-col gap-2 text-sm text-stone-600">
            <Link to="/login" className="transition hover:text-stone-900">
              Iniciar sesión
            </Link>
            <Link to="/register" className="transition hover:text-stone-900">
              Crear cuenta
            </Link>
            <Link to="/profile" className="transition hover:text-stone-900">
              Mi perfil
            </Link>
          </div>
        </div>
      </div>

      <div className="border-t border-stone-200">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-6 py-4 text-sm text-stone-500 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} NutsInventory Store</p>
          <p>Frontend cliente base para demo y conexión con backend</p>
        </div>
      </div>
    </footer>
  );
}