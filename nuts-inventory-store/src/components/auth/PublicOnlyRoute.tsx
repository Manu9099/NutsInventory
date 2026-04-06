import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../features/auth/hooks/useAuth'

export function PublicOnlyRoute() {
  const token = localStorage.getItem('token')
  const { data: user, isLoading } = useAuth()

  if (!token) {
    return <Outlet />
  }

  if (isLoading) {
    return (
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-white p-10 shadow-sm ring-1 ring-stone-200">
          <h1 className="text-2xl font-bold text-stone-900">Cargando sesión...</h1>
          <p className="mt-3 text-sm text-stone-600">
            Redirigiendo a tu cuenta.
          </p>
        </div>
      </section>
    )
  }

  if (user) {
    return <Navigate to="/profile" replace />
  }

  return <Outlet />
}