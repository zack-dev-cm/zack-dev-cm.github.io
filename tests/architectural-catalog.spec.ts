import {test,expect} from '@playwright/test';

const base='/docs/architectural-catalog/';
test.use({launchOptions:{args:['--enable-webgl','--ignore-gpu-blocklist','--enable-unsafe-swiftshader']}});
for(const width of [360,390,768,1440]){
  test(`grounded cabinet story and inspection at ${width}px`,async({page},testInfo)=>{
    await page.setViewportSize({width,height:width<500?900:1000});
    await page.emulateMedia({reducedMotion:'reduce'});
    const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
    await page.goto(base);
    await page.waitForFunction(()=>(window as any).catalogStudy?.ready,null,{timeout:60000});
    const initial=await page.evaluate(()=>(window as any).catalogStudy.inspect());
    expect(initial.playing).toBe(false);expect(initial.drawers).toEqual([1,2]);
    expect(initial.facts.scope.installedDimensions).toBeNull();expect(initial.facts.scope.quantity).toBeNull();expect(initial.facts.scope.price).toBeNull();
    expect(initial.availableModelMeshes).toBeGreaterThan(60);expect(initial.workflow.evidenceHashesVerified).toBe(true);expect(initial.workflow.asset).toBe("data/examples/B3000-drawing.png");expect(initial.visibleMeshes).toBeGreaterThan(1);
    for(let i=0;i<8;i++){
      await page.locator('#chapters button').nth(i).click();
      await expect(page.locator('#chapters button').nth(i)).toHaveAttribute('aria-current','step');
      expect(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth)).toBe(false);
    }
    await page.getByRole('button',{name:'Restart story',exact:true}).click();
    await page.getByRole('button',{name:'Play story',exact:true}).click();
    await expect.poll(()=>page.evaluate(()=>(window as any).catalogStudy.inspect().time)).toBeGreaterThan(.1);
    await page.getByRole('button',{name:'Pause story',exact:true}).click();
    expect(await page.evaluate(()=>(window as any).catalogStudy.inspect().playing)).toBe(false);
    await page.getByRole('button',{name:'B3100',exact:true}).click();
    await page.getByLabel('Select a part',{exact:true}).selectOption('drawers');
    await expect(page.locator('#part-description')).toContainText('Two upper drawers, side by side');
    await page.getByLabel('Nominal width',{exact:true}).selectOption('48');
    await expect(page.locator('#dimensions')).toContainText('48 W × 34 H × 24 D inches');
    await page.getByRole('button',{name:'05 Review dimensions',exact:true}).click();
    await expect(page.locator('#chapter-copy')).toContainText('48 × 34 × 24 inch');
    await expect(page.locator('#source')).toContainText('48 W × 34 H × 24 D inches');
    await page.getByLabel('Nominal width',{exact:true}).selectOption('24');
    await expect(page.locator('#chapter-copy')).toContainText('24 × 34 × 24 inch');
    await expect(page.locator('#source')).toContainText('24 W × 34 H × 24 D inches');
    await page.getByLabel('Nominal width',{exact:true}).selectOption('48');
    await page.locator('#opening').fill('1');await page.locator('#separate').fill('0.7');
    const opened=await page.evaluate(()=>(window as any).catalogStudy.inspect());
    expect(opened.opening).toBe(1);expect(opened.separate).toBe(.7);expect(opened.manual).toBe(true);expect(opened.playing).toBe(false);
    await page.getByLabel('Wireframe',{exact:true}).check();
    expect(await page.evaluate(()=>(window as any).catalogStudy.inspect().wireframe)).toBe(true);
    await page.getByRole('button',{name:'Reset view',exact:true}).click();
    expect(await page.evaluate(()=>(window as any).catalogStudy.inspect().opening)).toBe(0);
    await page.getByLabel('Nominal width',{exact:true}).selectOption('36');
    const camera=await page.evaluate(()=>(window as any).catalogStudy.inspect().camera);
    await page.locator('#scene').scrollIntoViewIfNeeded();
    const rect=await page.locator('#scene').boundingBox();
    await page.mouse.move(rect!.x+rect!.width*.2,rect!.y+rect!.height*.3);await page.mouse.down();
    await page.mouse.move(rect!.x+rect!.width*.2+40,rect!.y+rect!.height*.3+20,{steps:5});await page.mouse.up();
    expect(await page.evaluate(()=>(window as any).catalogStudy.inspect().camera)).not.toEqual(camera);
    await page.getByRole('button',{name:'Reset view',exact:true}).click();
    expect(await page.evaluate(()=>(window as any).catalogStudy.inspect().camera)).toEqual(camera);
    await page.screenshot({path:testInfo.outputPath(`catalog-${width}.png`),fullPage:true});
    const glb=await page.request.get(base+'models/catalog-cabinets.glb');expect(glb.status()).toBe(200);expect((await glb.body()).subarray(0,4).toString()).toBe('glTF');
    expect(errors).toEqual([]);
  });
}

