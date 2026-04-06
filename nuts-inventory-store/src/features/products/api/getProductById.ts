import { http } from '../../../services/api/http';
import { endpoints } from '../../../services/api/endpoints';
import { mapProduct } from '../mappers/product.mapper';
import type { Product } from '../types/product.types';

export async function getProductById(id: string): Promise<Product> {
  const { data } = await http.get(endpoints.productById(id));
  return mapProduct(data);
}