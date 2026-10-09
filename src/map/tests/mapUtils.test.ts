import { describe, expect, it } from 'vitest';
import { bboxEquals, bboxToKey, boundsToBbox } from '../utils/bbox';
import { colorForScore, SCORE_STOPS, scoreColorExpression } from '../utils/colorScale';
import { zonesToFeatureCollection } from '../utils/geojson';
import { buildFixtureZones } from '../data/fixtureZones';
import type { Bbox, ZoneFeature } from '../data/types';

const bounds = (west: number, south: number, east: number, north: number) => ({
  getWest: () => west,
  getSouth: () => south,
  getEast: () => east,
  getNorth: () => north,
});

describe('boundsToBbox', () => {
  it('rend la bbox dans l ordre attendu par l API', () => {
    expect(boundsToBbox(bounds(2.25, 48.81, 2.42, 48.9))).toEqual([2.25, 48.81, 2.42, 48.9]);
  });

  it('arrondit pour que deux vues quasi identiques donnent la meme bbox', () => {
    expect(boundsToBbox(bounds(2.2500004, 48.81, 2.42, 48.9))).toEqual(
      boundsToBbox(bounds(2.2500009, 48.81, 2.42, 48.9)),
    );
  });

  it('ramene une longitude debordante dans [-180, 180]', () => {
    const [west, , east] = boundsToBbox(bounds(185, 10, 190, 20));
    expect(west).toBe(-175);
    expect(east).toBe(-170);
  });

  it('borne la latitude aux poles', () => {
    expect(boundsToBbox(bounds(0, -95, 10, 95))).toEqual([0, -90, 10, 90]);
  });
});

describe('bboxEquals', () => {
  it('distingue deux vues differentes et reconnait la meme', () => {
    const a: Bbox = [1, 2, 3, 4];
    expect(bboxEquals(a, [1, 2, 3, 4])).toBe(true);
    expect(bboxEquals(a, [1, 2, 3, 5])).toBe(false);
    expect(bboxEquals(a, null)).toBe(false);
    expect(bboxEquals(null, null)).toBe(false);
  });

  it('produit une cle de requete stable', () => {
    expect(bboxToKey([1, 2, 3, 4])).toBe('1,2,3,4');
  });
});

describe('colorForScore', () => {
  it('donne la couleur du palier atteint', () => {
    expect(colorForScore(0)).toBe(SCORE_STOPS[0].color);
    expect(colorForScore(39.9)).toBe(SCORE_STOPS[0].color);
    expect(colorForScore(40)).toBe(SCORE_STOPS[1].color);
    expect(colorForScore(85)).toBe(SCORE_STOPS[3].color);
  });

  it('annonce a MapLibre les memes paliers que la legende', () => {
    expect(scoreColorExpression()).toEqual([
      'step',
      ['get', 'score_global'],
      SCORE_STOPS[0].color,
      SCORE_STOPS[1].from,
      SCORE_STOPS[1].color,
      SCORE_STOPS[2].from,
      SCORE_STOPS[2].color,
      SCORE_STOPS[3].from,
      SCORE_STOPS[3].color,
    ]);
  });
});

describe('zonesToFeatureCollection', () => {
  const zone = (zone_id: string, withGeometry: boolean): ZoneFeature => ({
    zone_id,
    score_global: 42,
    geometry: withGeometry
      ? {
          type: 'Polygon',
          coordinates: [
            [
              [2, 48],
              [2.1, 48],
              [2.1, 48.1],
              [2, 48],
            ],
          ],
        }
      : undefined,
  });

  it('expose zone_id et score_global comme proprietes de la feature', () => {
    const { features } = zonesToFeatureCollection([zone('abc', true)]);
    expect(features).toHaveLength(1);
    expect(features[0]).toMatchObject({
      type: 'Feature',
      id: 'abc',
      properties: { zone_id: 'abc', score_global: 42 },
    });
  });

  it('ignore une zone sans geometrie plutot que de la placer au hasard', () => {
    const { features } = zonesToFeatureCollection([zone('a', false), zone('b', true)]);
    expect(features.map((f) => f.id)).toEqual(['b']);
  });
});

describe('buildFixtureZones', () => {
  const PARIS: Bbox = [2.25, 48.81, 2.42, 48.9];

  it('couvre la vue demandee', () => {
    expect(buildFixtureZones(PARIS).length).toBeGreaterThan(50);
  });

  it('redonne exactement les memes zones pour la meme vue', () => {
    expect(buildFixtureZones(PARIS)).toEqual(buildFixtureZones(PARIS));
  });

  it('produit des identifiants au format d un index H3 (15 caracteres hex)', () => {
    for (const zone of buildFixtureZones(PARIS).slice(0, 20)) {
      expect(zone.zone_id).toMatch(/^[0-9a-f]{15}$/);
    }
  });

  it('produit des hexagones fermes et des scores dans l echelle', () => {
    for (const zone of buildFixtureZones(PARIS).slice(0, 20)) {
      const ring = zone.geometry?.coordinates[0] ?? [];
      expect(ring).toHaveLength(7);
      expect(ring[0]).toEqual(ring[6]);
      expect(zone.score_global).toBeGreaterThanOrEqual(0);
      expect(zone.score_global).toBeLessThanOrEqual(100);
    }
  });

  it('ne produit rien pour une vue vide ou inversee', () => {
    expect(buildFixtureZones([2.4, 48.9, 2.25, 48.81])).toEqual([]);
  });
});
