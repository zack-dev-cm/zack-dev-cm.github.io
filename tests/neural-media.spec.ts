import { test, expect } from '@playwright/test';

for (const width of [1440, 390]) {
  for (const [project, title] of [
    ['sectioncheck', 'SectionCheck · Pixels to a review'],
    ['datarepo', 'datarepo · Follow the records'],
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
