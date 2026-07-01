import { type PropsWithChildren } from 'react';
import { Link } from 'react-router-dom';

type AuthLayoutProps = PropsWithChildren<{
  title: string;
  subtitle: string;
}>;

function AuthLayout({ title, subtitle, children }: AuthLayoutProps) {
  return (
    <main className="auth-shell">
      <section className="auth-panel" aria-labelledby="auth-title">
        <p className="auth-badge">BioWatch</p>
        <h1 id="auth-title">{title}</h1>
        <p className="auth-subtitle">{subtitle}</p>
        {children}
        <p className="auth-note">
          Mode demo frontend uniquement. L'authentification est simulee en attendant les API
          backend.
        </p>
        <nav aria-label="Pages d'authentification" className="auth-links">
          <Link to="/login">Connexion</Link>
          <Link to="/signup">Inscription</Link>
          <Link to="/forgot-password">Mot de passe oublie</Link>
        </nav>
      </section>
    </main>
  );
}

export default AuthLayout;
