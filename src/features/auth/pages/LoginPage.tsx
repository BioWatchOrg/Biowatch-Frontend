import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthField from '../components/AuthField';
import AuthLayout from '../components/AuthLayout';
import { getAuthMessage } from '../messages/authMessages';
import { persistDummySession } from '../utils/dummyAuth';
import { validateLogin } from '../validation/authValidation';

type LoginForm = {
  email: string;
  password: string;
};

const INITIAL_FORM: LoginForm = {
  email: '',
  password: '',
};

function LoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState<LoginForm>(INITIAL_FORM);
  const [errors, setErrors] = useState<Partial<LoginForm>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);

  const submitForm = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validationErrors = validateLogin(form);
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
        setGlobalError(getAuthMessage('loginError'));
      } finally {
        setIsLoading(false);
      }
    }, 350);
  };

  return (
    <AuthLayout
      title="Bon retour"
      subtitle="Connectez-vous pour acceder a votre tableau de bord ecologique."
    >
      <form onSubmit={submitForm} noValidate>
        <AuthField
          id="login-email"
          label="Adresse email"
          type="email"
          value={form.email}
          onChange={(email) => setForm((previous) => ({ ...previous, email }))}
          error={errors.email}
          autoComplete="email"
        />
        <AuthField
          id="login-password"
          label="Mot de passe"
          type="password"
          value={form.password}
          onChange={(password) => setForm((previous) => ({ ...previous, password }))}
          error={errors.password}
          autoComplete="current-password"
        />

        {globalError ? (
          <p className="form-alert form-alert-error" role="alert">
            {globalError}
          </p>
        ) : null}

        <button type="submit" className="auth-button" disabled={isLoading}>
          {isLoading ? getAuthMessage('loadingLogin') : getAuthMessage('actionLogin')}
        </button>
      </form>

      <p className="auth-inline-link">
        <Link to="/forgot-password">Mot de passe oublie ?</Link>
      </p>
      <p className="auth-inline-link">
        Nouveau ici ? <Link to="/signup">Creer un compte</Link>
      </p>
    </AuthLayout>
  );
}

export default LoginPage;
