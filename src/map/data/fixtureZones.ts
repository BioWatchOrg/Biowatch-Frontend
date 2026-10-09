import type { Bbox, ZoneFeature, ZoneGeometry } from './types';

/**
 * Grille hexagonale déterministe couvrant la vue courante.
 *
 * Fixture temporaire : elle imite la forme des cellules H3 sans en être
 * (voir `zonesSource.ts`). Déterministe, donc une même vue redonne toujours les mêmes
 * scores — sans ça, chaque déplacement ferait clignoter les couleurs.
 */

/** Rayon d'une cellule en degrés, calibré pour ~100 hexagones sur une vue d'agglomération. */
const RADIUS_LNG = 0.0105;
const RADIUS_LAT = 0.0073;

const STEP_LNG = RADIUS_LNG * 1.75;
const STEP_LAT = RADIUS_LAT * 1.5;

/** Bruit reproductible : même entrée, même score, sans dépendance externe. */
const pseudoRandom = (seed: number): number => {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
};

const round = (value: number, digits: number): number => {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
};

const hexagon = (lng: number, lat: number): ZoneGeometry => {
  const ring = Array.from({ length: 6 }, (_, corner) => {
    const angle = (Math.PI / 3) * corner + Math.PI / 6;
    return [
      round(lng + RADIUS_LNG * Math.cos(angle), 6),
      round(lat + RADIUS_LAT * Math.sin(angle), 6),
    ];
  });
  return { type: 'Polygon', coordinates: [[...ring, ring[0]]] };
};

/** Identifiant stable dérivé de la position, au format d'un index H3 (15 caractères hex). */
const zoneIdFor = (col: number, row: number): string => {
  const suffix = Math.abs(col * 4093 + row * 97)
    .toString(16)
    .padStart(6, '0')
    .slice(-6);
  return `881f1d${suffix}fffff`.slice(0, 15);
};

export const buildFixtureZones = (bbox: Bbox): ZoneFeature[] => {
  const [minLng, minLat, maxLng, maxLat] = bbox;
  if (maxLng <= minLng || maxLat <= minLat) {
    return [];
  }

  const firstCol = Math.floor(minLng / STEP_LNG);
  const lastCol = Math.ceil(maxLng / STEP_LNG);
  const firstRow = Math.floor(minLat / STEP_LAT);
  const lastRow = Math.ceil(maxLat / STEP_LAT);

  const zones: ZoneFeature[] = [];
  for (let row = firstRow; row <= lastRow; row += 1) {
    for (let col = firstCol; col <= lastCol; col += 1) {
      const lng = col * STEP_LNG + (Math.abs(row) % 2) * (STEP_LNG / 2);
      const lat = row * STEP_LAT;
      const seed = col * 1000 + row;
      zones.push({
        zone_id: zoneIdFor(col, row),
        score_global: round(15 + pseudoRandom(seed) * 80, 1),
        geometry: hexagon(lng, lat),
      });
    }
  }
  return zones;
};
