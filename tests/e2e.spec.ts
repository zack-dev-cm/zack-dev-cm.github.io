import { test, expect, type Locator, type Page } from '@playwright/test';
import { CHROME_EXTENSION_STATS, CLAWHUB_DOWNLOAD_STATS, OPEN_SOURCE_CONTRIBUTIONS } from '../constants';

const clawHubDownloadTotal = CLAWHUB_DOWNLOAD_STATS.reduce((sum, stat) => sum + stat.downloads, 0);
const clawHubDownloadText = clawHubDownloadTotal.toLocaleString('en-US');
const clawHubSkillCount = CLAWHUB_DOWNLOAD_STATS.length;

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

const requestFirstOk = async (page: Page, paths: string[]) => {
  for (const candidate of paths) {
    const response = await page.request.get(candidate);
    if (response.status() < 400) return response;
  }

  throw new Error(`No request candidate returned OK: ${paths.join(', ')}`);
};

test('SEO and answer-engine signals stay focused above the fold', async ({ page }) => {
  const consoleErrors: string[] = [];
  const pageErrors: string[] = [];
  page.on('console', (message) => {
    if (message.type() === 'error') consoleErrors.push(message.text());
  });
  page.on('pageerror', (error) => pageErrors.push(error.message));

  await page.setViewportSize({ width: 1440, height: 900 });
  await gotoPortfolio(page);

  await expect(page).toHaveTitle('Zakhar Pashkin | Computer Vision and AI Product Engineer');
  const h1 = page.getByRole('heading', { level: 1 });
  await expect(h1).toHaveCount(1);
  await expect(h1).toHaveText('Zakhar Pashkin is a computer vision and AI product engineer.');
  await expect(h1).toBeInViewport();

  const layout = await page.evaluate(() => {
    const intro = document.getElementById('intro');
    const experience = document.getElementById('experience');
    const heading = document.querySelector('h1');
    if (!intro || !experience || !heading) return null;
    return {
      introTop: intro.getBoundingClientRect().top,
      experienceTop: experience.getBoundingClientRect().top,
      h1Top: heading.getBoundingClientRect().top,
      viewportHeight: window.innerHeight,
      overflow: document.documentElement.scrollWidth - window.innerWidth
    };
  });
  expect(layout).not.toBeNull();
  if (!layout) throw new Error('Missing SEO layout metrics');
  expect(layout.introTop).toBeLessThan(layout.experienceTop);
  expect(layout.h1Top).toBeLessThan(layout.viewportHeight * 0.35);
  expect(layout.overflow).toBeLessThanOrEqual(4);

  const heroCopy = await page.locator('#intro').innerText();
  expect(heroCopy).toMatch(/OCR/i);
  expect(heroCopy).toMatch(/segmentation/i);
  expect(heroCopy).toMatch(/multimodal retrieval/i);
  expect(heroCopy).toMatch(/model-serving APIs/i);

  const metaDescription = (await page.locator('meta[name="description"]').getAttribute('content')) || '';
  expect(metaDescription.length).toBeGreaterThan(80);
  expect(metaDescription.length).toBeLessThanOrEqual(170);
  expect(metaDescription).toMatch(/computer vision/i);
  expect(metaDescription).toMatch(/OCR|segmentation|multimodal/i);
  await expect(page.locator('meta[name="keywords"]')).toHaveCount(0);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://zack-dev-cm.github.io/');

  const sitemapResponse = await requestFirstOk(page, ['/docs/sitemap.xml', '/sitemap.xml']);
  const sitemap = await sitemapResponse.text();
  const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
  expect(locs.length).toBeLessThanOrEqual(25);
  expect(locs.filter((url) => /\.(?:json|jsonld|txt)$/i.test(url))).toHaveLength(0);
  expect(locs.filter((url) => /\.md$/i.test(url))).toHaveLength(0);
  expect(locs.filter((url) => /\/projects\/[^/]+\/$/i.test(url)).length).toBeGreaterThanOrEqual(10);
  const projectResponse = await page.request.get('/docs/projects/fast-ocr-onnx-inference-server/');
  expect(projectResponse.status()).toBe(200);
  const projectHtml = await projectResponse.text();
  expect(projectHtml).toContain('<h1>Fast OCR ONNX Inference Server</h1>');
  expect(projectHtml).toContain('<link rel="canonical" href="https://zack-dev-cm.github.io/projects/fast-ocr-onnx-inference-server/"');
  expect(projectHtml).toContain('<link rel="alternate" type="text/markdown"');
  expect(projectHtml).toContain('<meta property="og:image" content="https://zack-dev-cm.github.io/docs/images/fast-ocr-onnx-inference-card.webp" />');
  expect(projectHtml).toContain('<meta name="twitter:image" content="https://zack-dev-cm.github.io/docs/images/fast-ocr-onnx-inference-card.webp" />');

  const poresResponse = await page.request.get('/docs/projects/pores-wrinkles-detection-service/');
  expect(poresResponse.status()).toBe(200);
  const poresHtml = await poresResponse.text();
  expect(poresHtml).toContain('<meta property="og:image" content="https://zack-dev-cm.github.io/docs/images/face-texture-analysis-service-card.webp" />');

  const wrinkleLabResponse = await page.request.get('/docs/projects/full-face-wrinkle-and-skin-texture-segmentation-lab/');
  expect(wrinkleLabResponse.status()).toBe(200);
  const wrinkleLabHtml = await wrinkleLabResponse.text();
  expect(wrinkleLabHtml).toContain('<meta property="og:image" content="https://zack-dev-cm.github.io/docs/images/full-face-wrinkle-segmentation-lab-card.webp" />');

  const discoveryResponse = await requestFirstOk(page, ['/docs/agent-discovery.json', '/agent-discovery.json']);
  const discovery = await discoveryResponse.json();
  expect(discovery.answerTargets.length).toBeGreaterThanOrEqual(8);
  expect(discovery.serviceSignals.length).toBeGreaterThanOrEqual(4);

  const schemaResponse = await requestFirstOk(page, ['/docs/schema.jsonld', '/schema.jsonld']);
  const schema = await schemaResponse.json();
  const graph = (Array.isArray(schema['@graph']) ? schema['@graph'] : []) as Array<Record<string, unknown>>;
  const schemaTypes = new Set(
    graph.flatMap((node) => {
      const type = node['@type'];
      if (Array.isArray(type)) return type.filter((item): item is string => typeof item === 'string');
      return typeof type === 'string' ? [type] : [];
    })
  );
  for (const requiredType of ['Person', 'WebSite', 'WebPage', 'ProfilePage', 'FAQPage', 'Service', 'ItemList']) {
    expect(schemaTypes.has(requiredType), `schema.jsonld should include ${requiredType}`).toBe(true);
  }

  await page.setViewportSize({ width: 390, height: 844 });
  await gotoPortfolio(page);
  await expect(page.getByRole('heading', { level: 1 })).toBeInViewport();
  await expect
    .poll(async () => page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth), {
      message: 'Expected SEO hero to avoid mobile horizontal overflow'
    })
    .toBeLessThanOrEqual(4);

  expect(pageErrors).toEqual([]);
  expect(consoleErrors).toEqual([]);
});

