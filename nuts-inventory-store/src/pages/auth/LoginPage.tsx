import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../../features/auth/api/login';

export function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('admin@nutsinventory.com');
  const [password, setPassword] = useState('Admin123*');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    try {
      const response = await login({
        email,
        password,
      });

      localStorage.setItem('token', response.accessToken);
      localStorage.setItem('authUser', JSON.stringify(response.user));

      navigate('/profile');
    } catch (error: any) {
      setErrorMessage(
        error?.response?.data?.message ||
          error?.message ||
          'No se pudo iniciar sesión.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mx-auto max-w-lg px-6 py-12">
      <div className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-stone-200">
        <p className="text-sm font-semibold uppercase tracking-wide text-stone-500">
          Acceso
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">Iniciar sesión</h1>
        <p className="mt-2 text-stone-600">
          Conexión directa al endpoint actual de autenticación.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-stone-700">
              Correo
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@nutsinventory.com"
              className="w-full rounded-xl border border-stone-300 px-4 py-3 text-sm outline-none transition focus:border-stone-500"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-stone-700">
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="********"
              className="w-full rounded-xl border border-stone-300 px-4 py-3 text-sm outline-none transition focus:border-stone-500"
              required
            />
          </div>

          {errorMessage ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {errorMessage}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            className="inline-flex w-full items-center justify-center rounded-xl bg-stone-900 px-5 py-3 text-sm font-semibold text-white transition hover:opacity-95 disabled:cursor-not-allowed disabled:bg-stone-400"
          >
            {loading ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>

        <div className="mt-6 rounded-2xl border border-stone-200 bg-stone-50 p-4 text-sm text-stone-600">
          <p className="font-medium text-stone-900">Demo actual del backend</p>
          <p className="mt-2">Email: admin@nutsinventory.com</p>
          <p>Password: Admin123*</p>
        </div>

        <div className="mt-6 text-sm text-stone-500">
          <Link to="/" className="font-medium text-stone-900 hover:underline">
            Volver al inicio
          </Link>
        </div>
      </div>
    </section>
  );
}