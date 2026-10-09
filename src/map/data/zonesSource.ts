import type { Bbox, ZoneFeature } from './types';
import { buildFixtureZones } from './fixtureZones';

/**
 * Point d'entrée unique de la carte pour ses données.
 *
 * Tant que `apps/api` n'expose aucun endpoint et que la couche API (#17 / PR #71) n'est pas
 * fusionnée, cette fonction sert une grille de cellules fictives. Le remplacement se fait
 * ici et nulle part ailleurs :
 *
 *   const { results } = await getAtRiskZones({ bbox, limit: MAX_ZONES_IN_VIEW });
 *   return results;
 *
 * La signature est déjà celle de l'appel réel (asynchrone, bbox en entrée, zones en sortie),
 * donc les composants n'auront pas à changer.
 */
export const MAX_ZONES_IN_VIEW = 500;

const FAKE_LATENCY_MS = 120;

export const fetchZonesInView = async (bbox: Bbox): Promise<ZoneFeature[]> => {
  await new Promise((resolve) => setTimeout(resolve, FAKE_LATENCY_MS));
  return buildFixtureZones(bbox).slice(0, MAX_ZONES_IN_VIEW);
};
