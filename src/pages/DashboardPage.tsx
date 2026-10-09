import { Link } from 'react-router-dom';
import { clearAuthSession } from '../features/auth/services/authSession';

function DashboardPage() {
  return (
    <main className="dashboard-shell">
      <section className="dashboard-card" aria-labelledby="dashboard-title">
        <p className="auth-badge">BioWatch</p>
        <h1 id="dashboard-title">Tableau de bord de demonstration</h1>
        <p>
          Vous etes connecte avec une session temporaire frontend. Cette page sera remplacee par le
          veritable tableau de bord des que l'authentification backend sera disponible.
        </p>
        <Link to="/carte" className="auth-button">
          Voir la carte
        </Link>
        <Link
          to="/login"
          className="btn btn-primary auth-button-secondary"
          onClick={() => clearAuthSession()}
        >
          Se deconnecter
        </Link>
      </section>
    </main>
  );
}

export default DashboardPage;
