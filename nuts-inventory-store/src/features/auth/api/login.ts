import { http } from '../../../services/api/http';
import { endpoints } from '../../../services/api/endpoints';
import type { LoginRequest, LoginResponse } from '../types/auth.types';

export async function login(payload: LoginRequest): Promise<LoginResponse> {
  const { data } = await http.post(endpoints.login, payload);
  return data;
}