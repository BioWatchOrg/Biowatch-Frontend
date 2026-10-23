/**
 * Formes de données consommées par la carte.
 *
 * La carte ne définit pas son propre contrat : elle reprend celui de `/v1` exposé par
 * `src/api`. Une zone de la carte est une zone renvoyée par `GET /v1/zones/at-risk`.
 */
export type { AtRiskZone as ZoneFeature, Bbox, ZoneGeometry } from '../../api';
