import { FormEvent, useState } from 'react';
import { Link } from 'react-router-dom';
import AuthField from '../components/AuthField';
import AuthLayout from '../components/AuthLayout';
import { getAuthMessage } from '../messages/authMessages';
import { validateForgotPassword } from '../validation/authValidation';

type ForgotPasswordForm = {
  email: string;
};

const INITIAL_FORM: ForgotPasswordForm = {
  email: '',
};

function ForgotPasswordPage() {
  const [form, setForm] = useState<ForgotPasswordForm>(INITIAL_FORM);
  const [errors, setErrors] = useState<Partial<ForgotPasswordForm>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const submitForm = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validationErrors = validateForgotPassword(form);
    setErrors(validationErrors);
    setGlobalError(null);
    setSuccessMessage(null);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setIsLoading(true);

    window.setTimeout(() => {
      try {
        setSuccessMessage(getAuthMessage('forgotSuccess'));
      } catch {
        setGlobalError(getAuthMessage('forgotError'));
      } finally {
        setIsLoading(false);
      }
    }, 350);
  };

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
          value={form.email}
          onChange={(email) => setForm({ email })}
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
