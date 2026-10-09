import type { ZonesStatus } from '../hooks/useZonesInView';

interface MapStatusProps {
  status: ZonesStatus;
  error: string | null;
  onRetry: () => void;
}

/** Indicateur de chargement et bandeau d'erreur superposés à la carte. */
function MapStatus({ status, error, onRetry }: MapStatusProps) {
  if (status === 'loading') {
    return (
      <p className="map-status map-status-loading" role="status">
        <span className="map-spinner" aria-hidden="true" />
        Chargement des zones...
      </p>
    );
  }

  if (status === 'error' && error) {
    return (
      <div className="map-status map-status-error" role="alert">
        <span>{error}</span>
        <button type="button" className="map-retry" onClick={onRetry}>
          Reessayer
        </button>
      </div>
    );
  }

  return null;
}

export default MapStatus;
