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

const gotoStandalone = async (page: Page, slug: string) => {
  const baseUrl = process.env.PLAYWRIGHT_BASE_URL || '';
  const [rawPath, rawQuery = ''] = slug.split('?');
  const standalonePath = rawPath.replace(/^\/|\/$/g, '');
  const suffix = rawQuery ? `?${rawQuery}` : '';
  const candidates = baseUrl.includes('pages.dev')
    ? [`/${standalonePath}/${suffix}`, `/docs/${standalonePath}/${suffix}`]
    : [`/docs/${standalonePath}/${suffix}`, `/${standalonePath}/${suffix}`, `/public/${standalonePath}/${suffix}`];

  for (const candidate of candidates) {
    const response = await page.goto(candidate, { waitUntil: 'domcontentloaded' });
    if (!response || response.status() < 400) {
      return;
    }
  }

  throw new Error(`Unable to load standalone page for slug "${slug}"`);
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
  const removedFreelanceMarketplaceHost = ['up', 'work', 'com'].join('.');
  await expect(page.locator(`a[href*="${removedFreelanceMarketplaceHost}"]`)).toHaveCount(0);
  await expect(page.getByRole('link', { name: 'X' }).first()).toHaveAttribute(
    'href',
    'https://x.com/Zackdevcv'
  );

  const clawHubSection = page.locator('#clawhub');
  await expect(clawHubSection.getByRole('heading', { name: 'Downloads Tracker' })).toBeVisible();
  await expect(clawHubSection.getByText('2,929')).toBeVisible();
  await expect(clawHubSection.getByText(/downloads across 11 public packages/i)).toBeVisible();

  const chromeStatsSection = page.locator('#chrome-stats');
  await expect(chromeStatsSection.getByRole('heading', { name: 'Extension Stats Tracker' })).toBeVisible();
  await expect(
    chromeStatsSection.locator('.proof-chip').filter({ hasText: 'publisher rollup users' }).locator('strong')
  ).toHaveText('188');
  await expect(chromeStatsSection.getByText('SourcePack Hub - Local AI Research Library')).toBeVisible();
  await expect(chromeStatsSection.getByRole('link', { name: 'JSON snapshot' })).toHaveAttribute(
    'href',
    '/docs/chrome-extension-stats.json'
  );

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
  await expect(latestSection.getByText('Dermaself Flutter Skin Analysis App', { exact: false })).toBeVisible();
  await expect(latestSection.getByText('SourcePack Chrome Extension Wave', { exact: false })).toBeVisible();
  await expect(latestSection.getByText('Trusted ClawHub Install Gate', { exact: false })).toBeVisible();
  await expect(latestSection.getByText('Google Drive File Provider Repair Toolkit', { exact: false })).toBeVisible();
  await expect(latestSection.getByText('GitHub + ClawHub Downloads Tracker', { exact: false })).toBeVisible();
  await expect(latestSection.getByText('Telegram Mini App Security Auditor', { exact: false })).toBeVisible();
  await expect(latestSection.getByText('Agentic Codex Dev Skill', { exact: false })).toBeVisible();
  await expect(latestSection.getByText('Session Rescue', { exact: false })).toBeVisible();
  await expect(latestSection.getByText('LocalArchive', { exact: false })).toBeVisible();
  await expect(latestSection.getByText('LocalLens Private AI Summaries', { exact: false })).toBeVisible();
  await expect(latestSection.getByText('OpenClaw Chinese Laoshi Ops', { exact: false })).toBeVisible();
  await expect(latestSection.getByText('Random Coffee Best Fit Outreach', { exact: false })).toBeVisible();
  await expect(latestSection.getByText('AntiRot', { exact: false })).toBeVisible();
  await expect(latestSection.getByText('Probes', { exact: false })).toBeVisible();

  const projectSearch = page.getByLabel('Search projects');
  await expect(projectSearch).toBeVisible();
  await expect(page.getByTestId('project-card').first().getByText('Open case study')).toBeVisible();

  await projectSearch.fill('session rescue');
  const sessionRescueCard = page.getByRole('button', { name: /Open project: Session Rescue/i });
  await expect(sessionRescueCard).toBeVisible();
  await sessionRescueCard.focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('dialog')).toBeVisible();
  await expect(page).toHaveURL(/\?project=session-rescue/);
  await expect(page.getByRole('dialog').getByRole('link', { name: 'View on Chrome Web Store' })).toHaveAttribute(
    'href',
    'https://chromewebstore.google.com/detail/session-rescue/hoklaadapaobdbkeiacebnnciponcmnf'
  );
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toBeHidden();

  await projectSearch.fill('localarchive');
  await expect(page.getByRole('button', { name: /Open project: LocalArchive/i })).toBeVisible();

  await projectSearch.fill('sourcepack chrome extension wave');
  const sourcePackCard = page.getByRole('button', { name: /Open project: SourcePack Chrome Extension Wave/i });
  await expect(sourcePackCard).toBeVisible();
  await sourcePackCard.click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await expect(page).toHaveURL(/\?project=sourcepack-chrome-extension-wave/);
  await expect(page.getByRole('dialog').getByText('Publisher users')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toBeHidden();

  await projectSearch.fill('file provider repair');
  const driveRepairCard = page.getByRole('button', { name: /Open project: Google Drive File Provider Repair Toolkit/i });
  await expect(driveRepairCard).toBeVisible();
  await driveRepairCard.click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await expect(page).toHaveURL(/\?project=google-drive-file-provider-repair-toolkit/);
  await expect(page.getByRole('dialog').getByText('Destructive data actions')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toBeHidden();

  await projectSearch.fill('');

  const realUsersFilter = page.getByRole('button', { name: /Real users/i });
  await realUsersFilter.click();
  await expect(realUsersFilter).toHaveAttribute('aria-pressed', 'true');
  await expect(
    page.getByRole('button', { name: /Open project: Dalshe – Circular Clothing Pickup Mini App/i })
  ).toHaveCount(0);

  await projectSearch.fill('probes');
  const probesCard = page.getByRole('button', { name: /Open project: Probes/i });
  await expect(probesCard).toBeVisible();
  await probesCard.click();

  const modal = page.getByRole('dialog');
  await expect(modal).toBeVisible();
  await expect(modal.getByRole('link', { name: 'View on GitHub' })).toHaveAttribute(
    'href',
    'https://github.com/zack-dev-cm/probes-oss'
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

test('project deep links open and close cleanly', async ({ page }) => {
  await page.goto('/?project=session-rescue', { waitUntil: 'domcontentloaded' });

  const modal = page.getByRole('dialog');
  await expect(modal).toBeVisible();
  await expect(modal.getByRole('heading', { name: 'Session Rescue' })).toBeVisible();

  await page.keyboard.press('Escape');
  await expect(modal).toBeHidden();
  await expect(page).not.toHaveURL(/project=session-rescue/);
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
    await projectSearch.fill('localarchive');

    const localArchiveCard = page.getByRole('button', {
      name: /Open project: LocalArchive/i
    });
    await expect(localArchiveCard).toBeVisible();

    const box = await localArchiveCard.boundingBox();
    expect(box?.width ?? 0).toBeLessThanOrEqual(390);

    await page.screenshot({ path: 'test-results/home-mobile.png', fullPage: true });
  });
});

test('clicking the sidebar name four times opens the hidden wind page', async ({ page }) => {
  await gotoPortfolio(page);

  const homeLink = page.getByRole('link', { name: 'Zakhar Pashkin' }).first();
  for (let i = 0; i < 4; i += 1) {
    await homeLink.click();
  }

  await expect(page).toHaveURL(/skill-wind/);
  await expect(page.getByRole('heading', { name: /The Wind Remembers/i })).toBeVisible();
});

test('skill wind standalone page renders across key responsive breakpoints', async ({ page }) => {
  const viewports = [
    { width: 360, height: 800 },
    { width: 390, height: 844 },
    { width: 768, height: 1024 },
    { width: 1280, height: 960 },
  ];

  for (const viewport of viewports) {
    await page.setViewportSize(viewport);
    await gotoStandalone(page, 'skill-wind');

    await expect(page).toHaveTitle('The Wind Remembers - Portfolio Cover');
    await expect(page.getByRole('heading', { name: /The Wind Remembers/i })).toBeVisible();
    await expect(page.locator('.cover-stage__signature')).not.toContainText(/Zakhar Pashkin/i);
    await expect(page.getByText(/Skills are never only procedures/i)).toBeVisible();
    await expect(page.locator('.cover-stage')).toBeVisible();
    await expect(page.locator('#wind-canvas')).toHaveCount(1);
    await expect
      .poll(async () =>
        page.locator('.cover-stage__image').evaluate((img) => (img as HTMLImageElement).naturalWidth)
      )
      .toBeGreaterThan(0);

    const coverBox = await page.locator('.cover-stage').boundingBox();
    expect(coverBox?.width ?? 0).toBeGreaterThan(Math.min(300, viewport.width - 80));
    expect(coverBox?.height ?? 0).toBeGreaterThan(320);
    const coverHeadingBox = await page.getByRole('heading', { name: /The Wind Remembers/i }).boundingBox();
    if (coverBox && coverHeadingBox) {
      expect(coverHeadingBox.x).toBeGreaterThanOrEqual(coverBox.x - 1);
      expect(coverHeadingBox.x + coverHeadingBox.width).toBeLessThanOrEqual(coverBox.x + coverBox.width + 1);
    }
    if (viewport.width >= 768 && coverBox) {
      expect(coverBox.width / coverBox.height).toBeGreaterThan(1.75);
      expect(coverBox.width / coverBox.height).toBeLessThan(2.02);
    }

    await expect
      .poll(async () => page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth), {
        message: `Expected no horizontal overflow on skill wind page at ${viewport.width}px`,
      })
      .toBeLessThanOrEqual(4);
  }

  await expect
    .poll(async () =>
      page.locator('#wind-canvas').evaluate((node) => {
        const canvas = node as HTMLCanvasElement;
        const context = canvas.getContext('2d');
        if (!context || canvas.width === 0 || canvas.height === 0) return false;
        const left = Math.floor(canvas.width * 0.2);
        const top = Math.floor(canvas.height * 0.2);
        const width = Math.max(1, Math.floor(canvas.width * 0.6));
        const height = Math.max(1, Math.floor(canvas.height * 0.6));
        const pixels = context.getImageData(left, top, width, height).data;
        for (let i = 3; i < pixels.length; i += 4) {
          if (pixels[i] > 8) return true;
        }
        return false;
      })
    )
    .toBe(true);

  await expect(page.getByRole('link', { name: 'Return to portfolio' })).toHaveAttribute(
    'href',
    'https://zack-dev-cm.github.io/'
  );

  await page.screenshot({ path: 'test-results/skill-wind.png', fullPage: true });
});

test('skill wind cover capture mode fills a social banner viewport', async ({ page }) => {
  await page.setViewportSize({ width: 1200, height: 627 });
  await gotoStandalone(page, 'skill-wind?cover=1');

  const coverStage = page.locator('.cover-stage');
  await expect(page.getByRole('heading', { name: /The Wind Remembers/i })).toBeVisible();
  await expect(page.locator('.cover-stage__signature')).not.toContainText(/Zakhar Pashkin/i);
  await expect(page.locator('.threshold__copy')).toBeHidden();

  const box = await coverStage.boundingBox();
  expect(Math.round(box?.width ?? 0)).toBe(1200);
  expect(Math.round(box?.height ?? 0)).toBe(627);

  await expect
    .poll(async () =>
      page.locator('.cover-stage__image').evaluate((img) => (img as HTMLImageElement).naturalWidth)
    )
    .toBeGreaterThan(0);

  await page.screenshot({ path: 'test-results/skill-wind-cover.png', fullPage: true });
});
