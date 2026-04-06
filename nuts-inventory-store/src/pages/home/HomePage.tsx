import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  BadgeCheck,
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
    title: 'Productos seleccionados',
    description: 'Frutos secos y productos relacionados con una presentación clara y lista para compra.',
  },
  {
    icon: Truck,
    title: 'Compra simple',
    description: 'Explora el catálogo, revisa detalle, agrega al carrito y avanza al checkout.',
  },
  {
    icon: PackageCheck,
    title: 'Stock visible',
    description: 'Cada producto muestra precio, categoría y disponibilidad para una compra más confiable.',
  },
]

export function HomePage() {
  const { data: products = [], isLoading, isError } = useProducts()

  const featuredProducts = useMemo<Product[]>(() => {
    return products.filter((product) => product.stock > 0).slice(0, 4)
  }, [products])

  const categories = useMemo<string[]>(() => {
    return Array.from(
      new Set(
        products
          .map((product) => product.categoryName?.trim())
          .filter((value): value is string => Boolean(value)),
      ),
    ).slice(0, 3)
  }, [products])

  return (
    <div className="bg-stone-50">
      <section className="border-b border-stone-200 -bg-gradient-to-b from-stone-100 to-stone-50">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-stone-300 bg-white px-4 py-2 text-sm font-medium text-stone-700 shadow-sm">
                <Sparkles className="h-4 w-4" />
                Storefront cliente de NutsInventory
              </div>

              <h1 className="mt-6 max-w-2xl text-4xl font-bold tracking-tight text-stone-900 sm:text-5xl">
                Frutos secos y productos seleccionados, en una experiencia de compra más clara.
              </h1>

              <p className="mt-5 max-w-xl text-base leading-7 text-stone-600 sm:text-lg">
                Explora el catálogo, descubre productos por categoría, revisa detalles y agrega al carrito
                desde una tienda moderna conectada a tu backend.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  to="/catalog"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-stone-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-stone-800"
                >
                  Ver catálogo
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <Link
                  to="/orders"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-stone-300 bg-white px-6 py-3 text-sm font-semibold text-stone-700 transition hover:bg-stone-100"
                >
                  Ver mis pedidos
                </Link>
              </div>

              <div className="mt-8 flex flex-wrap gap-3 text-sm text-stone-600">
                <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 shadow-sm ring-1 ring-stone-200">
                  <BadgeCheck className="h-4 w-4 text-stone-700" />
                  Catálogo conectado
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 shadow-sm ring-1 ring-stone-200">
                  <ShoppingBag className="h-4 w-4 text-stone-700" />
                  Carrito activo
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 shadow-sm ring-1 ring-stone-200">
                  <PackageCheck className="h-4 w-4 text-stone-700" />
                  Base de checkout
                </span>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm sm:col-span-2">
                <p className="text-sm font-medium text-stone-500">Tienda online</p>
                <h2 className="mt-2 text-2xl font-semibold text-stone-900">
                  Un storefront simple, limpio y listo para escalar.
                </h2>
                <p className="mt-3 text-sm leading-6 text-stone-600">
                  Pensado para mostrar productos reales, facilitar la compra y evolucionar hacia una
                  experiencia ecommerce más completa.
                </p>
              </div>

              <div className="rounded-3xl border border-stone-200 bg-stone-900 p-6 text-white shadow-sm">
                <p className="text-sm text-stone-300">Productos cargados</p>
                <p className="mt-3 text-3xl font-bold">{products.length}</p>
                <p className="mt-2 text-sm text-stone-300">Disponibles desde el backend</p>
              </div>

              <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
                <p className="text-sm text-stone-500">Categorías visibles</p>
                <p className="mt-3 text-3xl font-bold text-stone-900">{categories.length}</p>
                <p className="mt-2 text-sm text-stone-600">Organización más clara para explorar</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="mb-8 max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-stone-500">
            Beneficios
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-stone-900">
            Una base sólida para una tienda que se siente real
          </h2>
          <p className="mt-3 text-stone-600">
            Esta home ya no solo presenta el proyecto: también comunica utilidad, estructura y confianza.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {benefits.map((benefit) => {
            const Icon = benefit.icon

            return (
              <article
                key={benefit.title}
                className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm"
              >
                <div className="inline-flex rounded-2xl bg-stone-100 p-3 text-stone-700">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-stone-900">{benefit.title}</h3>
                <p className="mt-2 text-sm leading-6 text-stone-600">{benefit.description}</p>
              </article>
            )
          })}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="-rounded-[2rem] border border-stone-200 bg-white p-8 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-stone-500">
                Categorías
              </p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-stone-900">
                Compra por tipo de producto
              </h2>
              <p className="mt-3 max-w-2xl text-stone-600">
                Una navegación más comercial empieza mostrando grupos claros desde la portada.
              </p>
            </div>

            <Link
              to="/catalog"
              className="inline-flex items-center gap-2 text-sm font-semibold text-stone-700 transition hover:text-stone-900"
            >
              Ir al catálogo
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {(categories.length > 0 ? categories : ['Frutos secos', 'Snacks', 'Complementos']).map(
              (category) => (
                <Link
                  key={category}
                  to="/catalog"
                  className="group rounded-3xl border border-stone-200 bg-stone-50 p-6 transition hover:-translate-y-0.5 hover:bg-stone-100"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-stone-500">Categoría</span>
                    <ArrowRight className="h-4 w-4 text-stone-400 transition group-hover:text-stone-700" />
                  </div>
                  <h3 className="mt-8 text-xl font-semibold text-stone-900">{category}</h3>
                  <p className="mt-2 text-sm leading-6 text-stone-600">
                    Explora productos relacionados dentro de esta categoría.
                  </p>
                </Link>
              ),
            )}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-stone-500">
              Destacados
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-stone-900">
              Productos para empezar a comprar
            </h2>
            <p className="mt-3 text-stone-600">
              Mostramos una selección inicial para que la home tenga intención comercial real.
            </p>
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
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="-h-[360px] animate-pulse rounded-3xl border border-stone-200 bg-white"
              />
            ))}
          </div>
        ) : isError ? (
          <div className="rounded-3xl border border-red-200 bg-red-50 p-6">
            <h3 className="text-lg font-semibold text-red-900">No se pudieron cargar los productos</h3>
            <p className="mt-2 text-sm text-red-700">
              La home sigue funcionando, pero la sección de destacados necesita conexión correcta con el backend.
            </p>
          </div>
        ) : featuredProducts.length === 0 ? (
          <div className="rounded-3xl border border-stone-200 bg-white p-8 text-center shadow-sm">
            <h3 className="text-xl font-semibold text-stone-900">Aún no hay productos destacados</h3>
            <p className="mt-3 text-sm text-stone-600">
              Cuando existan productos con stock disponible, aparecerán aquí automáticamente.
            </p>
            <Link
              to="/catalog"
              className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-stone-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-stone-800"
            >
              Ir al catálogo
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="-rounded-[2rem] border border-stone-200 bg-stone-900 px-8 py-10 text-white shadow-sm">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-stone-300">
                Siguiente paso
              </p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight">
                Tu storefront ya puede empezar a sentirse como producto, no como placeholder.
              </h2>
              <p className="mt-3 text-sm leading-6 text-stone-300">
                Con esta portada mejoras percepción, branding técnico y consistencia con el resto del flujo.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                to="/catalog"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-6 py-3 text-sm font-semibold text-stone-900 transition hover:bg-stone-100"
              >
                Explorar tienda
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-stone-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-stone-800"
              >
                Ingresar
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}