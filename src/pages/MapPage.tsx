import { Link } from 'react-router-dom';
import StressScoreMap from '../map/components/StressScoreMap';

function MapPage() {
  return (
    <main className="map-page">
      <header className="map-page-header">
        <h1>Carte du stress ecologique</h1>
        <Link to="/dashboard" className="btn btn-ghost">
          Retour au tableau de bord
        </Link>
      </header>
      <StressScoreMap />
    </main>
  );
}

export default MapPage;
