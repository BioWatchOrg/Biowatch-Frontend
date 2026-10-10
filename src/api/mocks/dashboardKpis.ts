import type { DashboardKpisResponse } from '../types';

// Fixed payload: the real endpoint aggregates over the bbox, the mock ignores the params.
export const mockGetDashboardKpis = (): DashboardKpisResponse => ({
  vegetation_coverage: { value: 41.2, previous: 43.8, delta_pct: -5.9 },
  ecological_trend: { value: -2.1, previous: -1.4, delta_pct: 50.0 },
});
