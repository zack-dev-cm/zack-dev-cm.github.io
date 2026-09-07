import { test, expect } from '@playwright/test';

test('Vehicle Lab is featured, has direct demo links and its film plays in the portfolio', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.site-layout')).toBeVisible();
  const featured = page.locator('.featured-card').filter({ has: page.getByRole('heading', { name: 'Vehicle Lab · CAD to simulation', exact: true }) });
  await expect(featured.locator('img')).toHaveAttribute('src', /vehicle-lab-hero-poster\.jpg$/);
  await expect(featured.getByRole('link', { name: 'Explore in 3D' })).toHaveAttribute('href', /\/docs\/vehicle-lab\/film\.html$/);
  await page.goto('/projects/vehicle-lab-a-reusable-engineering-notebook/');
  const actions = page.getByRole('navigation', { name: 'Project actions' });
  await expect(actions.getByRole('link', { name: 'Explore in 3D' })).toHaveAttribute('href', /\/docs\/vehicle-lab\/film\.html$/);
  await expect(actions.getByRole('link', { name: 'Explore motion and terrain' })).toHaveAttribute('href', /\/docs\/vehicle-lab\/terrain\.html$/);
  await page.goto('/');
  await expect(page.locator('.site-layout')).toBeVisible();
  const archive = page.locator('#project-archive');
  if (!(await archive.evaluate((node: HTMLDetailsElement) => node.open))) {
    await archive.locator(':scope > summary').click();
  }
  await page.getByLabel('Search projects').fill('vehicle lab');
  await page.getByRole('link', { name: /Open project: Vehicle Lab:/ }).click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  const interactiveAction = dialog.getByRole('navigation', { name: 'Project actions' }).getByRole('link', { name: 'Explore in 3D' });
  await expect(interactiveAction).toHaveAttribute('href', /\/docs\/vehicle-lab\/film\.html$/);
  await expect(interactiveAction).toBeInViewport();
  const video = dialog.locator('video');
  await expect(video).toHaveAttribute('poster', /vehicle-lab-hero-poster\.jpg$/);
  await expect(video).toHaveAttribute('controls', '');
  await expect.poll(() => video.evaluate((v: HTMLVideoElement) => v.duration)).toBe(37.5);
  await video.evaluate(async (v: HTMLVideoElement) => { v.muted = true; await v.play(); });
  await expect.poll(() => video.evaluate((v: HTMLVideoElement) => v.currentTime)).toBeGreaterThan(0);
  await video.evaluate((v: HTMLVideoElement) => v.pause());
  await expect(dialog.getByRole('link', { name: 'Read the documentation' })).toHaveAttribute('href', /\/docs\/vehicle-lab\/docs\/$/);
  await expect(dialog.getByRole('link', { name: 'Source on GitHub' })).toHaveAttribute('href', 'https://github.com/zack-dev-cm/vehicle-lab');
  await expect(dialog).toContainText('unqualified for fabrication or riding');
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
});

test('Vehicle Lab mobile site provides the film, setup guide and source archive', async ({ page, request }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/docs/vehicle-lab/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Keep the evidence.');
  await expect(page.locator('#hero-video')).toHaveAttribute('poster', /hero-poster\.jpg$/);
  await page.getByRole('link', { name: 'Watch with music' }).click();
  const video = page.locator('video');
  await video.evaluate(async (v: HTMLVideoElement) => { v.muted = true; await v.play(); });
  await expect.poll(() => video.evaluate((v: HTMLVideoElement) => v.duration)).toBe(37.5);
  await expect.poll(() => video.evaluate((v: HTMLVideoElement) => v.currentTime)).toBeGreaterThan(0);
  await video.evaluate((v: HTMLVideoElement) => v.pause());
  await expect(page.locator('track[kind="captions"]')).toHaveAttribute('src', /hero\.vtt$/);
  await page.goto('/docs/vehicle-lab/');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.getByRole('link', { name: /Create your own project/ }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Your first project');
  await expect(page.locator('main')).toContainText('tools/project.py init');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  const archive = await request.head('/docs/vehicle-lab/downloads/vehicle-lab-0.1.1.tar.gz');
  expect(archive.ok()).toBe(true);
  expect(Number(archive.headers()['content-length'])).toBeGreaterThan(1_000_000);
});

test('Vehicle Lab independent project works under the published site path', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/docs/vehicle-lab/studio.html?project=projects/linear-stage/project.json');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('What stops the carriage?');
  await page.getByRole('button', { name: /01\s*initial-fit/ }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Keep the failed fit.');
  await expect(page.locator('#facts [data-status]')).toContainText('failed');
  await page.getByRole('button', { name: 'Project record', exact: true }).click();
  const record = page.getByRole('dialog');
  await expect(record.locator('.revision-graph svg a')).toHaveCount(2);
  await expect(record).toContainText('Increase only the slot width to 24 mm.');
  const failed = record.locator('.evidence-card').filter({ has: page.locator('.record-status.failed') });
  await failed.getByText('Read recorded data', { exact: true }).click();
  expect(JSON.parse(await failed.locator('pre').innerText()).total_clearance).toBe(-2);
  await page.keyboard.press('Escape');
  await expect(record).toBeHidden();
  await page.getByRole('button', { name: /03\s*travel/ }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Inspect the recorded travel.');
  await expect(page.locator('#telemetry')).toContainText('Prescribed motion fixture');
  expect(errors).toEqual([]);
});


test('Vehicle Lab terrain exposes recorded handling and source parameters on mobile', async ({ page, request }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/docs/vehicle-lab/terrain.html?study=chrono-handling');
  await page.waitForFunction(() => (window as any).vehicleTerrain?.ready || (window as any).vehicleTerrain?.error);
  expect(await page.evaluate(() => (window as any).vehicleTerrain.error)).toBe(null);
  await page.locator('#scrub').fill('6');
  await expect(page.locator('#steer')).toHaveText('15.0');
  await expect(page.locator('#outcome')).toHaveText('Recorded maneuver screen passed');
  await page.locator('#play').click();
  await expect.poll(() => page.evaluate(() => (window as any).vehicleTerrain.time)).toBeGreaterThan(6);
  await page.locator('#play').click();
  await page.locator('.parameters summary').click();
  await expect(page.locator('#parameters')).toContainText('1 ms / 50 Hz');
  const run = await request.get('/docs/vehicle-lab/data/chrono-handling.json');
  expect(run.ok()).toBe(true);
  expect((await run.json()).frames).toHaveLength(600);
  await page.locator('#study').selectOption('chrono-pit');
  await expect(page.locator('#outcome')).toHaveText('Obstacle traversal failed');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  expect(errors).toEqual([]);
});
