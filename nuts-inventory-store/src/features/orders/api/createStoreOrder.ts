import { http } from '../../../services/api/http'
import type { CreateOrderResponse, StoreCreateOrderRequest } from '../types/order.types'

export async function createStoreOrder(
  payload: StoreCreateOrderRequest,
): Promise<CreateOrderResponse> {
  const { data } = await http.post('/store/orders', payload)
  return data
}