test('homepage renders core sections and project discovery controls', async ({ page }) => {
  test.setTimeout(180_000);
  await gotoPortfolio(page);

  // Wait for main title and a couple of sections to ensure hydration
  await expect(page.getByRole('heading', { name: 'About Me' })).toBeVisible({ timeout: 15000 });
  await expect(page.getByRole('heading', { name: 'Computer Vision Systems' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'AI Product and Release Systems' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Projects', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Latest Updates' })).toBeVisible();

  const resumeLink = page.getByRole('link', { name: /Download resume/i }).first();
  await expect(resumeLink).toBeVisible();
  await expect(resumeLink).toHaveAttribute('href', resumePath());
  const resumeResponse = await page.request.get(resumePath());
  expect(resumeResponse.status()).toBe(200);
  expect(resumeResponse.headers()['content-type']).toContain('application/pdf');
  const agentDiscoveryResponse = await page.request.get('/docs/agent-discovery.json');
  expect(agentDiscoveryResponse.status()).toBe(200);
  expect(agentDiscoveryResponse.headers()['content-type']).toMatch(/application\/json|text\/plain|octet-stream/);
  const agentDiscovery = await agentDiscoveryResponse.json();
  expect(agentDiscovery.entity.name).toBe('Zakhar Pashkin');
  expect(agentDiscovery.answerTargets.length).toBeGreaterThanOrEqual(4);

  await expect(page.getByRole('link', { name: 'LinkedIn' }).first()).toHaveAttribute(
    'href',
    'https://de.linkedin.com/in/zakhar-pashkin-a524a6163'
  );
  const removedFreelanceMarketplaceHost = ['up', 'work', 'com'].join('.');
  await expect(page.locator(`a[href*="${removedFreelanceMarketplaceHost}"]`)).toHaveCount(0);
  await expect(page.getByRole('link', { name: 'X' }).first()).toHaveAttribute(
    'href',
    'https://x.com/Zackdevcv'
  );

  const clawHubSection = page.locator('#clawhub');
  await expect(clawHubSection.getByRole('heading', { name: 'Downloads Tracker' })).toBeVisible();
  await expect(clawHubSection.getByText(clawHubDownloadText)).toBeVisible();
  await expect(clawHubSection.getByText(new RegExp(`downloads across ${clawHubSkillCount} public skills`, 'i'))).toBeVisible();

  const chromeStatsSection = page.locator('#chrome-stats');
  await expect(chromeStatsSection.getByRole('heading', { name: 'Extension Stats Tracker' })).toBeVisible();
  await expect(
    chromeStatsSection.locator('.metric-chip').filter({ hasText: 'reported users as of' }).locator('strong')
  ).toHaveText(CHROME_EXTENSION_STATS.totalUsers.toLocaleString('en-US'));
  await expect(chromeStatsSection.getByText('GitHub Repo Summarizer')).toBeVisible();
  await expect(chromeStatsSection.getByRole('link', { name: 'JSON snapshot' })).toHaveAttribute(
    'href',
    '/docs/chrome-extension-stats.json'
  );

  await expect(page.locator('#field-notes')).toHaveCount(0);
  await expect(page.locator('#trend-blog')).toHaveCount(0);
  await expect(page.locator('a[href="#field-notes"]')).toHaveCount(0);
  await expect(page.locator('a[href="#trend-blog"]')).toHaveCount(0);
  await expect(page.getByText('Trend-to-Skill Blog System')).toHaveCount(0);

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

  const contributedSection = page.locator('#contributed-to');
  await expect(contributedSection.getByRole('heading', { name: 'Contributed To' })).toBeVisible();
  await expect(contributedSection.getByRole('link')).toHaveCount(OPEN_SOURCE_CONTRIBUTIONS.length);
  await expect(contributedSection.getByText(/Merged PR|Open PR|Issue comment|Issue/)).toHaveCount(0);
  await expect(contributedSection.getByText(/Real GitHub organizations/i)).toHaveCount(0);
  for (const contribution of OPEN_SOURCE_CONTRIBUTIONS) {
    await expect(contributedSection.getByRole('link', { name: contribution.name })).toBeVisible();
  }

  const projectImages = page.locator('#projects img');
  const projectCount = await projectImages.count();
  expect(projectCount).toBeGreaterThan(0);
  for (let i = 0; i < Math.min(3, projectCount); i += 1) {
    await expectImageLoaded(projectImages.nth(i), `project ${i + 1}`, 15000);
  }

  const latestSection = page.locator('#latest');
  await expect(page.locator('#featured').getByText('GitHub + ClawHub Downloads Tracker', { exact: false })).toBeVisible();
  await expect(latestSection.getByText('Computer Vision and AI Systems Refresh', { exact: false })).toBeVisible();
  await expect(latestSection.getByText('Marketplace Stats Refresh', { exact: false })).toBeVisible();
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
  await expect(page.locator('input[type="search"]')).toHaveCount(1);
  await expect(page.locator('#projects input[type="search"]')).toHaveCount(0);
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
  await expect(page.getByRole('dialog').getByText('Current publisher users')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toBeHidden();

  await projectSearch.fill('fast ocr');
  await page.evaluate(() => {
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: {
        writeText: async (text: string) => {
          (window as Window & { __copiedText?: string }).__copiedText = text;
        }
      }
    });
  });
  const fastOcrCard = page.getByRole('button', { name: /Open project: Fast OCR ONNX Inference Server/i });
  await expect(fastOcrCard).toBeVisible();
  await fastOcrCard.click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await expect(page).toHaveURL(/\?project=fast-ocr-onnx-inference-server/);
  await expect(page.getByRole('dialog').getByText('Rendered flowchart')).toBeVisible();
  await expect(page.getByRole('dialog').getByTestId('mermaid-visual')).toBeVisible();
  await expect(page.getByRole('dialog').getByText('Mermaid source')).toBeVisible();
  await page.getByRole('dialog').getByRole('button', { name: 'Copy project link' }).click();
  const copiedProjectUrl = await page.evaluate(() => (window as Window & { __copiedText?: string }).__copiedText || '');
  const copiedProjectPath = new URL(copiedProjectUrl).pathname;
  expect(copiedProjectPath).toBe('/projects/fast-ocr-onnx-inference-server/');
  expect(copiedProjectUrl).not.toContain('?project=');
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toBeHidden();

  await projectSearch.fill('architectural drawing catalog reception');
  const architectureCard = page.getByRole('button', { name: /Open project: Architectural Drawing and Interior Catalog Matching/i });
  await expect(architectureCard).toBeVisible();
  await architectureCard.click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await expect(page).toHaveURL(/\?project=architectural-drawing-and-interior-catalog-matching/);
  await page.getByRole('button', { name: 'Next image' }).click();
  await expect(page.getByRole('dialog').locator('img.modal-media__asset')).toHaveAttribute(
    'src',
    /architectural-catalog-reception-preview\.webp/
  );
  await expect(page.getByRole('dialog').locator('img[src*="interior-marble"]')).toHaveCount(0);
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

  const userFacingFilter = page.getByRole('button', { name: /User-facing/i });
  await userFacingFilter.click();
  await expect(userFacingFilter).toHaveAttribute('aria-pressed', 'true');
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

  // Capture a viewport screenshot for visual sanity without forcing the whole media-heavy page to render.
  await page.locator('#chrome-stats').scrollIntoViewIfNeeded();
  await page.screenshot({ path: 'test-results/home.png', fullPage: false });
});

