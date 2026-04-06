import { useQuery } from '@tanstack/react-query';
import { me } from '../api/me';

export function useAuth() {
  const token = localStorage.getItem('token');

  return useQuery({
    queryKey: ['me'],
    queryFn: me,
    enabled: !!token,
    retry: false,
  });
}