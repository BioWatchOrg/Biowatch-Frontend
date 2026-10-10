import type { ZoneDetailParams, ZoneDetailResponse } from '../types';
import { findMockZone, monthlyBuckets, pseudoNoise } from './data';

const DEFAULT_FROM = '2025-10';
const DEFAULT_TO = '2026-09';

export const mockGetZoneDetail = (
  zoneId: string,
  params: ZoneDetailParams = {},
): ZoneDetailResponse => {
  const zone = findMockZone(zoneId);
  if (!zone) throw { kind: 'not_found', status: 404, message: 'Zone not found' };

  const { from = DEFAULT_FROM, to = DEFAULT_TO } = params;
  const buckets = monthlyBuckets(from, to);
  const seed = zone.score_global * 10;

  return {
    zone_id: zone.zone_id,
    score_global: zone.score_global,
    sub_scores: zone.sub_scores,
    history: buckets.map((bucket_id, i) => {
      const drift = (pseudoNoise(seed + i) - 0.5) * 8;
      const vegetation = zone.sub_scores.vegetation;
      return {
        bucket_id,
        score_global: Math.round((zone.score_global + drift) * 10) / 10,
        sub_scores:
          vegetation === null ? {} : { vegetation: Math.round((vegetation + drift) * 10) / 10 },
      };
    }),
  };
};
