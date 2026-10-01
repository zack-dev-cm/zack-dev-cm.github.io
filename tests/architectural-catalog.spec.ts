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
    expect(initial.visibleMeshes).toBeGreaterThan(60);expect(initial.triangles).toBeGreaterThan(1000);
    for(let i=0;i<6;i++){
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
    await page.getByRole('button',{name:'05 Check dimensions',exact:true}).click();
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
