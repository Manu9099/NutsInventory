export interface StoreCustomerProfile {
  id: number
  email: string
  fullName: string
  phone?: string | null
  city?: string | null
  address?: string | null
  loyaltyPoints?: number
  tier?: string
  totalSpent?: number
  totalPurchases?: number
  isProfileComplete: boolean
}

export interface UpdateStoreCustomerProfileRequest {
  phone?: string
  city?: string
  address?: string
}