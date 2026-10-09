import axios from 'axios';
import type { ApiError } from './types';

const kindFromStatus = (status: number): ApiError['kind'] => {
  if (status === 404) return 'not_found';
  if (status >= 400 && status < 500) return 'validation';
  if (status >= 500) return 'server';
  return 'unknown';
};

/** FastAPI sends `{ detail: string | [{ msg }] }`; fall back to a generic message otherwise. */
const extractDetail = (data: unknown): string | null => {
  if (typeof data !== 'object' || data === null || !('detail' in data)) return null;
  const { detail } = data as { detail: unknown };
  if (typeof detail === 'string') return detail;
  if (Array.isArray(detail)) {
    const msgs = detail
      .map((d) => (typeof d === 'object' && d !== null && 'msg' in d ? String(d.msg) : null))
      .filter((m): m is string => m !== null);
    return msgs.length > 0 ? msgs.join('; ') : null;
  }
  return null;
};

export const isApiError = (e: unknown): e is ApiError =>
  typeof e === 'object' && e !== null && 'kind' in e && 'status' in e && 'message' in e;

export const normalizeApiError = (error: unknown): ApiError => {
  if (isApiError(error)) return error;
  if (axios.isAxiosError(error)) {
    if (error.response) {
      const { status, data } = error.response;
      return {
        kind: kindFromStatus(status),
        status,
        message: extractDetail(data) ?? error.message,
      };
    }
    if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
      return { kind: 'timeout', status: null, message: 'Request timed out' };
    }
    return { kind: 'network', status: null, message: 'Network error' };
  }
  return {
    kind: 'unknown',
    status: null,
    message: error instanceof Error ? error.message : 'Unknown error',
  };
};
