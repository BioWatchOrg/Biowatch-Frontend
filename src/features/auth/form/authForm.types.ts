export type AuthFormValues = Record<string, string>;

export type AuthFormErrors<TValues extends AuthFormValues> = Partial<Record<keyof TValues, string>>;

export type AuthFormSubmitResult = {
  globalError?: string;
  successMessage?: string;
};

export type AuthFormConfig<TValues extends AuthFormValues> = {
  initialValues: TValues;
  validate: (values: TValues) => AuthFormErrors<TValues>;
  submit: (values: TValues) => Promise<AuthFormSubmitResult | void> | AuthFormSubmitResult | void;
};
