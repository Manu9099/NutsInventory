export interface StoreCreateOrderItemRequest {
  productId: number
  quantity: number
}

export interface StoreCreateOrderRequest {
  items: StoreCreateOrderItemRequest[]
  loyaltyPointsToRedeem: number
  notes?: string | null
}

export interface CreateOrderResponse {
  orderId: number
  grossAmount: number
  discountApplied: number
  netAmount: number
  loyaltyPointsEarned: number
}

export interface CustomerOrderItem {
  productId: number
  productName: string
  imageUrl?: string | null
  quantity: number
  unitPrice: number
  subtotal: number
}

export interface CustomerOrder {
  id: number
  orderDate: string
  status: string
  totalAmount: number
  discountApplied: number
  loyaltyPointsEarned: number
  notes?: string | null
  items: CustomerOrderItem[]
}