test('source facts cannot change silently and the film stays available',async({page})=>{
  await page.route('**/architectural-catalog/data/catalog-facts.json',route=>route.fulfill({contentType:'application/json',body:'{"products":[]}'}));
  await page.goto(base);
  await expect(page.locator('#loading')).toContainText('Catalog facts checksum mismatch');
  await expect(page.getByRole('link',{name:'Watch the catalog film instead'})).toHaveAttribute('href','media/catalog-film.mp4');
  expect(await page.evaluate(()=>(window as any).catalogStudy.ready)).toBe(false);
});

test('catalog comparison and downloads work without JavaScript',async({browser,baseURL})=>{
  const context=await browser.newContext({javaScriptEnabled:false,baseURL});const page=await context.newPage();
  await page.goto(base);await expect(page.getByRole('table')).toContainText('B3000');await expect(page.getByRole('table')).toContainText('Two side by side');
  await expect(page.getByRole('link',{name:'Watch the catalog film',exact:true})).toBeVisible();
  expect((await page.request.get(base+'media/catalog-film.mp4')).status()).toBe(200);await context.close();
});

test('main-page preview and case-study film lead to the interactive catalog',async({page})=>{
  await page.goto('/');const card=page.locator('.featured-card').filter({has:page.getByRole('heading',{name:'From drawing to catalog',exact:true})});
  await card.scrollIntoViewIfNeeded();const video=card.locator('video');
  await expect(video).toHaveAttribute('src',base+'media/catalog-loop.mp4');
  await expect.poll(()=>video.evaluate((v:HTMLVideoElement)=>!v.paused&&v.currentTime>.3)).toBe(true);
  expect(await video.evaluate((v:HTMLVideoElement)=>[v.videoWidth,v.videoHeight,v.muted])).toEqual([1280,720,true]);
  await card.getByRole('button',{name:'Pause From drawing to catalog preview',exact:true}).click();
  expect(await video.evaluate((v:HTMLVideoElement)=>v.paused)).toBe(true);
  await page.goto('/projects/architectural-drawing-and-interior-catalog-matching/');
  await expect(page.getByRole('link',{name:'Explore catalog in 3D',exact:true}).first()).toHaveAttribute('href',/\/docs\/architectural-catalog\/$/);
  await expect(page.locator('header.hero video source')).toHaveAttribute('src',base+'media/catalog-film.mp4');
  await expect(page.locator('header.hero video track')).toHaveAttribute('src',/catalog\.vtt$/);
});

test('catalog story is discoverable on arrival and can be inspected fullscreen',async({page})=>{
  await page.setViewportSize({width:1440,height:1000});
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.goto('/');
  const study=page.locator('.hero__study'),video=study.locator('video');
  await expect(study).toBeVisible();
  const bounds=await study.boundingBox();expect(bounds!.y+bounds!.height).toBeLessThan(1000);
  await expect(video).toHaveAttribute('poster',base+'media/catalog-teaser.jpg');
  expect(await video.getAttribute('src')).toBeNull();
  await study.getByRole('button',{name:'Play Catalog story on the main page',exact:true}).click();
  await expect.poll(()=>video.evaluate((v:HTMLVideoElement)=>!v.paused&&v.currentTime>.2)).toBe(true);
  await study.getByRole('button',{name:'Pause Catalog story on the main page',exact:true}).click();
  expect(await video.evaluate((v:HTMLVideoElement)=>v.paused)).toBe(true);
  await study.getByRole('link',{name:'Open the 3D story',exact:false}).click();
  await page.waitForFunction(()=>(window as any).catalogStudy?.ready);
  await page.getByRole('button',{name:'Fullscreen',exact:true}).click();
  await expect.poll(()=>page.evaluate(()=>document.fullscreenElement?.className)).toBe('model-area');
  await page.getByRole('button',{name:'Exit fullscreen',exact:true}).click();
  await expect.poll(()=>page.evaluate(()=>document.fullscreenElement)).toBeNull();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth)).toBe(false);
});

