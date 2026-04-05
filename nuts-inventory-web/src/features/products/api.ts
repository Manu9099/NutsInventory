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

export type CreateProductRequest = {
  name: string;
  sku: string;
  description?: string | null;
  price: number;
  stockQuantity: number;
  reorderLevel: number;
  category: string;
  weight: number;
  imageUrl?: string | null;
};

export type UpdateProductRequest = {
  name: string;
  sku: string;
  description?: string | null;
  price: number;
  reorderLevel: number;
  category: string;
  weight: number;
  imageUrl?: string | null;
};

export type RestockRequest = {
  quantity: number;
  reason?: string | null;
};

export async function getProducts(search?: string) {
  const query = search?.trim()
    ? `/products?search=${encodeURIComponent(search.trim())}`
    : "/products";

  return apiClient<Product[]>(query);
}

export async function getLowStockProducts() {
  return apiClient<Product[]>("/products/low-stock");
}

export async function createProduct(request: CreateProductRequest) {
  return apiClient<Product>("/products", {
    method: "POST",
    body: JSON.stringify(request),
  });
}

export async function updateProduct(id: number, request: UpdateProductRequest) {
  return apiClient<Product>(`/products/${id}`, {
    method: "PUT",
    body: JSON.stringify(request),
  });
}

export async function deactivateProduct(id: number) {
  return apiClient<void>(`/products/${id}/deactivate`, {
    method: "PATCH",
  });
}

export async function reactivateProduct(id: number) {
  return apiClient<void>(`/products/${id}/reactivate`, {
    method: "PATCH",
  });
}

export async function restockProduct(id: number, request: RestockRequest) {
  return apiClient<void>(`/products/${id}/restock`, {
    method: "POST",
    body: JSON.stringify(request),
  });
}