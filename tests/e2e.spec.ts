import { test, expect, type Locator, type Page } from '@playwright/test';

const gotoPortfolio = async (page: Page) => {
  const baseUrl = process.env.PLAYWRIGHT_BASE_URL || '';
  const isCloudflare = baseUrl.includes('pages.dev');
  const expectedPath = isCloudflare ? '/docs/' : '/';

  const response = await page.goto(expectedPath, { waitUntil: 'domcontentloaded' });
  if (isCloudflare && response && response.status() >= 400) {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
  }
};

test('homepage renders core sections and project discovery controls', async ({ page }) => {
  await gotoPortfolio(page);

  // Wait for main title and a couple of sections to ensure hydration
  await expect(page.getByRole('heading', { name: 'About Me' })).toBeVisible({ timeout: 15000 });
  await expect(page.getByRole('heading', { name: 'Projects', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Latest Updates' })).toBeVisible();

  // Card presence: ensure at least one project card renders
  const cards = page.getByTestId('project-card');
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
  await expect(latestSection.getByText('Probes', { exact: false })).toBeVisible();

  const projectSearch = page.getByLabel('Search projects');
  await expect(projectSearch).toBeVisible();

  const realUsersFilter = page.getByRole('button', { name: /Real users/i });
  await realUsersFilter.click();
  await expect(realUsersFilter).toHaveAttribute('aria-pressed', 'true');
  await expect(
    page.getByRole('button', { name: /Open project: Dalshe – Circular Clothing Pickup Mini App/i })
  ).toHaveCount(0);

  await projectSearch.fill('pr0bes_bot');
  const probesCard = page.getByRole('button', { name: /Open project: Probes/i });
  await expect(probesCard).toBeVisible();
  await probesCard.click();

  const modal = page.getByRole('dialog');
  await expect(modal).toBeVisible();
  await expect(modal.getByRole('link', { name: 'Telegram Bot' })).toHaveAttribute(
    'href',
    'https://t.me/pr0bes_bot'
  );
  await page.keyboard.press('Escape');
  await expect(modal).toBeHidden();

  // Capture screenshot for visual sanity check
  await page.screenshot({ path: 'test-results/home.png', fullPage: true });
});

test.describe('mobile', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test('project explorer stays usable on mobile without horizontal overflow', async ({ page }) => {
    await gotoPortfolio(page);

    await page.locator('#projects').scrollIntoViewIfNeeded();

    await expect
      .poll(async () => {
        return page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      })
      .toBeLessThanOrEqual(4);

    const projectSearch = page.getByLabel('Search projects');
    await projectSearch.fill('calorio');

    const calorioCard = page.getByRole('button', {
      name: /Open project: Dishes Recognition & Nutrition Goals Telegram Bot/i
    });
    await expect(calorioCard).toBeVisible();

    const box = await calorioCard.boundingBox();
    expect(box?.width ?? 0).toBeLessThanOrEqual(390);

    await page.screenshot({ path: 'test-results/home-mobile.png', fullPage: true });
  });
});