test('mobile arrival offers a direct story link without moving the primary actions out of view',async({page})=>{
  await page.emulateMedia({reducedMotion:'reduce'});
  for(const width of [360,390]){
    await page.setViewportSize({width,height:900});await page.goto('/');
    const link=page.locator('.hero__3d-link');
    await expect(link).toBeVisible();await expect(link).toHaveAttribute('href',base);
    for(const name of ['Selected work','Download resume']){
      const box=await page.getByRole('link',{name,exact:false}).first().boundingBox();
      expect(box!.y+box!.height).toBeLessThan(900);
    }
    expect(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth)).toBe(false);
    await link.click();await page.waitForFunction(()=>(window as any).catalogStudy?.ready);
    await expect(page.getByRole('button',{name:'Play story',exact:true})).toBeVisible();
  }
});

test('portrait fullscreen keeps both cabinet variants and opened components in frame',async({page})=>{
  await page.setViewportSize({width:390,height:844});
  await page.goto(base);await page.waitForFunction(()=>(window as any).catalogStudy?.ready);
  await page.getByRole('button',{name:'Fullscreen',exact:true}).click();
  await expect.poll(()=>page.evaluate(()=>document.fullscreenElement?.className)).toBe('model-area');
  for(const time of ['0','8','16','24','32','40','48','56'])for(const width of ['24','48']){
    await page.getByLabel('Story time',{exact:true}).fill(time);
    await page.getByLabel('Nominal width',{exact:true}).selectOption(width);
    for(const opening of ['0','1']){
      await page.getByLabel('Open doors & drawers',{exact:true}).fill(opening);
      await page.getByLabel('Separate components',{exact:true}).fill(opening);
      const bounds=await page.evaluate(()=>(window as any).catalogStudy.inspect().frameBounds);
      expect(bounds).toHaveLength(Number(time)>=48?1:2);
      for(const box of bounds){
        const state=`${box.code} ${width} inches / open ${opening} / time ${time}`;
        expect(box.minX,`${state}: left edge`).toBeGreaterThan(-.98);
        expect(box.maxX,`${state}: right edge`).toBeLessThan(.98);
        expect(box.minY,`${state}: bottom edge`).toBeGreaterThan(-.98);
        expect(box.maxY,`${state}: top edge`).toBeLessThan(.98);
      }
    }
  }
  await page.getByRole('button',{name:'Exit fullscreen',exact:true}).click();
});

test('denied fullscreen opens a usable expanded view with keyboard exit',async({page})=>{
  await page.addInitScript(()=>{
    Element.prototype.requestFullscreen=()=>Promise.reject(new DOMException('Blocked by browser policy','NotAllowedError'));
  });
  await page.setViewportSize({width:390,height:844});
  const errors:string[]=[];page.on('pageerror',error=>errors.push(error.message));
  await page.goto(base);await page.waitForFunction(()=>(window as any).catalogStudy?.ready);
  await page.getByRole('button',{name:'Fullscreen',exact:true}).click();
  const expanded=page.getByRole('dialog',{name:'Interactive drawing to room workflow',exact:true});
  await expect(expanded).toBeVisible();
  await expect(expanded).toHaveAttribute('aria-modal','true');
  await expect(expanded.getByRole('button',{name:'Close expanded view',exact:true})).toBeVisible();
  await page.getByLabel('Nominal width',{exact:true}).selectOption('48');
  await page.getByLabel('Open doors & drawers',{exact:true}).fill('1');
  await page.getByLabel('Select a part',{exact:true}).selectOption('doors');
  await page.getByLabel('Select a part',{exact:true}).press('Tab');
  expect(await page.evaluate(()=>document.activeElement?.id)).toBe('scene');
  await page.keyboard.press('Shift+Tab');
  expect(await page.evaluate(()=>document.activeElement?.id)).toBe('part');
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(page.getByRole('button',{name:'Fullscreen',exact:true})).toBeFocused();
  await expect(page.getByLabel('Nominal width',{exact:true})).toHaveValue('48');
  expect(await page.evaluate(()=>(window as any).catalogStudy.inspect().opening)).toBe(1);
  expect(await page.evaluate(()=>(document.querySelector('.site-header') as HTMLElement)?.inert)).toBe(false);
  expect(errors).toEqual([]);
});


