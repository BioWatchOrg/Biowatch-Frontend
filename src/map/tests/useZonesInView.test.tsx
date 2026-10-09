import { act, renderHook, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { MOVE_DEBOUNCE_MS, useZonesInView, type MapLike } from '../hooks/useZonesInView';
import * as zonesSource from '../data/zonesSource';
import type { ZoneFeature } from '../data/types';

const zone = (zone_id: string): ZoneFeature => ({
  zone_id,
  score_global: 50,
  geometry: {
    type: 'Polygon',
    coordinates: [
      [
        [2, 48],
        [2.1, 48],
        [2.1, 48.1],
        [2, 48],
      ],
    ],
  },
});

/** Carte factice : elle expose juste ce dont le hook a besoin et permet de simuler un déplacement. */
const fakeMap = () => {
  const handlers = new Set<() => void>();
  let view = { west: 2.25, south: 48.81, east: 2.42, north: 48.9 };

  const map: MapLike & { moveTo: (lng: number) => void } = {
    getBounds: () => ({
      getWest: () => view.west,
      getSouth: () => view.south,
      getEast: () => view.east,
      getNorth: () => view.north,
    }),
    on: (_event, handler) => handlers.add(handler),
    off: (_event, handler) => handlers.delete(handler),
    moveTo: (lng) => {
      view = { ...view, west: lng, east: lng + 0.17 };
      handlers.forEach((handler) => handler());
    },
  };

  return { map, handlerCount: () => handlers.size };
};

describe('useZonesInView', () => {
  beforeEach(() => vi.useFakeTimers({ shouldAdvanceTime: true }));
  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('charge les zones de la vue initiale', async () => {
    vi.spyOn(zonesSource, 'fetchZonesInView').mockResolvedValue([zone('a')]);
    const { map } = fakeMap();

    const { result } = renderHook(() => useZonesInView(map));

    expect(result.current.status).toBe('loading');
    await waitFor(() => expect(result.current.status).toBe('ready'));
    expect(result.current.zones.map((z) => z.zone_id)).toEqual(['a']);
  });

  it('ne recharge pas tant que le deplacement n est pas termine', async () => {
    const fetchZones = vi.spyOn(zonesSource, 'fetchZonesInView').mockResolvedValue([]);
    const { map } = fakeMap();
    renderHook(() => useZonesInView(map));
    await waitFor(() => expect(fetchZones).toHaveBeenCalledTimes(1));

    act(() => {
      map.moveTo(2.3);
      map.moveTo(2.31);
      map.moveTo(2.32);
    });
    expect(fetchZones).toHaveBeenCalledTimes(1);

    await act(async () => {
      vi.advanceTimersByTime(MOVE_DEBOUNCE_MS);
    });
    await waitFor(() => expect(fetchZones).toHaveBeenCalledTimes(2));
    expect(fetchZones.mock.calls[1][0]).toEqual([2.32, 48.81, 2.49, 48.9]);
  });

  it('ne refait pas la requete quand la vue revient au meme endroit', async () => {
    const fetchZones = vi.spyOn(zonesSource, 'fetchZonesInView').mockResolvedValue([]);
    const { map } = fakeMap();
    renderHook(() => useZonesInView(map));
    await waitFor(() => expect(fetchZones).toHaveBeenCalledTimes(1));

    await act(async () => {
      map.moveTo(2.25);
      vi.advanceTimersByTime(MOVE_DEBOUNCE_MS);
    });

    expect(fetchZones).toHaveBeenCalledTimes(1);
  });

  it('affiche un message et permet de reessayer apres un echec', async () => {
    const fetchZones = vi
      .spyOn(zonesSource, 'fetchZonesInView')
      .mockRejectedValueOnce(new Error('boom'))
      .mockResolvedValueOnce([zone('b')]);
    const { map } = fakeMap();

    const { result } = renderHook(() => useZonesInView(map));
    await waitFor(() => expect(result.current.status).toBe('error'));
    expect(result.current.error).toBe('Impossible de charger les zones pour cette vue.');

    await act(async () => result.current.retry());
    await waitFor(() => expect(result.current.status).toBe('ready'));
    expect(result.current.zones.map((z) => z.zone_id)).toEqual(['b']);
    expect(result.current.error).toBeNull();
    expect(fetchZones).toHaveBeenCalledTimes(2);
  });

  it('ignore une reponse plus lente que le deplacement suivant', async () => {
    let resolveFirst: (zones: ZoneFeature[]) => void = () => {};
    vi.spyOn(zonesSource, 'fetchZonesInView')
      .mockImplementationOnce(
        () =>
          new Promise<ZoneFeature[]>((resolve) => {
            resolveFirst = resolve;
          }),
      )
      .mockResolvedValueOnce([zone('recente')]);

    const { map } = fakeMap();
    const { result } = renderHook(() => useZonesInView(map));

    await act(async () => {
      map.moveTo(2.3);
      vi.advanceTimersByTime(MOVE_DEBOUNCE_MS);
    });
    await waitFor(() => expect(result.current.zones.map((z) => z.zone_id)).toEqual(['recente']));

    await act(async () => resolveFirst([zone('perimee')]));

    expect(result.current.zones.map((z) => z.zone_id)).toEqual(['recente']);
  });

  it('se desabonne de la carte au demontage', async () => {
    vi.spyOn(zonesSource, 'fetchZonesInView').mockResolvedValue([]);
    const { map, handlerCount } = fakeMap();

    const { unmount } = renderHook(() => useZonesInView(map));
    await waitFor(() => expect(handlerCount()).toBe(1));

    unmount();
    expect(handlerCount()).toBe(0);
  });

  it('ne tente rien tant que la carte n est pas prete', () => {
    const fetchZones = vi.spyOn(zonesSource, 'fetchZonesInView').mockResolvedValue([]);
    const { result } = renderHook(() => useZonesInView(null));

    expect(result.current.status).toBe('idle');
    expect(fetchZones).not.toHaveBeenCalled();
  });
});
