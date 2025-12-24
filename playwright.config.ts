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
        command: 'npm run preview -- --host --port 4173',
        url: 'http://127.0.0.1:4173',
        timeout: 120_000,
        reuseExistingServer
      }
    : undefined
};

export default config;
