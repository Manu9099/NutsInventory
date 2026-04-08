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

const benefits = [
  {
    icon: Leaf,
    title: 'Selección saludable',
    description:
      'Productos con una presentación más limpia, natural y fácil de explorar.',
  },
  {
    icon: Truck,
    title: 'Compra simple',
    description:
      'Menos fricción entre catálogo, carrito y checkout para una experiencia más directa.',
  },
  {
    icon: PackageCheck,
    title: 'Stock visible',
    description:
      'Cada producto muestra disponibilidad para comprar con más confianza.',
  },
]

function FeaturedTile({
  title,
  description,
  category,
  imageUrl,
  price,
  href = '/catalog',
  large = false,
}: {
  title: string
  description: string
  category?: string
  imageUrl?: string | null
  price?: number
  href?: string
  large?: boolean
}) {
  return (
    <Link
      to={href}
      className={`group relative overflow-hidden -rounded-[2rem] border border-stone-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${
        large ? '-min-h-[460px]' : 'min-h-[220px]-'
      }`}
    >
      <div className={`absolute inset-0 ${large ? 'h-full' : 'h-full'}`}>
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full items-center justify-center -bg-gradient-to-br from-stone-100 via-stone-50 to-lime-50">
            <div className="rounded-full bg-white/90 p-4 shadow-sm">
              <Leaf className="h-10 w-10 text-lime-700" />
            </div>
          </div>
        )}

        <div className="absolute inset-0 -bg-gradient-to-t from-stone-950/80 via-stone-900/20 to-transparent" />
      </div>

      <div className="relative flex h-full flex-col justify-end p-6 text-white">
        <div className="mb-3 flex flex-wrap gap-2">
          <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur-sm">
            {category ?? 'Destacado'}
          </span>

          {typeof price === 'number' ? (
            <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur-sm">
              S/ {price.toFixed(2)}
            </span>
          ) : null}
        </div>

        <h3 className={`${large ? 'text-3xl' : 'text-xl'} font-semibold tracking-tight`}>
          {title}
        </h3>

        <p className={`mt-3 max-w-xl text-sm leading-6 text-white/85 ${large ? '' : 'line-clamp-2'}`}>
          {description}
        </p>

        <div className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-white">
          Explorar
          <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
        </div>
      </div>
    </Link>
  )
}

