import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import AuthField from '../components/AuthField';
import AuthLayout from '../components/AuthLayout';
import useAuthForm from '../form/useAuthForm';
import { getAuthMessage } from '../messages/authMessages';
import { validateForgotPassword } from '../validation/authValidation';

type ForgotPasswordForm = {
  email: string;
};

const INITIAL_FORM: ForgotPasswordForm = {
  email: '',
};

function ForgotPasswordPage() {
  const initialValues = useMemo(() => INITIAL_FORM, []);
  const { values, errors, isLoading, globalError, successMessage, submitForm, setValue } =
    useAuthForm<ForgotPasswordForm>({
      initialValues,
      validate: validateForgotPassword,
      submit: () => {
        try {
          return { successMessage: getAuthMessage('forgotSuccess') };
        } catch {
          return { globalError: getAuthMessage('forgotError') };
        }
      },
    });

  return (
    <AuthLayout
      title="Recuperer l'acces"
      subtitle="Saisissez votre email et nous enverrons un lien des que le backend sera connecte."
    >
      <form onSubmit={submitForm} noValidate>
        <AuthField
          id="forgot-email"
          label="Adresse email"
          type="email"
          value={values.email}
          onChange={(email) => setValue('email', email)}
          error={errors.email}
          autoComplete="email"
        />

        {globalError ? (
          <p className="form-alert form-alert-error" role="alert">
            {globalError}
          </p>
        ) : null}

        {successMessage ? (
          <p className="form-alert form-alert-success" role="status">
            {successMessage}
          </p>
        ) : null}

        <button type="submit" className="auth-button" disabled={isLoading}>
          {isLoading ? getAuthMessage('loadingForgot') : getAuthMessage('actionForgot')}
        </button>
      </form>

      <p className="auth-inline-link">
        Mot de passe retrouve ? <Link to="/login">Retour a la connexion</Link>
      </p>
    </AuthLayout>
  );
}

export default ForgotPasswordPage;
