import { apiClient } from "../../lib/api-client";

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

export type CreateCustomerRequest = {
  email: string;
  firstName: string;
  lastName: string;
  phone?: string | null;
  city?: string | null;
  address?: string | null;
};

export type CustomerLoyaltySummary = {
  customerId: number;
  fullName: string;
  email: string;
  loyaltyPoints: number;
  tier: string;
  totalSpent: number;
  totalPurchases: number;
  lastPurchaseDate?: string | null;
};

export type LoyaltyTransaction = {
  id: number;
  customerId: number;
  pointsAdded: number;
  reason: string;
  orderId?: number | null;
  createdAt: string;
};

export async function getCustomers(search?: string) {
  const query = search?.trim()
    ? `/customers?search=${encodeURIComponent(search.trim())}`
    : "/customers";

  return apiClient<Customer[]>(query);
}

export async function createCustomer(request: CreateCustomerRequest) {
  return apiClient<Customer>("/customers", {
    method: "POST",
    body: JSON.stringify(request),
  });
}

export async function getCustomerLoyaltySummary(customerId: number) {
  return apiClient<CustomerLoyaltySummary>(`/customers/${customerId}/loyalty`);
}

export async function getCustomerTransactions(customerId: number) {
  return apiClient<LoyaltyTransaction[]>(`/customers/${customerId}/transactions`);
}