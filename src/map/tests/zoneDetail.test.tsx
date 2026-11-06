import { act, render, renderHook, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import * as zonesApi from '../../api/zonesApi';
import type { ZoneDetailResponse } from '../../api/types';
import { useMapStore } from '../../store/mapStore';
import ScoreHistoryChart from '../components/ScoreHistoryChart';
import ZoneDetailPanel from '../components/ZoneDetailPanel';
import { useZoneDetail } from '../hooks/useZoneDetail';

const detail = (
  zone_id: string,
  overrides: Partial<ZoneDetailResponse> = {},
): ZoneDetailResponse => ({
  zone_id,
  score_global: 72,
  sub_scores: {
    human_pressure: 80,
    vegetation: null,
    biodiversity: 40,
    dynamic: 55,
    protection: 0,
  },
  history: [
    { bucket_id: '2026-01', score_global: 60, sub_scores: {} },
    { bucket_id: '2026-02', score_global: 72, sub_scores: {} },
  ],
  ...overrides,
});

beforeEach(() => useMapStore.setState({ selectedZoneId: null }));
afterEach(() => vi.restoreAllMocks());

describe('useZoneDetail', () => {
  it('ne fait aucun appel sans zone', () => {
    const spy = vi.spyOn(zonesApi, 'getZoneDetail');
    const { result } = renderHook(() => useZoneDetail(null));
    expect(result.current.status).toBe('idle');
    expect(spy).not.toHaveBeenCalled();
  });

  it('charge le détail de la zone', async () => {
    vi.spyOn(zonesApi, 'getZoneDetail').mockResolvedValue(detail('a'));
    const { result } = renderHook(() => useZoneDetail('a'));
    expect(result.current.status).toBe('loading');
    await waitFor(() => expect(result.current.status).toBe('ready'));
    expect(result.current.detail?.zone_id).toBe('a');
  });

  it('expose un message prêt à afficher puis recharge au retry', async () => {
    const spy = vi
      .spyOn(zonesApi, 'getZoneDetail')
      .mockRejectedValueOnce(new Error('boom'))
      .mockResolvedValueOnce(detail('a'));
    const { result } = renderHook(() => useZoneDetail('a'));
    await waitFor(() => expect(result.current.status).toBe('error'));
    expect(result.current.error).toMatch(/Impossible/);

    act(() => result.current.retry());
    await waitFor(() => expect(result.current.status).toBe('ready'));
    expect(spy).toHaveBeenCalledTimes(2);
  });

  it('ignore la réponse d une zone remplacée entre-temps', async () => {
    let resolveA!: (d: ZoneDetailResponse) => void;
    vi.spyOn(zonesApi, 'getZoneDetail').mockImplementation((id) =>
      id === 'a'
        ? new Promise((resolve) => {
            resolveA = resolve;
          })
        : Promise.resolve(detail('b')),
    );
    const { result, rerender } = renderHook(({ id }) => useZoneDetail(id), {
      initialProps: { id: 'a' },
    });
    rerender({ id: 'b' });
    await waitFor(() => expect(result.current.detail?.zone_id).toBe('b'));
    await act(async () => resolveA(detail('a')));
    expect(result.current.detail?.zone_id).toBe('b');
  });
});

describe('ZoneDetailPanel', () => {
  it('ne rend rien sans zone sélectionnée', () => {
    const { container } = render(<ZoneDetailPanel />);
    expect(container).toBeEmptyDOMElement();
  });

  it('affiche le score, les 5 sous-scores et jamais de valeur de remplacement', async () => {
    vi.spyOn(zonesApi, 'getZoneDetail').mockResolvedValue(detail('a'));
    useMapStore.setState({ selectedZoneId: 'a' });
    render(<ZoneDetailPanel />);

    expect(await screen.findByText('72')).toBeInTheDocument();
    expect(screen.getByText(/Catégorie de territoire : donnée manquante/)).toBeInTheDocument();
    expect(screen.getAllByRole('listitem')).toHaveLength(5);
    expect(screen.getByText('données indisponibles')).toBeInTheDocument();
    // protection = 0 est une vraie valeur, pas une donnée manquante
    expect(screen.getByText('0')).toBeInTheDocument();
    expect(screen.getByRole('img', { name: /2026-01 à 2026-02/ })).toBeInTheDocument();
  });

  it('se ferme en vidant la sélection de la carte', async () => {
    vi.spyOn(zonesApi, 'getZoneDetail').mockResolvedValue(detail('a'));
    useMapStore.setState({ selectedZoneId: 'a' });
    render(<ZoneDetailPanel />);

    await userEvent.click(screen.getByRole('button', { name: 'Fermer' }));
    expect(useMapStore.getState().selectedZoneId).toBeNull();
  });

  it('signale une erreur de chargement', async () => {
    vi.spyOn(zonesApi, 'getZoneDetail').mockRejectedValue(new Error('x'));
    useMapStore.setState({ selectedZoneId: 'a' });
    render(<ZoneDetailPanel />);
    expect(await screen.findByRole('alert')).toHaveTextContent('Impossible');
  });
});

describe('ScoreHistoryChart', () => {
  it('indique l indisponibilité quand l historique est trop court', () => {
    render(
      <ScoreHistoryChart history={[{ bucket_id: '2026-01', score_global: 50, sub_scores: {} }]} />,
    );
    expect(screen.getByText('Historique indisponible.')).toBeInTheDocument();
  });

  it('ignore les buckets sans score', () => {
    const { container } = render(
      <ScoreHistoryChart
        history={[
          { bucket_id: '2026-01', score_global: 10, sub_scores: {} },
          { bucket_id: '2026-02', score_global: null, sub_scores: {} },
          { bucket_id: '2026-03', score_global: 30, sub_scores: {} },
        ]}
      />,
    );
    expect(container.querySelectorAll('circle')).toHaveLength(2);
  });
});
