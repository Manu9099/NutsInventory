export interface CreateOrderItemRequest {
  productId: number;
  quantity: number;
}

export interface CreateOrderRequest {
  customerId: number;
  items: CreateOrderItemRequest[];
  loyaltyPointsToRedeem: number;
  notes?: string | null;
}

export interface CreateOrderResponse {
  orderId: number;
  grossAmount: number;
  discountApplied: number;
  netAmount: number;
  loyaltyPointsEarned: number;
}