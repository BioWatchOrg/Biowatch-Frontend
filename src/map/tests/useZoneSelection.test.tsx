import { renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { useMapStore } from '../../store/mapStore';
import {
  useZoneSelection,
  zoneIdFromEvent,
  type SelectableMap,
  type ZoneLayerEvent,
} from '../hooks/useZoneSelection';
import { ZONES_FILL_LAYER_ID } from '../layers/stressScoreLayer';

type Listener = (e: ZoneLayerEvent) => void;

/** Carte factice : enregistre les écouteurs par « type@couche » pour pouvoir les déclencher. */
const fakeMap = () => {
  const listeners = new Map<string, Listener>();
  const canvas = { style: { cursor: '' } };
  const map: SelectableMap = {
    on: (type, layerId, listener) => listeners.set(`${type}@${layerId}`, listener),
    off: (type, layerId) => listeners.delete(`${type}@${layerId}`),
    getCanvas: () => canvas,
  };
  const fire = (type: string, event: ZoneLayerEvent = {}) =>
    listeners.get(`${type}@${ZONES_FILL_LAYER_ID}`)?.(event);
  return { map, canvas, listeners, fire };
};

const clickOn = (zone_id: unknown): ZoneLayerEvent => ({ features: [{ properties: { zone_id } }] });

describe('zoneIdFromEvent', () => {
  it('lit le zone_id de la premiere feature', () => {
    expect(zoneIdFromEvent(clickOn('881f1d4a0001fff'))).toBe('881f1d4a0001fff');
  });

  it('rend null sans feature ou sans zone_id exploitable', () => {
    expect(zoneIdFromEvent({})).toBeNull();
    expect(zoneIdFromEvent({ features: [{ properties: null }] })).toBeNull();
    expect(zoneIdFromEvent(clickOn(42))).toBeNull();
    expect(zoneIdFromEvent(clickOn(''))).toBeNull();
  });
});

describe('useZoneSelection', () => {
  afterEach(() => {
    useMapStore.getState().clearSelection();
  });

  it('envoie le zone_id de la cellule cliquee au store', () => {
    const { map, fire } = fakeMap();
    renderHook(() => useZoneSelection(map));

    fire('click', clickOn('881f1d4a0001fff'));

    expect(useMapStore.getState().selectedZoneId).toBe('881f1d4a0001fff');
  });

  it('garde la selection si le clic ne porte pas de zone', () => {
    const { map, fire } = fakeMap();
    useMapStore.getState().selectZone('881f1d4a0001fff');
    renderHook(() => useZoneSelection(map));

    fire('click', {});

    expect(useMapStore.getState().selectedZoneId).toBe('881f1d4a0001fff');
  });

  it('signale les cellules cliquables par le curseur', () => {
    const { map, canvas, fire } = fakeMap();
    renderHook(() => useZoneSelection(map));

    fire('mouseenter');
    expect(canvas.style.cursor).toBe('pointer');
    fire('mouseleave');
    expect(canvas.style.cursor).toBe('');
  });

  it('retire ses ecouteurs au demontage', () => {
    const { map, listeners } = fakeMap();
    const { unmount } = renderHook(() => useZoneSelection(map));
    expect(listeners.size).toBe(3);

    unmount();

    expect(listeners.size).toBe(0);
  });

  it('ne fait rien tant que la carte n est pas prete', () => {
    expect(() => renderHook(() => useZoneSelection(null))).not.toThrow();
  });
});
