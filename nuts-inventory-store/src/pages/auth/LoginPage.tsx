import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { LogIn, ShieldCheck } from 'lucide-react'
import { login } from '../../features/auth/api/login'

export function LoginPage() {
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage('')
    setLoading(true)

    try {
      const response = await login({
        email,
        password,
      })

      localStorage.setItem('token', response.accessToken)
      localStorage.setItem('authUser', JSON.stringify(response.user))

      navigate('/profile')
    } catch (error: any) {
      setErrorMessage(
        error?.response?.data?.message ||
          error?.message ||
          'No se pudo iniciar sesión.',
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl -rounded-[2rem] border border-stone-200 bg-white p-8 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="rounded-2xl bg-stone-100 p-3 text-stone-700">
            <LogIn className="h-6 w-6" />
          </div>

          <div>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-stone-500">
              Cuenta
            </p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight text-stone-900">
              Iniciar sesión
            </h1>
            <p className="mt-3 text-sm leading-6 text-stone-600">
              Accede con tu cuenta de cliente para revisar tu perfil, continuar tu compra y ver tus pedidos.
            </p>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-lime-200 bg-lime-50 p-4 text-sm text-lime-800">
          <div className="flex items-start gap-2">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" />
            <p>
              Este login ahora usa el flujo de <span className="font-semibold">customer auth</span> del storefront.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-stone-700">
              Correo
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="cliente@correo.com"
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
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {errorMessage}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            className="inline-flex w-full items-center justify-center rounded-xl bg-stone-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:bg-stone-400"
          >
            {loading ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Link
            to="/register"
            className="text-sm font-medium text-stone-700 transition hover:text-stone-900"
          >
            ¿No tienes cuenta? Crear cuenta
          </Link>

          <Link
            to="/"
            className="text-sm font-medium text-stone-500 transition hover:text-stone-800"
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    </section>
  )
}