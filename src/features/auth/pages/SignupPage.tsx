import { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthField from '../components/AuthField';
import AuthLayout from '../components/AuthLayout';
import useAuthForm from '../form/useAuthForm';
import { getAuthMessage } from '../messages/authMessages';
import { persistAuthSession } from '../services/authSession';
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
  const initialValues = useMemo(() => INITIAL_FORM, []);
  const { values, errors, isLoading, globalError, submitForm, setValue } = useAuthForm<SignupForm>({
    initialValues,
    validate: validateSignup,
    submit: (form) => {
      try {
        persistAuthSession(form.email);
        navigate('/dashboard', { replace: true });
      } catch {
        return { globalError: getAuthMessage('signupError') };
      }

      return {};
    },
  });

  return (
    <AuthLayout title="Creer votre compte" subtitle="Configurez votre acces aux analyses BioWatch.">
      <form onSubmit={submitForm} noValidate>
        <AuthField
          id="signup-fullName"
          label="Nom complet"
          value={values.fullName}
          onChange={(fullName) => setValue('fullName', fullName)}
          error={errors.fullName}
          autoComplete="name"
        />
        <AuthField
          id="signup-email"
          label="Adresse email"
          type="email"
          value={values.email}
          onChange={(email) => setValue('email', email)}
          error={errors.email}
          autoComplete="email"
        />
        <AuthField
          id="signup-password"
          label="Mot de passe"
          type="password"
          value={values.password}
          onChange={(password) => setValue('password', password)}
          error={errors.password}
          autoComplete="new-password"
        />
        <AuthField
          id="signup-confirmPassword"
          label="Confirmer le mot de passe"
          type="password"
          value={values.confirmPassword}
          onChange={(confirmPassword) => setValue('confirmPassword', confirmPassword)}
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
