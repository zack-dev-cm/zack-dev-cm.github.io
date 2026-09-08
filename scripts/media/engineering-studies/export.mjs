import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {ROOT,session,open} from './browser.mjs';
import {publishFiles} from './publish.mjs';

const digest=bytes=>createHash('sha256').update(bytes).digest('hex');
const local=path.resolve(ROOT,'../../node_modules/.engineering-capture');
fs.mkdirSync(local,{recursive:true});
const staging=fs.mkdtempSync(path.join(local,'model-export-'));
let s;
try{
 const names=['studio.html','studio.css','studio.js','scene-kit.js','agnitra-model.js','retrieval-model.js','timeline.js',...fs.readdirSync(path.join(ROOT,'data')).map(n=>'data/'+n),...['three.module.min.js','three.core.min.js','OrbitControls.js','GLTFExporter.js'].map(n=>'vendor/'+n)];
 const frozen=new Map(names.map(name=>[name,fs.readFileSync(path.join(ROOT,name))]));
 const toolNames=['export.mjs','browser.mjs','publish.mjs'];
 const frozenTools=new Map(toolNames.map(name=>[name,fs.readFileSync(new URL('./'+name,import.meta.url))]));
 s=await session();
 await s.page.route('**/*',route=>{
  const name=decodeURIComponent(new URL(route.request().url()).pathname).slice(1),body=frozen.get(name);
  if(!body)return route.abort();
  const type={'.html':'text/html','.css':'text/css','.js':'text/javascript','.json':'application/json','.png':'image/png'}[path.extname(name)]||'application/octet-stream';
  return route.fulfill({status:200,body,contentType:type});
 });
 for(const project of ['agnitra','retrieval']){
  await open(s,project);
  const bytes=Buffer.from(await s.page.evaluate(()=>neuralFilm.exportGLB()));
  assert.equal(bytes.toString('ascii',0,4),'glTF');assert.equal(bytes.readUInt32LE(4),2);assert.equal(bytes.readUInt32LE(8),bytes.length);
  const json=JSON.parse(bytes.toString('utf8',20,20+bytes.readUInt32LE(12)));assert(json.meshes.length>10);
  const sourceFacts=await s.page.evaluate(()=>neuralFilm.inspect().facts);
  fs.writeFileSync(path.join(staging,project+'.glb'),bytes);
  fs.writeFileSync(path.join(staging,project+'.json'),JSON.stringify({format:'glTF 2.0',meshes:json.meshes.length,bytes:bytes.length,sha256:digest(bytes),sourceFacts,sourceSha256:Object.fromEntries([...frozen].map(([n,b])=>[n,digest(b)])),toolSha256:Object.fromEntries([...frozenTools].map(([n,b])=>[n,digest(b)])),units:'Illustrative display units; not manufacturing or anatomical dimensions'},null,2)+'\n');
 }
 for(const [name,bytes] of frozen)assert.equal(digest(fs.readFileSync(path.join(ROOT,name))),digest(bytes),'Export input changed: '+name);
 for(const [name,bytes] of frozenTools)assert.equal(digest(fs.readFileSync(new URL('./'+name,import.meta.url))),digest(bytes),'Export tool changed: '+name);
 publishFiles(staging,path.join(ROOT,'models'),['agnitra.glb','agnitra.json','retrieval.glb','retrieval.json']);
 for(const project of ['agnitra','retrieval']){const m=JSON.parse(fs.readFileSync(path.join(ROOT,'models',project+'.json')));console.log(`${project}: ${m.meshes} meshes, ${m.bytes} bytes, ${m.sha256}`);}
}finally{try{await s?.close();}finally{fs.rmSync(staging,{recursive:true,force:true});}}
