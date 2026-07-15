import type { PlaywrightTestConfig } from '@playwright/test';

process.env.PW_TEST_SCREENSHOT_NO_FONTS_READY ??= '1';

const baseURL = process.env.PLAYWRIGHT_BASE_URL || 'http://127.0.0.1:4173';
const parsedBaseURL = new URL(baseURL);
const isLocalBase = ['127.0.0.1', 'localhost'].includes(parsedBaseURL.hostname);
const localPort = Number(parsedBaseURL.port || 80);
if (isLocalBase && (!Number.isInteger(localPort) || localPort < 1 || localPort > 65535)) {
  throw new Error(`Invalid PLAYWRIGHT_BASE_URL port: ${parsedBaseURL.port}`);
}
const localBindHost = parsedBaseURL.hostname === 'localhost' ? '127.0.0.1' : parsedBaseURL.hostname;
const localServerCommand = `python3 -m http.server ${localPort} --bind ${localBindHost} --directory .`;
const reuseExistingServer = process.env.PLAYWRIGHT_REUSE_SERVER === 'true';
const skipBuild = process.env.PLAYWRIGHT_SKIP_BUILD === 'true';
const useSystemChrome = process.env.PLAYWRIGHT_USE_SYSTEM_CHROME === 'true';

const config: PlaywrightTestConfig = {
  testDir: './tests',
  timeout: 180_000,
  retries: process.env.CI ? 1 : 0,
  use: {
    baseURL,
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
    ...(useSystemChrome ? { channel: 'chrome' } : {})
  },
  webServer: isLocalBase
    ? {
        // Serve repo root so GitHub Pages-style `/docs/*` assets resolve in local E2E.
        command: skipBuild
          ? localServerCommand
          : `npm run build && ${localServerCommand}`,
        url: baseURL,
        timeout: 120_000,
        reuseExistingServer
      }
    : undefined
};

export default config;
