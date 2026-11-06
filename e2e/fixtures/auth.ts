import type { Page } from '@playwright/test';

// Auth factice : le CTA de la landing connecte l'utilisateur et ouvre le tableau de bord.
// À remplacer par un storageState quand Firebase sera branché.
export async function signInThroughLanding(page: Page): Promise<void> {
  await page.goto('/');
  await page.getByRole('button', { name: 'Commencer gratuitement' }).click();
}
