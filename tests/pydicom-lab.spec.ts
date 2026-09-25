import { test, expect } from '@playwright/test';

test.use({ launchOptions: { args: ['--enable-webgl', '--ignore-gpu-blocklist', '--enable-unsafe-swiftshader'] } });
const url = '/docs/contribution-lab/pydicom.html';

for (const width of [390, 1440]) {
  test(`pydicom guided playback and hands-on overflow at ${width}px`, async ({ page }, info) => {
    await page.setViewportSize({ width, height: 950 });
    await page.goto(url);
    await expect(page.locator('#scene-status')).toBeHidden({ timeout: 30000 });
    await expect(page.locator('#lut-scene')).toBeVisible();
    await expect(page.locator('#before-output')).toHaveText('30');
    await expect(page.locator('#after-output')).toHaveText('30');
    const timeline = page.getByLabel('Example timeline', { exact: true });

    await page.getByRole('button', { name: 'Play example', exact: true }).click();
    await expect(page.getByRole('button', { name: 'Pause', exact: true })).toBeVisible();
    await expect.poll(() => timeline.inputValue()).not.toBe('0');
    await page.getByRole('button', { name: 'Pause example beside model', exact: true }).click();
    await expect(page.getByRole('button', { name: 'Play example', exact: true })).toBeVisible();
    await page.getByRole('button', { name: 'Play example beside model', exact: true }).click();
    await page.getByRole('button', { name: 'Pause', exact: true }).click();
    const paused = await timeline.inputValue();
    await page.waitForTimeout(220);
    await expect(timeline).toHaveValue(paused);

    await timeline.fill('12');
    await expect(page.locator('#stage-title')).toHaveText('Keep large values at the top.');
    await expect(page.locator('#input-value')).toHaveText('256');
    await expect(page.locator('#scene-readout')).toHaveText('Input 256 · Before 10 → After 40');
    await expect(page.locator('#before-output')).toHaveText('10');
    await expect(page.locator('#after-output')).toHaveText('40');
    await expect(page.locator('#before-math')).toContainText('uint8: 0');
    await expect(page.locator('#after-math')).toContainText('last index 3');

    await page.getByRole('button', { name: '04 · Shift', exact: true }).click();
    await expect(timeline).toHaveValue('18');
    await expect(page.locator('#input-value')).toHaveText('356');
    await expect(page.locator('#first-value')).toHaveText('100');
    await expect(page.locator('#before-output')).toHaveText('10');
    await expect(page.locator('#after-output')).toHaveText('40');

    await page.getByRole('button', { name: 'Play example', exact: true }).click();
    await page.getByLabel('First mapped input', { exact: true }).fill('0');
    await expect(page.getByRole('button', { name: 'Play example', exact: true })).toBeVisible();
    await expect(page.locator('#play-state')).toHaveText('Paused · exploring your values');
    await page.getByLabel('Input', { exact: true }).fill('256');
    await expect(page.locator('#before-output')).toHaveText('10');
    await expect(page.locator('#after-output')).toHaveText('40');
    const manualTime = await timeline.inputValue();
    await page.waitForTimeout(180);
    await expect(timeline).toHaveValue(manualTime);

    await page.locator('[data-entry="0"]').focus();
    await page.keyboard.press('Space');
    await expect(page.locator('#entry-detail')).toContainText('Index 0 stores 10');
    await expect(page.locator('[data-entry="0"]')).toHaveAttribute('aria-pressed', 'true');
    await page.getByRole('button', { name: 'Front view', exact: true }).click();
    await page.getByRole('button', { name: 'Reset view', exact: true }).click();
    expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(false);
    await page.screenshot({ path: info.outputPath(`pydicom-overflow-${width}.png`), fullPage: true });

    await page.getByRole('button', { name: 'In range · 2', exact: true }).click();
    await expect(page.locator('#before-output')).toHaveText('30');
    await expect(page.locator('#after-output')).toHaveText('30');
    await page.getByRole('button', { name: 'Restart', exact: true }).click();
    await expect(timeline).toHaveValue('0');
    await expect(page.locator('#play-state')).toHaveText('Paused · guided example');
  });
}

test('pydicom retains guided arithmetic and keyboard inspection when WebGL cannot load', async ({ page }) => {
  await page.route('**/engineering-studies/vendor/three.module.min.js', route => route.abort());
  await page.goto(url);
  await expect(page.locator('#scene-status')).toContainText('3D is unavailable');
  await expect(page.locator('#lut-scene')).toBeHidden();
  await expect(page.locator('.camera')).toBeHidden();
  await page.getByRole('button', { name: 'Play example', exact: true }).click();
  await expect.poll(() => page.getByLabel('Example timeline', { exact: true }).inputValue()).not.toBe('0');
  await page.getByLabel('Example timeline', { exact: true }).fill('12');
  await expect(page.locator('#before-output')).toHaveText('10');
  await expect(page.locator('#after-output')).toHaveText('40');
  await page.locator('[data-entry="3"]').focus();
  await page.keyboard.press('Space');
  await expect(page.locator('#entry-detail')).toContainText('Index 3 stores 40');
  await page.getByRole('button', { name: 'Below range', exact: true }).click();
  await expect(page.locator('#before-output')).toHaveText('10');
  await expect(page.locator('#after-output')).toHaveText('10');
});

test('reduced-motion starts paused and permits explicit playback', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(url);
  const timeline = page.getByLabel('Example timeline', { exact: true });
  await expect(timeline).toHaveValue('0');
  await page.waitForTimeout(180);
  await expect(timeline).toHaveValue('0');
  await page.getByRole('button', { name: 'Play example', exact: true }).click();
  await expect.poll(() => timeline.inputValue()).not.toBe('0');
  await page.getByRole('button', { name: 'Pause', exact: true }).click();
});
