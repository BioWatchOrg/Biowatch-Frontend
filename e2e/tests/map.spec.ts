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

test.beforeEach(async ({ page }) => {
  await page.route('**/basemaps.cartocdn.com/**', (route) =>
    route.fulfill({ json: OFFLINE_STYLE }),
  );
});

test('la carte affiche les cellules et sa legende', async ({ page }) => {
  await page.goto('/carte');

  await expect(page.getByRole('heading', { name: 'Carte du stress ecologique' })).toBeVisible();

  const canvas = page.locator('canvas.maplibregl-canvas');
  await expect(canvas).toBeVisible();
  // Un canvas de hauteur nulle rendrait une carte invisible tout en passant les autres assertions.
  await expect.poll(async () => (await canvas.boundingBox())?.height ?? 0).toBeGreaterThan(300);

  await expect(
    page.getByRole('region', { name: 'Echelle du score de stress ecologique' }),
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
