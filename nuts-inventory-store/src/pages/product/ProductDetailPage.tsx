import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  BadgeCheck,
  Minus,
  Package,
  Plus,
  ShoppingCart,
} from 'lucide-react'
import { useProduct } from '../../features/products/hooks/useProduct'
import { useCart } from '../../features/cart/hooks/useCart'

export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { data: product, isLoading, isError, error } = useProduct(id ?? '')
 const { addItem, openCartDrawer } = useCart()

  const [quantity, setQuantity] = useState(1)
  const [successMessage, setSuccessMessage] = useState('')

  const maxQuantity = useMemo(() => {
    if (!product) return 1
    return product.stock > 0 ? product.stock : 1
  }, [product])

  useEffect(() => {
    setQuantity(1)
    setSuccessMessage('')
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

  const handleAddToCart = () => {
    if (!product || product.stock <= 0) return

    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity,
      imageUrl: product.imageUrl,
    })

    setSuccessMessage('Producto agregado al carrito.')
    openCartDrawer()
  }

  if (isLoading) {
    return (
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <Link
          to="/catalog"
          className="inline-flex items-center gap-2 text-sm font-medium text-stone-600 transition hover:text-stone-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver al catálogo
        </Link>

        <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_1fr]">
          <div className="h-[430px]- animate-pulse rounded-[2rem]- border border-stone-200 bg-white" />
          <div className="space-y-4">
            <div className="h-8 w-32 animate-pulse rounded-xl bg-stone-200" />
            <div className="h-12 w-3/4 animate-pulse rounded-xl bg-stone-200" />
            <div className="h-8 w-40 animate-pulse rounded-xl bg-stone-200" />
            <div className="h-32 animate-pulse rounded-2xl bg-stone-200" />
            <div className="h-48 animate-pulse rounded-[2rem]- bg-stone-200" />
          </div>
        </div>
      </section>
    )
  }

  if (isError || !product) {
    return (
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <Link
          to="/catalog"
          className="inline-flex items-center gap-2 text-sm font-medium text-stone-600 transition hover:text-stone-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver al catálogo
        </Link>

        <div className="mt-6 rounded-[2rem]- border border-red-200 bg-red-50 p-8">
          <h1 className="text-2xl font-bold tracking-tight text-red-900">
            No se pudo cargar el producto
          </h1>
          <p className="mt-3 text-sm leading-6 text-red-700">
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
    <section className="bg-stone-50">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <Link
          to="/catalog"
          className="inline-flex items-center gap-2 text-sm font-medium text-stone-600 transition hover:text-stone-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver al catálogo
        </Link>

        <div className="mt-6 grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-[2rem]- border border-stone-200 bg-white p-5 shadow-sm">
            <div className="relative flex min-h-[430px]- items-center justify-center overflow-hidden rounded-[1.5rem]- bg-stone-100">
              {product.imageUrl ? (
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center justify-center px-6 text-center">
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

          <div className="space-y-6">
            <div className="rounded-[2rem]- border border-stone-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-stone-500">
                {product.categoryName ?? 'Producto'}
              </p>

              <h1 className="mt-3 text-4xl font-bold tracking-tight text-stone-900">
                {product.name}
              </h1>

              <div className="mt-4 flex flex-wrap items-center gap-3">
                <p className="text-3xl font-bold text-stone-900">
                  S/ {product.price.toFixed(2)}
                </p>

                {isOutOfStock ? (
                  <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
                    Producto sin stock
                  </span>
                ) : product.stock <= 10 ? (
                  <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                    Quedan {product.stock} unidades
                  </span>
                ) : (
                  <span className="rounded-full bg-lime-100 px-3 py-1 text-xs font-semibold text-lime-700">
                    Stock disponible: {product.stock}
                  </span>
                )}
              </div>

              <div className="mt-6 rounded-2xl bg-stone-50 p-5">
                <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-stone-500">
                  Descripción
                </h2>
                <p className="mt-3 text-sm leading-7 text-stone-700">
                  {product.description ||
                    'Este producto no tiene descripción registrada.'}
                </p>
              </div>
            </div>

            <div className="rounded-[2rem]- border border-stone-200 bg-white p-6 shadow-sm">
  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
    <div>
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-stone-500">
        Cantidad
      </p>
      <p className="mt-2 text-sm text-stone-600">
        {isOutOfStock
          ? 'Este producto no tiene stock disponible.'
          : maxQuantity === 1
          ? 'Solo queda 1 unidad disponible.'
          : `Puedes agregar hasta ${maxQuantity} unidades.`}
      </p>
    </div>

    <div className="inline-flex items-center rounded-2xl border border-stone-300 bg-white">
      <button
        type="button"
        onClick={decreaseQuantity}
        disabled={isOutOfStock || quantity <= 1}
        className="inline-flex h-12 w-12 items-center justify-center rounded-l-2xl text-stone-700 transition hover:bg-stone-50 disabled:cursor-not-allowed disabled:bg-stone-100 disabled:text-stone-300"
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
        className="inline-flex h-12 w-12 items-center justify-center rounded-r-2xl text-stone-700 transition hover:bg-stone-50 disabled:cursor-not-allowed disabled:bg-stone-100 disabled:text-stone-300"
        aria-label="Aumentar cantidad"
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  </div>

  {!isOutOfStock ? (
    <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
      <span className="rounded-full bg-stone-100 px-3 py-1 font-medium text-stone-700">
        Stock disponible: {product.stock}
      </span>

      {quantity >= maxQuantity ? (
        <span className="rounded-full bg-amber-100 px-3 py-1 font-medium text-amber-700">
          Llegaste al máximo disponible
        </span>
      ) : null}
    </div>
  ) : null}

  <div className="mt-6 rounded-2xl bg-stone-50 p-5">
    <div className="flex items-center justify-between text-sm text-stone-600">
      <span>Precio unitario</span>
      <span>S/ {product.price.toFixed(2)}</span>
    </div>

    <div className="mt-3 flex items-center justify-between border-t border-stone-200 pt-3">
      <span className="text-base font-semibold text-stone-900">Total</span>
      <span className="text-2xl font-bold text-stone-900">
        S/ {total.toFixed(2)}
      </span>
    </div>
  </div>
</div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-[2rem]- border border-stone-200 bg-white p-5 shadow-sm">
                <div className="flex items-center gap-2 text-stone-900">
                  <BadgeCheck className="h-5 w-5" />
                  <h3 className="font-semibold">Compra segura</h3>
                </div>
                <p className="mt-3 text-sm leading-6 text-stone-600">
                  Base lista para integrarse con auth de customer y flujo de checkout.
                </p>
              </div>

              <div className="rounded-[2rem]- border border-stone-200 bg-white p-5 shadow-sm">
                <div className="flex items-center gap-2 text-stone-900">
                  <Package className="h-5 w-5" />
                  <h3 className="font-semibold">Entrega</h3>
                </div>
                <p className="mt-3 text-sm leading-6 text-stone-600">
                  Puedes conectar cálculo de envío, tiempos de entrega y tracking en la siguiente fase.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}