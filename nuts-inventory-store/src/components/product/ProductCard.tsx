import { BadgeCheck, Package, ShoppingCart } from 'lucide-react'
import type { Product } from '../../features/products/types/product.types'
import { useCart } from '../../features/cart/hooks/useCart'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem, openCartDrawer, setCartNotice, getItemQuantity } = useCart()

  const isOutOfStock = product.stock <= 0
  const isLowStock = product.stock > 0 && product.stock <= 10
  const quantityInCart = getItemQuantity(product.id)

  const handleAddToCart = () => {
    if (isOutOfStock) return

    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      imageUrl: product.imageUrl,
    })

    setCartNotice(`${product.name} se agregó al carrito.`)
    openCartDrawer()
  }

  return (
    <article className="group overflow-hidden rounded-[2rem]- border border-stone-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="relative h-64 overflow-hidden bg-stone-100">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center px-6 text-center">
            <Package className="h-10 w-10 text-stone-400" />
            <p className="mt-3 text-sm font-medium text-stone-500">Sin imagen</p>
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
          ) : isLowStock ? (
            <span className="rounded-full bg-amber-500 px-3 py-1 text-xs font-semibold text-white shadow-sm">
              Últimas {product.stock}
            </span>
          ) : null}
        </div>
      </div>

      <div className="p-5">
        <h3 className="line-clamp-2 text-xl font-semibold tracking-tight text-stone-900">
          {product.name}
        </h3>

        <p className="mt-3 min-h-[4.5rem]- line-clamp-3 text-sm leading-6 text-stone-600">
          {product.description || 'Producto disponible en catálogo.'}
        </p>

        <div className="mt-5 flex items-end justify-between gap-4">
          <div>
            <p className="text-2xl font-bold text-stone-900">
              S/ {product.price.toFixed(2)}
            </p>

            <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
              <span className="rounded-full bg-stone-100 px-3 py-1 font-medium text-stone-700">
                Stock: {product.stock}
              </span>

              {!isOutOfStock ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-lime-50 px-3 py-1 font-medium text-lime-700">
                  <BadgeCheck className="h-3.5 w-3.5" />
                  Listo para compra
                </span>
              ) : null}

              {quantityInCart > 0 ? (
                <span className="rounded-full bg-stone-900 px-3 py-1 font-medium text-white">
                  En carrito: {quantityInCart}
                </span>
              ) : null}
            </div>
          </div>
        </div>

        <div className="mt-5">
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-stone-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:bg-stone-400"
          >
            <ShoppingCart className="h-4 w-4" />
            {isOutOfStock ? 'Sin stock' : quantityInCart > 0 ? 'Agregar uno más' : 'Agregar al carrito'}
          </button>
        </div>
      </div>
    </article>
  )
}