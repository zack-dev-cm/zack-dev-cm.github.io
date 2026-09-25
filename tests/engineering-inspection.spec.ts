import { test, expect } from '@playwright/test';

test.use({ launchOptions: { args: ['--enable-webgl', '--ignore-gpu-blocklist', '--enable-unsafe-swiftshader'] } });

const viewer = '/docs/engineering-studies/studio.html';
const state = (page: any) => page.evaluate(() => (window as any).neuralFilm.inspect());

for (const project of ['agnitra', 'retrieval']) {
  test(`${project}: selecting a stage connects the model, evidence and camera`, async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 683 });
    await page.goto(`${viewer}?project=${project}`);
    await page.waitForFunction(() => (window as any).neuralFilm?.ready);
    const initial = await state(page);
    expect(initial.playing).toBe(false);
    expect(initial.manual).toBe(true);
    await expect(page.getByRole('button', { name: 'Focus selection', exact: true })).toBeDisabled();

    // Keep focus navigation explicit; native popup arrow behavior varies by OS.
    const picker = page.getByLabel('Choose a stage', { exact: true });
    await picker.focus();
    await expect(picker).toBeFocused();
    const selectedId = project === 'agnitra' ? 'conv' : 'vision';
    await picker.selectOption(selectedId);
    await picker.press('Tab');
    await expect(page.getByRole('button', { name: 'Focus selection', exact: true })).toBeFocused();
    await expect.poll(async () => (await state(page)).selectedStage).toBe(selectedId);
    await expect(page.locator('.stage-marker[aria-pressed="true"]')).toHaveCount(1);
    await expect(page.locator('#evidence-value')).toContainText(project === 'agnitra' ? '[1, 3, 32, 32] → [1, 8, 32, 32]' : 'Frame → visual embedding → visual index');
    await expect(page.locator('#fixture-link')).toHaveAttribute('href', project === 'agnitra' ? 'data/agnitra-shapes.json' : 'data/retrieval.json');

    const overviewCamera = (await state(page)).camera;
    await page.getByRole('button', { name: 'Focus selection', exact: true }).click();
    expect((await state(page)).focusActive).toBe(true);
    expect((await state(page)).camera).not.toEqual(overviewCamera);
    await page.getByRole('button', { name: 'Reset view', exact: true }).click();
    expect((await state(page)).camera).toEqual(overviewCamera);

    await page.getByRole('button', { name: project === 'agnitra' ? 'Select 4: AdaptiveAvgPool2d' : 'Select 4: On-screen text / OCR', exact: true }).click();
    await expect(picker).toHaveValue(project === 'agnitra' ? 'pool' : 'ocr');
    await expect(page.locator('#evidence-value')).toContainText(project === 'agnitra' ? '[1, 8, 1, 1]' : 'no readable text');

    await page.getByRole('button', { name: 'Play tour', exact: true }).click();
    expect((await state(page)).playing).toBe(true);
    expect((await state(page)).selectedStage).toBeNull();
    await expect(page.locator('#stage-markers')).toBeHidden();
    await page.getByRole('button', { name: 'Inspect in 3D', exact: true }).click();
    expect((await state(page)).playing).toBe(false);
    expect((await state(page)).manual).toBe(true);
  });

  for (const width of [360, 390, 768, 1440]) {
    test(`${project}: inspection content does not overlap at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: width === 1440 ? 683 : 844 });
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.goto(`${viewer}?project=${project}`);
      await page.waitForFunction(() => (window as any).neuralFilm?.ready);
      await page.getByLabel('Choose a stage', { exact: true }).selectOption(project === 'agnitra' ? 'linear' : 'result');
      const layout = await page.evaluate(() => {
        const ids = ['story', 'viewport', 'evidence', 'scope', 'transport'];
        const rects = ids.map(id => {
          const r = document.getElementById(id)!.getBoundingClientRect();
          return { id, left: r.left, right: r.right, top: r.top, bottom: r.bottom };
        });
        const overlapping: string[] = [];
        for (let i = 0; i < rects.length; i++) for (let j = i + 1; j < rects.length; j++) {
          const a = rects[i], b = rects[j];
          if (Math.min(a.right, b.right) - Math.max(a.left, b.left) > 1 && Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top) > 1) overlapping.push(`${a.id}/${b.id}`);
        }
        return { overlapping, overflow: document.documentElement.scrollWidth > innerWidth, tracking: getComputedStyle(document.querySelector('h1')!).letterSpacing };
      });
      expect(layout.overlapping).toEqual([]);
      expect(layout.overflow).toBe(false);
      expect(['normal', '0px']).toContain(layout.tracking);
      expect((await state(page)).playing).toBe(false);
    });
  }
}
