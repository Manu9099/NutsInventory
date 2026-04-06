import { http } from '../../../services/api/http'
import { endpoints } from '../../../services/api/endpoints'
import type {
  StoreCustomerProfile,
  UpdateStoreCustomerProfileRequest,
} from '../types/customer-profile.types'

export async function updateStoreCustomerProfile(
  payload: UpdateStoreCustomerProfileRequest,
): Promise<StoreCustomerProfile> {
  const { data } = await http.put(endpoints.storeCustomerProfile, payload)
  return data
}