import { env } from "./env";

export type ApiErrorPayload = {
  error?: string;
  message?: string;
  details?: Array<{ field?: string; error?: string }>;
};

export class ApiError extends Error {
  status: number;
  payload?: ApiErrorPayload;

  constructor(status: number, message: string, payload?: ApiErrorPayload) {
    super(message);
    this.status = status;
    this.payload = payload;
  }
}

function getToken() {
  return localStorage.getItem("nuts_access_token");
}

export async function apiClient<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const token = getToken();

  const response = await fetch(`${env.apiUrl}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options?.headers ?? {}),
    },
    ...options,
  });

  if (response.status === 204) {
    return undefined as T;
  }

  const text = await response.text();
  const data = text ? JSON.parse(text) : undefined;

  if (!response.ok) {
    throw new ApiError(
      response.status,
      data?.message ?? "Ocurrió un error en la solicitud.",
      data
    );
  }

  return data as T;
}