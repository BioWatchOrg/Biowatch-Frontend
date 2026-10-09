/** Response shapes of apps/api (/v1). Field names mirror the backend contract as-is. */

/** Bucket key from core.time_bucket: "2026-07" (MONTHLY), "2026-S2" (BIMONTHLY), "2026" (YEARLY). */
export type BucketId = string;

/** [min_lng, min_lat, max_lng, max_lat] */
export type Bbox = [number, number, number, number];

export type Indicator =
  | 'score_global'
  | 'human_pressure'
  | 'vegetation'
  | 'biodiversity'
  | 'dynamic'
  | 'protection';

export const INDICATORS: readonly Indicator[] = [
  'score_global',
  'human_pressure',
  'vegetation',
  'biodiversity',
  'dynamic',
  'protection',
];

/** A null sub-score means "no data": the UI shows "données indisponibles", never a default. */
export interface SubScores {
  human_pressure: number | null;
  vegetation: number | null;
  biodiversity: number | null;
  dynamic: number | null;
  protection: number | null;
}

export interface ZoneGeometry {
  type: 'Polygon';
  coordinates: number[][][];
}

// GET /v1/zones/at-risk
export interface AtRiskZone {
  zone_id: string;
  score_global: number;
  /** Present only when `bbox` was provided. */
  geometry?: ZoneGeometry;
}

export interface AtRiskZonesResponse {
  total: number;
  limit: number;
  offset: number;
  results: AtRiskZone[];
}

// GET /v1/zones/{zone_id}
export interface ZoneHistoryPoint {
  bucket_id: BucketId;
  score_global: number | null;
  /** The backend may return only a subset of sub-scores per bucket. */
  sub_scores: Partial<SubScores>;
}

export interface ZoneDetailResponse {
  zone_id: string;
  score_global: number | null;
  sub_scores: SubScores;
  history: ZoneHistoryPoint[];
}

// GET /v1/dashboard/kpis
export interface Kpi {
  value: number | null;
  previous: number | null;
  delta_pct: number | null;
}

export interface DashboardKpisResponse {
  vegetation_coverage: Kpi;
  ecological_trend: Kpi;
}

// GET /v1/zones/compare
export type ZoneComparisonRow = { zone_id: string } & Partial<Record<Indicator, number | null>>;

export interface ZonesCompareResponse {
  period: BucketId;
  results: ZoneComparisonRow[];
  unknown_zone_ids: string[];
}

// POST /v1/zones/export/pdf (body: zone_id XOR bbox; response: application/pdf blob)
export type ExportPdfRequest =
  | { zone_id: string; bbox?: never }
  | { bbox: string; zone_id?: never };

// Query params
export interface AtRiskParams {
  bbox?: Bbox;
  limit?: number;
  offset?: number;
}

export interface ZoneDetailParams {
  from?: string;
  to?: string;
}

export interface DashboardKpisParams {
  bbox: Bbox;
  period: BucketId;
}

export interface ZonesCompareParams {
  zone_ids: string[];
  indicators: Indicator[];
  period: BucketId;
}

/** Normalized error thrown by the API layer (see ../errors.ts). */
export interface ApiError {
  kind: 'validation' | 'not_found' | 'server' | 'network' | 'timeout' | 'unknown';
  status: number | null;
  message: string;
}
