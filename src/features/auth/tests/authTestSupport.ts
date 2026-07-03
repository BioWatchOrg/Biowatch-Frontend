import { act } from '@testing-library/react';
import { FormEvent } from 'react';

const AUTH_SUBMIT_DELAY_MS = 350;

export function createFormSubmitEvent(): FormEvent<HTMLFormElement> {
  return {
    preventDefault: vi.fn(),
  } as unknown as FormEvent<HTMLFormElement>;
}

export async function flushAuthSubmitDelay(): Promise<void> {
  await act(async () => {
    vi.advanceTimersByTime(AUTH_SUBMIT_DELAY_MS);
    await Promise.resolve();
  });
}
