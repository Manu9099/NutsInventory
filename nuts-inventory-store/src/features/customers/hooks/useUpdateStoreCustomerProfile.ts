import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateStoreCustomerProfile } from '../api/updateStoreCustomerProfile'

export function useUpdateStoreCustomerProfile() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateStoreCustomerProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['store-customer-profile'] })
    },
  })
}