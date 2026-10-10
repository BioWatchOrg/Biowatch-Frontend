import { apiClient } from './client';
import type {
  AtRiskParams,
  AtRiskZonesResponse,
  DashboardKpisParams,
  DashboardKpisResponse,
  ExportPdfRequest,
  ZoneDetailParams,
  ZoneDetailResponse,
  ZonesCompareParams,
  ZonesCompareResponse,
} from './types';
import { normalizeApiError } from './errors';

/**
 * Single entry point for apps/api calls. Features import these functions only — never axios.
 * With VITE_USE_MOCKS=true the typed fixtures in ./mocks answer instead of the network;
 * the flag is a build-time constant so mock code is tree-shaken out of production bundles.
 */
const USE_MOCKS = import.meta.env.VITE_USE_MOCKS === 'true';

const MOCK_LATENCY_MS = 150;

const fromMock = async <T>(produce: () => T): Promise<T> => {
  await new Promise((resolve) => setTimeout(resolve, MOCK_LATENCY_MS));
  try {
    return produce();
  } catch (e) {
    throw normalizeApiError(e);
  }
};

export const getAtRiskZones = async (params: AtRiskParams = {}): Promise<AtRiskZonesResponse> => {
  if (USE_MOCKS) {
    const { mockGetAtRiskZones } = await import('./mocks/atRisk');
    return fromMock(() => mockGetAtRiskZones(params));
  }
  const { bbox, ...rest } = params;
  const { data } = await apiClient.get<AtRiskZonesResponse>('/v1/zones/at-risk', {
    params: { ...rest, ...(bbox ? { bbox: bbox.join(',') } : {}) },
  });
  return data;
};

export const getZoneDetail = async (
  zoneId: string,
  params: ZoneDetailParams = {},
): Promise<ZoneDetailResponse> => {
  if (USE_MOCKS) {
    const { mockGetZoneDetail } = await import('./mocks/zoneDetail');
    return fromMock(() => mockGetZoneDetail(zoneId, params));
  }
  const { data } = await apiClient.get<ZoneDetailResponse>(
    `/v1/zones/${encodeURIComponent(zoneId)}`,
    { params },
  );
  return data;
};

export const getDashboardKpis = async (
  params: DashboardKpisParams,
): Promise<DashboardKpisResponse> => {
  if (USE_MOCKS) {
    const { mockGetDashboardKpis } = await import('./mocks/dashboardKpis');
    return fromMock(() => mockGetDashboardKpis());
  }
  const { data } = await apiClient.get<DashboardKpisResponse>('/v1/dashboard/kpis', {
    params: { bbox: params.bbox.join(','), period: params.period },
  });
  return data;
};

export const getZonesCompare = async (
  params: ZonesCompareParams,
): Promise<ZonesCompareResponse> => {
  if (USE_MOCKS) {
    const { mockGetZonesCompare } = await import('./mocks/zonesCompare');
    return fromMock(() => mockGetZonesCompare(params));
  }
  const { data } = await apiClient.get<ZonesCompareResponse>('/v1/zones/compare', {
    params: {
      zone_ids: params.zone_ids.join(','),
      indicators: params.indicators.join(','),
      period: params.period,
    },
  });
  return data;
};

export const exportZonePdf = async (body: ExportPdfRequest): Promise<Blob> => {
  if (USE_MOCKS) {
    const { mockExportPdf } = await import('./mocks/exportPdf');
    return fromMock(() => mockExportPdf(body));
  }
  const { data } = await apiClient.post<Blob>('/v1/zones/export/pdf', body, {
    responseType: 'blob',
    timeout: 60_000,
  });
  return data;
};
