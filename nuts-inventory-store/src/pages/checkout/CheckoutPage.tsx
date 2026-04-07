import { useEffect, useMemo, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { Link, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  CreditCard,
  MapPin,
  PencilLine,
  ShieldCheck,
  Truck,
} from 'lucide-react'

import { useCart } from '../../features/cart/hooks/useCart'
import { useAuth } from '../../features/auth/hooks/useAuth'
import { useStoreCustomerProfile } from '../../features/customers/hooks/useStoreCustomerProfile'
import { useUpdateStoreCustomerProfile } from '../../features/customers/hooks/useUpdateStoreCustomerProfile'
import { useCreateStoreOrder } from '../../features/orders/hooks/useCreateStoreOrder'

export function CheckoutPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { items, subtotal, clearCart } = useCart()
  const { data: user, isLoading: isAuthLoading, isError: isAuthError } = useAuth()

  const hasToken = typeof window !== 'undefined' && !!localStorage.getItem('token')
  const isAuthenticated = hasToken && !!user

  const {
    data: profile,
    isLoading: isProfileLoading,
    isError: isProfileError,
  } = useStoreCustomerProfile(isAuthenticated)

  const { mutateAsync: saveProfile, isPending: isSavingProfile } =
    useUpdateStoreCustomerProfile()

  const { mutateAsync: createOrder, isPending: isCreatingOrder } =
    useCreateStoreOrder()

  const [phone, setPhone] = useState('')
  const [city, setCity] = useState('')
  const [address, setAddress] = useState('')
  const [notes, setNotes] = useState('')
  const [loyaltyPointsToRedeem, setLoyaltyPointsToRedeem] = useState('0')
  const [isEditingDetails, setIsEditingDetails] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const shipping = items.length > 0 ? 10 : 0

  useEffect(() => {
    if (!profile) return

    setPhone(profile.phone ?? '')
    setCity(profile.city ?? '')
    setAddress(profile.address ?? '')
  }, [profile])

  const profileComplete = useMemo(() => {
    return Boolean(
      user &&
        user.fullName?.trim() &&
        user.email?.trim() &&
        phone.trim() &&
        city.trim() &&
        address.trim(),
    )
  }, [user, phone, city, address])

  const shouldShowDetailsForm = !profileComplete || isEditingDetails

  const availablePoints = profile?.loyaltyPoints ?? 0

  const requestedPoints = useMemo(() => {
    const parsed = Number(loyaltyPointsToRedeem || 0)
    if (Number.isNaN(parsed) || parsed < 0) return 0
    return Math.floor(parsed)
  }, [loyaltyPointsToRedeem])

  const maxRedeemablePointsByProducts = Math.floor(subtotal * 100)

  const redeemablePoints = Math.min(
    requestedPoints,
    availablePoints,
    maxRedeemablePointsByProducts,
  )

  const loyaltyDiscount = redeemablePoints / 100
  const productsNetTotal = Math.max(subtotal - loyaltyDiscount, 0)
  const finalPreviewTotal = productsNetTotal + shipping
  const earnedPointsPreview = Math.floor(productsNetTotal)

  const validateDetails = () => {
    if (!phone.trim()) return 'Ingresa el teléfono.'
    if (!city.trim()) return 'Ingresa la ciudad.'
    if (!address.trim()) return 'Ingresa la dirección.'
    return ''
  }

  const handleSaveDetails = async () => {
    setErrorMessage('')
    setSuccessMessage('')

    const validationError = validateDetails()
    if (validationError) {
      setErrorMessage(validationError)
      return
    }

    try {
      await saveProfile({
        phone: phone.trim(),
        city: city.trim(),
        address: address.trim(),
      })

      setIsEditingDetails(false)
      setSuccessMessage('Tus datos de entrega se guardaron correctamente.')

      await queryClient.invalidateQueries({
        queryKey: ['store-customer-profile'],
      })
    } catch (error: any) {
      setErrorMessage(
        error?.response?.data?.message ||
          error?.message ||
          'No se pudieron guardar tus datos.',
      )
    }
  }

  const handleUseMaxPoints = () => {
    const maxUsable = Math.min(availablePoints, maxRedeemablePointsByProducts)
    setLoyaltyPointsToRedeem(String(maxUsable))
  }

  const handlePointsChange = (value: string) => {
    const digitsOnly = value.replace(/[^\d]/g, '')
    setLoyaltyPointsToRedeem(digitsOnly === '' ? '0' : digitsOnly)
  }

  const handleConfirmOrder = async () => {
    setErrorMessage('')
    setSuccessMessage('')

    if (items.length === 0) {
      setErrorMessage('No hay productos en el carrito.')
      return
    }

    if (!user) {
      setErrorMessage('Debes iniciar sesión para completar la compra.')
      return
    }

    if (!profileComplete) {
      setErrorMessage('Completa primero tus datos de entrega.')
      setIsEditingDetails(true)
      return
    }

    try {
      const composedNotes = [
        notes.trim(),
        `Cliente: ${user.fullName}`,
        `Correo: ${user.email}`,
        `Teléfono: ${phone}`,
        `Entrega: ${address}, ${city}`,
      ]
        .filter(Boolean)
        .join(' | ')

      const response = await createOrder({
        items: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
        loyaltyPointsToRedeem: redeemablePoints,
        notes: composedNotes,
      })

      await queryClient.invalidateQueries({
        queryKey: ['store-customer-profile'],
      })

      setSuccessMessage(
        `Pedido #${response.orderId} confirmado correctamente.
Descuento aplicado: S/ ${Number(response.discountApplied).toFixed(2)}
Total neto: S/ ${Number(response.netAmount).toFixed(2)}
Puntos ganados: ${response.loyaltyPointsEarned}`,
      )

      clearCart()

      setTimeout(() => {
        navigate('/orders')
      }, 1200)
    } catch (error: any) {
      setErrorMessage(
        error?.response?.data?.message ||
          error?.message ||
          'No se pudo confirmar el pedido.',
      )
    }
  }

  if (items.length === 0) {
    return (
      <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <Link
          to="/cart"
          className="inline-flex items-center gap-2 text-sm font-medium text-stone-600 transition hover:text-stone-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver al carrito
        </Link>

        <div className="mt-8 rounded-3xl bg-white p-8 shadow-sm ring-1 ring-stone-200">
          <h1 className="text-3xl font-semibold tracking-tight text-stone-900">
            No hay productos para pagar
          </h1>
          <p className="mt-3 text-stone-600">
            Tu carrito está vacío. Agrega productos antes de continuar al
            checkout.
          </p>

          <Link
            to="/catalog"
            className="mt-6 inline-flex rounded-xl bg-stone-900 px-5 py-3 text-sm font-semibold text-white transition hover:opacity-95"
          >
            Ir al catálogo
          </Link>
        </div>
      </section>
    )
  }

  if (hasToken && (isAuthLoading || isProfileLoading)) {
    return (
      <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-stone-200">
          <h1 className="text-3xl font-semibold tracking-tight text-stone-900">
            Preparando tu checkout...
          </h1>
          <p className="mt-3 text-stone-600">
            Estamos cargando tu sesión y tus datos de entrega.
          </p>
        </div>
      </section>
    )
  }

  if (!isAuthenticated || isAuthError) {
    return (
      <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <Link
          to="/cart"
          className="inline-flex items-center gap-2 text-sm font-medium text-stone-600 transition hover:text-stone-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver al carrito
        </Link>

        <div className="mt-8 rounded-3xl bg-white p-8 shadow-sm ring-1 ring-stone-200">
          <h1 className="text-3xl font-semibold tracking-tight text-stone-900">
            Inicia sesión para continuar
          </h1>
          <p className="mt-3 text-stone-600">
            El checkout rápido necesita una sesión activa de customer.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/login"
              className="inline-flex rounded-xl bg-stone-900 px-5 py-3 text-sm font-semibold text-white transition hover:opacity-95"
            >
              Iniciar sesión
            </Link>
            <Link
              to="/register"
              className="inline-flex rounded-xl border border-stone-300 px-5 py-3 text-sm font-semibold text-stone-700 transition hover:bg-stone-50"
            >
              Crear cuenta
            </Link>
          </div>
        </div>
      </section>
    )
  }

  if (isProfileError) {
    return (
      <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-stone-200">
          <h2 className="text-2xl font-semibold text-stone-900">
            No se pudo cargar tu perfil de cliente
          </h2>
          <p className="mt-3 text-stone-600">
            Intenta nuevamente. El checkout necesita tus datos de entrega.
          </p>
        </div>
      </section>
    )
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <Link
        to="/cart"
        className="inline-flex items-center gap-2 text-sm font-medium text-stone-600 transition hover:text-stone-900"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver al carrito
      </Link>

      <div className="mt-6">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-stone-500">
          Compra
        </p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight text-stone-900">
          Checkout
        </h1>
        <p className="mt-3 max-w-2xl text-stone-600">
          Si ya tienes sesión activa, solo confirmas. Si te falta algo,
          completas solo esos datos.
        </p>
        <p className="mt-2 text-sm text-stone-500">
          Sesión activa: {user.fullName} · {user.email}
        </p>
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1.3fr_0.8fr]">
        <div className="space-y-6">
          <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-stone-200">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-stone-100 p-3">
                <MapPin className="h-5 w-5 text-stone-700" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-stone-900">
                  Entrega
                </h2>
                <p className="text-sm text-stone-500">
                  Datos necesarios para despachar el pedido.
                </p>
              </div>
            </div>

            {shouldShowDetailsForm ? (
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-stone-900">
                  Completa tus datos de entrega
                </h3>

                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-1">
                    <label className="mb-2 block text-sm font-medium text-stone-700">
                      Nombre
                    </label>
                    <input
                      value={user.fullName}
                      disabled
                      className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-500 outline-none"
                    />
                  </div>

                  <div className="sm:col-span-1">
                    <label className="mb-2 block text-sm font-medium text-stone-700">
                      Correo
                    </label>
                    <input
                      value={user.email}
                      disabled
                      className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-500 outline-none"
                    />
                  </div>

                  <div className="sm:col-span-1">
                    <label className="mb-2 block text-sm font-medium text-stone-700">
                      Teléfono
                    </label>
                    <input
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="999 999 999"
                      className="w-full rounded-xl border border-stone-300 px-4 py-3 text-sm outline-none transition focus:border-stone-500"
                    />
                  </div>

                  <div className="sm:col-span-1">
                    <label className="mb-2 block text-sm font-medium text-stone-700">
                      Ciudad
                    </label>
                    <input
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Lima"
                      className="w-full rounded-xl border border-stone-300 px-4 py-3 text-sm outline-none transition focus:border-stone-500"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="mb-2 block text-sm font-medium text-stone-700">
                      Dirección
                    </label>
                    <input
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Av. Ejemplo 123"
                      className="w-full rounded-xl border border-stone-300 px-4 py-3 text-sm outline-none transition focus:border-stone-500"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleSaveDetails}
                  disabled={isSavingProfile}
                  className="mt-5 inline-flex rounded-xl bg-stone-900 px-5 py-3 text-sm font-semibold text-white transition hover:opacity-95 disabled:cursor-not-allowed disabled:bg-stone-400"
                >
                  {isSavingProfile ? 'Guardando...' : 'Guardar datos y continuar'}
                </button>
              </div>
            ) : (
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-stone-900">
                  Datos de entrega
                </h3>

                <div className="mt-4 space-y-2 text-sm text-stone-600">
                  <p>
                    <span className="font-medium text-stone-900">Cliente:</span>{' '}
                    {user.fullName}
                  </p>
                  <p>
                    <span className="font-medium text-stone-900">Correo:</span>{' '}
                    {user.email}
                  </p>
                  <p>
                    <span className="font-medium text-stone-900">
                      Teléfono:
                    </span>{' '}
                    {phone}
                  </p>
                  <p>
                    <span className="font-medium text-stone-900">Ciudad:</span>{' '}
                    {city}
                  </p>
                  <p>
                    <span className="font-medium text-stone-900">
                      Dirección:
                    </span>{' '}
                    {address}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setIsEditingDetails(true)}
                  className="mt-5 inline-flex items-center gap-2 rounded-xl border border-stone-300 px-4 py-2 text-sm font-medium text-stone-700 transition hover:bg-stone-50"
                >
                  <PencilLine className="h-4 w-4" />
                  Editar datos
                </button>
              </div>
            )}
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-stone-200">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-stone-100 p-3">
                <CreditCard className="h-5 w-5 text-stone-700" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-stone-900">
                  Pago y notas
                </h2>
                <p className="text-sm text-stone-500">
                  Déjalo visual por ahora y conecta la pasarela cuando cierres
                  pagos.
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-6">
              <div className="rounded-2xl border border-stone-200 bg-stone-50 p-4">
                <p className="text-sm font-semibold text-stone-900">
                  Pagar con puntos
                </p>
                <p className="mt-1 text-sm text-stone-600">
                  Puedes usar tus puntos para reducir el subtotal de productos.
                </p>

                <div className="mt-4 grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-stone-700">
                      Puntos a canjear
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={loyaltyPointsToRedeem}
                      onChange={(e) => handlePointsChange(e.target.value)}
                      placeholder="0"
                      className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-stone-500"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleUseMaxPoints}
                    className="rounded-xl border border-stone-300 px-4 py-3 text-sm font-medium text-stone-700 transition hover:bg-stone-100"
                  >
                    Usar máximo
                  </button>
                </div>

                <div className="mt-4 grid gap-2 text-sm text-stone-600">
                  <p>
                    <span className="font-medium text-stone-900">
                      Puntos disponibles:
                    </span>{' '}
                    {availablePoints}
                  </p>
                  <p>
                    <span className="font-medium text-stone-900">
                      Máximo usable ahora:
                    </span>{' '}
                    {Math.min(availablePoints, maxRedeemablePointsByProducts)}
                  </p>
                  <p>
                    <span className="font-medium text-stone-900">
                      Conversión:
                    </span>{' '}
                    100 pts = S/ 1.00
                  </p>
                  <p>
                    <span className="font-medium text-stone-900">
                      Descuento estimado:
                    </span>{' '}
                    S/ {loyaltyDiscount.toFixed(2)}
                  </p>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-stone-700">
                  Notas del pedido
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Indicaciones adicionales para la entrega"
                  rows={4}
                  className="w-full rounded-xl border border-stone-300 px-4 py-3 text-sm outline-none transition focus:border-stone-500"
                />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-stone-200 p-4">
                  <div className="flex items-center gap-2 text-sm font-medium text-stone-900">
                    <ShieldCheck className="h-4 w-4" />
                    Compra segura
                  </div>
                  <p className="mt-2 text-sm text-stone-600">
                    Cuando conectes tu pasarela, este flujo ya quedará listo
                    para cobrar.
                  </p>
                </div>

                <div className="rounded-2xl border border-stone-200 p-4">
                  <div className="flex items-center gap-2 text-sm font-medium text-stone-900">
                    <Truck className="h-4 w-4" />
                    Entrega
                  </div>
                  <p className="mt-2 text-sm text-stone-600">
                    Tus datos de delivery viajan junto con la orden en las notas
                    compuestas.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {errorMessage ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {errorMessage}
            </div>
          ) : null}

          {successMessage ? (
            <div className="whitespace-pre-line rounded-2xl border border-lime-200 bg-lime-50 p-4 text-sm text-lime-700">
              {successMessage}
            </div>
          ) : null}
        </div>

        <aside className="h-fit rounded-3xl bg-white p-6 shadow-sm ring-1 ring-stone-200">
          <h2 className="text-xl font-semibold text-stone-900">Resumen final</h2>

          <div className="mt-5 space-y-4">
            {items.map((item) => (
              <div
                key={item.productId}
                className="flex items-start justify-between gap-3 border-b border-stone-100 pb-4"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-stone-900">
                    {item.name}
                  </p>
                  <p className="mt-1 text-xs text-stone-500">
                    {item.quantity} x S/ {item.price.toFixed(2)}
                  </p>
                </div>

                <p className="text-sm font-semibold text-stone-900">
                  S/ {(item.quantity * item.price).toFixed(2)}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-6 space-y-3 text-sm text-stone-600">
            <div className="flex items-center justify-between">
              <span>Subtotal productos</span>
              <span>S/ {subtotal.toFixed(2)}</span>
            </div>

            <div className="flex items-center justify-between">
              <span>Descuento por puntos</span>
              <span>- S/ {loyaltyDiscount.toFixed(2)}</span>
            </div>

            <div className="flex items-center justify-between">
              <span>Envío</span>
              <span>S/ {shipping.toFixed(2)}</span>
            </div>
          </div>

          <div className="my-5 h-px bg-stone-200" />

          <div className="flex items-center justify-between">
            <span className="text-base font-semibold text-stone-900">
              Total a pagar
            </span>
            <span className="text-2xl font-bold text-stone-900">
              S/ {finalPreviewTotal.toFixed(2)}
            </span>
          </div>

          <p className="mt-3 text-xs text-stone-500">
            Ganarías aprox. {earnedPointsPreview} puntos con esta compra.
          </p>

          <button
            type="button"
            onClick={handleConfirmOrder}
            disabled={isCreatingOrder || isSavingProfile || shouldShowDetailsForm}
            className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-stone-900 px-5 py-3 text-sm font-semibold text-white transition hover:opacity-95 disabled:cursor-not-allowed disabled:bg-stone-400"
          >
            {isCreatingOrder ? 'Confirmando...' : 'Confirmar pedido'}
          </button>

          <p className="mt-3 text-xs text-stone-500">
            Primero confirmas el pedido. Cuando integres la pasarela, el
            siguiente paso será pagar.
          </p>
        </aside>
      </div>
    </section>
  )
}