import { test, expect, type Locator } from '@playwright/test';

test('homepage renders core sections and takes screenshot', async ({ page }) => {
  const baseUrl = process.env.PLAYWRIGHT_BASE_URL || '';
  const isCloudflare = baseUrl.includes('pages.dev');
  const expectedPath = isCloudflare ? '/docs/' : '/';

  const response = await page.goto(expectedPath, { waitUntil: 'domcontentloaded' });
  if (isCloudflare && response && response.status() >= 400) {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
  }

  // Wait for main title and a couple of sections to ensure hydration
  await expect(page.getByRole('heading', { name: 'About Me' })).toBeVisible({ timeout: 15000 });
  await expect(page.getByRole('heading', { name: 'Projects', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Latest Updates' })).toBeVisible();

  // Card presence: ensure at least one project card renders
  const cards = page.locator('[aria-label="Project"], [data-testid="project-card"], .project-card');
  await expect(cards.first()).toBeVisible();

  const expectImageLoaded = async (locator: Locator, label: string, timeoutMs = 10000) => {
    await expect(locator).toBeVisible();
    await locator.scrollIntoViewIfNeeded();
    await expect.poll(
      async () =>
        locator.evaluate((img) => {
          const element = img as HTMLImageElement;
          return element.naturalWidth;
        }),
      { message: `Expected ${label} image to have natural width`, timeout: timeoutMs }
    ).toBeGreaterThan(0);
  };

  const logoImages = page.locator('#experience img');
  const logoCount = await logoImages.count();
  expect(logoCount).toBeGreaterThan(0);
  for (let i = 0; i < Math.min(3, logoCount); i += 1) {
    await expectImageLoaded(logoImages.nth(i), `logo ${i + 1}`);
  }

  const projectImages = page.locator('#projects img');
  const projectCount = await projectImages.count();
  expect(projectCount).toBeGreaterThan(0);
  for (let i = 0; i < Math.min(3, projectCount); i += 1) {
    await expectImageLoaded(projectImages.nth(i), `project ${i + 1}`, 15000);
  }

  const latestSection = page.locator('#latest');
  await expect(page.locator('#featured').getByText('AntiRot', { exact: false })).toBeVisible();
  await expect(latestSection.getByText('AntiRot', { exact: false })).toBeVisible();
  await expect(latestSection.getByText('seogeo', { exact: false })).toBeVisible();
  await expect(latestSection.getByText('Blacksock', { exact: false })).toBeVisible();
  await expect(latestSection.getByText('Beauty Visual Inbox', { exact: false })).toBeVisible();
  await expect(latestSection.getByText('Dalshe', { exact: false })).toBeVisible();
  await expect(latestSection.getByText('Probes', { exact: false })).toBeVisible();

  // Capture screenshot for visual sanity check
  await page.screenshot({ path: 'test-results/home.png', fullPage: true });
});
