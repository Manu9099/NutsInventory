import { http } from '../../../services/api/http'
import { endpoints } from '../../../services/api/endpoints'
import { mapProduct } from '../mappers/product.mapper'

export async function getProducts() {
  const { data } = await http.get(endpoints.products)
  return Array.isArray(data) ? data.map(mapProduct) : []
}