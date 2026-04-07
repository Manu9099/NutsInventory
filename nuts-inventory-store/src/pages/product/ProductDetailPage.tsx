import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, BadgeCheck, Minus, Package, Plus } from 'lucide-react'

import { useProduct } from '../../features/products/hooks/useProduct'

export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { data: product, isLoading, isError, error } = useProduct(id ?? '')

  const [quantity, setQuantity] = useState(1)

  const maxQuantity = useMemo(() => {
    if (!product) return 1
    return product.stock > 0 ? product.stock : 1
  }, [product])

  useEffect(() => {
    setQuantity(1)
  }, [product?.id])

  const isOutOfStock = (product?.stock ?? 0) <= 0

  const increaseQuantity = () => {
    setQuantity((prev) => Math.min(prev + 1, maxQuantity))
  }

  const decreaseQuantity = () => {
    setQuantity((prev) => Math.max(prev - 1, 1))
  }

  const handleInputQuantity = (value: string) => {
    const parsed = Number(value)

    if (Number.isNaN(parsed)) {
      setQuantity(1)
      return
    }

    setQuantity(Math.max(1, Math.min(parsed, maxQuantity)))
  }

  if (isLoading) {
    return (
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <Link
          to="/catalog"
          className="inline-flex items-center gap-2 text-sm font-medium text-stone-600 transition hover:text-stone-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver al catálogo
        </Link>

        <div className="mt-8 rounded-3xl bg-white p-8 shadow-sm ring-1 ring-stone-200">
          <h1 className="text-3xl font-semibold tracking-tight text-stone-900">
            Cargando producto...
          </h1>
          <p className="mt-3 text-stone-600">
            Estamos preparando el detalle del producto.
          </p>
        </div>
      </section>
    )
  }

  if (isError || !product) {
    return (
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <Link
          to="/catalog"
          className="inline-flex items-center gap-2 text-sm font-medium text-stone-600 transition hover:text-stone-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver al catálogo
        </Link>

        <div className="mt-8 rounded-3xl bg-white p-8 shadow-sm ring-1 ring-stone-200">
          <h1 className="text-3xl font-semibold tracking-tight text-stone-900">
            No se pudo cargar el producto
          </h1>
          <p className="mt-3 text-stone-600">
            {error instanceof Error
              ? error.message
              : 'Ocurrió un problema obteniendo el detalle del producto.'}
          </p>
        </div>
      </section>
    )
  }

  const total = product.price * quantity

  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <Link
        to="/catalog"
        className="inline-flex items-center gap-2 text-sm font-medium text-stone-600 transition hover:text-stone-900"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver al catálogo
      </Link>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="overflow-hidden rounded-[2rem]- bg-white shadow-sm ring-1 ring-stone-200">
          <div className="relative h-[420px]- bg-stone-100">
            {product.imageUrl ? (
              <img
                src={product.imageUrl}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full flex-col items-center justify-center px-6 text-center">
                <Package className="h-12 w-12 text-stone-400" />
                <p className="mt-3 text-sm font-medium text-stone-500">
                  Sin imagen disponible
                </p>
              </div>
            )}

            <div className="absolute left-4 top-4 flex flex-wrap gap-2">
              <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-stone-700 shadow-sm">
                {product.categoryName ?? 'Producto'}
              </span>

              {isOutOfStock ? (
                <span className="rounded-full bg-red-600 px-3 py-1 text-xs font-semibold text-white shadow-sm">
                  Sin stock
                </span>
              ) : product.stock <= 10 ? (
                <span className="rounded-full bg-amber-500 px-3 py-1 text-xs font-semibold text-white shadow-sm">
                  Últimas {product.stock}
                </span>
              ) : (
                <span className="rounded-full bg-lime-600 px-3 py-1 text-xs font-semibold text-white shadow-sm">
                  Disponible
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="rounded-[2rem]- bg-white p-8 shadow-sm ring-1 ring-stone-200">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-stone-500">
            {product.categoryName ?? 'Producto'}
          </p>

          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-stone-900">
            {product.name}
          </h1>

          <p className="mt-4 text-3xl font-bold text-stone-900">
            S/ {product.price.toFixed(2)}
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
            {isOutOfStock ? (
              <span className="rounded-full bg-red-50 px-3 py-1 font-medium text-red-700">
                Producto sin stock
              </span>
            ) : product.stock <= 10 ? (
              <span className="rounded-full bg-amber-50 px-3 py-1 font-medium text-amber-700">
                Quedan {product.stock} unidades
              </span>
            ) : (
              <span className="rounded-full bg-lime-50 px-3 py-1 font-medium text-lime-700">
                Stock disponible: {product.stock}
              </span>
            )}

            {!isOutOfStock ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-stone-100 px-3 py-1 font-medium text-stone-700">
                <BadgeCheck className="h-3.5 w-3.5" />
                Producto activo
              </span>
            ) : null}
          </div>

          <div className="mt-8">
            <h2 className="text-lg font-semibold text-stone-900">Descripción</h2>
            <p className="mt-3 leading-7 text-stone-600">
              {product.description ||
                'Este producto no tiene descripción registrada.'}
            </p>
          </div>

          <div className="mt-8 rounded-3xl border border-stone-200 p-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-stone-900">Cantidad</p>
                <p className="mt-1 text-sm text-stone-500">
                  {isOutOfStock
                    ? 'Este producto no tiene stock disponible.'
                    : maxQuantity === 1
                      ? 'Solo queda 1 unidad disponible.'
                      : `Puedes revisar hasta ${maxQuantity} unidades.`}
                </p>
              </div>

              <div className="inline-flex items-center overflow-hidden rounded-2xl border border-stone-300 bg-white">
                <button
                  type="button"
                  onClick={decreaseQuantity}
                  disabled={isOutOfStock || quantity <= 1}
                  className="inline-flex h-12 w-12 items-center justify-center text-stone-700 transition hover:bg-stone-50 disabled:cursor-not-allowed disabled:bg-stone-100 disabled:text-stone-300"
                  aria-label="Disminuir cantidad"
                >
                  <Minus className="h-4 w-4" />
                </button>

                <input
                  type="number"
                  min={1}
                  max={maxQuantity}
                  value={quantity}
                  onChange={(e) => handleInputQuantity(e.target.value)}
                  disabled={isOutOfStock}
                  className="h-12 w-16 border-x border-stone-300 text-center text-sm font-semibold outline-none"
                />

                <button
                  type="button"
                  onClick={increaseQuantity}
                  disabled={isOutOfStock || quantity >= maxQuantity}
                  className="inline-flex h-12 w-12 items-center justify-center text-stone-700 transition hover:bg-stone-50 disabled:cursor-not-allowed disabled:bg-stone-100 disabled:text-stone-300"
                  aria-label="Aumentar cantidad"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            {!isOutOfStock ? (
              <div className="mt-4 flex flex-wrap gap-2 text-xs">
                <span className="rounded-full bg-stone-100 px-3 py-1 font-medium text-stone-700">
                  Stock disponible: {product.stock}
                </span>

                {quantity >= maxQuantity ? (
                  <span className="rounded-full bg-amber-50 px-3 py-1 font-medium text-amber-700">
                    Llegaste al máximo disponible
                  </span>
                ) : null}
              </div>
            ) : null}

            <div className="mt-5 grid gap-3 rounded-2xl bg-stone-50 p-4 sm:grid-cols-2">
              <div>
                <p className="text-xs uppercase tracking-[0.15em] text-stone-500">
                  Precio unitario
                </p>
                <p className="mt-1 text-lg font-semibold text-stone-900">
                  S/ {product.price.toFixed(2)}
                </p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-[0.15em] text-stone-500">
                  Total referencial
                </p>
                <p className="mt-1 text-lg font-semibold text-stone-900">
                  S/ {total.toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-stone-200 p-4">
              <h3 className="text-sm font-semibold text-stone-900">
                Compra segura
              </h3>
              <p className="mt-2 text-sm leading-6 text-stone-600">
                Base lista para integrarse con auth de customer y flujo de
                checkout.
              </p>
            </div>

            <div className="rounded-2xl border border-stone-200 p-4">
              <h3 className="text-sm font-semibold text-stone-900">Entrega</h3>
              <p className="mt-2 text-sm leading-6 text-stone-600">
                Puedes conectar cálculo de envío, tiempos de entrega y tracking
                en la siguiente fase.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}