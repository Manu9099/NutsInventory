import { useMemo, useState } from 'react';
import { ProductCard } from '../../components/product/ProductCard';
import { useProducts } from '../../features/products/hooks/useProducts';
import type { Product } from '../../features/products/types/product.types';

export function CatalogPage() {
  const { data: products = [], isLoading, isError, error } = useProducts();

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('Todos');

  const categories = useMemo(() => {
    const uniqueCategories = Array.from(
      new Set(
        products
          .map((product) => product.categoryName?.trim())
          .filter((value): value is string => Boolean(value))
      )
    );

    return ['Todos', ...uniqueCategories];
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter((product: Product) => {
      const matchesCategory =
        category === 'Todos' || product.categoryName === category;

      const searchableText = [
        product.name,
        product.description,
        product.categoryName,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      const matchesSearch = searchableText.includes(search.trim().toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [products, category, search]);

  if (isLoading) {
    return (
      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Catálogo</h1>
          <p className="mt-2 text-stone-600">Cargando productos...</p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-stone-200"
            >
              <div className="h-48 animate-pulse bg-stone-200" />
              <div className="p-4">
                <div className="h-4 w-20 animate-pulse rounded bg-stone-200" />
                <div className="mt-3 h-6 w-40 animate-pulse rounded bg-stone-200" />
                <div className="mt-3 h-4 w-full animate-pulse rounded bg-stone-200" />
                <div className="mt-2 h-4 w-3/4 animate-pulse rounded bg-stone-200" />
                <div className="mt-6 h-10 w-full animate-pulse rounded-xl bg-stone-200" />
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="mx-auto max-w-7xl px-6 py-12">
        <h1 className="text-3xl font-bold">Catálogo</h1>
        <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700">
          No se pudieron cargar los productos.
          {error instanceof Error ? (
            <p className="mt-2 text-sm">{error.message}</p>
          ) : null}
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-6 py-12">
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-wide text-stone-500">
          Tienda
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">Catálogo</h1>
        <p className="mt-2 text-stone-600">
          Explora nuestros productos y agrégalos al carrito.
        </p>
      </div>

      <div className="mb-8 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-stone-200">
        <div className="grid gap-4 md:grid-cols-[1.5fr_1fr]">
          <div>
            <label
              htmlFor="search"
              className="mb-2 block text-sm font-medium text-stone-700"
            >
              Buscar producto
            </label>
            <input
              id="search"
              type="text"
              placeholder="Ej. almendras, mix premium, pecanas..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-stone-300 px-4 py-3 text-sm outline-none transition focus:border-stone-500"
            />
          </div>

          <div>
            <label
              htmlFor="category"
              className="mb-2 block text-sm font-medium text-stone-700"
            >
              Categoría
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-xl border border-stone-300 px-4 py-3 text-sm outline-none transition focus:border-stone-500"
            >
              {categories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="mb-6 flex items-center justify-between">
        <p className="text-sm text-stone-600">
          {filteredProducts.length} producto
          {filteredProducts.length === 1 ? '' : 's'} encontrado
          {filteredProducts.length === 1 ? '' : 's'}
        </p>

        {(search || category !== 'Todos') && (
          <button
            onClick={() => {
              setSearch('');
              setCategory('Todos');
            }}
            className="rounded-xl border border-stone-300 px-4 py-2 text-sm font-medium text-stone-700 transition hover:bg-stone-50"
          >
            Limpiar filtros
          </button>
        )}
      </div>

      {filteredProducts.length === 0 ? (
        <div className="rounded-2xl bg-white p-10 text-center shadow-sm ring-1 ring-stone-200">
          <h2 className="text-xl font-semibold">No encontramos productos</h2>
          <p className="mt-2 text-stone-600">
            Prueba con otro nombre o cambia la categoría seleccionada.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}