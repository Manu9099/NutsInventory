import { http } from '../../../services/api/http';
import { endpoints } from '../../../services/api/endpoints';
import type { AuthUser } from '../types/auth.types';

export async function me(): Promise<AuthUser> {
  const { data } = await http.get(endpoints.me);
  return data;
}