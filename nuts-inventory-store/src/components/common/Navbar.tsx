import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import {
  ChevronDown,
  LogOut,
  Menu,
  Package,
  ShoppingCart,
  Star,
  Store,
  User,
  X,
} from 'lucide-react'
import { useCart } from '../../features/cart/hooks/useCart'
import { useAuth } from '../../features/auth/hooks/useAuth'
import { useStoreCustomerProfile } from '../../features/customers/hooks/useStoreCustomerProfile'

export function Navbar() {
  const navigate = useNavigate()
 const { items, openCartDrawer } = useCart()
  const { data: user } = useAuth()
 


  const isAuthenticated =
    typeof window !== 'undefined' && !!localStorage.getItem('token') && !!user

  const { data: profile } = useStoreCustomerProfile(isAuthenticated)
  const [isCartBadgeAnimating, setIsCartBadgeAnimating] = useState(false)
  
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const accountMenuRef = useRef<HTMLDivElement | null>(null)
  const mobileMenuRef = useRef<HTMLDivElement | null>(null)

  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0)
  const previousTotalItemsRef = useRef(totalItems)
  
useEffect(() => {
  const previousTotalItems = previousTotalItemsRef.current

  if (previousTotalItems !== totalItems && totalItems > 0) {
    setIsCartBadgeAnimating(true)

    const timeout = window.setTimeout(() => {
      setIsCartBadgeAnimating(false)
    }, 180)

    previousTotalItemsRef.current = totalItems

    return () => window.clearTimeout(timeout)
  }

  previousTotalItemsRef.current = totalItems
}, [totalItems])


  const firstName = useMemo(() => {
    if (!user?.fullName) return ''
    return user.fullName.trim().split(' ')[0]
  }, [user])

  const closeAllMenus = () => {
    setIsAccountMenuOpen(false)
    setIsMobileMenuOpen(false)
  }

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node

      if (
        accountMenuRef.current &&
        !accountMenuRef.current.contains(target)
      ) {
        setIsAccountMenuOpen(false)
      }

      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(target)
      ) {
        setIsMobileMenuOpen(false)
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        closeAllMenus()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEscape)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('authUser')
    closeAllMenus()
    navigate('/login')
  }

  const navClass = ({ isActive }: { isActive: boolean }) =>
    [
      'text-sm font-medium transition',
      isActive ? 'text-stone-900' : 'text-stone-500 hover:text-stone-900',
    ].join(' ')

  return (
    <header className="sticky top-0 z-40 border-b border-stone-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link
          to="/"
          onClick={closeAllMenus}
          className="inline-flex items-center gap-2 text-stone-900"
        >
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
            <>
              <NavLink to="/orders" className={navClass}>
                Mis pedidos
              </NavLink>
              <NavLink to="/profile" className={navClass}>
                Mi perfil
              </NavLink>
            </>
          ) : null}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          {isAuthenticated && profile ? (
            <Link
              to="/profile"
              onClick={closeAllMenus}
              className="hidden items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-800 md:inline-flex"
            >
              <Star className="h-4 w-4" />
              {profile.loyaltyPoints ?? 0} pts
            </Link>
          ) : null}

          {isAuthenticated ? (
            <div ref={accountMenuRef} className="relative hidden md:block">
              <button
                type="button"
                onClick={() => setIsAccountMenuOpen((prev) => !prev)}
                className="inline-flex items-center gap-2 rounded-full border border-stone-300 bg-white px-4 py-2 text-sm font-medium text-stone-700 transition hover:bg-stone-50"
              >
                <User className="h-4 w-4" />
                Hola, {firstName}
                <ChevronDown className="h-4 w-4" />
              </button>

              {isAccountMenuOpen ? (
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
                      onClick={closeAllMenus}
                      className="block rounded-xl px-3 py-2 text-sm text-stone-700 transition hover:bg-stone-50"
                    >
                      Mi perfil
                    </Link>

                    <Link
                      to="/orders"
                      onClick={closeAllMenus}
                      className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-stone-700 transition hover:bg-stone-50"
                    >
                      <Package className="h-4 w-4" />
                      Mis pedidos
                    </Link>

                    <Link
                      to="/profile"
                      onClick={closeAllMenus}
                      className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-stone-700 transition hover:bg-stone-50"
                    >
                      <Star className="h-4 w-4" />
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
          ) : (
            <Link
              to="/login"
              onClick={closeAllMenus}
              className="hidden rounded-xl border border-stone-300 px-4 py-2 text-sm font-medium text-stone-700 transition hover:bg-stone-50 md:inline-flex"
            >
              Ingresar
            </Link>
          )}

                <button
          type="button"
          onClick={openCartDrawer}
          className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-stone-200 bg-stone-50 text-stone-700 transition hover:bg-stone-100"
          aria-label="Abrir carrito"
        >
          <ShoppingCart className="h-4 w-4" />
              {totalItems > 0 ? (
            <span
              className={[
                'absolute -right-1 -top-1 inline-flex min-h-[18px]- min-w-[18px]- items-center justify-center rounded-full bg-stone-900 px-1 text-[10px] font-semibold text-white',
                'transform-gpu transition-transform duration-200 ease-out',
                isCartBadgeAnimating ? 'scale-125' : 'scale-100',
              ].join(' ')}
            >
              {totalItems}
            </span>
          ) : null}
        </button>

          <div ref={mobileMenuRef} className="relative md:hidden">
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-stone-200 bg-white text-stone-700 transition hover:bg-stone-50"
              aria-label="Abrir menú"
            >
              {isMobileMenuOpen ? (
                <X className="h-4 w-4" />
              ) : (
                <Menu className="h-4 w-4" />
              )}
            </button>

            {isMobileMenuOpen ? (
              <div className="absolute right-0 mt-2 -w-[280px] rounded-2xl border border-stone-200 bg-white p-3 shadow-lg">
                {isAuthenticated && user ? (
                  <div className="rounded-xl bg-stone-50 px-3 py-3">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-stone-900">
                          {user.fullName}
                        </p>
                        <p className="mt-1 text-xs text-stone-500">{user.email}</p>
                      </div>

                      {profile ? (
                        <div className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-800">
                          <Star className="h-3.5 w-3.5" />
                          {profile.loyaltyPoints ?? 0}
                        </div>
                      ) : null}
                    </div>
                  </div>
                ) : null}

                <div className="mt-3 space-y-1">
                  <Link
                    to="/"
                    onClick={closeAllMenus}
                    className="block rounded-xl px-3 py-2 text-sm text-stone-700 transition hover:bg-stone-50"
                  >
                    Inicio
                  </Link>

                  <Link
                    to="/catalog"
                    onClick={closeAllMenus}
                    className="block rounded-xl px-3 py-2 text-sm text-stone-700 transition hover:bg-stone-50"
                  >
                    Catálogo
                  </Link>

                  {isAuthenticated ? (
                    <>
                      <Link
                        to="/profile"
                        onClick={closeAllMenus}
                        className="block rounded-xl px-3 py-2 text-sm text-stone-700 transition hover:bg-stone-50"
                      >
                        Mi perfil
                      </Link>

                      <Link
                        to="/orders"
                        onClick={closeAllMenus}
                        className="block rounded-xl px-3 py-2 text-sm text-stone-700 transition hover:bg-stone-50"
                      >
                        Mis pedidos
                      </Link>

                      <Link
                        to="/profile"
                        onClick={closeAllMenus}
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
                    </>
                  ) : (
                    <>
                      <Link
                        to="/login"
                        onClick={closeAllMenus}
                        className="block rounded-xl px-3 py-2 text-sm text-stone-700 transition hover:bg-stone-50"
                      >
                        Ingresar
                      </Link>

                      <Link
                        to="/register"
                        onClick={closeAllMenus}
                        className="block rounded-xl px-3 py-2 text-sm text-stone-700 transition hover:bg-stone-50"
                      >
                        Crear cuenta
                      </Link>
                    </>
                  )}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </header>
  )
}