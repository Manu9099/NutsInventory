import { Link, NavLink } from 'react-router-dom';
import { ShoppingCart, Store, User, Package } from 'lucide-react';
import { useCart } from '../../features/cart/hooks/useCart';

export function Navbar() {
  const { items } = useCart();

  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);

  const navClass = ({ isActive }: { isActive: boolean }) =>
    [
      'text-sm font-medium transition',
      isActive ? 'text-stone-900' : 'text-stone-500 hover:text-stone-900',
    ].join(' ');

  return (
    <header className="sticky top-0 z-40 border-b border-stone-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-2 text-xl font-bold tracking-tight">
          <Store className="h-5 w-5" />
          <span>NutsInventory</span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <NavLink to="/" className={navClass}>
            Inicio
          </NavLink>
          <NavLink to="/catalog" className={navClass}>
            Catálogo
          </NavLink>
          <NavLink to="/orders" className={navClass}>
            <span className="inline-flex items-center gap-1">
              <Package className="h-4 w-4" />
              Mis pedidos
            </span>
          </NavLink>
          <NavLink to="/profile" className={navClass}>
            <span className="inline-flex items-center gap-1">
              <User className="h-4 w-4" />
              Mi perfil
            </span>
          </NavLink>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="hidden rounded-xl border border-stone-300 px-4 py-2 text-sm font-medium text-stone-700 transition hover:bg-stone-50 sm:inline-flex"
          >
            Ingresar
          </Link>

          <Link
            to="/cart"
            className="inline-flex items-center gap-2 rounded-xl bg-stone-900 px-4 py-2 text-sm font-medium text-white transition hover:opacity-95"
          >
            <ShoppingCart className="h-4 w-4" />
            <span>Carrito</span>
            <span className="rounded-full bg-white/15 px-2 py-0.5 text-xs">
              {totalItems}
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
}