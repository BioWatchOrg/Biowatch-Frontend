import { act, renderHook } from '@testing-library/react';
import useAuthForm from '../form/useAuthForm';
import { createFormSubmitEvent, flushAuthSubmitDelay } from './authTestSupport';

type LoginValues = {
  email: string;
  password: string;
};

const INITIAL_VALUES: LoginValues = {
  email: '',
  password: '',
};

describe('useAuthForm', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('blocks submit and surfaces validation errors', () => {
    const submit = vi.fn();
    const { result } = renderHook(() =>
      useAuthForm<LoginValues>({
        initialValues: INITIAL_VALUES,
        validate: (values) => ({
          email: values.email ? undefined : 'Email required',
          password: values.password ? undefined : 'Password required',
        }),
        submit,
      }),
    );

    act(() => {
      result.current.submitForm(createFormSubmitEvent());
    });

    expect(submit).not.toHaveBeenCalled();
    expect(result.current.errors.email).toBe('Email required');
    expect(result.current.errors.password).toBe('Password required');
  });

  it('handles successful submission and exposes success message', async () => {
    const { result } = renderHook(() =>
      useAuthForm<LoginValues>({
        initialValues: INITIAL_VALUES,
        validate: () => ({}),
        submit: async () => ({ successMessage: 'Success' }),
      }),
    );

    act(() => {
      result.current.setValue('email', 'user@example.com');
      result.current.setValue('password', 'password123');
      result.current.submitForm(createFormSubmitEvent());
    });

    expect(result.current.isLoading).toBe(true);

    await flushAuthSubmitDelay();

    expect(result.current.isLoading).toBe(false);
    expect(result.current.successMessage).toBe('Success');
    expect(result.current.globalError).toBeNull();
  });

  it('surfaces submit error through global alert state', async () => {
    const { result } = renderHook(() =>
      useAuthForm<LoginValues>({
        initialValues: INITIAL_VALUES,
        validate: () => ({}),
        submit: async () => ({ globalError: 'Submit failed' }),
      }),
    );

    act(() => {
      result.current.setValue('email', 'user@example.com');
      result.current.setValue('password', 'password123');
      result.current.submitForm(createFormSubmitEvent());
    });

    await flushAuthSubmitDelay();

    expect(result.current.isLoading).toBe(false);
    expect(result.current.globalError).toBe('Submit failed');
    expect(result.current.successMessage).toBeNull();
  });
});
