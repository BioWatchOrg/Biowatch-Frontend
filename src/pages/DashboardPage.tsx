import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../store/userStore';

function DashboardPage() {
  const navigate = useNavigate();
  const signOut = useUserStore((state) => state.signOut);

  const handleSignOut = () => {
    signOut();
    navigate('/');
  };

  return (
    <main className="dashboard-shell">
      <section className="dashboard-card" aria-labelledby="dashboard-title">
        <p className="dashboard-badge">BioWatch</p>
        <h1 id="dashboard-title">Tableau de bord de demonstration</h1>
        <p>
          Vous etes connecte avec une session de demonstration. Cette page sera remplacee par le
          veritable tableau de bord, et la connexion par Firebase, dans un prochain sprint.
        </p>
        <button type="button" className="btn btn-primary dashboard-logout" onClick={handleSignOut}>
          Se deconnecter
        </button>
      </section>
    </main>
  );
}

export default DashboardPage;
