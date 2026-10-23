import { expect, test } from '@playwright/test';
import { signInThroughLanding } from '../fixtures/auth';

test.describe('smoke', () => {
  test('la landing affiche le hero et ses actions', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('heading', { level: 1 })).toContainText('Surveillez vos');
    await expect(page.getByRole('button', { name: 'Commencer gratuitement' })).toBeVisible();
  });

  test('la navbar de la landing mène au tableau de bord', async ({ page }) => {
    await page.goto('/');

    await page
      .getByRole('navigation', { name: 'Navigation principale' })
      .getByRole('button', { name: 'Se connecter' })
      .click();

    await expect(page).toHaveURL(/\/dashboard$/);
    await expect(page.getByRole('heading', { name: /Tableau de bord/ })).toBeVisible();
  });

  test('le tableau de bord est inaccessible sans session', async ({ page }) => {
    await page.goto('/dashboard');

    await expect(page).toHaveURL(/\/$/);
  });

  test('une route inconnue redirige vers la landing', async ({ page }) => {
    await page.goto('/route-qui-nexiste-pas');

    await expect(page).toHaveURL(/\/$/);
  });

  test('le CTA mène au tableau de bord puis la déconnexion revient à la landing', async ({
    page,
  }) => {
    await signInThroughLanding(page);

    await expect(page).toHaveURL(/\/dashboard$/);
    await expect(page.getByRole('heading', { name: /Tableau de bord/ })).toBeVisible();

    await page.getByRole('button', { name: 'Se deconnecter' }).click();

    await expect(page).toHaveURL(/\/$/);
  });
});
