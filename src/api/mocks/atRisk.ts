import type { AtRiskParams, AtRiskZonesResponse } from '../types';
import { MOCK_ZONES, zoneIntersectsBbox } from './data';

const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 200;

export const mockGetAtRiskZones = (params: AtRiskParams = {}): AtRiskZonesResponse => {
  const { bbox, limit = DEFAULT_LIMIT, offset = 0 } = params;
  if (limit < 1 || limit > MAX_LIMIT || offset < 0) {
    throw { kind: 'validation', status: 400, message: 'limit/offset out of bounds' };
  }
  const matching = bbox ? MOCK_ZONES.filter((z) => zoneIntersectsBbox(z, bbox)) : MOCK_ZONES;
  return {
    total: matching.length,
    limit,
    offset,
    results: matching.slice(offset, offset + limit).map((z) => ({
      zone_id: z.zone_id,
      score_global: z.score_global,
      ...(bbox ? { geometry: z.geometry } : {}),
    })),
  };
};