test('docs route bootstraps without duplicate manifest probe', async ({ page }) => {
  const duplicateManifestFailures: string[] = [];

  page.on('response', (response) => {
    if (response.status() >= 400 && response.url().includes('/docs/docs/manifest.json')) {
      duplicateManifestFailures.push(`${response.status()} ${response.url()}`);
    }
  });

  await page.goto('/docs/', { waitUntil: 'domcontentloaded' });
  await expect(page.getByRole('heading', { name: 'About Me' })).toBeVisible({ timeout: 15000 });
  expect(duplicateManifestFailures).toEqual([]);
});

test('smart search bubbles and semantic queries surface relevant projects', async ({ page }) => {
  test.setTimeout(180_000);
  await gotoPortfolio(page);

  const smartSearch = page.locator('#smart-search');
  const explorer = page.locator('#projects');
  const explorerSearch = page.getByLabel('Search projects');
  const firstProjectCard = page.getByTestId('project-card').first();
  const searchInput = smartSearch.locator('#portfolio-smart-search');
  const topicPanel = smartSearch.locator('.quick-topic-panel');

  await expect(page.locator('input[type="search"]')).toHaveCount(1);
  await expect(explorer.locator('input[type="search"]')).toHaveCount(0);
  await expect(topicPanel).toHaveClass(/is-visible/);
  await expect(topicPanel.getByRole('button')).toHaveCount(8);

  await searchInput.fill('zzzzq qqqqx');
  await expect(topicPanel).not.toHaveClass(/is-visible/);
  await searchInput.fill('');
  await searchInput.focus();
  await expect(topicPanel).toHaveClass(/is-visible/);

  const expectFirstProject = async (title: string | RegExp) => {
    await expect(explorer.locator('.empty-state')).toHaveCount(0);
    await expect(firstProjectCard).toBeVisible({ timeout: 15000 });
    await expect(firstProjectCard).toContainText(title, { timeout: 15000 });
  };

  const quickTopics = [
    {
      label: 'OCR serving',
      query: 'ocr onnx inference api',
      expected: 'Fast OCR ONNX Inference Server',
    },
    {
      label: 'Edge inference',
      query: 'edge ai mobile inference',
      expected: 'Fast OCR ONNX Inference Server',
    },
    {
      label: 'Segmentation systems',
      query: 'skin texture segmentation computer vision',
      expected: 'Full-Face Wrinkle and Skin Texture Segmentation Lab',
    },
    {
      label: 'Video retrieval',
      query: 'multimodal video search',
      expected: 'Multimodal Video Search Platform',
    },
    {
      label: 'ML/MLOps delivery',
      query: 'clearml dermaself mlops',
      expected: 'ClearML Experiment Tracking for Dermaself',
    },
    {
      label: 'LLM inference',
      query: 'agnitra llm inference optimizer',
      expected: 'Agnitra AI Inference Optimizer',
    },
    {
      label: 'VLM/LLM workflows',
      query: 'llm vlm agents human review',
      expected: 'CollectionsAI ChatGPT App',
    },
    {
      label: 'Architecture CV',
      query: 'architectural drawing catalog matching',
      expected: 'Architectural Drawing and Interior Catalog Matching',
    },
  ];

  for (const topic of quickTopics) {
    await smartSearch.scrollIntoViewIfNeeded();
    await searchInput.fill('');
    await searchInput.focus();
    await expect(topicPanel).toHaveClass(/is-visible/);
    await smartSearch.getByRole('button', { name: topic.label, exact: true }).click();
    await expect(explorerSearch).toHaveValue(topic.query);
    await expect(topicPanel).not.toHaveClass(/is-visible/);
    await expectFirstProject(topic.expected);
  }

  const filteredTopics = [
    {
      trigger: 'jaw',
      label: 'Jaw classifier',
      query: 'jaw face type classifier',
      expected: 'Jaw and Face-Type Classifier for Aesthetic Review',
    },
    {
      trigger: 'inquest',
      label: 'InQuest RAG',
      query: 'inquest rag project binder',
      expected: 'InQuest Project Binder RAG QA',
    },
    {
      trigger: 'comfy',
      label: 'ComfyUI lab',
      query: 'comfyui colab custom model',
      expected: 'ComfyUI and Colab Generative Prototype Lab',
    },
    {
      trigger: 'mcp',
      label: 'MCP apps',
      query: 'mcp chatgpt conservation app',
      expected: 'CollectionsAI ChatGPT App',
    },
    {
      trigger: 'calorio',
      label: 'Calorio',
      query: 'calorio nutrition telegram bot',
      expected: 'Dishes Recognition & Nutrition Goals Telegram Bot',
    },
  ];

  for (const topic of filteredTopics) {
    await smartSearch.scrollIntoViewIfNeeded();
    await searchInput.fill(topic.trigger);
    await expect(topicPanel).toHaveClass(/is-visible/);
    await smartSearch.getByRole('button', { name: topic.label, exact: true }).click();
    await expect(explorerSearch).toHaveValue(topic.query);
    await expect(topicPanel).not.toHaveClass(/is-visible/);
    await expectFirstProject(topic.expected);
  }

  const customQueries = [
    {
      query: 'plastic surgery jaw classifier',
      expected: 'Jaw and Face-Type Classifier for Aesthetic Review',
    },
    {
      query: 'whole building catalog room matching',
      expected: 'Architectural Drawing and Interior Catalog Matching',
    },
    {
      query: 'custom model comfy workflow',
      expected: 'ComfyUI and Colab Generative Prototype Lab',
    },
    {
      query: 'project binder vector storage',
      expected: 'InQuest Project Binder RAG QA',
    },
    {
      query: 'video transcript embeddings search',
      expected: 'Multimodal Video Search Platform',
    },
    {
      query: 'chrome built in ai summaries',
      expected: 'LocalLens Private AI Summaries',
    },
    {
      query: 'calorio tg users nutrition telegram bot',
      expected: 'Dishes Recognition & Nutrition Goals Telegram Bot',
    },
  ];

  for (const item of customQueries) {
    await smartSearch.scrollIntoViewIfNeeded();
    await smartSearch.locator('#portfolio-smart-search').fill(item.query);
    await smartSearch.getByRole('button', { name: 'Search', exact: true }).click();
    await expect(explorerSearch).toHaveValue(item.query);
    await expectFirstProject(item.expected);
  }
});

