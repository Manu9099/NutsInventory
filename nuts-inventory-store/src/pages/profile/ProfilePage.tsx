import { Link, useNavigate } from 'react-router-dom'
import {
  BadgeCheck,
  CreditCard,
  LogOut,
  MapPin,
  PackageCheck,
  Phone,
  Star,
  User,
} from 'lucide-react'
import { useAuth } from '../../features/auth/hooks/useAuth'
import { useStoreCustomerProfile } from '../../features/customers/hooks/useStoreCustomerProfile'

export function ProfilePage() {
  const navigate = useNavigate()
  const { data: user, isLoading: isAuthLoading, isError: isAuthError } = useAuth()

  const isAuthenticated =
    typeof window !== 'undefined' && !!localStorage.getItem('token') && !!user

  const {
    data: profile,
    isLoading: isProfileLoading,
    isError: isProfileError,
  } = useStoreCustomerProfile(isAuthenticated)

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('authUser')
    navigate('/login')
  }

  if (isAuthLoading || isProfileLoading) {
    return (
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-white p-10 shadow-sm ring-1 ring-stone-200">
          <h1 className="text-2xl font-bold text-stone-900">Cargando perfil...</h1>
          <p className="mt-3 text-sm text-stone-600">
            Estamos preparando tu cuenta y tus beneficios.
          </p>
        </div>
      </section>
    )
  }

  if (isAuthError || isProfileError || !user || !profile) {
    return (
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-white p-10 shadow-sm ring-1 ring-stone-200">
          <h1 className="text-3xl font-bold tracking-tight text-stone-900">
            No se pudo cargar tu perfil
          </h1>
          <p className="mt-3 text-sm leading-6 text-stone-600">
            Inicia sesión otra vez para continuar.
          </p>

          <Link
            to="/login"
            className="mt-6 inline-flex items-center justify-center rounded-xl bg-stone-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-stone-800"
          >
            Ir a login
          </Link>
        </div>
      </section>
    )
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-stone-500">
          Cuenta
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-stone-900">
          Mi perfil
        </h1>
        <p className="mt-3 text-sm leading-6 text-stone-600">
          Gestiona tus datos, revisa tus beneficios y sigue tu actividad de compra.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6">
          <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-stone-200">
            <div className="mb-5 flex items-center gap-2">
              <User className="h-5 w-5 text-stone-700" />
              <h2 className="text-xl font-semibold text-stone-900">Información personal</h2>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-stone-500">
                  Nombre
                </p>
                <p className="mt-1 text-sm text-stone-900">{profile.fullName}</p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-stone-500">
                  Correo
                </p>
                <p className="mt-1 text-sm text-stone-900">{profile.email}</p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-stone-500">
                  Teléfono
                </p>
                <p className="mt-1 text-sm text-stone-900">{profile.phone || 'No registrado'}</p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-stone-500">
                  Ciudad
                </p>
                <p className="mt-1 text-sm text-stone-900">{profile.city || 'No registrada'}</p>
              </div>

              <div className="sm:col-span-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-stone-500">
                  Dirección
                </p>
                <p className="mt-1 text-sm text-stone-900">
                  {profile.address || 'No registrada'}
                </p>
              </div>
            </div>

            <div className="mt-6">
              <Link
                to="/checkout"
                className="inline-flex items-center gap-2 rounded-xl border border-stone-300 px-4 py-2 text-sm font-medium text-stone-700 transition hover:bg-stone-50"
              >
                <MapPin className="h-4 w-4" />
                Completar o usar datos en checkout
              </Link>
            </div>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-stone-200">
            <div className="mb-5 flex items-center gap-2">
              <PackageCheck className="h-5 w-5 text-stone-700" />
              <h2 className="text-xl font-semibold text-stone-900">Accesos rápidos</h2>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <Link
                to="/orders"
                className="rounded-2xl border border-stone-200 p-4 text-sm font-medium text-stone-700 transition hover:bg-stone-50"
              >
                Ver mis pedidos
              </Link>
              <Link
                to="/catalog"
                className="rounded-2xl border border-stone-200 p-4 text-sm font-medium text-stone-700 transition hover:bg-stone-50"
              >
                Ir al catálogo
              </Link>
              <Link
                to="/checkout"
                className="rounded-2xl border border-stone-200 p-4 text-sm font-medium text-stone-700 transition hover:bg-stone-50"
              >
                Ir al checkout
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center justify-center gap-2 rounded-2xl border border-red-200 p-4 text-sm font-medium text-red-600 transition hover:bg-red-50"
              >
                <LogOut className="h-4 w-4" />
                Cerrar sesión
              </button>
            </div>
          </div>
        </div>

        <aside className="space-y-6">
          <div className="rounded-3xl border border-amber-200 bg-amber-50 p-6">
            <div className="flex items-center gap-2 text-amber-800">
              <Star className="h-5 w-5" />
              <h2 className="text-xl font-semibold">Mis puntos</h2>
            </div>

            <p className="mt-4 text-4xl font-bold text-amber-900">
             {profile.loyaltyPoints ?? 0}
            </p>
            <p className="mt-2 text-sm text-amber-800">
              puntos disponibles para canjear en futuras compras.
            </p>

            <Link
              to="/checkout"
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-amber-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-amber-800"
            >
              <CreditCard className="h-4 w-4" />
              Usar en checkout
            </Link>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-stone-200">
            <div className="mb-4 flex items-center gap-2">
              <BadgeCheck className="h-5 w-5 text-stone-700" />
              <h2 className="text-xl font-semibold text-stone-900">Fidelidad</h2>
            </div>

            <div className="space-y-4 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-stone-500">Nivel</span>
                <span className="font-semibold text-stone-900">{profile.tier}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-stone-500">Total gastado</span>
                <span className="font-semibold text-stone-900">
                 S/ {(profile.totalSpent ?? 0).toFixed(2)}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-stone-500">Compras realizadas</span>
                <span className="font-semibold text-stone-900">
                 {profile.totalPurchases ?? 0}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-stone-500">Perfil listo para compra</span>
                <span className="font-semibold text-stone-900">
                  {profile.isProfileComplete ? 'Sí' : 'Falta completar'}
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-stone-200">
            <div className="mb-4 flex items-center gap-2">
              <Phone className="h-5 w-5 text-stone-700" />
              <h2 className="text-xl font-semibold text-stone-900">Estado de contacto</h2>
            </div>

            <p className="text-sm leading-6 text-stone-600">
              Mantén actualizados tu teléfono y dirección para que el checkout sea más rápido y no
              tengas que completar todo otra vez.
            </p>
          </div>
        </aside>
      </div>
    </section>
  )
}