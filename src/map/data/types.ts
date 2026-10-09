/**
 * Formes de données consommées par la carte.
 *
 * Elles recopient volontairement le contrat `/v1` exposé par `src/api/types` (PR #71).
 * Dès que cette couche est fusionnée dans `dev`, ce fichier devient un simple
 * ré-export : la carte ne définit pas son propre contrat de données.
 */

/** [min_lng, min_lat, max_lng, max_lat] */
export type Bbox = [number, number, number, number];

export interface ZoneGeometry {
  type: 'Polygon';
  coordinates: number[][][];
}

/** Cellule H3 et son score écologique. `geometry` n'est fourni que pour une requête par bbox. */
export interface ZoneFeature {
  zone_id: string;
  score_global: number;
  geometry?: ZoneGeometry;
}
