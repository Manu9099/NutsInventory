import { useMemo, useState } from 'react'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import { ProductCard } from '../../components/product/ProductCard'
import { useProducts } from '../../features/products/hooks/useProducts'
import type { Product } from '../../features/products/types/product.types'

type SortOption =
  | 'featured'
  | 'price-asc'
  | 'price-desc'
  | 'name-asc'
  | 'stock-desc'

export function CatalogPage() {
  const { data: products = [], isLoading, isError } = useProducts()

  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('Todas')
  const [sortBy, setSortBy] = useState<SortOption>('featured')

  const categories = useMemo(() => {
    const uniqueCategories = Array.from(
      new Set(
        products
          .map((product) => product.categoryName?.trim())
          .filter((value): value is string => Boolean(value)),
      ),
    ).sort((a, b) => a.localeCompare(b))

    return ['Todas', ...uniqueCategories]
  }, [products])

  const filteredProducts = useMemo<Product[]>(() => {
    const normalizedSearch = search.trim().toLowerCase()

    let result = [...products]

    if (selectedCategory !== 'Todas') {
      result = result.filter(
        (product) => product.categoryName === selectedCategory,
      )
    }

    if (normalizedSearch) {
      result = result.filter((product) => {
        const name = product.name.toLowerCase()
        const description = (product.description ?? '').toLowerCase()
        const category = (product.categoryName ?? '').toLowerCase()

        return (
          name.includes(normalizedSearch) ||
          description.includes(normalizedSearch) ||
          category.includes(normalizedSearch)
        )
      })
    }

    switch (sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price)
        break
      case 'price-desc':
        result.sort((a, b) => b.price - a.price)
        break
      case 'name-asc':
        result.sort((a, b) => a.name.localeCompare(b.name))
        break
      case 'stock-desc':
        result.sort((a, b) => b.stock - a.stock)
        break
      case 'featured':
      default:
        result.sort((a, b) => {
          const aScore = (a.stock > 0 ? 1 : 0) * 1000 + a.stock
          const bScore = (b.stock > 0 ? 1 : 0) * 1000 + b.stock
          return bScore - aScore
        })
        break
    }

    return result
  }, [products, search, selectedCategory, sortBy])

  const hasActiveFilters =
    search.trim().length > 0 || selectedCategory !== 'Todas'

  const clearFilters = () => {
    setSearch('')
    setSelectedCategory('Todas')
    setSortBy('featured')
  }

  return (
    <section className="bg-stone-50">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="rounded-[2rem]- border border-stone-200 bg-white p-8 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-stone-500">
            Tienda
          </p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight text-stone-900">
            Catálogo
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-stone-600">
            Explora productos, filtra por categoría y encuentra más rápido lo que
            quieres comprar.
          </p>

          <div className="mt-8 grid gap-4 lg:grid-cols-[1.3fr_0.7fr]">
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar por nombre, categoría o descripción"
                className="w-full rounded-2xl border border-stone-300 bg-white py-3 pl-11 pr-4 text-sm outline-none transition focus:border-stone-500"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="rounded-2xl border border-stone-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-stone-500"
              >
                <option value="featured">Destacados</option>
                <option value="price-asc">Precio: menor a mayor</option>
                <option value="price-desc">Precio: mayor a menor</option>
                <option value="name-asc">Nombre: A-Z</option>
                <option value="stock-desc">Mayor stock</option>
              </select>

              <button
                type="button"
                onClick={clearFilters}
                disabled={!hasActiveFilters && sortBy === 'featured'}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-stone-300 bg-white px-4 py-3 text-sm font-medium text-stone-700 transition hover:bg-stone-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <X className="h-4 w-4" />
                Limpiar
              </button>
            </div>
          </div>

          <div className="mt-6 flex items-start gap-3">
            <SlidersHorizontal className="mt-1 h-4 w-4 text-stone-500" />
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => {
                const isActive = selectedCategory === category

                return (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setSelectedCategory(category)}
                    className={[
                      'rounded-full px-4 py-2 text-sm font-medium transition',
                      isActive
                        ? 'bg-stone-900 text-white'
                        : 'border border-stone-300 bg-white text-stone-700 hover:bg-stone-50',
                    ].join(' ')}
                  >
                    {category}
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-stone-600">
              {filteredProducts.length}{' '}
              {filteredProducts.length === 1 ? 'producto encontrado' : 'productos encontrados'}
            </p>
            {hasActiveFilters ? (
              <p className="mt-1 text-xs text-stone-500">
                Filtros activos:
                {search.trim() ? ` búsqueda "${search.trim()}"` : ''}
                {selectedCategory !== 'Todas' ? ` · categoría ${selectedCategory}` : ''}
              </p>
            ) : null}
          </div>
        </div>

        {isLoading ? (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="h-[430px]- animate-pulse rounded-[2rem]- border border-stone-200 bg-white"
              />
            ))}
          </div>
        ) : isError ? (
          <div className="mt-8 rounded-[2rem]- border border-red-200 bg-red-50 p-8">
            <h2 className="text-xl font-semibold text-red-900">
              No se pudo cargar el catálogo
            </h2>
            <p className="mt-3 text-sm leading-6 text-red-700">
              Intenta nuevamente en unos segundos.
            </p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="mt-8 rounded-[2rem]- border border-stone-200 bg-white p-10 text-center shadow-sm">
            <h2 className="text-2xl font-semibold text-stone-900">
              No encontramos productos
            </h2>
            <p className="mt-3 text-sm leading-6 text-stone-600">
              Prueba cambiando la búsqueda o quitando algunos filtros.
            </p>

            <button
              type="button"
              onClick={clearFilters}
              className="mt-6 inline-flex items-center justify-center rounded-2xl bg-stone-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-stone-800"
            >
              Limpiar filtros
            </button>
          </div>
        ) : (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}