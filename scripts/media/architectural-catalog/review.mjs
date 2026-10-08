import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import {spawnSync} from 'node:child_process';
import {chromium} from 'playwright';
import {checkComposition} from './composition-review.mjs';
import {assertDecodedOutput} from './decoded-output.mjs';

const ROOT=fileURLToPath(new URL('../../../',import.meta.url));
const out=path.resolve(ROOT,process.env.CATALOG_REVIEW_OUTPUT||'private/visual-review-20261002/revised');fs.mkdirSync(out,{recursive:true});
const base=process.env.CATALOG_REVIEW_URL||'http://127.0.0.1:4174/architectural-catalog/';
const browser=await chromium.launch({executablePath:process.env.CHROME_PATH||'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true,args:['--enable-gpu']});
const report={kind:'COMPOSITION_REVIEW',source:'current rendered implementation',samples:[],screenshots:[],decoded:[],limitation:'Bounds and depth tests detect clipping/overlay regressions. An independent visual reviewer must inspect the actual frames and motion.'};
try{
  const page=await browser.newPage();
  for(const width of [360,390,768,1440,1920]){
    await page.setViewportSize({width,height:width===1920?1080:1000});await page.goto(base+(width===1920?'?capture':''));await page.waitForFunction(()=>catalogStudy.ready);
    for(let t=0;t<64;t+=.5){
      const frame=await page.evaluate(t=>{catalogStudy.seek(t);return catalogStudy.composition();},t);
      report.samples.push({width,...checkComposition(frame,t)});
    }
    for(const time of [4,12,20,28,36,44,52,60]){
      await page.evaluate(t=>catalogStudy.seek(t),time);
      const name=`${width}-phase-${time}.png`;
      await (width===1920?page:page.locator('.model-area')).screenshot({path:path.join(out,name)});report.screenshots.push(name);
    }
    await page.evaluate(()=>catalogStudy.seek(55.958333333));const before=await page.evaluate(()=>catalogStudy.inspect());
    await page.evaluate(()=>catalogStudy.seek(56));const after=await page.evaluate(()=>catalogStudy.inspect());
    if(JSON.stringify(before.camera)!==JSON.stringify(after.camera))throw Error('Room-to-result camera discontinuity at '+width);
  }
  if(process.argv.includes('--decoded')){
    const film=path.join(ROOT,'public/architectural-catalog/media/catalog-film.mp4'),bytes=fs.readFileSync(film);
    report.filmSha256=createHash('sha256').update(bytes).digest('hex');
    for(const time of [0,.25,4,7.75,7.958,8,8.25,12,15.75,15.958,16,16.25,20,23.75,23.958,24,24.25,28,31.75,31.958,32,32.25,36,39.75,39.958,40,40.25,44,47.75,47.958,48,48.25,52,55.75,55.958,56,56.25,60,63.75,63.958]){
      const name=`decoded-${time.toFixed(3)}.png`,r=spawnSync('ffmpeg',['-hide_banner','-loglevel','error','-y','-ss',String(time),'-i',film,'-frames:v','1',path.join(out,name)],{encoding:'utf8'});assertDecodedOutput(r,path.join(out,name));report.decoded.push({time,path:name});
    }
  }
  fs.writeFileSync(path.join(out,'composition.json'),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify({passed:true,samples:report.samples.length,screenshots:report.screenshots.length,decoded:report.decoded.length,out}));
}finally{await browser.close();}
