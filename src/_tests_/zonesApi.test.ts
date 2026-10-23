import type { AxiosAdapter, InternalAxiosRequestConfig } from 'axios';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { apiClient } from '../api/client';
import {
  exportZonePdf,
  getAtRiskZones,
  getDashboardKpis,
  getZoneDetail,
  getZonesCompare,
} from '../api/zonesApi';

const PARIS_BBOX: [number, number, number, number] = [2.25, 48.81, 2.42, 48.9];

describe('zonesApi (network path)', () => {
  const originalAdapter = apiClient.defaults.adapter;
  let requests: InternalAxiosRequestConfig[];

  beforeEach(() => {
    requests = [];
    apiClient.defaults.adapter = (async (config: InternalAxiosRequestConfig) => {
      requests.push(config);
      return { data: { ok: true }, status: 200, statusText: 'OK', headers: {}, config };
    }) as AxiosAdapter;
  });

  afterEach(() => {
    apiClient.defaults.adapter = originalAdapter;
  });

  it('at-risk: serializes bbox as a comma list and keeps paging params', async () => {
    await expect(getAtRiskZones({ bbox: PARIS_BBOX, limit: 50, offset: 10 })).resolves.toEqual({
      ok: true,
    });
    expect(requests[0].url).toBe('/v1/zones/at-risk');
    expect(requests[0].params).toEqual({ limit: 50, offset: 10, bbox: '2.25,48.81,2.42,48.9' });
  });

  it('at-risk: sends no bbox param when none is given', async () => {
    await getAtRiskZones();
    expect(requests[0].params).toEqual({});
  });

  it('zone detail: encodes the zone id in the path', async () => {
    await getZoneDetail('a/b', { from: '2026-01', to: '2026-03' });
    expect(requests[0].url).toBe('/v1/zones/a%2Fb');
    expect(requests[0].params).toEqual({ from: '2026-01', to: '2026-03' });
  });

  it('dashboard kpis: serializes bbox and forwards period', async () => {
    await getDashboardKpis({ bbox: PARIS_BBOX, period: '2026-08' });
    expect(requests[0].url).toBe('/v1/dashboard/kpis');
    expect(requests[0].params).toEqual({ bbox: '2.25,48.81,2.42,48.9', period: '2026-08' });
  });

  it('zones compare: joins zone ids and indicators', async () => {
    await getZonesCompare({
      zone_ids: ['a', 'b'],
      indicators: ['vegetation', 'protection'],
      period: '2026-08',
    });
    expect(requests[0].url).toBe('/v1/zones/compare');
    expect(requests[0].params).toEqual({
      zone_ids: 'a,b',
      indicators: 'vegetation,protection',
      period: '2026-08',
    });
  });

  it('pdf export: posts the body and asks for a blob with a long timeout', async () => {
    await exportZonePdf({ zone_id: 'abc' });
    expect(requests[0].method).toBe('post');
    expect(requests[0].url).toBe('/v1/zones/export/pdf');
    expect(JSON.parse(requests[0].data as string)).toEqual({ zone_id: 'abc' });
    expect(requests[0].responseType).toBe('blob');
    expect(requests[0].timeout).toBe(60_000);
  });
});

describe('zonesApi (VITE_USE_MOCKS=true)', () => {
  beforeEach(() => {
    vi.stubEnv('VITE_USE_MOCKS', 'true');
    vi.resetModules();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  it('answers from the typed fixtures without touching the network', async () => {
    const api = await import('../api/zonesApi');
    const zones = await api.getAtRiskZones({ bbox: PARIS_BBOX, limit: 5 });
    expect(zones.results).toHaveLength(5);

    const detail = await api.getZoneDetail(zones.results[0].zone_id);
    expect(detail.zone_id).toBe(zones.results[0].zone_id);

    const kpis = await api.getDashboardKpis({ bbox: PARIS_BBOX, period: '2026-08' });
    expect(kpis).toHaveProperty('vegetation_coverage');

    const compare = await api.getZonesCompare({
      zone_ids: [zones.results[0].zone_id, 'ghost'],
      indicators: ['vegetation'],
      period: '2026-08',
    });
    expect(compare.unknown_zone_ids).toEqual(['ghost']);

    const pdf = await api.exportZonePdf({ zone_id: 'abc' });
    expect(pdf.type).toBe('application/pdf');
  });

  it('turns a fixture failure into a normalized ApiError', async () => {
    const api = await import('../api/zonesApi');
    await expect(api.getAtRiskZones({ limit: 500 })).rejects.toMatchObject({
      kind: 'validation',
      status: 400,
    });
  });
});
