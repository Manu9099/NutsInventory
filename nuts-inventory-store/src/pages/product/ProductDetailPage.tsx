import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ShoppingCart } from 'lucide-react';
import { useProduct } from '../../features/products/hooks/useProduct';
import { useCart } from '../../features/cart/hooks/useCart';

export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: product, isLoading, isError, error } = useProduct(id ?? '');
  const { addItem } = useCart();

  const [quantity, setQuantity] = useState(1);

  const maxQuantity = useMemo(() => {
    if (!product) return 1;
    return product.stock > 0 ? product.stock : 1;
  }, [product]);

  const increaseQuantity = () => {
    setQuantity((prev) => Math.min(prev + 1, maxQuantity));
  };

  const decreaseQuantity = () => {
    setQuantity((prev) => Math.max(prev - 1, 1));
  };

  const handleAddToCart = () => {
    if (!product || product.stock <= 0) return;

    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity,
      imageUrl: product.imageUrl,
    });
  };

  if (isLoading) {
    return (
      <section className="mx-auto max-w-7xl px-6 py-12">
        <Link
          to="/catalog"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-stone-500 hover:text-stone-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver al catálogo
        </Link>

        <div className="grid gap-8 lg:grid-cols-2">
          <div className="-h-[420px] animate-pulse rounded-3xl bg-stone-200" />
          <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-stone-200">
            <div className="h-4 w-24 animate-pulse rounded bg-stone-200" />
            <div className="mt-4 h-8 w-2/3 animate-pulse rounded bg-stone-200" />
            <div className="mt-4 h-5 w-32 animate-pulse rounded bg-stone-200" />
            <div className="mt-6 h-4 w-full animate-pulse rounded bg-stone-200" />
            <div className="mt-2 h-4 w-5/6 animate-pulse rounded bg-stone-200" />
            <div className="mt-2 h-4 w-4/6 animate-pulse rounded bg-stone-200" />
            <div className="mt-8 h-12 w-full animate-pulse rounded-xl bg-stone-200" />
          </div>
        </div>
      </section>
    );
  }

  if (isError || !product) {
    return (
      <section className="mx-auto max-w-7xl px-6 py-12">
        <Link
          to="/catalog"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-stone-500 hover:text-stone-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver al catálogo
        </Link>

        <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-red-700">
          <h1 className="text-xl font-semibold">No se pudo cargar el producto</h1>
          {error instanceof Error ? (
            <p className="mt-2 text-sm">{error.message}</p>
          ) : (
            <p className="mt-2 text-sm">
              Ocurrió un problema obteniendo el detalle del producto.
            </p>
          )}
        </div>
      </section>
    );
  }

  const isOutOfStock = product.stock <= 0;

  return (
    <section className="mx-auto max-w-7xl px-6 py-12">
      <Link
        to="/catalog"
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-stone-500 hover:text-stone-900"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver al catálogo
      </Link>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-stone-200">
          <div className="-h-[420px] bg-stone-100">
            {product.imageUrl ? (
              <img
                src={product.imageUrl}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-stone-400">
                Sin imagen disponible
              </div>
            )}
          </div>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-stone-200">
          <p className="text-sm font-semibold uppercase tracking-wide text-stone-500">
            {product.categoryName ?? 'Producto'}
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight">{product.name}</h1>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <span className="text-3xl font-bold">S/ {product.price.toFixed(2)}</span>

            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                isOutOfStock
                  ? 'bg-red-100 text-red-700'
                  : product.stock <= 10
                  ? 'bg-amber-100 text-amber-700'
                  : 'bg-lime-100 text-lime-700'
              }`}
            >
              {isOutOfStock
                ? 'Sin stock'
                : product.stock <= 10
                ? `Últimas ${product.stock} unidades`
                : `Stock disponible: ${product.stock}`}
            </span>
          </div>

          <div className="mt-6">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-stone-900">
              Descripción
            </h2>
            <p className="mt-3 leading-7 text-stone-600">
              {product.description || 'Este producto no tiene descripción registrada.'}
            </p>
          </div>

          <div className="mt-8 rounded-2xl border border-stone-200 bg-stone-50 p-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <label
                  htmlFor="quantity"
                  className="mb-2 block text-sm font-medium text-stone-700"
                >
                  Cantidad
                </label>

                <div className="inline-flex items-center overflow-hidden rounded-xl border border-stone-300 bg-white">
                  <button
                    type="button"
                    onClick={decreaseQuantity}
                    disabled={isOutOfStock}
                    className="px-4 py-3 text-sm font-semibold text-stone-700 transition hover:bg-stone-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    -
                  </button>

                  <input
                    id="quantity"
                    type="number"
                    min={1}
                    max={maxQuantity}
                    value={quantity}
                    onChange={(e) => {
                      const value = Number(e.target.value);

                      if (Number.isNaN(value)) {
                        setQuantity(1);
                        return;
                      }

                      setQuantity(Math.max(1, Math.min(value, maxQuantity)));
                    }}
                    disabled={isOutOfStock}
                    className="w-16 border-x border-stone-300 py-3 text-center text-sm font-medium outline-none"
                  />

                  <button
                    type="button"
                    onClick={increaseQuantity}
                    disabled={isOutOfStock}
                    className="px-4 py-3 text-sm font-semibold text-stone-700 transition hover:bg-stone-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="text-sm text-stone-600">
                Total:{' '}
                <span className="font-semibold text-stone-900">
                  S/ {(product.price * quantity).toFixed(2)}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-stone-900 px-5 py-3 text-sm font-semibold text-white transition hover:opacity-95 disabled:cursor-not-allowed disabled:bg-stone-300"
            >
              <ShoppingCart className="h-4 w-4" />
              {isOutOfStock ? 'Producto sin stock' : 'Agregar al carrito'}
            </button>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-stone-200 p-4">
              <p className="text-sm font-semibold text-stone-900">Compra segura</p>
              <p className="mt-1 text-sm text-stone-600">
                Base lista para integrar autenticación y checkout.
              </p>
            </div>

            <div className="rounded-2xl border border-stone-200 p-4">
              <p className="text-sm font-semibold text-stone-900">Envíos</p>
              <p className="mt-1 text-sm text-stone-600">
                Puedes conectar cálculo de envío en una siguiente fase.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}