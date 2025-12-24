import { test, expect, type Locator } from '@playwright/test';

test('homepage renders core sections and takes screenshot', async ({ page }) => {
  // Root should bootstrap the built app (manifest or fallback) and render About/Projects
  await page.goto('/', { waitUntil: 'domcontentloaded' });

  // Wait for main title and a couple of sections to ensure hydration
  await expect(page.getByRole('heading', { name: 'About Me' })).toBeVisible({ timeout: 15000 });
  await expect(page.getByRole('heading', { name: 'Projects' })).toBeVisible();
  await expect(page.getByText('Latest Updates')).toBeVisible();

  // Card presence: ensure at least one project card renders
  const cards = page.locator('[aria-label="Project"] , [data-testid="project-card"] , .group.relative.cursor-pointer');
  await expect(cards.first()).toBeVisible();

  const expectImageLoaded = async (locator: Locator, label: string) => {
    await expect(locator).toBeVisible();
    await expect.poll(
      async () =>
        locator.evaluate((img) => {
          const element = img as HTMLImageElement;
          return element.complete;
        }),
      { message: `Expected ${label} image to finish loading` }
    ).toBe(true);
    await expect.poll(
      async () =>
        locator.evaluate((img) => {
          const element = img as HTMLImageElement;
          return element.naturalWidth;
        }),
      { message: `Expected ${label} image to have natural width` }
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
    await expectImageLoaded(projectImages.nth(i), `project ${i + 1}`);
  }

  const latestSection = page.locator('#latest');
  await expect(latestSection.getByText('seogeo', { exact: false })).toBeVisible();
  await expect(latestSection.getByText('Blacksock', { exact: false })).toBeVisible();
  await expect(latestSection.getByText('Beauty Visual Inbox', { exact: false })).toBeVisible();
  await expect(latestSection.getByText('Dalshe', { exact: false })).toBeVisible();
  await expect(latestSection.getByText('Probes', { exact: false })).toBeVisible();

  // Capture screenshot for visual sanity check
  await page.screenshot({ path: 'test-results/home.png', fullPage: true });
});
