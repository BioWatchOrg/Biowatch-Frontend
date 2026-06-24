import { FormEvent, useState } from 'react';
import {
  AuthFormConfig,
  AuthFormErrors,
  AuthFormSubmitResult,
  AuthFormValues,
} from './authForm.types';

const SUBMIT_DELAY_MS = 350;

type UseAuthFormResult<TValues extends AuthFormValues> = {
  values: TValues;
  errors: AuthFormErrors<TValues>;
  isLoading: boolean;
  globalError: string | null;
  successMessage: string | null;
  setValue: <TKey extends keyof TValues>(key: TKey, value: TValues[TKey]) => void;
  submitForm: (event: FormEvent<HTMLFormElement>) => void;
};

function resolveResult(result: AuthFormSubmitResult | void): AuthFormSubmitResult {
  return result ?? {};
}

function useAuthForm<TValues extends AuthFormValues>(config: AuthFormConfig<TValues>): UseAuthFormResult<TValues> {
  const [values, setValues] = useState<TValues>(config.initialValues);
  const [errors, setErrors] = useState<AuthFormErrors<TValues>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const setValue = <TKey extends keyof TValues>(key: TKey, value: TValues[TKey]) => {
    setValues((previous) => ({ ...previous, [key]: value }));
  };

  const submitForm = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validationErrors = config.validate(values);
    setErrors(validationErrors);
    setGlobalError(null);
    setSuccessMessage(null);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setIsLoading(true);

    window.setTimeout(async () => {
      try {
        const result = resolveResult(await config.submit(values));
        setGlobalError(result.globalError ?? null);
        setSuccessMessage(result.successMessage ?? null);
      } catch {
        setGlobalError(null);
        setSuccessMessage(null);
      } finally {
        setIsLoading(false);
      }
    }, SUBMIT_DELAY_MS);
  };

  return {
    values,
    errors,
    isLoading,
    globalError,
    successMessage,
    setValue,
    submitForm,
  };
}

export default useAuthForm;