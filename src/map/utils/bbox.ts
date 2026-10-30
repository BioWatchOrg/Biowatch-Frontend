import type { Bbox } from '../data/types';

/** Ce que la carte doit exposer pour qu'on en calcule la bbox — volontairement minimal. */
export interface BoundsLike {
  getWest(): number;
  getSouth(): number;
  getEast(): number;
  getNorth(): number;
}

const PRECISION = 4;

const round = (n: number): number => Number(n.toFixed(PRECISION));

/** Longitude ramenée dans [-180, 180] : un déplacement continu vers l'est la fait déborder. */
const wrapLng = (lng: number): number => ((((lng + 180) % 360) + 360) % 360) - 180;

const clampLat = (lat: number): number => Math.min(90, Math.max(-90, lat));

/**
 * Bbox de la vue courante, arrondie pour que deux rendus quasi identiques produisent
 * la même clé de requête et évitent un rechargement inutile.
 *
 * Une vue qui couvre tout le globe, ou qui chevauche l'antiméridien, ne tient pas dans une
 * seule bbox [ouest, sud, est, nord] avec ouest < est : on demande alors toutes les
 * longitudes plutôt que d'envoyer une bbox inversée que l'API refuserait.
 */
export const boundsToBbox = (bounds: BoundsLike): Bbox => {
  const south = round(clampLat(bounds.getSouth()));
  const north = round(clampLat(bounds.getNorth()));
  const width = bounds.getEast() - bounds.getWest();
  const west = wrapLng(bounds.getWest());
  // L'est se déduit de la largeur : le replier lui aussi transformerait 180 en -180.
  const east = west + width;
  if (width >= 360 || east > 180) {
    return [-180, south, 180, north];
  }
  return [round(west), south, round(east), north];
};

export const bboxEquals = (a: Bbox | null, b: Bbox | null): boolean =>
  a !== null && b !== null && a.every((value, index) => value === b[index]);
