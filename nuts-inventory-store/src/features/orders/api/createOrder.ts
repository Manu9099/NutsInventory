import { http } from '../../../services/api/http';
import { endpoints } from '../../../services/api/endpoints';
import type {
//  CreateOrderRequest,
  CreateOrderResponse,
} from '../types/order.types';

export async function createOrder(
): Promise<CreateOrderResponse> {
  const { data } = await http.post(endpoints.orders);
  return data;
}