import { apiClient } from "../../lib/api-client";

export type DashboardSummary = {
  totalProducts: number;
  activeProducts: number;
  lowStockProducts: number;
  totalCustomers: number;
  activeCustomers: number;
  totalOrders: number;
  totalRevenue: number;
};

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

export type TopSeller = {
  productId: number;
  productName: string;
  category: string;
  quantitySold: number;
  revenue: number;
  rank: number;
};

export type MonthlyTrend = {
  year: number;
  month: number;
  totalQuantity: number;
  totalRevenue: number;
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

export async function getDashboardSummary() {
  return apiClient<DashboardSummary>("/dashboard/summary");
}

export async function getLowStockProducts() {
  return apiClient<Product[]>("/products/low-stock");
}

export async function getTopSellers() {
  return apiClient<TopSeller[]>("/dashboard/top-sellers?limit=5");
}

export async function getMonthlySalesTrend() {
  return apiClient<MonthlyTrend[]>("/dashboard/monthly-sales-trend?months=12");
}

export async function getInventoryMovements() {
  return apiClient<InventoryMovement[]>("/inventory/movements?limit=10");
}