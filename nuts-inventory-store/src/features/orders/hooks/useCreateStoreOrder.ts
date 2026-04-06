import { useMutation } from '@tanstack/react-query'
import { createStoreOrder } from '../api/createStoreOrder'

export function useCreateStoreOrder() {
  return useMutation({
    mutationFn: createStoreOrder,
  })
}