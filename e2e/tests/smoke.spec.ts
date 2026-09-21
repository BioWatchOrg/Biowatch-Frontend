import { expect, test } from '@playwright/test';
import { loginThroughUi } from '../fixtures/auth';

test.describe('smoke', () => {
  test('la landing affiche le hero et ses actions', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('heading', { level: 1 })).toContainText('Surveillez vos');
    await expect(page.getByRole('link', { name: 'Commencer gratuitement' })).toBeVisible();
  });

  test('la navbar de la landing mène à la connexion', async ({ page }) => {
    await page.goto('/');

    await page
      .getByRole('navigation', { name: 'Navigation principale' })
      .getByRole('link', { name: 'Se connecter' })
      .click();

    await expect(page).toHaveURL(/\/login$/);
    await expect(page.getByRole('heading', { name: 'Bon retour' })).toBeVisible();
  });

  test('une route inconnue redirige vers la connexion', async ({ page }) => {
    await page.goto('/route-qui-nexiste-pas');

    await expect(page).toHaveURL(/\/login$/);
  });

  test('la connexion mène au tableau de bord', async ({ page }) => {
    await loginThroughUi(page);

    await expect(page).toHaveURL(/\/dashboard$/);
    await expect(page.getByRole('heading', { name: /Tableau de bord/ })).toBeVisible();
  });
});