test('metric tracker sections stay compact and disclose full source rows', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1200 });
  await gotoPortfolio(page);

  const clawHubBoard = page.getByTestId('clawhub-board');
  await clawHubBoard.scrollIntoViewIfNeeded();
  await expect(clawHubBoard.getByRole('heading', { name: 'Top skill listings by downloads' })).toBeVisible();
  await expect(clawHubBoard.locator('.compact-rank-list').first().locator('.compact-rank-row')).toHaveCount(12);

  const disclosure = clawHubBoard.locator('.compact-disclosure');
  expect(await disclosure.evaluate((element) => (element as HTMLDetailsElement).open)).toBe(false);

  const cwsBoard = page.getByTestId('cws-board');
  await cwsBoard.scrollIntoViewIfNeeded();
  await expect(cwsBoard.getByRole('heading', { name: 'Chrome Web Store publisher detail' })).toBeVisible();
  await expect(cwsBoard.locator('.extension-stat-list').first().locator('.extension-stat-card')).toHaveCount(
    Math.min(3, CHROME_EXTENSION_STATS.extensions.length)
  );
  await expect(cwsBoard.locator('.extension-stat-card')).toHaveCount(CHROME_EXTENSION_STATS.extensions.length);

  const desktopMetrics = await page.evaluate(() => {
    const readSection = (id: string) => {
      const section = document.getElementById(id);
      if (!section) throw new Error(`Missing section ${id}`);
      const rect = section.getBoundingClientRect();
      return {
        height: rect.height,
        overflow: section.scrollWidth - section.clientWidth,
      };
    };
    return {
      clawhub: readSection('clawhub'),
      chromeStats: readSection('chrome-stats'),
    };
  });

  expect(desktopMetrics.clawhub.height).toBeLessThan(2100);
  expect(desktopMetrics.chromeStats.height).toBeLessThan(2100);
  expect(desktopMetrics.clawhub.overflow).toBeLessThanOrEqual(4);
  expect(desktopMetrics.chromeStats.overflow).toBeLessThanOrEqual(4);

  await clawHubBoard.scrollIntoViewIfNeeded();
  await disclosure.locator('summary').click();
  await expect(disclosure.locator('.compact-rank-row')).toHaveCount(Math.max(0, CLAWHUB_DOWNLOAD_STATS.length - 12));

  await page.setViewportSize({ width: 390, height: 1000 });
  await gotoPortfolio(page);
  await page.locator('#chrome-stats').scrollIntoViewIfNeeded();
  await expect
    .poll(async () => page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth), {
      message: 'Expected compact metric tracker sections to avoid mobile horizontal overflow',
    })
    .toBeLessThanOrEqual(4);
});

