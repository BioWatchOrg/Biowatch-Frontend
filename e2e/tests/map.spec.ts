import { expect, test } from '@playwright/test';

/**
 * Le fond de carte est servi par un tiers (CARTO). On le remplace par un style minimal
 * local : le test reste vert sans réseau et ne casse pas si le fournisseur est lent.
 * Ce qu'on vérifie ici est notre code — carte montée, cellules chargées, légende lisible.
 */
const OFFLINE_STYLE = {
  version: 8,
  sources: {},
  layers: [{ id: 'background', type: 'background', paint: { 'background-color': '#eeeae3' } }],
};

/**
 * `apps/api` n'expose encore aucun endpoint et la CI ne force pas `VITE_USE_MOCKS` :
 * on répond à sa place, au format du contrat `/v1`. Le chemin réseau réel (axios) est
 * donc bien exercé, seule la réponse est simulée.
 */
const hexagon = (lng: number, lat: number) => {
  const ring = Array.from({ length: 6 }, (_, i) => {
    const angle = (Math.PI / 3) * i + Math.PI / 6;
    return [lng + 0.01 * Math.cos(angle), lat + 0.007 * Math.sin(angle)];
  });
  return { type: 'Polygon', coordinates: [[...ring, ring[0]]] };
};

const AT_RISK_RESPONSE = {
  total: 2,
  limit: 200,
  offset: 0,
  results: [
    { zone_id: '881f1d4a0001fff', score_global: 85, geometry: hexagon(2.35, 48.86) },
    { zone_id: '881f1d4a0002fff', score_global: 30, geometry: hexagon(2.37, 48.86) },
  ],
};

test.beforeEach(async ({ page }) => {
  await page.route('**/basemaps.cartocdn.com/**', (route) =>
    route.fulfill({ json: OFFLINE_STYLE }),
  );
  await page.route('**/v1/zones/at-risk**', (route) => route.fulfill({ json: AT_RISK_RESPONSE }));
});

test('la carte affiche les cellules et sa legende', async ({ page }) => {
  await page.goto('/carte');

  await expect(page.getByRole('heading', { name: 'Carte du stress écologique' })).toBeVisible();

  const canvas = page.locator('canvas.maplibregl-canvas');
  await expect(canvas).toBeVisible();
  // Un canvas de hauteur nulle rendrait une carte invisible tout en passant les autres assertions.
  await expect.poll(async () => (await canvas.boundingBox())?.height ?? 0).toBeGreaterThan(300);

  await expect(
    page.getByRole('region', { name: 'Échelle du score de stress écologique' }),
  ).toBeVisible();

  // Le chargement des zones se termine : plus d'indicateur, et aucun bandeau d'erreur.
  await expect(page.getByRole('status')).toHaveCount(0);
  await expect(page.getByRole('alert')).toHaveCount(0);
});

test('le tableau de bord mene a la carte', async ({ page }) => {
  await page.goto('/dashboard');
  await page.getByRole('link', { name: 'Voir la carte' }).click();

  await expect(page).toHaveURL(/\/carte$/);
});
