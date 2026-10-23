import { getAtRiskZones } from '../../api';
import type { Bbox, ZoneFeature } from './types';

/**
 * Point d'entrée unique de la carte pour ses données.
 *
 * Les composants ne connaissent que cette fonction : ils ignorent si la réponse vient de
 * l'API ou des mocks typés de `src/api/mocks` (`VITE_USE_MOCKS=true`).
 *
 * Le contrat `/v1` plafonne `limit` à 200 et répond 400 au-delà : on reste à ce plafond.
 */
export const MAX_ZONES_IN_VIEW = 200;

export const fetchZonesInView = async (bbox: Bbox): Promise<ZoneFeature[]> => {
  const { results } = await getAtRiskZones({ bbox, limit: MAX_ZONES_IN_VIEW });
  return results;
};