test('featured cards stay inside their own bounds on desktop breakpoints', async ({ page }) => {
  test.setTimeout(120_000);
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
  test.setTimeout(60_000);
  await page.goto('/?project=session-rescue', { waitUntil: 'domcontentloaded' });

  const modal = page.getByRole('dialog');
  await expect(modal).toBeVisible({ timeout: 15000 });
  await expect(modal.getByRole('heading', { name: 'Session Rescue' })).toBeVisible();

  await page.keyboard.press('Escape');
  await expect(modal).toBeHidden();
  await expect(page).not.toHaveURL(/project=session-rescue/);
});

test('daily ML paper reviews page renders English feed with source ledgers', async ({ page }) => {
  test.setTimeout(90_000);
  await gotoStandalone(page, 'papers');

  await expect(page).toHaveTitle(/ML Papers, Read for Builders/);
  await expect(page.getByRole('heading', { name: /ML Papers, Read for Builders/i })).toBeVisible();
  await expect(page.getByText(/Use papers as candidates, not proof of production readiness/i)).toBeVisible();

  const feedResponse = await page.request.get('/docs/paper-reviews.json');
  expect(feedResponse.status()).toBe(200);
  expect(feedResponse.headers()['content-type']).toMatch(/application\/json|text\/plain|octet-stream/);
  const feed = await feedResponse.json();
  const forbiddenSourceName = ['Gon', 'zo'].join('');
  const forbiddenSourceUrl = ['t.me/', 'gon', 'zo'].join('');
  expect(feed.language).toBe('en');
  expect(feed.reviews.length).toBeGreaterThanOrEqual(1);
  expect(JSON.stringify(feed)).not.toMatch(new RegExp(`\\bN\\/A\\b|AQ\\.Ab8RN6I55tmuy2eY0kXBTk2xsR47rdSufEw5xW1iF-zJGNSSSQ|${forbiddenSourceName}|${forbiddenSourceUrl}`, 'i'));

  const latest = feed.reviews[0];
  await expect(page.getByRole('heading', { name: latest.title })).toBeVisible({ timeout: 15000 });
  await expect(page.getByRole('link', { name: 'Primary paper' })).toHaveAttribute('href', latest.paperUrl);
  await expect(page.getByRole('link', { name: 'PDF' })).toHaveAttribute('href', latest.pdfUrl);
  await expect(page.locator('body')).not.toContainText(new RegExp(`${forbiddenSourceName}|${forbiddenSourceUrl}`, 'i'));

  await page.getByPlaceholder(/Search topic/i).fill(latest.tags[0]);
  await expect(page.getByRole('heading', { name: latest.title })).toBeVisible();

  await expect
    .poll(async () => page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth))
    .toBeLessThanOrEqual(4);
});

test.describe('mobile', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test('project explorer stays usable on mobile without horizontal overflow', async ({ page }) => {
    test.setTimeout(90_000);
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
  test.setTimeout(60_000);
  await gotoPortfolio(page);

  const homeLink = page.getByRole('link', { name: 'Zakhar Pashkin' }).first();
  for (let i = 0; i < 4; i += 1) {
    await homeLink.click();
  }

  await expect(page).toHaveURL(/skill-wind/);
  await expect(page.getByRole('heading', { name: /The Wind Remembers/i })).toBeVisible();
});

test('skill wind standalone page renders across key responsive breakpoints', async ({ page }) => {
  test.setTimeout(120_000);
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
  test.setTimeout(60_000);
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