export function HomePage() {
  const { data: products = [], isLoading, isError } = useProducts()

  const availableProducts = products.filter((product) => product.stock > 0)
  const featuredProducts = availableProducts.slice(0, 4)
  const heroProduct = availableProducts[0]
  const secondaryProducts = availableProducts.slice(1, 3)

  const categories = Array.from(
    new Set(
      products
        .map((product) => product.categoryName?.trim())
        .filter((value): value is string => Boolean(value)),
    ),
  ).slice(0, 4)

  return (
    <section className="pb-16">
      <div className="mx-auto max-w-7xl px-4 pt-10 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-[2.5rem] border border-stone-200 -bg-gradient-to-br from-stone-950 via-stone-900 to-lime-950 text-white shadow-sm">
          <div className="grid gap-10 px-6 py-10 md:px-10 md:py-14 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-medium uppercase tracking-[0.22em] text-white/85">
                <Sparkles className="h-3.5 w-3.5" />
                NutsInventory Store
              </p>

              <h1 className="mt-6 max-w-3xl text-4xl font-semibold tracking-tight md:text-5xl">
                Frutos secos y snacks con una tienda más limpia, visual y comprable.
              </h1>

              <p className="mt-5 max-w-2xl text-base leading-7 text-white/75 md:text-lg">
                Explora productos destacados, compra con menos fricción y presenta una
                experiencia que ya se siente como producto real.
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
              <div className="-rounded-[2rem] border border-white/10 bg-white/10 p-5 backdrop-blur-sm">
                <p className="text-xs uppercase tracking-[0.18em] text-white/65">
                  Productos cargados
                </p>
                <p className="mt-2 text-4xl font-bold">{products.length}</p>
                <p className="mt-2 text-sm text-white/70">
                  Disponibles desde tu backend real.
                </p>
              </div>

              <div className="-rounded-[2rem] border border-white/10 bg-white/10 p-5 backdrop-blur-sm">
                <p className="text-xs uppercase tracking-[0.18em] text-white/65">
                  Categorías
                </p>
                <p className="mt-2 text-4xl font-bold">{categories.length}</p>
                <p className="mt-2 text-sm text-white/70">
                  Organización visual más clara para explorar.
                </p>
              </div>

              <div className="-rounded-[2rem] border border-white/10 bg-white/10 p-5 backdrop-blur-sm">
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
                Destacados del inicio
              </p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight text-stone-900 md:text-4xl">
                Una portada más ordenada y más fuerte visualmente
              </h2>
              <p className="mt-3 max-w-2xl text-stone-600">
                En vez de un carrusel complejo, aquí el foco cae sobre una selección clara
                de productos principales.
              </p>
            </div>

            <Link
              to="/catalog"
              className="inline-flex items-center gap-2 text-sm font-semibold text-stone-700 transition hover:text-stone-900"
            >
              Ver catálogo
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {isLoading ? (
            <div className="mt-8 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
              <div className="-h-[460px] animate-pulse -rounded-[2rem] bg-stone-100" />
              <div className="grid gap-4">
                <div className="-h-[220px]- animate-pulse -rounded-[2rem] bg-stone-100" />
                <div className="-h-[220px] animate-pulse -rounded-[2rem] bg-stone-100" />
              </div>
            </div>
          ) : isError ? (
            <div className="mt-8 -rounded-[2rem] border border-red-200 bg-red-50 p-6 text-red-700">
              No se pudieron cargar los destacados.
            </div>
          ) : heroProduct ? (
            <div className="mt-8 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
              <FeaturedTile
                title={heroProduct.name}
                description={heroProduct.description || 'Producto destacado dentro de la tienda.'}
                category={heroProduct.categoryName ?? 'Producto'}
                imageUrl={heroProduct.imageUrl}
                price={heroProduct.price}
                href="/catalog"
                large
              />

              <div className="grid gap-4">
                {secondaryProducts.map((product) => (
                  <FeaturedTile
                    key={product.id}
                    title={product.name}
                    description={product.description || 'Producto destacado.'}
                    category={product.categoryName ?? 'Producto'}
                    imageUrl={product.imageUrl}
                    price={product.price}
                    href="/catalog"
                  />
                ))}

                {secondaryProducts.length < 2 ? (
                  <div className="rounded-[2rem]- border border-stone-200 bg-white p-6 shadow-sm">
                    <p className="text-sm font-medium uppercase tracking-[0.2em] text-stone-500">
                      Más por descubrir
                    </p>
                    <h3 className="mt-3 text-2xl font-semibold tracking-tight text-stone-900">
                      Explora todo el catálogo
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-stone-600">
                      Completa la experiencia entrando a todas las categorías disponibles.
                    </p>

                    <Link
                      to="/catalog"
                      className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-stone-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-stone-800"
                    >
                      Ir al catálogo
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                ) : null}
              </div>
            </div>
          ) : (
            <div className="mt-8 rounded-[2rem]- border border-stone-200 bg-white p-8 text-center shadow-sm">
              <h3 className="text-2xl font-semibold text-stone-900">
                Aún no hay productos para destacar
              </h3>
              <p className="mt-3 text-stone-600">
                Cuando tengas productos activos con stock, aparecerán aquí.
              </p>
            </div>
          )}
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
                  className="h-[440px]- animate-pulse rounded-[2rem]- bg-stone-100"
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
                Cuando existan productos con stock disponible, aparecerán aquí automáticamente.
              </p>
            </div>
          ) : (
            <div className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}