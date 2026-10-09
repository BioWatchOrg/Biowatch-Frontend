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
 */
export const boundsToBbox = (bounds: BoundsLike): Bbox => [
  round(wrapLng(bounds.getWest())),
  round(clampLat(bounds.getSouth())),
  round(wrapLng(bounds.getEast())),
  round(clampLat(bounds.getNorth())),
];

export const bboxEquals = (a: Bbox | null, b: Bbox | null): boolean =>
  a !== null && b !== null && a.every((value, index) => value === b[index]);

export const bboxToKey = (bbox: Bbox): string => bbox.join(',');
