import { test, expect } from '@playwright/test';

test('datarepo stays in contributions, with retired project and 3D links redirected', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#featured')).not.toContainText(/datarepo/i);
  for (const number of [57, 58, 59]) {
    await expect(page.locator(`#contributed-to a[href="https://github.com/neuralinkcorp/datarepo/pull/${number}"]`)).toHaveCount(1);
  }
  const discovery = await (await page.request.get('/agent-discovery.json')).json();
  expect([...discovery.featuredProjects, ...discovery.allProjects].some((project: { id: number; title: string }) =>
    project.id === 83 || /neuralink.*contributions/i.test(project.title))).toBe(false);
  for (const slug of ['neuralink-datarepo-contributions', 'neuralink-contributions', 'zack-dev-cm-neuralink-contributions']) {
    await page.goto(`/projects/${slug}/`);
    await page.waitForURL('**/#contributed-to');
  }
  await page.goto('/docs/neural-engineering/studio.html?project=datarepo');
  await page.waitForURL('**/#contributed-to');
  await page.goto('/docs/neural-engineering/index.html');
  await expect(page.locator('#datarepo-video, a[href*="project=datarepo"]')).toHaveCount(0);
  for (const path of ['media/datarepo-film.mp4', 'media/datarepo-loop.mp4', 'media/datarepo-preview.gif', 'models/datarepo.glb']) {
    expect((await page.request.get(`/docs/neural-engineering/${path}`)).status()).toBe(404);
  }
});

for (const width of [1440, 390]) {
  for (const [project, title] of [
    ['sectioncheck', 'SectionCheck · Pixels to a review'],
  ]) {
    test(`${project} preview plays and pauses at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: width === 390 ? 844 : 960 });
      await page.goto('/');
      const card = page.locator('.featured-card').filter({ has: page.getByRole('heading', { name: title, exact: true }) });
      await card.scrollIntoViewIfNeeded();
      const video = card.locator('video');
      await expect.poll(() => video.evaluate((v: HTMLVideoElement) => !v.paused && v.currentTime > 0.3)).toBe(true);
      expect(await video.evaluate((v: HTMLVideoElement) => [v.videoWidth, v.videoHeight, v.muted])).toEqual([1280, 720, true]);
      await card.getByRole('button', { name: `Pause ${title} preview`, exact: true }).click();
      await expect.poll(() => video.evaluate((v: HTMLVideoElement) => v.paused)).toBe(true);
      const time = await video.evaluate((v: HTMLVideoElement) => v.currentTime);
      await page.waitForTimeout(150);
      expect(await video.evaluate((v: HTMLVideoElement) => v.currentTime)).toBe(time);
      await expect(card.getByRole('link', { name: 'Case study', exact: true })).toHaveAttribute('href', /\/projects\/[^/]+\/$/);
      const model = await page.request.get(`/docs/neural-engineering/models/${project}.glb`);
      expect(model.status()).toBe(200);
      expect((await model.body()).subarray(0, 4).toString()).toBe('glTF');
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    });
  }
}
