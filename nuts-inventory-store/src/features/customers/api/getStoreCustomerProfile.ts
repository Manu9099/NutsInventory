import { http } from '../../../services/api/http'
import { endpoints } from '../../../services/api/endpoints'
import type { StoreCustomerProfile } from '../types/customer-profile.types'

export async function getStoreCustomerProfile(): Promise<StoreCustomerProfile> {
  const { data } = await http.get(endpoints.storeCustomerProfile)
  return data
}