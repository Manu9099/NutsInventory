import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  BadgeCheck,
  ChevronLeft,
  ChevronRight,
  Leaf,
  PackageCheck,
  ShoppingBag,
  Sparkles,
  Truck,
} from 'lucide-react'

import { ProductCard } from '../../components/product/ProductCard'
import { useProducts } from '../../features/products/hooks/useProducts'
import type { Product } from '../../features/products/types/product.types'

const benefits = [
  {
    icon: Leaf,
    title: 'Selección saludable',
    description:
      'Productos pensados para verse naturales, ordenados y listos para compra.',
  },
  {
    icon: Truck,
    title: 'Compra simple',
    description:
      'Explora, agrega al carrito y avanza a checkout sin una experiencia recargada.',
  },
  {
    icon: PackageCheck,
    title: 'Stock visible',
    description:
      'Cada producto muestra disponibilidad real para comprar con más confianza.',
  },
]

function getCircularIndex(index: number, length: number) {
  return ((index % length) + length) % length
}

function getSlidePosition(index: number, activeIndex: number, length: number) {
  const raw = index - activeIndex
  const half = Math.floor(length / 2)

  if (raw > half) return raw - length
  if (raw < -half) return raw + length
  return raw
}

function FocusSlide({
  product,
  position,
  onClick,
}: {
  product: Product
  position: number
  onClick: () => void
}) {
  const isCenter = position === 0
  const isSide = Math.abs(position) === 1

  const wrapperClasses = isCenter
    ? 'relative z-20 scale-100 opacity-100'
    : isSide
      ? 'relative z-10 scale-[0.88] opacity-70 blur-[0.4px]'
      : 'pointer-events-none absolute opacity-0'

  const placementClasses =
    position === 0
      ? 'left-1/2 top-0 w-[92%] -translate-x-1/2 md:w-[58%]'
      : position === -1
        ? 'left-0 top-8 hidden w-[38%] md:block'
        : position === 1
          ? 'right-0 top-8 hidden w-[38%] md:block'
          : 'hidden'

  return (
    <button
      type="button"
      onClick={onClick}
      className={`${wrapperClasses} ${placementClasses} transition-all duration-500`}
      aria-label={`Ver ${product.name}`}
    >
      <article className="overflow-hidden rounded-[2rem]- border border-stone-200 bg-white shadow-sm">
        <div className="relative h-[350px]- bg-stone-100">
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-gradient-to-br- from-stone-100 via-stone-50 to-lime-50">
              <div className="rounded-full bg-white/80 p-4 shadow-sm">
                <Leaf className="h-10 w-10 text-lime-700" />
              </div>
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t- from-stone-950/70 via-stone-900/15 to-transparent" />

          <div className="absolute left-5 top-5 flex flex-wrap gap-2">
            <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-stone-700 shadow-sm">
              {product.categoryName ?? 'Producto'}
            </span>

            {product.stock > 0 ? (
              <span className="rounded-full bg-lime-600 px-3 py-1 text-xs font-semibold text-white shadow-sm">
                Disponible
              </span>
            ) : (
              <span className="rounded-full bg-red-600 px-3 py-1 text-xs font-semibold text-white shadow-sm">
                Sin stock
              </span>
            )}
          </div>

          <div className="absolute inset-x-0 bottom-0 p-6 text-left text-white">
            <p className="text-xs font-medium uppercase tracking-[0.22em] text-white/80">
              Destacado
            </p>
            <h3 className="mt-2 text-2xl font-semibold tracking-tight md:text-3xl">
              {product.name}
            </h3>
            <p className="mt-2 max-w-xl line-clamp-2 text-sm leading-6 text-white/85">
              {product.description || 'Producto destacado dentro de la tienda.'}
            </p>

            <div className="mt-4 flex items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.15em] text-white/70">
                  Precio
                </p>
                <p className="text-2xl font-bold">S/ {product.price.toFixed(2)}</p>
              </div>

              <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-medium backdrop-blur-sm">
                Explorar
                <ArrowRight className="h-4 w-4" />
              </span>
            </div>
          </div>
        </div>
      </article>
    </button>
  )
}

