import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../../features/auth/hooks/useAuth'

export function ProtectedRoute() {
  const location = useLocation()
  const token = localStorage.getItem('token')
  const { data: user, isLoading, isError } = useAuth()

  if (!token) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  if (isLoading) {
    return (
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-white p-10 shadow-sm ring-1 ring-stone-200">
          <h1 className="text-2xl font-bold text-stone-900">Validando sesión...</h1>
          <p className="mt-3 text-sm text-stone-600">
            Estamos comprobando tu acceso.
          </p>
        </div>
      </section>
    )
  }

  if (isError || !user) {
    localStorage.removeItem('token')
    localStorage.removeItem('authUser')
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return <Outlet />
}