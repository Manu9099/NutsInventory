import { useQuery } from '@tanstack/react-query'
import { getMyOrders } from '../api/getMyOrders'

export function useMyOrders() {
  return useQuery({
    queryKey: ['my-orders'],
    queryFn: getMyOrders,
  })
}