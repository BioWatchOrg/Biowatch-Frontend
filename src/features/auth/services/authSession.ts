import { clearDummySession, isDummyAuthenticated, persistDummySession } from '../utils/dummyAuth';

export function persistAuthSession(email: string): void {
  persistDummySession(email);
}

export function clearAuthSession(): void {
  clearDummySession();
}

export function isAuthSessionActive(): boolean {
  return isDummyAuthenticated();
}
