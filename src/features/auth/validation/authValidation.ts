import { getAuthMessage } from '../messages/authMessages';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type LoginInput = {
  email: string;
  password: string;
};

type SignupInput = {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

type ForgotInput = {
  email: string;
};

export function validateLogin(input: LoginInput): Partial<LoginInput> {
  const errors: Partial<LoginInput> = {};

  if (!input.email.trim()) {
    errors.email = getAuthMessage('emailRequired');
  } else if (!EMAIL_REGEX.test(input.email)) {
    errors.email = getAuthMessage('emailInvalid');
  }

  if (!input.password.trim()) {
    errors.password = getAuthMessage('passwordRequired');
  }

  return errors;
}

export function validateSignup(input: SignupInput): Partial<SignupInput> {
  const errors: Partial<SignupInput> = {};

  if (!input.fullName.trim()) {
    errors.fullName = getAuthMessage('fullNameRequired');
  }

  if (!input.email.trim()) {
    errors.email = getAuthMessage('emailRequired');
  } else if (!EMAIL_REGEX.test(input.email)) {
    errors.email = getAuthMessage('emailInvalid');
  }

  if (!input.password.trim()) {
    errors.password = getAuthMessage('passwordRequired');
  } else if (input.password.length < 8) {
    errors.password = getAuthMessage('passwordMin');
  }

  if (!input.confirmPassword.trim()) {
    errors.confirmPassword = getAuthMessage('confirmPasswordRequired');
  } else if (input.password !== input.confirmPassword) {
    errors.confirmPassword = getAuthMessage('passwordMismatch');
  }

  return errors;
}

export function validateForgotPassword(input: ForgotInput): Partial<ForgotInput> {
  const errors: Partial<ForgotInput> = {};

  if (!input.email.trim()) {
    errors.email = getAuthMessage('emailRequired');
  } else if (!EMAIL_REGEX.test(input.email)) {
    errors.email = getAuthMessage('emailInvalid');
  }

  return errors;
}
