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

export type Customer = {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string | null;
  city?: string | null;
  address?: string | null;
  registeredAt: string;
  lastPurchaseDate?: string | null;
  totalSpent: number;
  totalPurchases: number;
  loyaltyPoints: number;
  tier: string;
  isActive: boolean;
};

export type CreateOrderRequest = {
  customerId: number;
  items: Array<{
    productId: number;
    quantity: number;
  }>;
  loyaltyPointsToRedeem: number;
  notes?: string | null;
};

export type CreateOrderResponse = {
  orderId: number;
  grossAmount: number;
  discountApplied: number;
  netAmount: number;
  loyaltyPointsEarned: number;
};

export async function getProducts() {
  return apiClient<Product[]>("/products");
}

export async function getCustomers(search?: string) {
  const query = search?.trim()
    ? `/customers?search=${encodeURIComponent(search.trim())}`
    : "/customers";

  return apiClient<Customer[]>(query);
}

export async function createOrder(request: CreateOrderRequest) {
  return apiClient<CreateOrderResponse>("/orders", {
    method: "POST",
    body: JSON.stringify(request),
  });
}
