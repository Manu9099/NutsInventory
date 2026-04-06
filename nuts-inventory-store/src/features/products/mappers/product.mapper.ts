import type { Product } from '../types/product.types'

export function mapProduct(apiProduct: any): Product {
  return {
    id: apiProduct.id,
    name: apiProduct.name,
    description: apiProduct.description,
    price: apiProduct.price,
    stock: apiProduct.stock,
    imageUrl: apiProduct.imageUrl,
    categoryName: apiProduct.categoryName,
  }
}