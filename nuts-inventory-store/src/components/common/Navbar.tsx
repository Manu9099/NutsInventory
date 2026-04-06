import { useMemo, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import {
  ChevronDown,
  LogOut,
  ShoppingCart,
  Star,
  Store,
  User,
} from 'lucide-react'
import { useCart } from '../../features/cart/hooks/useCart'
import { useAuth } from '../../features/auth/hooks/useAuth'
import { useStoreCustomerProfile } from '../../features/customers/hooks/useStoreCustomerProfile'

export function Navbar() {
  const navigate = useNavigate()
  const { items } = useCart()
  const { data: user } = useAuth()

  const isAuthenticated =
    typeof window !== 'undefined' && !!localStorage.getItem('token') && !!user

  const { data: profile } = useStoreCustomerProfile(isAuthenticated)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0)

  const firstName = useMemo(() => {
    if (!user?.fullName) return ''
    return user.fullName.trim().split(' ')[0]
  }, [user])

  const navClass = ({ isActive }: { isActive: boolean }) =>
    [
      'text-sm font-medium transition',
      isActive ? 'text-stone-900' : 'text-stone-500 hover:text-stone-900',
    ].join(' ')

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('authUser')
    navigate('/login')
  }

  return (
    <header className="sticky top-0 z-40 border-b border-stone-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="inline-flex items-center gap-2 text-stone-900">
          <Store className="h-5 w-5" />
          <span className="text-lg font-bold tracking-tight">NutsInventory</span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <NavLink to="/" className={navClass}>
            Inicio
          </NavLink>
          <NavLink to="/catalog" className={navClass}>
            Catálogo
          </NavLink>
          {isAuthenticated ? (
            <NavLink to="/orders" className={navClass}>
              Mis pedidos
            </NavLink>
          ) : null}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          {isAuthenticated && profile ? (
            <>
              <Link
                to="/profile"
                className="hidden items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-800 md:inline-flex"
              >
                <Star className="h-4 w-4" />
                {profile.loyaltyPoints ?? 0} pts
              </Link>

              <div className="relative hidden md:block">
                <button
                  type="button"
                  onClick={() => setIsMenuOpen((prev) => !prev)}
                  className="inline-flex items-center gap-2 rounded-full border border-stone-300 bg-white px-4 py-2 text-sm font-medium text-stone-700 transition hover:bg-stone-50"
                >
                  <User className="h-4 w-4" />
                  Hola, {firstName}
                  <ChevronDown className="h-4 w-4" />
                </button>

                {isMenuOpen ? (
                  <div className="absolute right-0 mt-2 w-64 rounded-2xl border border-stone-200 bg-white p-2 shadow-lg">
                    <div className="rounded-xl bg-stone-50 px-3 py-3">
                      <p className="text-sm font-semibold text-stone-900">
                        {user.fullName}
                      </p>
                      <p className="mt-1 text-xs text-stone-500">{user.email}</p>
                    </div>

                    <div className="mt-2 space-y-1">
                      <Link
                        to="/profile"
                        onClick={() => setIsMenuOpen(false)}
                        className="block rounded-xl px-3 py-2 text-sm text-stone-700 transition hover:bg-stone-50"
                      >
                        Mi perfil
                      </Link>

                      <Link
                        to="/orders"
                        onClick={() => setIsMenuOpen(false)}
                        className="block rounded-xl px-3 py-2 text-sm text-stone-700 transition hover:bg-stone-50"
                      >
                        Mis pedidos
                      </Link>

                      <Link
                        to="/profile"
                        onClick={() => setIsMenuOpen(false)}
                        className="block rounded-xl px-3 py-2 text-sm text-stone-700 transition hover:bg-stone-50"
                      >
                        Mis puntos
                      </Link>

                      <button
                        type="button"
                        onClick={handleLogout}
                        className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm text-red-600 transition hover:bg-red-50"
                      >
                        <LogOut className="h-4 w-4" />
                        Cerrar sesión
                      </button>
                    </div>
                  </div>
                ) : null}
              </div>
            </>
          ) : (
            <Link
              to="/login"
              className="hidden rounded-xl border border-stone-300 px-4 py-2 text-sm font-medium text-stone-700 transition hover:bg-stone-50 md:inline-flex"
            >
              Ingresar
            </Link>
          )}

          <Link
            to="/cart"
            className="relative inline-flex h-11 w-11 items-center justify-center rounded-full border border-stone-300 bg-white text-stone-700 transition hover:bg-stone-50"
            aria-label="Ir al carrito"
          >
            <ShoppingCart className="h-5 w-5" />
            {totalItems > 0 ? (
              <span className="absolute -right-1 -top-1 inline-flex -min-h-[20px] -min-w-[20px] items-center justify-center rounded-full bg-stone-900 px-1.5 text-[11px] font-semibold text-white">
                {totalItems}
              </span>
            ) : null}
          </Link>

          {isAuthenticated && profile ? (
            <Link
              to="/profile"
              className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-2 text-sm font-semibold text-amber-800 md:hidden"
            >
              <Star className="h-4 w-4" />
              {profile.loyaltyPoints ?? 0}
            </Link>
          ) : null}
        </div>
      </div>
    </header>
  )
}