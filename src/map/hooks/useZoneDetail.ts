import { useCallback, useEffect, useRef, useState } from 'react';
import { getZoneDetail } from '../../api/zonesApi';
import type { ZoneDetailResponse } from '../../api/types';

export type ZoneDetailStatus = 'idle' | 'loading' | 'ready' | 'error';

export interface ZoneDetail {
  detail: ZoneDetailResponse | null;
  status: ZoneDetailStatus;
  /** Message prêt à afficher, jamais une erreur brute. */
  error: string | null;
  retry: () => void;
}

const ERROR_MESSAGE = 'Impossible de charger le détail de cette zone.';

/**
 * Charge le profil écologique d'une zone (score, sous-scores, historique) en un seul appel.
 * Sans `from`/`to`, c'est l'API qui choisit la fenêtre par défaut. Une réponse arrivée après
 * un changement de zone est ignorée, sinon le panneau afficherait la zone précédente.
 */
export const useZoneDetail = (zoneId: string | null): ZoneDetail => {
  const [detail, setDetail] = useState<ZoneDetailResponse | null>(null);
  const [status, setStatus] = useState<ZoneDetailStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);
  const latestRequest = useRef(0);

  useEffect(() => {
    const requestId = latestRequest.current + 1;
    latestRequest.current = requestId;

    if (!zoneId) {
      setDetail(null);
      setError(null);
      setStatus('idle');
      return;
    }

    setDetail(null);
    setError(null);
    setStatus('loading');
    getZoneDetail(zoneId)
      .then((result) => {
        if (latestRequest.current !== requestId) return;
        setDetail(result);
        setStatus('ready');
      })
      .catch(() => {
        if (latestRequest.current !== requestId) return;
        setError(ERROR_MESSAGE);
        setStatus('error');
      });
  }, [zoneId, attempt]);

  const retry = useCallback(() => setAttempt((n) => n + 1), []);

  return { detail, status, error, retry };
};
