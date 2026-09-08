import { test, expect } from '@playwright/test';

test.use({ launchOptions: { args: ['--enable-webgl', '--ignore-gpu-blocklist', '--enable-unsafe-swiftshader'] } });
const base = '/docs/engineering-studies/';
const projects = ['agnitra', 'retrieval'];

for (const width of [1440, 700, 390]) {
  for (const project of projects) {
    test(`${project} chapters and 3D inspection work at ${width}px`, async ({ page }, testInfo) => {
      await page.setViewportSize({ width, height: width === 390 ? 844 : 960 });
      await page.emulateMedia({ reducedMotion: 'reduce' });
      const errors: string[] = [];
      page.on('pageerror', error => errors.push(error.message));
      await page.goto(`${base}studio.html?project=${project}`);
      await page.waitForFunction(() => (window as any).neuralFilm?.ready, null, { timeout: 60000 });
      const state = await page.evaluate(() => (window as any).neuralFilm.inspect());
      expect(state.playing).toBe(false);
      expect(state.renderCalls).toBeGreaterThan(20);
      expect(state.triangles).toBeGreaterThan(1000);
      if (project === 'agnitra') {
        expect(state.facts.input).toEqual([1, 3, 32, 32]);
        expect(state.facts.output).toEqual([1, 4]);
        expect(state.facts.parameters).toBe(260);
        expect(state.visibleNodes.filter((node: any) => node.name.startsWith('Linear weight connection '))).toHaveLength(32);
      } else {
        expect(state.facts.fixtureKind).toBe('AUTHORED_ARCHITECTURE_EXAMPLE');
        expect(state.facts.result.measured).toBe(false);
        expect(state.facts.missingOcr).toBe(true);
      }
      const chapters = page.locator('#chapters button');
      await expect(chapters).toHaveCount(8);
      for (let index = 0; index < 8; index++) {
        await chapters.nth(index).click();
        await expect(chapters.nth(index)).toHaveAttribute('aria-current', 'step');
        const layout = await page.evaluate(() => {
          const rect = (selector: string) => document.querySelector(selector)!.getBoundingClientRect();
          return { overflow: document.documentElement.scrollWidth > innerWidth,
            storyBottom: rect('#story').bottom, evidenceTop: rect('#evidence').top,
            evidenceBottom: rect('#evidence').bottom, transportTop: rect('#transport').top,
            sceneTop: rect('#scene').top };
        });
        expect(layout.overflow).toBe(false);
        expect(layout.evidenceBottom).toBeLessThanOrEqual(layout.transportTop);
        expect(layout.storyBottom).toBeLessThanOrEqual(width <= 700 ? layout.sceneTop : layout.evidenceTop);
      }
      const pose = () => page.evaluate(() => {
        const app = (window as any).neuralFilm; app.seek(13.2);
        const state = app.inspect(); return { nodes: state.visibleNodes, camera: state.camera, shot: state.shot };
      });
      const before = await pose();
      await page.evaluate(() => (window as any).neuralFilm.seek(26.8));
      expect(await pose()).toEqual(before);
      await page.getByRole('button', { name: 'Inspect in 3D', exact: true }).click();
      const initial = await page.evaluate(() => (window as any).neuralFilm.inspect());
      await page.locator('#separate').fill('1');
      expect((await page.evaluate(() => (window as any).neuralFilm.inspect())).visibleNodes).not.toEqual(initial.visibleNodes);
      await page.getByLabel('Wireframe', { exact: true }).check();
      expect((await page.evaluate(() => (window as any).neuralFilm.inspect())).visibleNodes.some((node: any) => node.wireframe)).toBe(true);
      await page.getByLabel('Wireframe', { exact: true }).uncheck();
      await page.locator('#scene').scrollIntoViewIfNeeded();
      const canvas = await page.locator('#scene').boundingBox();
      const camera = await page.evaluate(() => (window as any).neuralFilm.inspect().camera);
      const x = canvas!.x + canvas!.width * .68, y = canvas!.y + canvas!.height * .5;
      await page.mouse.move(x, y); await page.mouse.down(); await page.mouse.move(x + 35, y + 18, { steps: 4 }); await page.mouse.up();
      expect(await page.evaluate(() => (window as any).neuralFilm.inspect().camera)).not.toEqual(camera);
      await page.getByRole('button', { name: 'Reset view', exact: true }).click();
      expect(await page.evaluate(() => (window as any).neuralFilm.inspect().camera)).toEqual(camera);
      await page.screenshot({ path: testInfo.outputPath(`${project}-${width}.png`), fullPage: true });
      const model = await page.request.get(`${base}models/${project}.glb`);
      expect(model.status()).toBe(200);
      expect((await model.body()).subarray(0, 4).toString()).toBe('glTF');
      expect(errors).toEqual([]);
    });
  }
}

test('a modified profiling fixture fails closed and offers the film', async ({ page }) => {
  await page.route('**/engineering-studies/data/agnitra-shapes.json', route => route.fulfill({ contentType: 'application/json', body: '{"input_shape":[]}' }));
  await page.goto(`${base}studio.html?project=agnitra`);
  await expect(page.locator('#loading')).toContainText('Fixture checksum mismatch');
  await expect(page.getByRole('link', { name: 'Watch the project film instead' })).toHaveAttribute('href', 'media/agnitra-film.mp4');
  expect(await page.evaluate(() => (window as any).neuralFilm.ready)).toBe(false);
});

for (const width of [1440, 390]) {
  test(`selected project previews play and pause at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: width === 390 ? 844 : 960 });
    await page.goto('/');
    await expect(page.locator('.featured-card')).toHaveCount(7);
    for (const [project, title] of [['agnitra', 'Agnitra · Model profiling & optimization'], ['retrieval', 'Multimodal video search']]) {
      const card = page.locator('.featured-card').filter({ has: page.getByRole('heading', { name: title, exact: true }) });
      await card.scrollIntoViewIfNeeded();
      const video = card.locator('video');
      await expect(video).toHaveAttribute('src', `${base}media/${project}-loop.mp4`);
      await expect.poll(() => video.evaluate((v: HTMLVideoElement) => !v.paused && v.currentTime > .3), { timeout: 15000 }).toBe(true);
      expect(await video.evaluate((v: HTMLVideoElement) => [v.videoWidth, v.videoHeight, v.muted])).toEqual([1280, 720, true]);
      await card.getByRole('button', { name: `Pause ${title} preview`, exact: true }).click();
      await expect.poll(() => video.evaluate((v: HTMLVideoElement) => v.paused)).toBe(true);
    }
  });
}

test('project gallery and film downloads remain readable without JavaScript', async ({ browser, baseURL }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, baseURL });
  const page = await context.newPage();
  await page.goto(`${base}index.html`);
  await expect(page.getByRole('heading', { name: 'Agnitra', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Multimodal video search', exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Explore in 3D', exact: true })).toHaveCount(2);
  await page.goto(`${base}studio.html?project=agnitra`);
  await expect(page.getByRole('link', { name: 'Agnitra film', exact: true })).toBeVisible();
  await context.close();
});
