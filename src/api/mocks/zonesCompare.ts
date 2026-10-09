import type { ZoneComparisonRow, ZonesCompareParams, ZonesCompareResponse } from '../types';
import { findMockZone } from './data';

const MAX_ZONES = 10;

export const mockGetZonesCompare = ({
  zone_ids,
  indicators,
  period,
}: ZonesCompareParams): ZonesCompareResponse => {
  if (zone_ids.length < 2 || zone_ids.length > MAX_ZONES) {
    throw {
      kind: 'validation',
      status: 400,
      message: `zone_ids must contain 2 to ${MAX_ZONES} ids`,
    };
  }
  const results: ZoneComparisonRow[] = [];
  const unknown_zone_ids: string[] = [];

  for (const id of zone_ids) {
    const zone = findMockZone(id);
    if (!zone) {
      unknown_zone_ids.push(id);
      continue;
    }
    const row: ZoneComparisonRow = { zone_id: id };
    for (const indicator of indicators) {
      row[indicator] =
        indicator === 'score_global' ? zone.score_global : zone.sub_scores[indicator];
    }
    results.push(row);
  }
  return { period, results, unknown_zone_ids };
};
