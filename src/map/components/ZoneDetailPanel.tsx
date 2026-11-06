import type { SubScores } from '../../api/types';
import { useMapStore } from '../../store/mapStore';
import { useZoneDetail } from '../hooks/useZoneDetail';
import { stopForScore, tokenColor } from '../utils/colorScale';
import ScoreHistoryChart from './ScoreHistoryChart';

const SUB_SCORE_LABELS: Record<keyof SubScores, string> = {
  human_pressure: 'Pression humaine',
  vegetation: 'Végétation',
  biodiversity: 'Biodiversité',
  dynamic: 'Dynamique temporelle',
  protection: 'Protection environnementale',
};

const SUB_SCORE_KEYS = Object.keys(SUB_SCORE_LABELS) as Array<keyof SubScores>;

/** Panneau latéral : profil écologique de la zone sélectionnée. Se ferme en vidant la sélection. */
function ZoneDetailPanel() {
  const selectedZoneId = useMapStore((state) => state.selectedZoneId);
  const clearSelection = useMapStore((state) => state.clearSelection);
  const { detail, status, error, retry } = useZoneDetail(selectedZoneId);

  if (!selectedZoneId) return null;

  const score = detail?.score_global ?? null;

  return (
    <aside className="zone-panel" aria-label="Détail de la zone">
      <header className="zone-panel-header">
        <h2>Zone {selectedZoneId}</h2>
        <button type="button" className="zone-panel-close" onClick={clearSelection}>
          Fermer
        </button>
      </header>

      {status === 'loading' && (
        <p role="status" className="zone-panel-missing">
          Chargement…
        </p>
      )}

      {status === 'error' && error && (
        <div role="alert" className="zone-panel-error">
          <span>{error}</span>
          <button type="button" className="map-retry" onClick={retry}>
            Réessayer
          </button>
        </div>
      )}

      {status === 'ready' && detail && (
        <>
          <section aria-label="Score global">
            {score === null ? (
              <p className="zone-panel-missing">Score global : données indisponibles</p>
            ) : (
              <p className="zone-panel-score">
                <strong style={{ color: tokenColor(stopForScore(score).token) }}>{score}</strong>
                <span> / 100 · {stopForScore(score).label}</span>
              </p>
            )}
            {/* L'API n'expose pas encore la catégorie de territoire : on ne l'invente pas. */}
            <p className="zone-panel-missing">Catégorie de territoire : donnée manquante</p>
          </section>

          <section aria-label="Sous-scores">
            <ul className="zone-panel-subscores">
              {SUB_SCORE_KEYS.map((key) => {
                const value = detail.sub_scores[key];
                return (
                  <li key={key}>
                    <span>{SUB_SCORE_LABELS[key]}</span>
                    <span>{value === null ? 'données indisponibles' : value}</span>
                  </li>
                );
              })}
            </ul>
          </section>

          <section aria-label="Historique du score">
            <ScoreHistoryChart history={detail.history} />
          </section>
        </>
      )}
    </aside>
  );
}

export default ZoneDetailPanel;
