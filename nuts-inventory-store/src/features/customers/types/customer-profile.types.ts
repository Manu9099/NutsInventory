export interface StoreCustomerProfile {
  id: number
  email: string
  fullName: string
  phone?: string | null
  city?: string | null
  address?: string | null
  isProfileComplete: boolean
}

export interface UpdateStoreCustomerProfileRequest {
  phone?: string
  city?: string
  address?: string
}