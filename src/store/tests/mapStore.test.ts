import { afterEach, describe, expect, it } from 'vitest';
import { useMapStore } from '../mapStore';

describe('useMapStore', () => {
  afterEach(() => {
    useMapStore.getState().clearSelection();
  });

  it('demarre sans zone selectionnee', () => {
    expect(useMapStore.getState().selectedZoneId).toBeNull();
  });

  it('retient la derniere zone selectionnee', () => {
    useMapStore.getState().selectZone('881f1d4a0001fff');
    useMapStore.getState().selectZone('881f1d4a0002fff');
    expect(useMapStore.getState().selectedZoneId).toBe('881f1d4a0002fff');
  });

  it('efface la selection', () => {
    useMapStore.getState().selectZone('881f1d4a0001fff');
    useMapStore.getState().clearSelection();
    expect(useMapStore.getState().selectedZoneId).toBeNull();
  });
});
