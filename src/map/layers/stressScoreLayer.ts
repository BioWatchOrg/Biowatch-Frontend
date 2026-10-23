import type { Map as MapLibreMap } from 'maplibre-gl';
import {
  resolveCssToken,
  scoreColorExpression,
  ZONE_OUTLINE_TOKEN,
  type TokenResolver,
} from '../utils/colorScale';
import { EMPTY_COLLECTION, type ZoneFeatureCollection } from '../utils/geojson';

export const ZONES_SOURCE_ID = 'stress-zones';
export const ZONES_FILL_LAYER_ID = 'stress-zones-fill';
export const ZONES_OUTLINE_LAYER_ID = 'stress-zones-outline';
export const ZONES_SELECTED_LAYER_ID = 'stress-zones-selected';

/** Filtre MapLibre qui ne garde que la zone sélectionnée — aucune quand `zoneId` est null. */
export const selectedZoneFilter = (zoneId: string | null): unknown[] => [
  '==',
  ['get', 'zone_id'],
  zoneId ?? '',
];

/** Ajoute source et couches si elles n'existent pas encore (le style peut être rechargé). */
export const addStressScoreLayer = (
  map: MapLibreMap,
  resolve: TokenResolver = resolveCssToken,
): void => {
  if (!map.getSource(ZONES_SOURCE_ID)) {
    map.addSource(ZONES_SOURCE_ID, { type: 'geojson', data: EMPTY_COLLECTION });
  }

  if (!map.getLayer(ZONES_FILL_LAYER_ID)) {
    map.addLayer({
      id: ZONES_FILL_LAYER_ID,
      type: 'fill',
      source: ZONES_SOURCE_ID,
      paint: {
        'fill-color': scoreColorExpression(resolve) as never,
        'fill-opacity': 0.45,
      },
    });
  }

  if (!map.getLayer(ZONES_OUTLINE_LAYER_ID)) {
    map.addLayer({
      id: ZONES_OUTLINE_LAYER_ID,
      type: 'line',
      source: ZONES_SOURCE_ID,
      paint: {
        'line-color': resolve(ZONE_OUTLINE_TOKEN),
        'line-width': 0.4,
        'line-opacity': 0.5,
      },
    });
  }

  if (!map.getLayer(ZONES_SELECTED_LAYER_ID)) {
    map.addLayer({
      id: ZONES_SELECTED_LAYER_ID,
      type: 'line',
      source: ZONES_SOURCE_ID,
      filter: selectedZoneFilter(null) as never,
      paint: {
        'line-color': resolve(ZONE_OUTLINE_TOKEN),
        'line-width': 3,
      },
    });
  }
};

/** Met en évidence la zone sélectionnée (contour épais), ou n'en montre aucune. */
export const setSelectedZone = (map: MapLibreMap, zoneId: string | null): void => {
  if (map.getLayer(ZONES_SELECTED_LAYER_ID)) {
    map.setFilter(ZONES_SELECTED_LAYER_ID, selectedZoneFilter(zoneId) as never);
  }
};

export const setStressScoreData = (map: MapLibreMap, data: ZoneFeatureCollection): void => {
  const source = map.getSource(ZONES_SOURCE_ID);
  if (source && 'setData' in source) {
    (source as { setData: (data: ZoneFeatureCollection) => void }).setData(data);
  }
};
