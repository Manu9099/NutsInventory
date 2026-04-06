import { http } from '../../../services/api/http'
import { endpoints } from '../../../services/api/endpoints'
import type { LoginResponse, RegisterRequest } from '../types/auth.types'

export async function register(payload: RegisterRequest): Promise<LoginResponse> {
  const { data } = await http.post(endpoints.register, payload)
  return data
}