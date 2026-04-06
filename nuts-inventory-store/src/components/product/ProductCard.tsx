import { Link } from 'react-router-dom';
import type { Product } from '../../features/products/types/product.types';
import { useCart } from '../../features/cart/hooks/useCart';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      imageUrl: product.imageUrl,
    });
  };

  return (
    <article className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-stone-200">
      <div className="h-48 bg-stone-100">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-stone-400">
            Sin imagen
          </div>
        )}
      </div>

      <div className="p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-stone-500">
          {product.categoryName ?? 'Producto'}
        </p>

        <h3 className="mt-1 text-lg font-semibold">{product.name}</h3>

        <p className="mt-2 line-clamp-2 text-sm text-stone-600">
          {product.description}
        </p>

        <div className="mt-4 flex items-center justify-between">
          <span className="text-lg font-bold">S/ {product.price.toFixed(2)}</span>
          <span className="text-sm text-stone-500">Stock: {product.stock}</span>
        </div>

        <div className="mt-4 flex gap-2">
          <Link
            to={`/products/${product.id}`}
            className="flex-1 rounded-xl border border-stone-300 px-4 py-2 text-center text-sm font-medium"
          >
            Ver detalle
          </Link>

          <button
            onClick={handleAddToCart}
            className="flex-1 rounded-xl bg-stone-900 px-4 py-2 text-sm font-medium text-white"
          >
            Agregar
          </button>
        </div>
      </div>
    </article>
  );
}