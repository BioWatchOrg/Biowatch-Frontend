import type { Bbox, SubScores, ZoneGeometry } from '../types';

/** Deterministic fixture zones around Paris. Hexagons are approximate (not real H3 cells). */
export interface MockZone {
  zone_id: string;
  score_global: number;
  sub_scores: SubScores;
  geometry: ZoneGeometry;
}

const ORIGIN = { lng: 2.25, lat: 48.81 };
const RADIUS_LNG = 0.0105;
const RADIUS_LAT = 0.0073;
const COLS = 14;
const ROWS = 12;

const hexagon = (lng: number, lat: number): ZoneGeometry => {
  const ring = Array.from({ length: 6 }, (_, i) => {
    const angle = (Math.PI / 3) * i + Math.PI / 6;
    return [
      Number((lng + RADIUS_LNG * Math.cos(angle)).toFixed(6)),
      Number((lat + RADIUS_LAT * Math.sin(angle)).toFixed(6)),
    ];
  });
  return { type: 'Polygon', coordinates: [[...ring, ring[0]]] };
};

const pseudo = (n: number): number => {
  const x = Math.sin(n * 12.9898) * 43758.5453;
  return x - Math.floor(x);
};

const round1 = (n: number): number => Math.round(n * 10) / 10;

const buildZone = (col: number, row: number): MockZone => {
  const seed = col * 100 + row;
  const lng = ORIGIN.lng + col * RADIUS_LNG * 1.75 + (row % 2) * RADIUS_LNG * 0.875;
  const lat = ORIGIN.lat + row * RADIUS_LAT * 1.5;
  return {
    zone_id: `881f1d4a${seed.toString(16).padStart(4, '0')}fffff`.slice(0, 16),
    score_global: round1(20 + pseudo(seed) * 75),
    sub_scores: {
      human_pressure: round1(pseudo(seed + 1) * 100),
      vegetation: round1(pseudo(seed + 2) * 100),
      biodiversity: pseudo(seed + 3) < 0.15 ? null : round1(pseudo(seed + 3) * 100),
      dynamic: round1(pseudo(seed + 4) * 20 - 10),
      protection: pseudo(seed + 5) < 0.6 ? 0 : round1(pseudo(seed + 5) * 100),
    },
    geometry: hexagon(lng, lat),
  };
};

export const MOCK_ZONES: MockZone[] = Array.from({ length: COLS * ROWS }, (_, i) =>
  buildZone(i % COLS, Math.floor(i / COLS)),
).sort((a, b) => b.score_global - a.score_global);

export const findMockZone = (zoneId: string): MockZone | undefined =>
  MOCK_ZONES.find((z) => z.zone_id === zoneId);

export const zoneIntersectsBbox = (zone: MockZone, bbox: Bbox): boolean => {
  const [minLng, minLat, maxLng, maxLat] = bbox;
  return zone.geometry.coordinates[0].some(
    ([lng, lat]) => lng >= minLng && lng <= maxLng && lat >= minLat && lat <= maxLat,
  );
};

/** Monthly bucket ids from `from` to `to` inclusive ("2026-01" … "2026-09"). */
export const monthlyBuckets = (from: string, to: string): string[] => {
  const out: string[] = [];
  let [y, m] = from.slice(0, 7).split('-').map(Number);
  const [ty, tm] = to.slice(0, 7).split('-').map(Number);
  while (y < ty || (y === ty && m <= tm)) {
    out.push(`${y}-${String(m).padStart(2, '0')}`);
    m += 1;
    if (m > 12) {
      m = 1;
      y += 1;
    }
  }
  return out;
};

export const pseudoNoise = pseudo;
