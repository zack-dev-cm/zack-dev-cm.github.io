import { test, expect, type Locator, type Page } from '@playwright/test';

const gotoPortfolio = async (page: Page) => {
  const baseUrl = process.env.PLAYWRIGHT_BASE_URL || '';
  const isCloudflare = baseUrl.includes('pages.dev');
  const expectedPath = isCloudflare ? '/' : '/';

  const response = await page.goto(expectedPath, { waitUntil: 'domcontentloaded' });
  if (isCloudflare && response && response.status() >= 400) {
    await page.goto('/docs/', { waitUntil: 'domcontentloaded' });
  }
};

const resumePath = () => {
  const baseUrl = process.env.PLAYWRIGHT_BASE_URL || '';
  return baseUrl.includes('pages.dev')
    ? '/resume/zakhar-pashkin-ai-product-engineer-resume.pdf'
    : '/docs/resume/zakhar-pashkin-ai-product-engineer-resume.pdf';
};

test('homepage renders core sections and project discovery controls', async ({ page }) => {
  await gotoPortfolio(page);

  // Wait for main title and a couple of sections to ensure hydration
  await expect(page.getByRole('heading', { name: 'About Me' })).toBeVisible({ timeout: 15000 });
  await expect(page.getByRole('heading', { name: 'Projects', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Latest Updates' })).toBeVisible();

  const resumeLink = page.getByRole('link', { name: /Download resume/i }).first();
  await expect(resumeLink).toBeVisible();
  await expect(resumeLink).toHaveAttribute('href', resumePath());
  const resumeResponse = await page.request.get(resumePath());
  expect(resumeResponse.status()).toBe(200);
  expect(resumeResponse.headers()['content-type']).toContain('application/pdf');

  await expect(page.getByRole('link', { name: 'LinkedIn' }).first()).toHaveAttribute(
    'href',
    'https://www.linkedin.com/in/zakhar-pashkin-a524a6163/'
  );

  const clawHubSection = page.locator('#clawhub');
  await expect(clawHubSection.getByRole('heading', { name: 'Downloads Tracker' })).toBeVisible();
  await expect(clawHubSection.getByText('1,349')).toBeVisible();
  await expect(clawHubSection.getByText(/downloads across 10 public packages/i)).toBeVisible();

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
  await expect(page.locator('#featured').getByText('GitHub + ClawHub Downloads Tracker', { exact: false })).toBeVisible();
  await expect(latestSection.getByText('GitHub + ClawHub Downloads Tracker', { exact: false })).toBeVisible();
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

test('featured cards stay inside their own bounds on desktop breakpoints', async ({ page }) => {
  const viewports = [
    { width: 1100, height: 900 },
    { width: 1200, height: 900 },
    { width: 1280, height: 900 },
    { width: 1440, height: 900 },
    { width: 1600, height: 900 },
  ];

  for (const viewport of viewports) {
    await page.setViewportSize(viewport);
    await gotoPortfolio(page);
    await page.locator('#featured').scrollIntoViewIfNeeded();

    await expect
      .poll(async () => page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth), {
        message: `Expected no horizontal overflow at ${viewport.width}px`,
      })
      .toBeLessThanOrEqual(4);

    const issues = await page.locator('.featured-card').evaluateAll((cards) => {
      const tolerance = 1;
      const rects = cards.map((card, index) => {
        const cardRect = card.getBoundingClientRect();
        const rect = {
          left: cardRect.left,
          right: cardRect.right,
          top: cardRect.top,
          bottom: cardRect.bottom,
        };
        const childOverflow = Array.from(card.children).some((child) => {
          const childRect = child.getBoundingClientRect();
          return (
            childRect.left < rect.left - tolerance ||
            childRect.right > rect.right + tolerance ||
            childRect.top < rect.top - tolerance ||
            childRect.bottom > rect.bottom + tolerance
          );
        });
        return { index, rect, childOverflow };
      });

      const failures: string[] = [];
      for (const item of rects) {
        if (item.childOverflow) {
          failures.push(`card ${item.index} child escapes card bounds`);
        }
      }

      for (let i = 0; i < rects.length; i += 1) {
        for (let j = i + 1; j < rects.length; j += 1) {
          const a = rects[i].rect;
          const b = rects[j].rect;
          const overlapsX = Math.max(0, Math.min(a.right, b.right) - Math.max(a.left, b.left));
          const overlapsY = Math.max(0, Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top));
          if (overlapsX > tolerance && overlapsY > tolerance) {
            failures.push(`card ${i} overlaps card ${j}`);
          }
        }
      }
      return failures;
    });

    expect(issues, `Featured card layout issues at ${viewport.width}px`).toEqual([]);

    const objectFits = await page.locator('.featured-card__asset').evaluateAll((assets) =>
      assets.map((asset) => window.getComputedStyle(asset).objectFit)
    );
    expect(objectFits.every((value) => value === 'contain')).toBe(true);
  }
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
