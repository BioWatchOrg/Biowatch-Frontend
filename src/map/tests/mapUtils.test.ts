import { afterEach, describe, expect, it } from 'vitest';
import { bboxEquals, bboxToKey, boundsToBbox } from '../utils/bbox';
import {
  resolveCssToken,
  SCORE_STOPS,
  scoreColorExpression,
  stopForScore,
  tokenColor,
} from '../utils/colorScale';
import { zonesToFeatureCollection } from '../utils/geojson';
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

  it('demande toutes les longitudes quand la vue couvre plus que le globe', () => {
    expect(boundsToBbox(bounds(-250, -60, 230, 70))).toEqual([-180, -60, 180, 70]);
  });

  it('demande toutes les longitudes quand la vue chevauche l antimeridien', () => {
    expect(boundsToBbox(bounds(170, -20, 190, 10))).toEqual([-180, -20, 180, 10]);
  });

  it('garde une vue qui s arrete pile sur l antimeridien', () => {
    expect(boundsToBbox(bounds(170, -20, 180, 10))).toEqual([170, -20, 180, 10]);
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

describe('stopForScore', () => {
  it('donne le palier atteint', () => {
    expect(stopForScore(0)).toBe(SCORE_STOPS[0]);
    expect(stopForScore(39.9)).toBe(SCORE_STOPS[0]);
    expect(stopForScore(40)).toBe(SCORE_STOPS[1]);
    expect(stopForScore(85)).toBe(SCORE_STOPS[3]);
  });
});

describe('couleurs du score', () => {
  afterEach(() => {
    document.documentElement.removeAttribute('style');
  });

  it('annonce a MapLibre les memes paliers que la legende', () => {
    const resolve = (token: string) => `resolved${token}`;
    expect(scoreColorExpression(resolve)).toEqual([
      'step',
      ['get', 'score_global'],
      `resolved${SCORE_STOPS[0].token}`,
      SCORE_STOPS[1].from,
      `resolved${SCORE_STOPS[1].token}`,
      SCORE_STOPS[2].from,
      `resolved${SCORE_STOPS[2].token}`,
      SCORE_STOPS[3].from,
      `resolved${SCORE_STOPS[3].token}`,
    ]);
  });

  it('ne recopie aucune couleur : chaque palier pointe une variable --score-*', () => {
    for (const stop of SCORE_STOPS) {
      expect(stop.token).toMatch(/^--score-/);
    }
    expect(tokenColor('--score-low')).toBe('var(--score-low)');
  });

  it('lit la valeur calculee de la variable CSS', () => {
    document.documentElement.style.setProperty('--score-low', ' #34c759 ');
    expect(resolveCssToken('--score-low')).toBe('#34c759');
  });

  it('echoue si la variable est absente plutot que d inventer une couleur', () => {
    expect(() => resolveCssToken('--score-absent')).toThrowError(/--score-absent/);
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
