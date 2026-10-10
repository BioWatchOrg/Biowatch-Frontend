import axios from 'axios';
import { normalizeApiError } from './errors';

type TokenProvider = () => Promise<string | null | undefined>;

let tokenProvider: TokenProvider | null = null;

/** Registered by the auth layer (Firebase `getIdToken()`), so the API layer stays auth-agnostic. */
export const setAuthTokenProvider = (provider: TokenProvider | null): void => {
  tokenProvider = provider;
};

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? '/api',
  timeout: 15_000,
});

apiClient.interceptors.request.use(async (config) => {
  const token = tokenProvider ? await tokenProvider() : null;
  if (token) config.headers.set('Authorization', `Bearer ${token}`);
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(normalizeApiError(error)),
);
