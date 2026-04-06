import { http } from '../../../services/api/http'
import type { CustomerOrder } from '../types/order.types'

export async function getMyOrders(): Promise<CustomerOrder[]> {
  const { data } = await http.get('/store/orders/me')
  return data
}