test('all eight phases render distinct evidence and geometry with deterministic seeking',async({page},testInfo)=>{
  await page.setViewportSize({width:1440,height:1000});await page.goto(base);
  await page.waitForFunction(()=>(window as any).catalogStudy?.ready);
  const phases=['drawing','extract','match','inspect','review','render','room','result'];
  const images=new Set<string>();
  for(let i=0;i<phases.length;i++){
    await page.getByLabel('Story time',{exact:true}).fill(String(i*8+6));
    const state=await page.evaluate(()=>(window as any).catalogStudy.inspect());
    expect(state.chapter).toBe(phases[i]);expect(state.workflow.stage).toBe(phases[i]);
    expect(state.workflow.visibleGroups).toContain('Workflow: '+phases[i]);
    await expect(page.locator('#stage-action')).not.toBeEmpty();
    if(['drawing','extract','match','render'].includes(phases[i]))expect(state.workflow.asset).toMatch(/data\/examples\/B3000-/);
    if(phases[i]==='inspect'){expect(state.opening).toBe(1);expect(state.separate).toBeGreaterThan(.5);expect(state.drawers).toEqual([1,2]);}
    if(phases[i]==='review')await expect(page.locator('#stage-detail')).toContainText('pending');
    if(phases[i]==='render'){expect(state.workflow.recordedImageWidthInches).toBe(36);expect(state.workflow.recordedImageFinish).toBe('oak');}
    if(i>=6){expect(state.workflow.roomVisible).toBe(true);expect(state.frameBounds).toHaveLength(1);}
    const pixels=await page.locator('#scene').screenshot();images.add(pixels.toString('base64'));
    await page.screenshot({path:testInfo.outputPath('phase-'+phases[i]+'.png'),fullPage:true});
  }
  expect(images.size).toBe(8);
  for(const [early,late,field] of [[.4,6,'scanY'],[8.4,14,'tokenX'],[16.4,22,'catalogAngle'],[40.4,46,'renderScale'],[48.4,54,'wallScale']] as const){
    await page.getByLabel('Story time',{exact:true}).fill(String(early));const a=await page.evaluate(()=>(window as any).catalogStudy.inspect().workflow);
    await page.getByLabel('Story time',{exact:true}).fill(String(late));const b=await page.evaluate(()=>(window as any).catalogStudy.inspect().workflow);
    expect(a[field]).not.toBe(b[field]);
    await page.getByLabel('Story time',{exact:true}).fill(String(early));
    expect(await page.evaluate(()=>(window as any).catalogStudy.inspect().workflow)).toEqual(a);
  }
  await page.getByRole('button',{name:'B3100',exact:true}).click();
  await page.getByLabel('Story time',{exact:true}).fill('46');
  expect(await page.evaluate(()=>(window as any).catalogStudy.inspect().workflow.asset)).toBe('data/examples/B3100-render.png');
  await expect(page.locator('#source')).toContainText('B3100');
});

