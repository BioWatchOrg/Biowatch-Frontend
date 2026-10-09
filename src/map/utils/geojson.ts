import type { ZoneFeature } from '../data/types';

export interface ZoneGeoJsonFeature {
  type: 'Feature';
  id: string;
  geometry: ZoneFeature['geometry'];
  properties: {
    zone_id: string;
    score_global: number;
  };
}

export interface ZoneFeatureCollection {
  type: 'FeatureCollection';
  features: ZoneGeoJsonFeature[];
}

export const EMPTY_COLLECTION: ZoneFeatureCollection = {
  type: 'FeatureCollection',
  features: [],
};

/**
 * Zones de l'API → GeoJSON pour MapLibre.
 * Une zone sans géométrie n'est pas affichable : elle est ignorée plutôt que dessinée
 * à une position inventée.
 */
export const zonesToFeatureCollection = (zones: readonly ZoneFeature[]): ZoneFeatureCollection => ({
  type: 'FeatureCollection',
  features: zones
    .filter((zone) => zone.geometry !== undefined)
    .map((zone) => ({
      type: 'Feature',
      id: zone.zone_id,
      geometry: zone.geometry,
      properties: {
        zone_id: zone.zone_id,
        score_global: zone.score_global,
      },
    })),
});
