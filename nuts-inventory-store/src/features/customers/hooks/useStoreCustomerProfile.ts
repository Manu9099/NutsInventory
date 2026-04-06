import { useQuery } from '@tanstack/react-query'
import { getStoreCustomerProfile } from '../api/getStoreCustomerProfile'

export function useStoreCustomerProfile(enabled = true) {
  return useQuery({
    queryKey: ['store-customer-profile'],
    queryFn: getStoreCustomerProfile,
    enabled,
    retry: false,
  })
}