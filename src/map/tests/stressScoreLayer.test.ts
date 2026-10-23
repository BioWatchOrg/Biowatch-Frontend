import type { Map as MapLibreMap } from 'maplibre-gl';
import { describe, expect, it, vi } from 'vitest';
import {
  addStressScoreLayer,
  selectedZoneFilter,
  setSelectedZone,
  setStressScoreData,
  ZONES_FILL_LAYER_ID,
  ZONES_OUTLINE_LAYER_ID,
  ZONES_SELECTED_LAYER_ID,
  ZONES_SOURCE_ID,
} from '../layers/stressScoreLayer';
import { EMPTY_COLLECTION } from '../utils/geojson';

interface LayerSpec {
  id: string;
  filter?: unknown;
  paint: Record<string, unknown>;
}

/** Carte factice : garde sources et couches en mémoire, comme le ferait MapLibre. */
const fakeMap = () => {
  const sources = new Map<string, { setData: ReturnType<typeof vi.fn> }>();
  const layers = new Map<string, LayerSpec>();
  const map = {
    getSource: (id: string) => sources.get(id),
    addSource: vi.fn((id: string) => sources.set(id, { setData: vi.fn() })),
    getLayer: (id: string) => layers.get(id),
    addLayer: vi.fn((layer: LayerSpec) => layers.set(layer.id, layer)),
    setFilter: vi.fn(),
  };
  return { map, asMapLibre: map as unknown as MapLibreMap, sources, layers };
};

const resolve = (token: string) => `color(${token})`;

describe('addStressScoreLayer', () => {
  it('ajoute la source, le remplissage, le contour et la couche de selection', () => {
    const { asMapLibre, layers, sources } = fakeMap();

    addStressScoreLayer(asMapLibre, resolve);

    expect(sources.has(ZONES_SOURCE_ID)).toBe(true);
    expect([...layers.keys()]).toEqual([
      ZONES_FILL_LAYER_ID,
      ZONES_OUTLINE_LAYER_ID,
      ZONES_SELECTED_LAYER_ID,
    ]);
    expect(layers.get(ZONES_OUTLINE_LAYER_ID)?.paint['line-color']).toBe('color(--color-navy)');
    expect(layers.get(ZONES_SELECTED_LAYER_ID)?.filter).toEqual(selectedZoneFilter(null));
  });

  it('ne duplique rien quand le style est recharge', () => {
    const { map, asMapLibre } = fakeMap();

    addStressScoreLayer(asMapLibre, resolve);
    addStressScoreLayer(asMapLibre, resolve);

    expect(map.addSource).toHaveBeenCalledTimes(1);
    expect(map.addLayer).toHaveBeenCalledTimes(3);
  });
});

describe('setSelectedZone', () => {
  it('filtre la couche de selection sur la zone choisie', () => {
    const { map, asMapLibre } = fakeMap();
    addStressScoreLayer(asMapLibre, resolve);

    setSelectedZone(asMapLibre, '881f1d4a0001fff');

    expect(map.setFilter).toHaveBeenCalledWith(ZONES_SELECTED_LAYER_ID, [
      '==',
      ['get', 'zone_id'],
      '881f1d4a0001fff',
    ]);
  });

  it('ne met aucune zone en evidence sans selection', () => {
    expect(selectedZoneFilter(null)).toEqual(['==', ['get', 'zone_id'], '']);
  });

  it('attend que la couche existe', () => {
    const { map, asMapLibre } = fakeMap();
    setSelectedZone(asMapLibre, '881f1d4a0001fff');
    expect(map.setFilter).not.toHaveBeenCalled();
  });
});

describe('setStressScoreData', () => {
  it('pousse les zones dans la source GeoJSON', () => {
    const { asMapLibre, sources } = fakeMap();
    addStressScoreLayer(asMapLibre, resolve);

    setStressScoreData(asMapLibre, EMPTY_COLLECTION);

    expect(sources.get(ZONES_SOURCE_ID)?.setData).toHaveBeenCalledWith(EMPTY_COLLECTION);
  });
});
