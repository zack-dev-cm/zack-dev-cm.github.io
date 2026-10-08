import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import assert from 'node:assert/strict';
import {test} from 'node:test';
import {publishFiles,publishFileGroups} from './publish.mjs';

test('an interrupted generation restores old media and its receipt',()=>{
 const root=fs.mkdtempSync(path.join(os.tmpdir(),'media-publish-')),staging=path.join(root,'staging'),dest=path.join(root,'media');
 fs.mkdirSync(staging);fs.mkdirSync(dest);
 try{
  for(const name of ['film.mp4','preview.gif','capture.json']){fs.writeFileSync(path.join(dest,name),'old-'+name);fs.writeFileSync(path.join(staging,name),'new-'+name);}
  let calls=0;assert.throws(()=>publishFiles(staging,dest,['film.mp4','preview.gif','capture.json'],(a,b)=>{if(++calls===2)throw Error('injected disk failure');fs.renameSync(a,b);}),/injected disk failure/);
  for(const name of ['film.mp4','preview.gif','capture.json'])assert.equal(fs.readFileSync(path.join(dest,name),'utf8'),'old-'+name);
  publishFiles(staging,dest,['film.mp4','preview.gif','capture.json']);
  for(const name of ['film.mp4','preview.gif','capture.json'])assert.equal(fs.readFileSync(path.join(dest,name),'utf8'),'new-'+name);
 }finally{fs.rmSync(root,{recursive:true,force:true});}
});

test('an overlapping publisher cannot replace files or release another lock',()=>{
 const root=fs.mkdtempSync(path.join(os.tmpdir(),'media-lock-')),staging=path.join(root,'staging'),dest=path.join(root,'models');
 fs.mkdirSync(staging);fs.mkdirSync(dest);fs.mkdirSync(path.join(dest,'.publish.lock'));
 try{
  fs.writeFileSync(path.join(dest,'model.glb'),'old');fs.writeFileSync(path.join(staging,'model.glb'),'new');
  assert.throws(()=>publishFiles(staging,dest,['model.glb']),{code:'EEXIST'});
  assert.equal(fs.readFileSync(path.join(dest,'model.glb'),'utf8'),'old');assert(fs.existsSync(path.join(dest,'.publish.lock')));
 }finally{fs.rmSync(root,{recursive:true,force:true});}
});

test('model replacement failure restores the complete media and model generation',()=>{
 const root=fs.mkdtempSync(path.join(os.tmpdir(),'media-model-rollback-')),staging=path.join(root,'staging'),media=path.join(root,'media'),models=path.join(root,'models');
 for(const directory of [staging,media,models])fs.mkdirSync(directory);
 const groups=[{staging,destination:media,names:['film.mp4','capture.json']},{staging,destination:models,names:['model.glb','model.json']}];
 try{
  for(const group of groups)for(const name of group.names){fs.writeFileSync(path.join(group.destination,name),'old-'+name);fs.writeFileSync(path.join(staging,name),'new-'+name);}
  let calls=0;assert.throws(()=>publishFileGroups(groups,(a,b)=>{if(++calls===4)throw Error('injected model failure');fs.renameSync(a,b);}),/injected model failure/);
  for(const group of groups)for(const name of group.names)assert.equal(fs.readFileSync(path.join(group.destination,name),'utf8'),'old-'+name);
  assert.deepEqual(fs.readdirSync(media).sort(),['capture.json','film.mp4']);
  assert.deepEqual(fs.readdirSync(models).sort(),['model.glb','model.json']);
 }finally{fs.rmSync(root,{recursive:true,force:true});}
});

test('a locked model destination prevents publishing new media or its receipt',()=>{
 const root=fs.mkdtempSync(path.join(os.tmpdir(),'media-model-lock-')),staging=path.join(root,'staging'),media=path.join(root,'media'),models=path.join(root,'models');
 for(const directory of [staging,media,models])fs.mkdirSync(directory);
 const groups=[{staging,destination:media,names:['film.mp4']},{staging,destination:models,names:['model.glb']}];
 try{
  for(const group of groups)for(const name of group.names){fs.writeFileSync(path.join(group.destination,name),'old');fs.writeFileSync(path.join(staging,name),'new');}
  fs.mkdirSync(path.join(models,'.publish.lock'));
  assert.throws(()=>publishFileGroups(groups),{code:'EEXIST'});
  assert.equal(fs.readFileSync(path.join(media,'film.mp4'),'utf8'),'old');
  assert(fs.existsSync(path.join(models,'.publish.lock')));
  assert(!fs.existsSync(path.join(media,'.publish.lock')));
 }finally{fs.rmSync(root,{recursive:true,force:true});}
});
