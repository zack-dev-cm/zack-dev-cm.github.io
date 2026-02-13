import type { PlaywrightTestConfig } from '@playwright/test';

const baseURL = process.env.PLAYWRIGHT_BASE_URL || 'http://127.0.0.1:4173';
const isLocalBase = baseURL.includes('127.0.0.1') || baseURL.includes('localhost');
const reuseExistingServer = process.env.PLAYWRIGHT_REUSE_SERVER === 'true';

const config: PlaywrightTestConfig = {
  testDir: './tests',
  retries: process.env.CI ? 1 : 0,
  use: {
    baseURL,
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure'
  },
  webServer: isLocalBase
    ? {
        // Serve repo root so GitHub Pages-style `/docs/*` assets resolve in local E2E.
        command: 'npm run build && python3 -m http.server 4173 --bind 127.0.0.1 --directory .',
        url: 'http://127.0.0.1:4173',
        timeout: 120_000,
        reuseExistingServer
      }
    : undefined
};

export default config;
