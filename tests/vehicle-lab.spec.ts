import { test, expect } from '@playwright/test';

test('Vehicle Lab can be found and its film plays in the portfolio', async ({ page }) => {
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
  const video = dialog.locator('video');
  await expect(video).toHaveAttribute('controls', '');
  await expect.poll(() => video.evaluate((v: HTMLVideoElement) => v.duration)).toBe(96);
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
  const video = page.locator('video');
  await video.evaluate((v: HTMLVideoElement) => v.load());
  await expect.poll(() => video.evaluate((v: HTMLVideoElement) => v.duration)).toBe(96);
  await expect(page.locator('track[kind="captions"]')).toHaveAttribute('src', /pipeline\.vtt$/);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.getByRole('link', { name: /Create your own project/ }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Your first project');
  await expect(page.locator('main')).toContainText('tools/project.py init');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  const archive = await request.head('/docs/vehicle-lab/downloads/vehicle-lab-0.1.0.tar.gz');
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
