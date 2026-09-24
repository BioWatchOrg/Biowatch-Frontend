import type { Page } from '@playwright/test';

export const DEMO_USER = {
  email: 'demo@biowatch.fr',
  password: 'motdepasse-demo',
} as const;

// Parcours de connexion via l'UI. À remplacer par un storageState
// quand l'authentification backend sera branchée.
export async function loginThroughUi(page: Page, user = DEMO_USER): Promise<void> {
  await page.goto('/login');
  await page.getByLabel('Adresse email').fill(user.email);
  await page.getByLabel('Mot de passe').fill(user.password);
  await page.getByRole('button', { name: 'Se connecter' }).click();
}
