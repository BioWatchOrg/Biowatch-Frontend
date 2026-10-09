import type { Map as MapLibreMap } from 'maplibre-gl';
import { scoreColorExpression } from '../utils/colorScale';
import { EMPTY_COLLECTION, type ZoneFeatureCollection } from '../utils/geojson';

export const ZONES_SOURCE_ID = 'stress-zones';
export const ZONES_FILL_LAYER_ID = 'stress-zones-fill';
export const ZONES_OUTLINE_LAYER_ID = 'stress-zones-outline';

/** Ajoute source et couches si elles n'existent pas encore (le style peut être rechargé). */
export const addStressScoreLayer = (map: MapLibreMap): void => {
  if (!map.getSource(ZONES_SOURCE_ID)) {
    map.addSource(ZONES_SOURCE_ID, { type: 'geojson', data: EMPTY_COLLECTION });
  }

  if (!map.getLayer(ZONES_FILL_LAYER_ID)) {
    map.addLayer({
      id: ZONES_FILL_LAYER_ID,
      type: 'fill',
      source: ZONES_SOURCE_ID,
      paint: {
        'fill-color': scoreColorExpression() as never,
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
        'line-color': '#0d1b2a',
        'line-width': 0.4,
        'line-opacity': 0.5,
      },
    });
  }
};

export const setStressScoreData = (map: MapLibreMap, data: ZoneFeatureCollection): void => {
  const source = map.getSource(ZONES_SOURCE_ID);
  if (source && 'setData' in source) {
    (source as { setData: (data: ZoneFeatureCollection) => void }).setData(data);
  }
};
