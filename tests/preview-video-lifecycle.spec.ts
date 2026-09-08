import { test, expect, type Page } from '@playwright/test';

async function delayFirstPlay(page: Page) {
  await page.addInitScript(() => {
    const play = HTMLMediaElement.prototype.play;
    const pause = HTMLMediaElement.prototype.pause;
    const state = { calls: 0, pauses: 0, reject: null as null | ((reason: unknown) => void) };
    (window as any).__previewPlayback = state;
    HTMLMediaElement.prototype.play = function () {
      if (this.closest('.preview-video')) {
        state.calls++;
        if (state.calls === 1) return new Promise<void>((_, reject) => { state.reject = reject; });
      }
      return play.call(this);
    };
    HTMLMediaElement.prototype.pause = function () {
      if (this.closest('.preview-video')) state.pauses++;
      pause.call(this);
    };
  });
}

async function restoreVisibilityWhilePending(page: Page) {
  await page.goto('/');
  const video = page.locator('.preview-video video');
  await video.scrollIntoViewIfNeeded();
  await expect.poll(() => page.evaluate(() => (window as any).__previewPlayback.calls)).toBe(1);
  const pauses = await page.evaluate(() => (window as any).__previewPlayback.pauses);
  await page.evaluate(() => window.scrollTo(0, 0));
  await expect.poll(() => page.evaluate(() => (window as any).__previewPlayback.pauses)).toBeGreaterThan(pauses);
  await video.scrollIntoViewIfNeeded();
  await page.evaluate(() => new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve()))));
  return video;
}

test('interrupted pending preview playback resumes when visibility returns', async ({ page }) => {
  await delayFirstPlay(page);
  const video = await restoreVisibilityWhilePending(page);
  await page.evaluate(() => (window as any).__previewPlayback.reject(new DOMException('Interrupted', 'AbortError')));
  await expect.poll(() => page.evaluate(() => (window as any).__previewPlayback.calls)).toBe(2);
  await expect.poll(() => video.evaluate(v => !(v as HTMLVideoElement).paused && (v as HTMLVideoElement).currentTime > 0)).toBe(true);
});

test('autoplay rejection leaves manual Play available without repeated attempts', async ({ page }) => {
  await delayFirstPlay(page);
  const video = await restoreVisibilityWhilePending(page);
  await page.evaluate(() => (window as any).__previewPlayback.reject(new DOMException('Requires gesture', 'NotAllowedError')));
  const button = page.getByRole('button', { name: 'Play Vehicle Lab · CAD to simulation preview', exact: true });
  await expect(button).toBeVisible();
  await page.waitForTimeout(400);
  expect(await page.evaluate(() => (window as any).__previewPlayback.calls)).toBe(1);
  await button.click();
  await expect.poll(() => video.evaluate(v => !(v as HTMLVideoElement).paused && (v as HTMLVideoElement).currentTime > 0)).toBe(true);
});
