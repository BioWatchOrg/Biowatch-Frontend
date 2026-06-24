import { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthField from '../components/AuthField';
import AuthLayout from '../components/AuthLayout';
import useAuthForm from '../form/useAuthForm';
import { getAuthMessage } from '../messages/authMessages';
import { persistAuthSession } from '../services/authSession';
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
  const initialValues = useMemo(() => INITIAL_FORM, []);
  const { values, errors, isLoading, globalError, submitForm, setValue } = useAuthForm<LoginForm>({
    initialValues,
    validate: validateLogin,
    submit: (form) => {
      try {
        persistAuthSession(form.email);
        navigate('/dashboard', { replace: true });
      } catch {
        return { globalError: getAuthMessage('loginError') };
      }

      return {};
    },
  });

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
          value={values.email}
          onChange={(email) => setValue('email', email)}
          error={errors.email}
          autoComplete="email"
        />
        <AuthField
          id="login-password"
          label="Mot de passe"
          type="password"
          value={values.password}
          onChange={(password) => setValue('password', password)}
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
