import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthField from '../components/AuthField';
import AuthLayout from '../components/AuthLayout';
import { getAuthMessage } from '../messages/authMessages';
import { persistDummySession } from '../utils/dummyAuth';
import { validateSignup } from '../validation/authValidation';

type SignupForm = {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const INITIAL_FORM: SignupForm = {
  fullName: '',
  email: '',
  password: '',
  confirmPassword: '',
};

function SignupPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState<SignupForm>(INITIAL_FORM);
  const [errors, setErrors] = useState<Partial<SignupForm>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);

  const submitForm = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validationErrors = validateSignup(form);
    setErrors(validationErrors);
    setGlobalError(null);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setIsLoading(true);

    window.setTimeout(() => {
      try {
        persistDummySession(form.email);
        navigate('/dashboard', { replace: true });
      } catch {
        setGlobalError(getAuthMessage('signupError'));
      } finally {
        setIsLoading(false);
      }
    }, 350);
  };

  return (
    <AuthLayout title="Creer votre compte" subtitle="Configurez votre acces aux analyses BioWatch.">
      <form onSubmit={submitForm} noValidate>
        <AuthField
          id="signup-fullName"
          label="Nom complet"
          value={form.fullName}
          onChange={(fullName) => setForm((previous) => ({ ...previous, fullName }))}
          error={errors.fullName}
          autoComplete="name"
        />
        <AuthField
          id="signup-email"
          label="Adresse email"
          type="email"
          value={form.email}
          onChange={(email) => setForm((previous) => ({ ...previous, email }))}
          error={errors.email}
          autoComplete="email"
        />
        <AuthField
          id="signup-password"
          label="Mot de passe"
          type="password"
          value={form.password}
          onChange={(password) => setForm((previous) => ({ ...previous, password }))}
          error={errors.password}
          autoComplete="new-password"
        />
        <AuthField
          id="signup-confirmPassword"
          label="Confirmer le mot de passe"
          type="password"
          value={form.confirmPassword}
          onChange={(confirmPassword) => setForm((previous) => ({ ...previous, confirmPassword }))}
          error={errors.confirmPassword}
          autoComplete="new-password"
        />

        {globalError ? (
          <p className="form-alert form-alert-error" role="alert">
            {globalError}
          </p>
        ) : null}

        <button type="submit" className="auth-button" disabled={isLoading}>
          {isLoading ? getAuthMessage('loadingSignup') : getAuthMessage('actionSignup')}
        </button>
      </form>

      <p className="auth-inline-link">
        Deja inscrit ? <Link to="/login">Retour a la connexion</Link>
      </p>
    </AuthLayout>
  );
}

export default SignupPage;
