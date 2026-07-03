export const DUMMY_SESSION_KEY = 'biowatch.dummySession';

type DummySession = {
  isAuthenticated: boolean;
  email: string;
  loginAt: string;
};

export function persistDummySession(email: string): void {
  const payload: DummySession = {
    isAuthenticated: true,
    email,
    loginAt: new Date().toISOString(),
  };

  window.localStorage.setItem(DUMMY_SESSION_KEY, JSON.stringify(payload));
}

export function clearDummySession(): void {
  window.localStorage.removeItem(DUMMY_SESSION_KEY);
}

export function isDummyAuthenticated(): boolean {
  const raw = window.localStorage.getItem(DUMMY_SESSION_KEY);
  if (!raw) {
    return false;
  }

  try {
    const parsed = JSON.parse(raw) as Partial<DummySession>;
    return parsed.isAuthenticated === true;
  } catch {
    return false;
  }
}
