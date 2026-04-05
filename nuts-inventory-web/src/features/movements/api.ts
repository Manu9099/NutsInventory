import { apiClient } from "../../lib/api-client";

export type Product = {
  id: number;
  name: string;
  sku: string;
  description?: string | null;
  price: number;
  stockQuantity: number;
  reorderLevel: number;
  category: string;
  weight: number;
  imageUrl?: string | null;
  isActive: boolean;
};

export type InventoryMovement = {
  id: number;
  productId: number;
  productName: string;
  movementType: string;
  quantityChange: number;
  previousQuantity: number;
  newQuantity: number;
  reason?: string | null;
  createdAt: string;
};

export async function getProducts() {
  return apiClient<Product[]>("/products");
}

export async function getInventoryMovements(params?: {
  productId?: number;
  limit?: number;
}) {
  const search = new URLSearchParams();

  if (params?.productId) {
    search.set("productId", String(params.productId));
  }

  if (params?.limit) {
    search.set("limit", String(params.limit));
  }

  const query = search.toString();
  return apiClient<InventoryMovement[]>(
    query ? `/inventory/movements?${query}` : "/inventory/movements"
  );
}