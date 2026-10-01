import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import http from 'node:http';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import {spawn,spawnSync} from 'node:child_process';
import {once} from 'node:events';
import {chromium} from 'playwright';
import {publishFiles} from '../engineering-studies/publish.mjs';
import {CHAPTERS,DURATION} from '../../../public/architectural-catalog/timeline.js';

const PUBLIC=fileURLToPath(new URL('../../../public/',import.meta.url));
const ROOT=path.join(PUBLIC,'architectural-catalog');
fs.mkdirSync(path.join(ROOT,'media'),{recursive:true});
fs.mkdirSync(path.join(ROOT,'models'),{recursive:true});
const digest=b=>createHash('sha256').update(b).digest('hex');
const sourceNames=['index.html','studio.css','studio.js','cabinets.js','timeline.js','data/catalog-facts.json'];
const vendorNames=['three.module.min.js','three.core.min.js','OrbitControls.js','GLTFExporter.js'];
const frozen=new Map(sourceNames.map(n=>['architectural-catalog/'+n,fs.readFileSync(path.join(ROOT,n))]));
for(const n of vendorNames)frozen.set('engineering-studies/vendor/'+n,fs.readFileSync(path.join(PUBLIC,'engineering-studies/vendor',n)));
const pixels=new URL('../engineering-studies/capture-pixels.mjs',import.meta.url);
frozen.set('architectural-catalog/capture-pixels.mjs',fs.readFileSync(pixels));
const toolPaths=[fileURLToPath(import.meta.url),fileURLToPath(new URL('../engineering-studies/publish.mjs',import.meta.url)),fileURLToPath(pixels)];
const frozenTools=new Map(toolPaths.map(p=>[path.basename(p),fs.readFileSync(p)]));
const staging=fs.mkdtempSync(path.join(os.tmpdir(),'architectural-catalog-capture-'));
const types={'.html':'text/html','.css':'text/css','.js':'text/javascript','.mjs':'text/javascript','.json':'application/json'};
const server=http.createServer((req,res)=>{let name=decodeURIComponent(new URL(req.url,'http://localhost').pathname).slice(1);if(name.endsWith('/'))name+='index.html';const body=frozen.get(name);if(!body){res.writeHead(404);res.end();return;}res.writeHead(200,{'Content-Type':types[path.extname(name)]||'application/octet-stream','Cache-Control':'no-store'});res.end(body);});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
let browser,encoder,encoderDone;
const errors=[];
try{
  browser=await chromium.launch({executablePath:process.env.CHROME_PATH||(process.platform==='darwin'?'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome':'/usr/bin/google-chrome'),headless:true,args:process.env.SOFTWARE_GL==='1'?['--enable-unsafe-swiftshader']:['--enable-gpu']});
  const page=await browser.newPage({viewport:{width:1920,height:1080},deviceScaleFactor:1});
  page.on('pageerror',e=>errors.push(e.message));
  await page.goto(`http://127.0.0.1:${server.address().port}/architectural-catalog/?capture`);
  await page.waitForFunction(()=>window.catalogStudy?.ready||window.catalogStudy?.error,null,{timeout:60000});
  const error=await page.evaluate(()=>catalogStudy.error);if(error)throw Error(error);
  const sourceFacts=await page.evaluate(()=>catalogStudy.inspect().facts);
  const renderer=await page.evaluate(()=>{const gl=catalogStudy.renderer.getContext(),e=gl.getExtension('WEBGL_debug_renderer_info');return e?gl.getParameter(e.UNMASKED_RENDERER_WEBGL):gl.getParameter(gl.RENDERER);});
  const glb=Buffer.from(await page.evaluate(()=>catalogStudy.exportGLB()));
  assert.equal(glb.toString('ascii',0,4),'glTF');assert.equal(glb.readUInt32LE(4),2);assert.equal(glb.readUInt32LE(8),glb.length);
  const gltf=JSON.parse(glb.toString('utf8',20,20+glb.readUInt32LE(12)));assert(gltf.meshes.length>30);
  fs.writeFileSync(path.join(staging,'catalog-cabinets.glb'),glb);
  fs.writeFileSync(path.join(staging,'catalog-cabinets.json'),JSON.stringify({format:'glTF 2.0',units:'metres',meshes:gltf.meshes.length,bytes:glb.length,sha256:digest(glb),sourceFacts,scope:'Catalog family explanation; authored finish, movement, panel and hardware details. Not fabrication geometry.'},null,2)+'\n');
  for(const [name,t] of [['poster',1.8],['compare',12.5],['open',19.3],['dimensions',23]]){
    await page.evaluate(t=>catalogStudy.seek(t),t);
    await page.screenshot({path:path.join(staging,`catalog-${name}.jpg`),type:'jpeg',quality:94});
  }
  if(process.argv.includes('--preview')){
    const dir=path.join(ROOT,'media');fs.mkdirSync(dir,{recursive:true});
    for(const n of ['poster','compare','open','dimensions'])fs.copyFileSync(path.join(staging,`catalog-${n}.jpg`),path.join(dir,`catalog-${n}.jpg`));
    publishFiles(staging,path.join(ROOT,'models'),['catalog-cabinets.glb','catalog-cabinets.json']);
    console.log(JSON.stringify({preview:true,renderer,meshes:gltf.meshes.length,errors}));
  }else{
    const film=path.join(staging,'catalog-film.mp4');
    encoder=spawn('ffmpeg',['-hide_banner','-loglevel','error','-y','-f','image2pipe','-vcodec','mjpeg','-framerate','24','-i','pipe:0','-an','-c:v','libx264','-preset','fast','-crf','21','-pix_fmt','yuv420p','-t',String(DURATION),'-movflags','+faststart','-metadata','title=From drawing to catalog','-metadata','comment=Catalog-grounded procedural 3D explanation; not OCR inference or fabrication geometry.',film],{stdio:['pipe','ignore','pipe']});
    let stderr='';encoder.stderr.on('data',b=>stderr+=b);encoder.stdin.on('error',()=>{});
    encoderDone=new Promise((resolve,reject)=>{encoder.once('close',code=>code===0?resolve():reject(Error(stderr||'Encoder failed: '+code)));encoder.once('error',reject);});encoderDone.catch(()=>{});
    await page.evaluate(async()=>{
      window.compareReadbacks=(await import('./capture-pixels.mjs')).compareReadbacks;
      window.readbackCanvas=new OffscreenCanvas(1306,1080);
      const img=document.createElement('img');img.id='capture-bitmap';img.style.cssText='position:absolute;inset:0;width:100%;height:100%;pointer-events:none';document.querySelector('#scene').after(img);document.querySelector('#scene').style.visibility='hidden';
    });
    const frames=[],started=Date.now();
    for(let i=0;i<DURATION*24;i++){
      const frame=await page.evaluate(async t=>{
        const app=catalogStudy,gl=app.renderer.getContext(),canvas=app.renderer.domElement;
        const r=window.readbackCanvas;if(r.width!==canvas.width||r.height!==canvas.height){r.width=canvas.width;r.height=canvas.height;}
        const ctx=r.getContext('2d',{willReadFrequently:true}),img=document.querySelector('#capture-bitmap');
        let previous='',oldPixels=null,url='',stable=false,comparison,attempts=0;
        for(;attempts<12;attempts++){
          app.seek(t);gl.finish();if(gl.isContextLost()||gl.getError()!==gl.NO_ERROR)throw Error('WebGL readback failed at '+t);
          url=canvas.toDataURL('image/png');img.src=url;await img.decode();ctx.drawImage(img,0,0);const pixels=ctx.getImageData(0,0,r.width,r.height).data;
          if(oldPixels){comparison=url===previous?{match:true,mean:0,tileMean:0,changedFraction:0}:compareReadbacks(oldPixels,pixels,r.width,r.height);if(comparison.match){stable=true;break;}}
          previous=url;oldPixels=pixels;
        }
        if(!stable)throw Error('Unstable scene at '+t+': '+JSON.stringify(comparison));
        return {time:t,chapter:app.inspect().chapter,attempts:attempts+1,comparison,pngDataUrlSha256:Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(url))),b=>b.toString(16).padStart(2,'0')).join('')};
      },i/24);
      const jpg=await page.screenshot({type:'jpeg',quality:94});
      if(!encoder.stdin.write(jpg))await Promise.race([once(encoder.stdin,'drain'),encoderDone.then(()=>{throw Error('Encoder finished before all frames');})]);
      frames.push(frame);if(i%120===0)console.log(`${i}/720 frames, ${Math.round((Date.now()-started)/1000)} seconds`);
    }
    encoder.stdin.end();await encoderDone;
    const transcode=spawnSync('ffmpeg',['-hide_banner','-loglevel','error','-y','-i',film,'-an','-vf','scale=1280:720','-c:v','libx264','-preset','slow','-crf','25','-pix_fmt','yuv420p','-movflags','+faststart',path.join(staging,'catalog-loop.mp4')],{encoding:'utf8'});if(transcode.status!==0)throw Error(transcode.stderr);
    const stamp=t=>'00:'+String(Math.floor(t/60)).padStart(2,'0')+':'+(t%60).toFixed(3).padStart(6,'0');
    fs.writeFileSync(path.join(staging,'catalog.vtt'),'WEBVTT\n\n'+CHAPTERS.map((c,i)=>`${i+1}\n${stamp(i*5)} --> ${stamp((i+1)*5)}\n${c.title} ${c.copy}\n`).join('\n'));
    assert.deepEqual(errors,[]);
    for(const [n,b] of frozen)assert.equal(digest(fs.readFileSync(n==='architectural-catalog/capture-pixels.mjs'?pixels:path.join(PUBLIC,n))),digest(b),'Source changed during capture: '+n);
    for(const p of toolPaths)assert.equal(digest(fs.readFileSync(p)),digest(frozenTools.get(path.basename(p))),'Capture tool changed');
    const mediaNames=['catalog-film.mp4','catalog-loop.mp4','catalog-poster.jpg','catalog-compare.jpg','catalog-open.jpg','catalog-dimensions.jpg','catalog.vtt'];
    const outputs=Object.fromEntries([...mediaNames,'catalog-cabinets.glb','catalog-cabinets.json'].map(n=>{const b=fs.readFileSync(path.join(staging,n));return [n,{bytes:b.length,sha256:digest(b)}];}));
    fs.writeFileSync(path.join(staging,'catalog-capture.json'),JSON.stringify({kind:'DETERMINISTIC_BROWSER_CAPTURE',width:1920,height:1080,fps:24,duration:DURATION,frameCount:frames.length,renderer,stableCanvasReadbacks:2,sourceSha256:Object.fromEntries([...frozen].map(([n,b])=>[n,digest(b)])),toolSha256:Object.fromEntries([...frozenTools].map(([n,b])=>[n,digest(b)])),outputs,pageErrors:errors,scope:sourceFacts.scope,frames},null,2)+'\n');
    publishFiles(staging,path.join(ROOT,'media'),[...mediaNames,'catalog-capture.json']);
    publishFiles(staging,path.join(ROOT,'models'),['catalog-cabinets.glb','catalog-cabinets.json']);
    console.log(JSON.stringify({completed:true,outputs,renderer}));
  }
}finally{
  if(encoder&&encoder.exitCode===null&&encoder.signalCode===null)encoder.kill();try{await encoderDone;}catch{}
  await browser?.close();await new Promise(resolve=>{server.close(resolve);server.closeAllConnections();});fs.rmSync(staging,{recursive:true,force:true});
}