export function HomePage() {
  const { data: products = [], isLoading, isError } = useProducts()
  const [activeSlide, setActiveSlide] = useState(0)

  const featuredProducts = useMemo(() => {
    return products.filter((product) => product.stock > 0).slice(0, 6)
  }, [products])

  const carouselProducts = useMemo(() => {
    return featuredProducts.slice(0, 5)
  }, [featuredProducts])

  const categories = useMemo(() => {
    return Array.from(
      new Set(
        products
          .map((product) => product.categoryName?.trim())
          .filter((value): value is string => Boolean(value)),
      ),
    ).slice(0, 4)
  }, [products])

  useEffect(() => {
    if (carouselProducts.length <= 1) return

    const interval = window.setInterval(() => {
      setActiveSlide((prev) => getCircularIndex(prev + 1, carouselProducts.length))
    }, 4500)

    return () => window.clearInterval(interval)
  }, [carouselProducts.length])

  useEffect(() => {
    if (activeSlide > Math.max(carouselProducts.length - 1, 0)) {
      setActiveSlide(0)
    }
  }, [activeSlide, carouselProducts.length])

  const goPrev = () => {
    if (carouselProducts.length === 0) return
    setActiveSlide((prev) => getCircularIndex(prev - 1, carouselProducts.length))
  }

  const goNext = () => {
    if (carouselProducts.length === 0) return
    setActiveSlide((prev) => getCircularIndex(prev + 1, carouselProducts.length))
  }

  return (
    <section className="pb-16">
      <div className="mx-auto max-w-7xl px-4 pt-10 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-[2.5rem] border border-stone-200 bg-gradient-to-br- from-stone-950 via-stone-900 to-lime-950 text-white shadow-sm">
          <div className="grid gap-10 px-6 py-10 md:px-10 md:py-14 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-medium uppercase tracking-[0.22em] text-white/85">
                <Sparkles className="h-3.5 w-3.5" />
                NutsInventory Store
              </p>

              <h1 className="mt-6 max-w-3xl text-4xl font-semibold tracking-tight md:text-5xl">
                Frutos secos y snacks con una experiencia más premium, simple y
                enfocada.
              </h1>

              <p className="mt-5 max-w-2xl text-base leading-7 text-white/75 md:text-lg">
                Explora productos seleccionados, compra con menos fricción y
                descubre una tienda que ya se siente como producto real.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  to="/catalog"
                  className="inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-stone-900 transition hover:bg-stone-100"
                >
                  Comprar ahora
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <Link
                  to="/orders"
                  className="inline-flex items-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/15"
                >
                  Ver mis pedidos
                </Link>
              </div>

              <div className="mt-8 flex flex-wrap gap-3 text-xs font-medium text-white/80">
                <span className="rounded-full bg-white/10 px-3 py-2">
                  Catálogo conectado
                </span>
                <span className="rounded-full bg-white/10 px-3 py-2">
                  Carrito activo
                </span>
                <span className="rounded-full bg-white/10 px-3 py-2">
                  Checkout con puntos
                </span>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
              <div className="rounded-[2rem]- border border-white/10 bg-white/10 p-5 backdrop-blur-sm">
                <p className="text-xs uppercase tracking-[0.18em] text-white/65">
                  Productos cargados
                </p>
                <p className="mt-2 text-4xl font-bold">{products.length}</p>
                <p className="mt-2 text-sm text-white/70">
                  Disponibles desde tu backend real.
                </p>
              </div>

              <div className="rounded-[2rem]- border border-white/10 bg-white/10 p-5 backdrop-blur-sm">
                <p className="text-xs uppercase tracking-[0.18em] text-white/65">
                  Categorías
                </p>
                <p className="mt-2 text-4xl font-bold">{categories.length}</p>
                <p className="mt-2 text-sm text-white/70">
                  Organización visual más clara para explorar.
                </p>
              </div>

              <div className="rounded-[2rem]- border border-white/10 bg-white/10 p-5 backdrop-blur-sm">
                <p className="text-xs uppercase tracking-[0.18em] text-white/65">
                  Experiencia
                </p>
                <p className="mt-2 text-xl font-semibold">Compra directa</p>
                <p className="mt-2 text-sm text-white/70">
                  Menos ruido, mejor foco y sensación más premium.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-14">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-stone-500">
                Focus carousel
              </p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight text-stone-900 md:text-4xl">
                Empieza por lo más atractivo de la tienda
              </h2>
              <p className="mt-3 max-w-2xl text-stone-600">
                Un carrusel con foco ayuda a que la portada se sienta más viva,
                más comercial y mejor guiada.
              </p>
            </div>

            {carouselProducts.length > 1 ? (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={goPrev}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-stone-300 bg-white text-stone-700 transition hover:bg-stone-50"
                  aria-label="Anterior"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  onClick={goNext}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-stone-300 bg-white text-stone-700 transition hover:bg-stone-50"
                  aria-label="Siguiente"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            ) : null}
          </div>

          <div className="mt-8">
            {isLoading ? (
              <div className="grid gap-4 md:grid-cols-3">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div
                    key={index}
                    className="h-[350px]- animate-pulse rounded-[2rem]- bg-stone-100"
                  />
                ))}
              </div>
            ) : isError ? (
              <div className="rounded-[2rem]- border border-red-200 bg-red-50 p-6 text-red-700">
                No se pudieron cargar los destacados.
              </div>
            ) : carouselProducts.length === 0 ? (
              <div className="rounded-[2rem]- border border-stone-200 bg-white p-8 text-center shadow-sm">
                <h3 className="text-2xl font-semibold text-stone-900">
                  Aún no hay productos para destacar
                </h3>
                <p className="mt-3 text-stone-600">
                  Cuando tengas productos activos con stock, aparecerán aquí.
                </p>
              </div>
            ) : (
              <>
                <div className="relative h-[350px]- md:h-[430px]-">
                  {carouselProducts.map((product, index) => {
                    const position = getSlidePosition(
                      index,
                      activeSlide,
                      carouselProducts.length,
                    )

                    if (Math.abs(position) > 1) return null

                    return (
                      <FocusSlide
                        key={product.id}
                        product={product}
                        position={position}
                        onClick={() => setActiveSlide(index)}
                      />
                    )
                  })}
                </div>

                {carouselProducts.length > 1 ? (
                  <div className="mt-6 flex items-center justify-center gap-2">
                    {carouselProducts.map((product, index) => (
                      <button
                        key={product.id}
                        type="button"
                        onClick={() => setActiveSlide(index)}
                        className={`h-2.5 rounded-full transition-all ${
                          index === activeSlide
                            ? 'w-8 bg-stone-900'
                            : 'w-2.5 bg-stone-300 hover:bg-stone-400'
                        }`}
                        aria-label={`Ir a ${product.name}`}
                      />
                    ))}
                  </div>
                ) : null}
              </>
            )}
          </div>
        </div>

        <div className="mt-16">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-stone-500">
                Beneficios
              </p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight text-stone-900">
                Una base sólida para una tienda que ya se siente real
              </h2>
            </div>

            <div className="inline-flex items-center gap-2 rounded-full bg-lime-50 px-4 py-2 text-sm font-medium text-lime-700">
              <BadgeCheck className="h-4 w-4" />
              Lista para seguir creciendo
            </div>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {benefits.map((benefit) => {
              const Icon = benefit.icon

              return (
                <article
                  key={benefit.title}
                  className="rounded-[2rem]- border border-stone-200 bg-white p-6 shadow-sm"
                >
                  <div className="inline-flex rounded-2xl bg-stone-100 p-3">
                    <Icon className="h-5 w-5 text-stone-700" />
                  </div>

                  <h3 className="mt-5 text-xl font-semibold text-stone-900">
                    {benefit.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-stone-600">
                    {benefit.description}
                  </p>
                </article>
              )
            })}
          </div>
        </div>

        <div className="mt-16">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-stone-500">
                Destacados
              </p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight text-stone-900">
                Productos para empezar a comprar
              </h2>
            </div>

            <Link
              to="/catalog"
              className="inline-flex items-center gap-2 text-sm font-semibold text-stone-700 transition hover:text-stone-900"
            >
              Ver todos los productos
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {isLoading ? (
            <div className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="h-[440px-] animate-pulse rounded-[2rem]- bg-stone-100"
                />
              ))}
            </div>
          ) : isError ? (
            <div className="mt-8 rounded-[2rem]- border border-red-200 bg-red-50 p-6 text-red-700">
              No se pudieron cargar los productos destacados.
            </div>
          ) : featuredProducts.length === 0 ? (
            <div className="mt-8 rounded-[2rem]- border border-stone-200 bg-white p-8 text-center shadow-sm">
              <ShoppingBag className="mx-auto h-10 w-10 text-stone-400" />
              <h3 className="mt-4 text-2xl font-semibold text-stone-900">
                Aún no hay productos destacados
              </h3>
              <p className="mt-3 text-stone-600">
                Cuando existan productos con stock disponible, aparecerán aquí
                automáticamente.
              </p>
            </div>
          ) : (
            <div className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
              {featuredProducts.slice(0, 4).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>

        <div className="mt-16 rounded-[2.5rem] border border-stone-200 bg-white px-6 py-8 shadow-sm md:px-8 md:py-10">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-stone-500">
                Siguiente paso
              </p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight text-stone-900">
                Tu storefront ya se puede sentir más marca y menos placeholder
              </h2>
              <p className="mt-3 max-w-2xl text-stone-600">
                Con esta portada mejoras percepción, foco visual y valor del
                producto desde el primer vistazo.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                to="/catalog"
                className="inline-flex items-center gap-2 rounded-2xl bg-stone-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-stone-800"
              >
                Explorar tienda
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                to="/login"
                className="inline-flex items-center gap-2 rounded-2xl border border-stone-300 px-5 py-3 text-sm font-semibold text-stone-700 transition hover:bg-stone-50"
              >
                Ingresar
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}