test('final room fit responds to both families, nominal width and bay width',async({page},testInfo)=>{
  await page.setViewportSize({width:390,height:900});await page.goto(base);await page.waitForFunction(()=>(window as any).catalogStudy?.ready);
  await page.getByLabel('Illustrative bay width',{exact:true}).fill('1000');
  await expect(page.locator('#chapter-number')).toContainText('Fit in a room');
  const fit=await page.evaluate(()=>(window as any).catalogStudy.inspect().workflow);
  expect(fit.roomVisible).toBe(true);expect(fit.fits).toBe(true);expect(fit.cabinetWidthMm).toBeCloseTo(914.4);expect(fit.sideClearanceMm).toBeCloseTo(42.8);
  await page.getByLabel('Nominal width',{exact:true}).selectOption('48');
  await expect(page.locator('#fit-status')).toContainText('needs 219.2 mm more bay width');
  expect(await page.evaluate(()=>(window as any).catalogStudy.inspect().workflow.fits)).toBe(false);
  await page.getByLabel('Illustrative bay width',{exact:true}).fill('1300');
  await expect(page.locator('#fit-status')).toContainText('40.4 mm per side');
  await page.getByRole('button',{name:'B3100',exact:true}).click();
  const family=await page.evaluate(()=>(window as any).catalogStudy.inspect());
  expect(family.workflow.roomVisible).toBe(true);expect(family.workflow.fits).toBe(true);expect(family.frameBounds.map((b:any)=>b.code)).toEqual(['B3100']);
  await page.getByLabel('Story time',{exact:true}).fill('64');
  await expect(page.locator('#chapter-number')).toContainText('Take the result');
  await expect(page.locator('#timecode')).toHaveText('1:04 / 1:04');
  expect(await page.evaluate(()=>(window as any).catalogStudy.inspect().workflow.roomVisible)).toBe(true);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth)).toBe(false);
  await page.screenshot({path:testInfo.outputPath('final-room-mobile.png'),fullPage:true});
});

test('original image evidence cannot change silently',async({page})=>{
  await page.route('**/architectural-catalog/data/examples/B3000-drawing.png',route=>route.fulfill({body:'altered original image'}));
  await page.goto(base);await expect(page.locator('#loading')).toContainText('Workflow evidence checksum mismatch');
  expect(await page.evaluate(()=>(window as any).catalogStudy.ready)).toBe(false);
  await expect(page.getByRole('link',{name:'Watch the catalog film instead'})).toBeVisible();
});


test('orbiting original evidence preserves its phase and pauses playback',async({page})=>{
  await page.setViewportSize({width:1440,height:1000});await page.goto(base);await page.waitForFunction(()=>(window as any).catalogStudy?.ready);
  await page.getByRole('button',{name:'Play story',exact:true}).click();
  await expect.poll(()=>page.evaluate(()=>(window as any).catalogStudy.inspect().time)).toBeGreaterThan(.1);
  const rect=await page.locator('#scene').boundingBox();
  await page.mouse.move(rect!.x+rect!.width*.5,rect!.y+rect!.height*.4);await page.mouse.down();
  await page.mouse.move(rect!.x+rect!.width*.5+40,rect!.y+rect!.height*.4+20,{steps:5});await page.mouse.up();
  const state=await page.evaluate(()=>(window as any).catalogStudy.inspect());
  expect(state.playing).toBe(false);expect(state.workflow.stage).toBe('drawing');expect(state.workflow.asset).toBe('data/examples/B3000-drawing.png');expect(state.frameBounds).toHaveLength(0);
});


test('scene keeps its captions separate and depth tests all stages at every viewport',async({page})=>{
  for(const width of [360,390,768,1440]){
    await page.setViewportSize({width,height:1000});await page.goto(base);await page.waitForFunction(()=>(window as any).catalogStudy?.ready);
    for(const time of Array.from({length:8},(_,i)=>[i*8,i*8+4,i*8+7.95]).flat()){
      const c=await page.evaluate(t=>{(window as any).catalogStudy.seek(t);return (window as any).catalogStudy.composition();},time);
      expect(c.canvas.bottom).toBeLessThanOrEqual(c.caption.top+.5);expect(c.fade).toBe(1);
      expect(c.objects.filter((o:any)=>o.depthTest===false||o.minX<=-.98||o.maxX>=.98||o.minY<=-.98||o.maxY>=.98)).toEqual([]);
    }
    await page.evaluate(()=>(window as any).catalogStudy.seek(55.958333333));const before=await page.evaluate(()=>(window as any).catalogStudy.inspect());
    await page.evaluate(()=>(window as any).catalogStudy.seek(56));const after=await page.evaluate(()=>(window as any).catalogStudy.inspect());expect(after.camera).toEqual(before.camera);
  }
});
