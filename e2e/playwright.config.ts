import { defineConfig, devices } from '@playwright/test';

const isCI = Boolean(process.env.CI);

// Port de `vite preview` en CI (build réel), de `vite` en local.
const LOCAL_PORT = isCI ? 4173 : 5173;
const LOCAL_URL = `http://localhost:${LOCAL_PORT}`;

// E2E_BASE_URL permet de viser un environnement déjà déployé :
// dans ce cas, aucun serveur local n'est démarré.
const externalBaseUrl = process.env.E2E_BASE_URL;

// Chromium seul par défaut (CI rapide). E2E_ALL_BROWSERS=1 ajoute Firefox et WebKit.
const runAllBrowsers = process.env.E2E_ALL_BROWSERS === '1';

const extraBrowsers = runAllBrowsers
  ? [
      { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
      { name: 'webkit', use: { ...devices['Desktop Safari'] } },
    ]
  : [];

export default defineConfig({
  testDir: './tests',
  outputDir: '../test-results',
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  workers: isCI ? 1 : undefined,
  reporter: isCI
    ? [['github'], ['html', { outputFolder: '../playwright-report', open: 'never' }]]
    : [['list'], ['html', { outputFolder: '../playwright-report', open: 'never' }]],
  use: {
    baseURL: externalBaseUrl ?? LOCAL_URL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }, ...extraBrowsers],
  webServer: externalBaseUrl
    ? undefined
    : {
        command: isCI ? 'npm run build && npm run preview' : 'npm run dev',
        cwd: '..',
        url: LOCAL_URL,
        reuseExistingServer: !isCI,
        timeout: 120_000,
      },
});
