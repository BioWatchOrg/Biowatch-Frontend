import { AxiosError, type AxiosAdapter } from 'axios';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { apiClient, setAuthTokenProvider } from '../api/client';
import { normalizeApiError } from '../api/errors';
import { mockGetAtRiskZones } from '../api/mocks/atRisk';
import { mockGetDashboardKpis } from '../api/mocks/dashboardKpis';
import { mockExportPdf } from '../api/mocks/exportPdf';
import { mockGetZoneDetail } from '../api/mocks/zoneDetail';
import { mockGetZonesCompare } from '../api/mocks/zonesCompare';

const PARIS_BBOX: [number, number, number, number] = [2.25, 48.81, 2.42, 48.9];

describe('mock layer', () => {
  it('at-risk: sorted desc, no geometry without bbox, geometry with bbox', () => {
    const global = mockGetAtRiskZones({ limit: 5 });
    expect(global.results).toHaveLength(5);
    expect(global.results[0].geometry).toBeUndefined();
    const scores = global.results.map((z) => z.score_global);
    expect(scores).toEqual([...scores].sort((a, b) => b - a));

    const mapped = mockGetAtRiskZones({ bbox: PARIS_BBOX, limit: 50 });
    expect(mapped.results.length).toBeGreaterThan(0);
    expect(mapped.results.every((z) => z.geometry?.type === 'Polygon')).toBe(true);
  });

  it('at-risk: out-of-bounds limit is a 400', () => {
    expect(() => mockGetAtRiskZones({ limit: 500 })).toThrowError(
      expect.objectContaining({ status: 400 }),
    );
  });

  it('zone detail: 5 sub-scores, history over range, 404 on unknown zone', () => {
    const { results } = mockGetAtRiskZones({ limit: 1 });
    const detail = mockGetZoneDetail(results[0].zone_id, { from: '2026-01', to: '2026-03' });
    expect(Object.keys(detail.sub_scores)).toHaveLength(5);
    expect(detail.history.map((h) => h.bucket_id)).toEqual(['2026-01', '2026-02', '2026-03']);
    expect(() => mockGetZoneDetail('nope')).toThrowError(expect.objectContaining({ status: 404 }));
  });

  it('compare: lists unknown ids separately and enforces the zone count', () => {
    const [a, b] = mockGetAtRiskZones({ limit: 2 }).results;
    const res = mockGetZonesCompare({
      zone_ids: [a.zone_id, b.zone_id, 'ghost'],
      indicators: ['vegetation'],
      period: '2026-08',
    });
    expect(res.results).toHaveLength(2);
    expect(res.unknown_zone_ids).toEqual(['ghost']);
    expect(() =>
      mockGetZonesCompare({ zone_ids: [a.zone_id], indicators: [], period: '2026-08' }),
    ).toThrowError(expect.objectContaining({ status: 400 }));
  });

  it('kpis and pdf export return the contract shapes', () => {
    expect(mockGetDashboardKpis()).toHaveProperty('vegetation_coverage.delta_pct');
    expect(mockExportPdf({ zone_id: 'abc' }).type).toBe('application/pdf');
  });
});

describe('normalizeApiError', () => {
  const axiosError = (status: number, data: unknown) =>
    new AxiosError('boom', 'ERR_BAD_REQUEST', undefined, undefined, {
      status,
      data,
    } as never);

  it.each([
    [400, 'validation'],
    [404, 'not_found'],
    [500, 'server'],
  ])('maps HTTP %i to %s', (status, kind) => {
    expect(normalizeApiError(axiosError(status, {}))).toMatchObject({ kind, status });
  });

  it('extracts FastAPI detail strings and validation arrays', () => {
    expect(normalizeApiError(axiosError(404, { detail: 'Zone not found' })).message).toBe(
      'Zone not found',
    );
    expect(
      normalizeApiError(axiosError(422, { detail: [{ msg: 'a' }, { msg: 'b' }] })).message,
    ).toBe('a; b');
  });

  it('maps no-response errors to network / timeout', () => {
    expect(normalizeApiError(new AxiosError('x', 'ERR_NETWORK')).kind).toBe('network');
    expect(normalizeApiError(new AxiosError('x', 'ECONNABORTED')).kind).toBe('timeout');
  });

  it('falls back to unknown and passes ApiError through', () => {
    expect(normalizeApiError(new Error('oops'))).toMatchObject({
      kind: 'unknown',
      message: 'oops',
    });
    const already = { kind: 'server', status: 500, message: 'm' } as const;
    expect(normalizeApiError(already)).toBe(already);
  });
});

describe('apiClient', () => {
  afterEach(() => setAuthTokenProvider(null));

  const captureHeaders = async () => {
    const adapter = vi.fn(async (config) => ({
      data: {},
      status: 200,
      statusText: 'OK',
      headers: {},
      config,
    })) as unknown as AxiosAdapter;
    await apiClient.get('/ping', { adapter });
    return (adapter as unknown as ReturnType<typeof vi.fn>).mock.calls[0][0].headers;
  };

  it('attaches the bearer token from the registered provider', async () => {
    setAuthTokenProvider(async () => 'jwt-123');
    expect((await captureHeaders()).get('Authorization')).toBe('Bearer jwt-123');
  });

  it('sends no Authorization header without a token', async () => {
    expect((await captureHeaders()).get('Authorization')).toBeUndefined();
  });

  it('rejects with a normalized ApiError', async () => {
    const adapter: AxiosAdapter = async (config) => {
      throw new AxiosError('x', 'ERR_BAD_REQUEST', config, undefined, {
        status: 404,
        data: { detail: 'missing' },
        statusText: '',
        headers: {},
        config,
      } as never);
    };
    await expect(apiClient.get('/x', { adapter })).rejects.toEqual({
      kind: 'not_found',
      status: 404,
      message: 'missing',
    });
  });
});
