import { useCallback, useEffect, useRef, useState } from 'react';
import type { Bbox, ZoneFeature } from '../data/types';
import { fetchZonesInView } from '../data/zonesSource';
import { bboxEquals, boundsToBbox, type BoundsLike } from '../utils/bbox';

/** Le minimum attendu d'une instance MapLibre — un stub suffit donc à tester ce hook. */
export interface MapLike {
  getBounds(): BoundsLike;
  on(event: 'moveend', handler: () => void): unknown;
  off(event: 'moveend', handler: () => void): unknown;
}

export type ZonesStatus = 'idle' | 'loading' | 'ready' | 'error';

export interface ZonesInView {
  zones: ZoneFeature[];
  status: ZonesStatus;
  /** Message prêt à afficher, jamais une erreur brute. */
  error: string | null;
  retry: () => void;
}

export const MOVE_DEBOUNCE_MS = 400;

const ERROR_MESSAGE = 'Impossible de charger les zones pour cette vue.';

/**
 * Recharge les zones à chaque déplacement de la carte, avec un délai d'attente pour ne pas
 * tirer une requête par image pendant un déplacement continu. Une réponse arrivée après
 * un nouveau déplacement est ignorée, sinon la carte afficherait la vue précédente.
 */
export const useZonesInView = (map: MapLike | null): ZonesInView => {
  const [zones, setZones] = useState<ZoneFeature[]>([]);
  const [status, setStatus] = useState<ZonesStatus>('idle');
  const [error, setError] = useState<string | null>(null);

  const requestedBbox = useRef<Bbox | null>(null);
  const latestRequest = useRef(0);

  const load = useCallback(async (bbox: Bbox) => {
    requestedBbox.current = bbox;
    const requestId = latestRequest.current + 1;
    latestRequest.current = requestId;

    setStatus('loading');
    setError(null);
    try {
      const result = await fetchZonesInView(bbox);
      if (latestRequest.current !== requestId) return;
      setZones(result);
      setStatus('ready');
    } catch {
      if (latestRequest.current !== requestId) return;
      setError(ERROR_MESSAGE);
      setStatus('error');
    }
  }, []);

  useEffect(() => {
    if (!map) return;

    let timer: ReturnType<typeof setTimeout> | undefined;

    const scheduleLoad = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        const bbox = boundsToBbox(map.getBounds());
        // Un zoom qui retombe sur la même vue arrondie ne déclenche rien.
        if (bboxEquals(bbox, requestedBbox.current)) return;
        void load(bbox);
      }, MOVE_DEBOUNCE_MS);
    };

    void load(boundsToBbox(map.getBounds()));
    map.on('moveend', scheduleLoad);

    return () => {
      clearTimeout(timer);
      map.off('moveend', scheduleLoad);
    };
  }, [map, load]);

  const retry = useCallback(() => {
    const bbox = requestedBbox.current;
    if (bbox) void load(bbox);
  }, [load]);

  return { zones, status, error, retry };
};
