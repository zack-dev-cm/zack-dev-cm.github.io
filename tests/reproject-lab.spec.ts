import { test, expect } from '@playwright/test';

test.use({ launchOptions: { args: ['--enable-webgl', '--ignore-gpu-blocklist', '--enable-unsafe-swiftshader'] } });
const url = '/docs/contribution-lab/reproject.html';

for (const width of [360, 390, 768, 1440]) {
  test(`reproject recorded coordinates, playback and manual comparison at ${width}px`, async ({ page }, info) => {
    await page.setViewportSize({ width, height: 950 });
    await page.goto(url);
    await expect(page.locator('#scene-status')).toBeHidden({ timeout: 30000 });
    await expect(page.locator('#coordinate-scene')).toBeVisible();
    const timeline = page.getByLabel('Example timeline', { exact: true });
    await expect(page.locator('#world-coordinate')).toHaveText('(1, 1)');
    await page.getByRole('button', { name: 'Play example', exact: true }).click();
    await expect.poll(() => timeline.inputValue()).not.toBe('0');
    await page.getByRole('button', { name: 'Pause', exact: true }).click();
    const paused = await timeline.inputValue();
    await page.waitForTimeout(180);
    await expect(timeline).toHaveValue(paused);

    await page.getByRole('button', { name: '04 · Old check', exact: true }).click();
    await expect(timeline).toHaveValue('19');
    await expect(page.locator('#inverse-coordinate')).toHaveText('(NaN, 0)');
    await expect(page.locator('#world-coordinate')).toHaveText('(2, 1)');
    await expect(page.locator('#distance-check')).toHaveText('false');
    await expect(page.locator('#finite-check')).toHaveText('false');
    await expect(page.locator('#decision')).toHaveText('Accepted');
    await expect(page.locator('#value-1')).toHaveText('2');
    await expect(page.locator('#footprint-1')).toHaveText('1');

    await timeline.fill('26');
    await expect(page.locator('#stage-title')).toHaveText('Check that the inverse is finite.');
    await expect(page.locator('#decision')).toHaveText('Rejected');
    await expect(page.locator('#value-1')).toHaveText('NaN');
    await expect(page.locator('#footprint-1')).toHaveText('0');
    await expect(page.locator('#value-0')).toHaveText('1');

    await page.getByRole('button', { name: 'Play example', exact: true }).click();
    const valid = page.locator('[data-pixel="0"]');
    await valid.focus();
    await page.keyboard.press('Space');
    await expect(page.locator('#play-state')).toHaveText('Paused · inspecting your selection');
    await expect(page.locator('#inverse-coordinate')).toHaveText('(0, 0)');
    await expect(page.locator('#decision')).toHaveText('Accepted');
    await expect(page.locator('[data-mode="proposed"]')).toHaveAttribute('aria-pressed', 'true');
    await page.locator('[data-pixel="1"]').click();
    await page.getByRole('button', { name: 'Baseline', exact: true }).click();
    await expect(page.locator('#value-1')).toHaveText('2');
    await page.getByRole('button', { name: 'Proposed correction', exact: true }).click();
    await expect(page.locator('#value-1')).toHaveText('NaN');
    await page.getByRole('button', { name: 'Front view', exact: true }).click();
    await page.getByRole('button', { name: 'Reset view', exact: true }).click();
    expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(false);
    await page.screenshot({ path: info.outputPath(`reproject-${width}.png`), fullPage: true });
    await page.getByRole('button', { name: 'Restart', exact: true }).click();
    await expect(timeline).toHaveValue('0');
    await expect(page.locator('[data-pixel="0"]')).toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator('[data-mode="baseline"]')).toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator('#stage-title')).toHaveText('Start on the output grid.');
  });
}

test('reproject is complete without WebGL and starts still with reduced motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.route('**/engineering-studies/vendor/three.module.min.js', route => route.abort());
  await page.goto(url);
  await expect(page.locator('#scene-status')).toContainText('3D is unavailable');
  await expect(page.locator('#coordinate-scene')).toBeHidden();
  const timeline = page.getByLabel('Example timeline', { exact: true });
  await page.waitForTimeout(180);
  await expect(timeline).toHaveValue('0');
  await page.getByRole('button', { name: '05 · Correction', exact: true }).click();
  await expect(page.locator('#value-1')).toHaveText('NaN');
  await expect(page.locator('#footprint-1')).toHaveText('0');
  await page.locator('[data-pixel="0"]').focus();
  await page.keyboard.press('Space');
  await expect(page.locator('#decision')).toHaveText('Accepted');
  await page.getByRole('button', { name: 'Play example', exact: true }).click();
  await expect.poll(() => timeline.inputValue()).not.toBe('26');
});

test('a failed fixture request has a readable recovery state', async ({ page }) => {
  await page.route('**/reproject-fixture.json', route => route.fulfill({ status: 503, body: 'Unavailable' }));
  await page.goto(url);
  await expect(page.locator('#scene-status')).toContainText('recorded fixture could not load');
  await expect(page.getByRole('button', { name: 'Play example', exact: true })).toBeDisabled();
  await expect(page.getByRole('link', { name: 'Inspect the change and regression' })).toBeVisible();
});
