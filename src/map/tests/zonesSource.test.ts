import { afterEach, describe, expect, it, vi } from 'vitest';
import * as api from '../../api';
import { mockGetAtRiskZones } from '../../api/mocks/atRisk';
import { fetchZonesInView, MAX_ZONES_IN_VIEW } from '../data/zonesSource';
import type { Bbox } from '../data/types';

const PARIS: Bbox = [2.25, 48.81, 2.42, 48.9];

describe('fetchZonesInView', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('demande a l API les zones de la vue, geometrie comprise', async () => {
    const getAtRiskZones = vi.spyOn(api, 'getAtRiskZones').mockResolvedValue({
      total: 1,
      limit: MAX_ZONES_IN_VIEW,
      offset: 0,
      results: [{ zone_id: '881f1d4a0001fff', score_global: 72 }],
    });

    const zones = await fetchZonesInView(PARIS);

    expect(getAtRiskZones).toHaveBeenCalledWith({ bbox: PARIS, limit: MAX_ZONES_IN_VIEW });
    expect(zones).toEqual([{ zone_id: '881f1d4a0001fff', score_global: 72 }]);
  });

  it('propage l erreur de l API pour que la carte affiche son bandeau', async () => {
    vi.spyOn(api, 'getAtRiskZones').mockRejectedValue(new Error('network'));
    await expect(fetchZonesInView(PARIS)).rejects.toThrow('network');
  });

  it('reste dans le plafond du contrat /v1 (sinon 400)', () => {
    expect(() => mockGetAtRiskZones({ bbox: PARIS, limit: MAX_ZONES_IN_VIEW })).not.toThrow();
  });
});

describe('mocks de zones', () => {
  it('produisent des identifiants au format d un index H3 (15 caracteres hex)', () => {
    const { results } = mockGetAtRiskZones({ bbox: PARIS, limit: MAX_ZONES_IN_VIEW });
    expect(results.length).toBeGreaterThan(0);
    for (const zone of results) {
      expect(zone.zone_id).toMatch(/^[0-9a-f]{15}$/);
    }
    expect(new Set(results.map((z) => z.zone_id)).size).toBe(results.length);
  });
});
