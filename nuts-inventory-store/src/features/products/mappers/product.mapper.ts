import type { Product } from '../types/product.types'

export function mapProduct(apiProduct: any): Product {
  return {
    id: apiProduct.id,
    name: apiProduct.name,
    description: apiProduct.description ?? '',
    price: Number(apiProduct.price ?? 0),
    stock: Number(apiProduct.stockQuantity ?? apiProduct.stock ?? 0),
    imageUrl: apiProduct.imageUrl,
    categoryName: apiProduct.category ?? apiProduct.categoryName,
  }
}