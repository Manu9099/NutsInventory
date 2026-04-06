import { Link } from 'react-router-dom';
import { useAuth } from '../../features/auth/hooks/useAuth';

export function ProfilePage() {
  const { data: user, isLoading, isError } = useAuth();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('authUser');
    window.location.href = '/login';
  };

  if (isLoading) {
    return (
      <section className="mx-auto max-w-4xl px-6 py-12">
        <div className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-stone-200">
          <div className="h-4 w-24 animate-pulse rounded bg-stone-200" />
          <div className="mt-4 h-8 w-56 animate-pulse rounded bg-stone-200" />
          <div className="mt-6 h-4 w-40 animate-pulse rounded bg-stone-200" />
          <div className="mt-3 h-4 w-48 animate-pulse rounded bg-stone-200" />
          <div className="mt-3 h-4 w-32 animate-pulse rounded bg-stone-200" />
        </div>
      </section>
    );
  }

  if (isError || !user) {
    return (
      <section className="mx-auto max-w-4xl px-6 py-12">
        <div className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-stone-200">
          <h1 className="text-2xl font-bold tracking-tight">Mi perfil</h1>
          <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
            No se pudo obtener el usuario autenticado. Inicia sesión otra vez.
          </div>

          <Link
            to="/login"
            className="mt-6 inline-flex rounded-xl bg-stone-900 px-5 py-3 text-sm font-semibold text-white"
          >
            Ir a login
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-4xl px-6 py-12">
      <div className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-stone-200">
        <p className="text-sm font-semibold uppercase tracking-wide text-stone-500">
          Cuenta
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">Mi perfil</h1>
        <p className="mt-2 text-stone-600">
          Datos obtenidos desde el endpoint autenticado del backend.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-stone-200 p-5">
            <p className="text-sm font-medium text-stone-500">Nombre completo</p>
            <p className="mt-2 text-lg font-semibold text-stone-900">
              {user.fullName}
            </p>
          </div>

          <div className="rounded-2xl border border-stone-200 p-5">
            <p className="text-sm font-medium text-stone-500">Correo</p>
            <p className="mt-2 text-lg font-semibold text-stone-900">
              {user.email}
            </p>
          </div>

          <div className="rounded-2xl border border-stone-200 p-5">
            <p className="text-sm font-medium text-stone-500">Rol</p>
            <p className="mt-2 text-lg font-semibold text-stone-900">
              {user.role}
            </p>
          </div>

          <div className="rounded-2xl border border-stone-200 p-5">
            <p className="text-sm font-medium text-stone-500">ID</p>
            <p className="mt-2 text-lg font-semibold text-stone-900">
              {user.id}
            </p>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            to="/catalog"
            className="rounded-xl border border-stone-300 px-4 py-2 text-sm font-medium text-stone-700 transition hover:bg-stone-50"
          >
            Ir al catálogo
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            className="rounded-xl bg-stone-900 px-4 py-2 text-sm font-medium text-white transition hover:opacity-95"
          >
            Cerrar sesión
          </button>
        </div>
      </div>
    </section>
  );
}