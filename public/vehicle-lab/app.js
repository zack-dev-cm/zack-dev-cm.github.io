import * as T from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {CHAPTERS, DURATION, chapterAt} from './chapters.js';
import {createReplay} from './replay-player.js';
import {assetPath,validateProject,validateGeometry,sha256} from './project-contract.js';
import {mountProjectRecord} from './project-record.js';

const $ = s => document.querySelector(s);
const capture = new URLSearchParams(location.search).has('capture');
if (capture) document.body.classList.add('capture');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const colors = {frame:0x4d6a78, suspension:0xa083a2, drive:0xcf8650, electrical:0x6faaa0, body:0xe97948, hardware:0xb8bcb5, wheels:0x303a39};
let renderer, scene, camera, controls, floor, grid, defaultFog;
let models = Object.create(null), replay, physics, manifest, history;
let current = -1, clock = 0, playing = false, previous = 0, animation = null, disposed = false;
let userView = false, userExplode = false, userWire = false, solo = 'all';
let lastPhysicsFrame = null;
let chapters=CHAPTERS, duration=DURATION, customProject=null;
const customReplays=Object.create(null);
window.vehicleTour = {ready:false, duration:DURATION};

const ease = t => {const v=Math.max(0,Math.min(1,t));return v*v*(3-2*v);};
const formatTime = t => `${String(Math.floor(t/60)).padStart(2,'0')}:${String(Math.floor(t%60)).padStart(2,'0')}`;
async function json(path) {const r=await fetch(assetPath(path),{cache:'no-store'});if(!r.ok)throw Error('Missing release asset: '+path);return r.json();}

function initScene() {
  renderer = new T.WebGLRenderer({canvas:$('#scene'), antialias:true, preserveDrawingBuffer:true});
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
  renderer.setClearColor(0xe1e8e3);renderer.outputColorSpace=T.SRGBColorSpace;
  renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.05;
  renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFSoftShadowMap;
  scene=new T.Scene();defaultFog=new T.Fog(0xe1e8e3,15,35);scene.fog=defaultFog;
  camera=new T.PerspectiveCamera(33,1,.01,80);camera.up.set(0,0,1);
  controls=new OrbitControls(camera,renderer.domElement);controls.enableDamping=false;
  controls.minDistance=2;controls.maxDistance=18;controls.maxPolarAngle=Math.PI*.49;
  controls.addEventListener('start',()=>{pause();userView=true;});
  controls.addEventListener('change',()=>{if(userView&&!playing)render();});
  scene.add(new T.HemisphereLight(0xfffaf0,0x6a887e,2.2));
  const key=new T.DirectionalLight(0xfff3dc,3.2);key.position.set(-3,-5,9);key.castShadow=true;
  key.shadow.mapSize.set(1024,1024);Object.assign(key.shadow.camera,{left:-6,right:6,top:6,bottom:-6,near:.5,far:25});key.shadow.normalBias=.02;scene.add(key);
  const fill=new T.DirectionalLight(0xc1e0e9,1.7);fill.position.set(4,3,5);scene.add(fill);
  floor=new T.Mesh(new T.PlaneGeometry(80,80),new T.MeshStandardMaterial({color:0xe1e8e3,roughness:1}));floor.position.z=-.03;floor.receiveShadow=true;scene.add(floor);
  grid=new T.GridHelper(36,72,0x9db5a7,0xb6c9bc);grid.rotation.x=Math.PI/2;grid.position.z=-.026;grid.material.transparent=true;grid.material.opacity=.28;scene.add(grid);
  new ResizeObserver(resize).observe($('#scene'));
  resize();
}

function resize() {
  if(!renderer||disposed)return;
  const {width,height}=$('#scene').getBoundingClientRect();
  renderer.setSize(Math.max(1,width),Math.max(1,height),false);
  camera.aspect=width/Math.max(1,height);camera.updateProjectionMatrix();
  if(window.vehicleTour.ready&&current>=0&&chapters[current]?.replay)showTime(clock);else render();
}
function render(){if(renderer&&!disposed)renderer.render(scene,camera);}

async function loadModel(id,metadataPath=`data/${id}.json`) {
  const meta=await json(metadataPath);
  const base=metadataPath.includes('/')?metadataPath.slice(0,metadataPath.lastIndexOf('/')):'';
  const response=await fetch(assetPath(meta.binary,base),{cache:'no-store'});
  if(!response.ok)throw Error('Geometry file missing: '+id);
  const bytes=await response.arrayBuffer();
  await validateGeometry(meta,bytes);
  const root=new T.Group(), rawBox=new T.Box3(), buckets=new Map();
  for(const p of meta.parts){
    const v=new Float32Array(bytes,p.positionOffset,p.positionCount);
    for(let i=0;i<v.length;i+=3)rawBox.expandByPoint(new T.Vector3(v[i],v[i+1],v[i+2]));
  }
  const size=rawBox.getSize(new T.Vector3()), center=rawBox.getCenter(new T.Vector3());
  if(!size.toArray().every(Number.isFinite)||Math.max(...size.toArray())<=0)throw Error('Model has no finite spatial extent');
  const scale=3.65/Math.max(...size.toArray());
  for(const p of meta.parts){
    // Merge render batches by material and subsystem; retain source part IDs.
    const wheel=p.group==='wheels'?(p.id.match(/(?:FRONT|REAR|FL|FR|RL|RR)(?:[-_][LR])?/i)||['wheel'])[0]:'';
    const key=[p.group,p.color.map(v=>v.toFixed(2)).join(','),wheel].join('|');
    if(!buckets.has(key))buckets.set(key,{positions:[],indices:[],ids:[],color:p.color,group:p.group});
    const b=buckets.get(key),v=new Float32Array(bytes,p.positionOffset,p.positionCount),indices=new Uint32Array(bytes,p.indexOffset,p.indexCount),base=b.positions.length/3;
    for(let i=0;i<v.length;i+=3)b.positions.push((v[i]-center.x)*scale,(v[i+1]-center.y)*scale,(v[i+2]-rawBox.min.z)*scale);
    for(const n of indices)b.indices.push(n+base);b.ids.push(p.id);
  }
  for(const b of buckets.values()){
    const geometry=new T.BufferGeometry();geometry.setAttribute('position',new T.Float32BufferAttribute(b.positions,3));geometry.setIndex(b.indices);geometry.computeVertexNormals();geometry.computeBoundingBox();
    const material=new T.MeshStandardMaterial({color:new T.Color().setRGB(...b.color,T.SRGBColorSpace),roughness:b.group==='body'?.38:.65,metalness:['hardware','drive','frame'].includes(b.group)?.35:.04,side:T.DoubleSide});
    const mesh=new T.Mesh(geometry,material);mesh.castShadow=true;
    const mid=geometry.boundingBox.getCenter(new T.Vector3());
    const direction={frame:[0,0,0],body:[0,0,1.25],drive:[.25,-.65,.3],electrical:[.2,.65,.65],suspension:[-.2,0,.2],hardware:[0,0,.35],wheels:[Math.sign(mid.x)*.35,Math.sign(mid.y)*.85,.05]}[b.group];
    mesh.userData={group:b.group,sourceIDs:b.ids,original:material.color.clone(),direction:new T.Vector3(...direction)};root.add(mesh);
  }
  root.visible=false;scene.add(root);
  return {root,meta,height:size.z*scale,boundsMm:size.toArray(),renderBatchCount:buckets.size};
}

function makePhysics(data){
  const root=new T.Group(),objects={},springs=[],links=[];
  function geometry(s){if(s.kind==='box')return new T.BoxGeometry(...s.dimensions_m);const g=new T.CylinderGeometry(s.dimensions_m[0],s.dimensions_m[0],s.dimensions_m[1],48);g.rotateX(Math.PI/2);return g;}
  for(const [name,b] of Object.entries(data.assembly)){
    const group=new T.Group();
    for(const s of b.shapes){
      const ghost=name==='chassis'&&!s.collision;
      const m=new T.Mesh(geometry(s),new T.MeshStandardMaterial({color:s.colour,roughness:.65,metalness:.15,transparent:ghost,opacity:ghost?.22:1}));
      m.position.set(...s.centre_local_m);m.quaternion.set(...s.quaternion_xyzw);m.castShadow=!ghost;group.add(m);
    }objects[name]=group;root.add(group);
  }
  for(const s of data.terrain){const m=new T.Mesh(geometry(s),new T.MeshStandardMaterial({color:s.kind==='box'?0xb5c0aa:0x9e7654,roughness:1}));m.position.set(...s.centre_m);if(s.kind==='cylinder')m.rotation.x=-Math.PI/2;m.receiveShadow=true;m.castShadow=true;root.add(m);}
  const arrows={};
  for(const name of ['FL_wheel','FR_wheel','rear_spool','chassis']){const a=new T.ArrowHelper(new T.Vector3(0,0,1),new T.Vector3(),.1,0xd46534,.045,.025);arrows[name]=a;root.add(a);}
  const line=color=>{const o=new T.Line(new T.BufferGeometry().setFromPoints([new T.Vector3(),new T.Vector3()]),new T.LineBasicMaterial({color}));root.add(o);return o;};
  data.spring_names.forEach(()=>springs.push(line(0xe88137)));
  (data.distance_links||[]).forEach(()=>links.push(line(0x448589)));
  root.visible=false;scene.add(root);return {root,objects,springs,links,arrows};
}

function physicsAt(t){
  const fs=replay.frames;
  // Use a saved frame without interpolation or modification of solver values.
  let low=0,high=fs.length-1;
  while(low<high){const mid=Math.ceil((low+high)/2);if(fs[mid].t<=t)low=mid;else high=mid-1;}
  const f=fs[low];lastPhysicsFrame=f;
  for(const [name,p] of Object.entries(f.bodies)){const o=physics.objects[name];o.position.set(...p.slice(0,3));o.quaternion.set(...p.slice(3,7));}
  for(const [i,pair] of (f.spring_endpoints_m||[]).entries())physics.springs[i].geometry.setFromPoints(pair.map(p=>new T.Vector3(...p)));
  for(const [i,d] of (replay.distance_links||[]).entries()){
    const a=new T.Vector3(...d.a_local_m),b=new T.Vector3(...d.b_local_m),oa=physics.objects[d.body_a],ob=physics.objects[d.body_b];oa.updateMatrixWorld();ob.updateMatrixWorld();oa.localToWorld(a);ob.localToWorld(b);physics.links[i].geometry.setFromPoints([a,b]);
  }
  for(const [name,a] of Object.entries(physics.arrows)){const force=new T.Vector3(...f.contact_force_n[name]),length=force.length();a.position.set(...f.bodies[name].slice(0,3));a.visible=length>1;if(length>1){a.setDirection(force.normalize());a.setLength(Math.min(length/1000,1.2),.045,.025);}}
  const p=new T.Vector3(...f.bodies.chassis.slice(0,3));
  if(!userView){controls.target.copy(p).add(new T.Vector3(.35,0,.1));camera.position.copy(p).add(new T.Vector3(-2.7,-3.4,1.55));camera.lookAt(controls.target);}
  $('#metric-time').textContent=f.t.toFixed(2)+' s';$('#metric-speed').textContent=(f.speed_m_s*3.6).toFixed(2)+' km/h';$('#metric-roll').textContent=f.roll_deg.toFixed(2)+'°';
  $('#plot-cursor').setAttribute('x1',String(8+f.t/replay.summary.duration_s*224));$('#plot-cursor').setAttribute('x2',String(8+f.t/replay.summary.duration_s*224));
  $('#geometry-count').textContent=`ARCHIVED SOLVER FRAME ${low+1} / ${fs.length}`;
}

function setupTelemetry(){
  const samples=replay.frames, all=samples.flatMap(f=>f.wheel_heave_m.map(v=>v*1000)), lo=Math.min(-5,...all),hi=Math.max(10,...all);
  const paths=[0,1,2,3].map((wheel)=>samples.map((f,i)=>`${i?'L':'M'}${(8+f.t/replay.summary.duration_s*224).toFixed(2)},${(75-(f.wheel_heave_m[wheel]*1000-lo)/(hi-lo)*60).toFixed(2)}`).join(' '));
  $('#telemetry').innerHTML=`<div class="metric"><span>SIM TIME</span><strong id="metric-time"></strong></div><div class="metric"><span>SPEED</span><strong id="metric-speed"></strong></div><div class="metric"><span>ROLL</span><strong id="metric-roll"></strong></div><p>WHEEL TRAVEL / mm</p><svg viewBox="0 0 240 95" role="img" aria-label="Four saved wheel travel traces over the twelve second obstacle run"><path d="M8 15V75H232" fill="none" stroke="#a9bdb0"/>${paths.map((p,i)=>`<path d="${p}" fill="none" stroke="${['#d15e32','#337c82','#9971a4','#739566'][i]}" stroke-width="1.5"/>`).join('')}<line id="plot-cursor" y1="10" y2="80" stroke="#173c41" stroke-dasharray="3 3"/><text x="8" y="92" font-size="8" fill="#58736a">0 s</text><text x="211" y="92" font-size="8" fill="#58736a">12 s</text></svg><p class="fail">OBSTACLE NOT CLEARED<br>Historical development failure</p>`;
}

function setupDiagram(){
  const count=history.nodes.length;
  // This is a comparison of independent studies, not a fabricated parent edge.
  $('#diagram').innerHTML=`<h2>Three views of the design space</h2><div class="tree-row"><div class="tree-node">CQ-L1<b>Package baseline</b><small>Preserved study</small></div><span class="tree-edge">/</span><div class="tree-node">RC25-R0<b>Bench-scale branch</b><small>Digital prototype</small></div><span class="tree-edge">/</span><div class="tree-node">RIDGE R5 P03<b>Body & ergonomics</b><small>Integration open</small></div></div><p class="branch-note">${count} records in the source evolution register · distinct scales · no physical-build claim</p>`;
}

function setChapter(index){
  current=index;const ch=chapters[index];userView=false;userExplode=false;userWire=false;solo='all';
  if(customProject)$('#headline').textContent=ch.title;else $('#headline').innerHTML=ch.title;
  $('#chapter-number').textContent=String(index).padStart(2,'0');$('#chapter-category').textContent=ch.category;
  $('#description').textContent=ch.description;$('#chapter-note').textContent=ch.note;$('#caption').textContent=ch.caption;$('#caption-index').textContent='FIELD NOTES / '+String(index).padStart(2,'0');
  $('#facts').replaceChildren(...ch.facts.map(([value,label])=>{const div=document.createElement('div');div.className='fact';if(ch.status&&value===ch.status)div.dataset.status=ch.status;const b=document.createElement('b'),span=document.createElement('span');b.textContent=value;span.textContent=label;div.append(b,span);return div;}));
  for(const b of $('#chapters').children)b.setAttribute('aria-current',String(Number(b.dataset.index)===index));
  for(const b of ['#orbit','#explode','#wire'])$(b).setAttribute('aria-pressed','false');$('#isolate').value='all';
  for(const m of Object.values(models)){m.root.visible=false;m.root.scale.setScalar(1);m.root.position.set(0,0,0);for(const o of m.root.children){o.position.set(0,0,0);o.visible=true;o.material.wireframe=false;o.material.color.copy(o.userData.original);}}
  const special=customProject?null:ch.model;
  scene.fog=ch.replay?null:defaultFog;camera.near=.01;camera.far=80;camera.updateProjectionMatrix();controls.minDistance=2;controls.maxDistance=18;
  floor.position.set(0,0,-.03);floor.scale.setScalar(1);grid.position.set(0,0,-.026);grid.scale.setScalar(1);
  if(physics)physics.root.visible=special==='physics';grid.visible=special!=='physics';floor.visible=special!=='physics';
  for(const run of Object.values(customReplays))run.root.visible=false;
  if(ch.replay)customReplays[ch.replay].root.visible=true;
  $('#diagram').hidden=special!=='comparison';$('#telemetry').hidden=special!=='physics'&&!ch.replay;$('#viewport-tools').hidden=['physics','comparison'].includes(special)||Boolean(ch.replay);
  if(typeof ch.model==='string'&&models[ch.model])models[ch.model].root.visible=true;
  if(special==='comparison'){
    for(const [i,id] of ['baseline','prototype','body'].entries()){const m=models[id];m.root.visible=true;m.root.scale.setScalar(.62);m.root.position.set((i-1)*2.4,0,0);}
    $('#model-label').textContent='DESIGN EVOLUTION / BRANCH COMPARISON';$('#geometry-count').textContent='SOURCE SNAPSHOTS / DISPLAY SCALE NORMALIZED';
  } else if(special==='physics'){
    $('#model-label').textContent='CQ-PH1.1 / PROJECT CHRONO';$('#view-label').textContent='SAVED SOLVER STATES / 1×';
  } else if(ch.replay){
    const run=customReplays[ch.replay];$('#model-label').textContent=run.data.engine;$('#view-label').textContent='RECORDED POSES';
    $('#geometry-count').textContent=`${run.data.bodies.length} BODIES / ${run.data.frames.length} SAVED FRAMES`;
  } else {
    const m=models[ch.model];$('#model-label').textContent=m.meta.revision;
    $('#view-label').textContent=index===6?'EXPLODED INSPECTION':'NATIVE CAD → WEBGL';
    $('#geometry-count').textContent=`${m.meta.partCount.toLocaleString()} COMPONENT GROUPS / ${m.meta.triangleCount.toLocaleString()} TRIANGLES`;
  }
}

function showTime(t){
  if(!Number.isFinite(t))throw new TypeError('Tour time must be finite');
  clock=Math.max(0,Math.min(duration,t));const index=customProject?chapters.findIndex(ch=>clock>=ch.start&&(clock<ch.end||ch.end===duration)):chapterAt(clock);const chapterChanged=index!==current;if(chapterChanged)setChapter(index);
  const ch=chapters[index], local=clock-ch.start, u=local/(ch.end-ch.start);
  if(ch.replay){
    const run=customReplays[ch.replay],frame=run.at(Math.min(run.duration,local));
    if(!userView){
      const vertical=T.MathUtils.degToRad(camera.fov)/2,horizontal=Math.atan(Math.tan(vertical)*camera.aspect),distance=run.radius/Math.sin(Math.min(vertical,horizontal))*1.15;
      controls.target.copy(run.center);camera.position.copy(run.center).addScaledVector(new T.Vector3(-1.8,-2.3,1.2).normalize(),distance);camera.lookAt(controls.target);
      camera.near=Math.max(.00001,distance/1000);camera.far=Math.max(80,distance+run.radius*4);camera.updateProjectionMatrix();controls.minDistance=Math.max(.0001,run.radius*.1);controls.maxDistance=distance*4;
      const ground=Math.min(0,run.bounds.min.z-.03);floor.position.set(run.center.x,run.center.y,ground);grid.position.set(run.center.x,run.center.y,ground+.004);floor.scale.setScalar(Math.max(1,run.extent/30));grid.scale.setScalar(Math.max(.01,run.extent/12));
    }
    $('#telemetry').replaceChildren();
    for(const [label,value] of [['TIME / s',frame.t],...Object.entries(frame.metrics||{}).slice(0,3)]){
      const div=document.createElement('div');div.className='metric';const span=document.createElement('span'),strong=document.createElement('strong');span.textContent=label;strong.textContent=Number(value).toFixed(3);div.append(span,strong);$('#telemetry').append(div);
    }
    const note=document.createElement('p');note.className='fail';note.textContent=ch.status.toUpperCase()+' / '+run.data.engine;$('#telemetry').append(note);
  }
  else if(!customProject&&ch.model==='physics'){physicsAt(Math.min(12,Math.max(0,local-1)));}
  else if(!customProject&&ch.model==='comparison'){
    if(!userView){controls.target.set(0,0,1.0);camera.position.set(-.5+u*.6,-11.8,5.9);camera.lookAt(controls.target);}
    for(const [i,id] of ['baseline','prototype','body'].entries())models[id].root.rotation.z=-.28+.1*Math.sin(u*Math.PI+i*.4);
  } else {
    const m=models[ch.model];m.root.rotation.z=0;
    let separation=0;
    if(!customProject&&index===2)separation=.72*Math.sin(Math.PI*ease((u-.28)/.72));
    if(!customProject&&index===6)separation=1.1*Math.sin(Math.PI*ease(u));
    if(userExplode)separation=1;
    for(const o of m.root.children){
      o.position.copy(o.userData.direction).multiplyScalar(separation);
      o.visible=solo==='all'||o.userData.group===solo;
      const bodyFade=!customProject&&index===3&&o.userData.group==='body'?1-ease((u-.08)/.22):1;
      o.material.opacity=bodyFade;o.material.transparent=bodyFade<1;
      if(bodyFade<.01)o.visible=false;
      o.material.wireframe=userWire||(!customProject&&index===1&&u<.27);
      o.material.color.copy(!customProject&&index===3?new T.Color(colors[o.userData.group]):o.userData.original);
    }
    if(!userView){
      const angle=-2.2+u*.65+(index===3?.2:0),distance=8.3+(separation*.85);
      controls.target.set(0,0,m.height*.43);
      camera.position.set(distance*Math.cos(angle),distance*Math.sin(angle),m.height*.4+3.1+Math.sin(u*Math.PI)*.45);
      camera.lookAt(controls.target);
    }
  }
  $('#scrub').value=clock;$('#time').textContent=formatTime(clock)+' / '+formatTime(duration);
  window.vehicleTour.time=clock;window.vehicleTour.chapter=current;
  // Warm newly visible render batches before presenting the chapter's first frame.
  if(chapterChanged)render();
  render();
  return {time:clock,chapter:current,physicsFrame:lastPhysicsFrame?.t??null};
}

function loop(now){animation=null;if(disposed||!playing)return;const dt=previous?Math.min(.1,(now-previous)/1000):0;previous=now;showTime(clock+dt);if(clock>=duration)pause();else animation=requestAnimationFrame(loop);}
function play(){if(!window.vehicleTour.ready)return;if(clock>=duration)showTime(0);playing=true;previous=0;userView=false;$('#play').innerHTML='Ⅱ <span>Pause tour</span>';$('#play').setAttribute('aria-label','Pause the guided tour');if(animation===null)animation=requestAnimationFrame(loop);}
function pause(){playing=false;previous=0;if(animation!==null)cancelAnimationFrame(animation);animation=null;$('#play').innerHTML='▶ <span>Play tour</span>';$('#play').setAttribute('aria-label','Play the guided tour');}

function setupChapters(){
$('#chapters').replaceChildren();
for(const [index,ch] of chapters.entries()){
  const b=document.createElement('button');b.dataset.index=index;const n=document.createElement('small'),label=document.createElement('span');n.textContent=String(index).padStart(2,'0');label.textContent=ch.label;b.append(n,label);b.disabled=true;
  b.onclick=()=>{pause();showTime(ch.start+.01);};$('#chapters').append(b);
}
}
setupChapters();
$('#play').onclick=()=>playing?pause():play();$('#scrub').disabled=true;
$('#scrub').oninput=e=>{pause();showTime(+e.target.value);};
$('#orbit').onclick=()=>{pause();userView=false;showTime(clock);$('#orbit').setAttribute('aria-pressed','true');};
$('#explode').onclick=()=>{pause();userExplode=!userExplode;$('#explode').setAttribute('aria-pressed',String(userExplode));showTime(clock);};
$('#wire').onclick=()=>{pause();userWire=!userWire;$('#wire').setAttribute('aria-pressed',String(userWire));showTime(clock);};
$('#isolate').onchange=e=>{pause();solo=e.target.value;showTime(clock);};
$('#retry').onclick=()=>location.reload();
$('#record-toggle').onclick=()=>{pause();$('#project-record').showModal();const graph=$('#project-record .revision-graph');if(graph)graph.scrollLeft=Math.max(0,Number(graph.dataset.focusX)-graph.clientWidth/2);};
$('#record-close').onclick=()=>$('#project-record').close();
document.addEventListener('visibilitychange',()=>{if(document.hidden)pause();});
window.addEventListener('pagehide',()=>{pause();disposed=true;controls?.dispose();scene?.traverse(o=>{o.geometry?.dispose();if(Array.isArray(o.material))o.material.forEach(m=>m.dispose());else o.material?.dispose();});renderer?.dispose();});

async function start(){
  initScene();
  const projectPath=new URLSearchParams(location.search).get('project');
  if(projectPath){
    if(!/^projects\/[a-z0-9-]+\/project\.json$/.test(projectPath))throw Error('Choose a project manifest under projects/<id>/project.json');
    customProject=validateProject(await json(projectPath));
    $('#project-name').textContent=customProject.name;document.title=customProject.name+' · Vehicle Lab';
    for(const model of customProject.models){
      models[model.id]=await loadModel(model.id,model.metadata);
    }
    const verifiedEvidence=[];
    for(const evidence of customProject.evidence||[]){
      const r=await fetch(assetPath(evidence.path),{cache:'no-store'});if(!r.ok)throw Error('Missing evidence: '+evidence.id);const bytes=await r.arrayBuffer();
      if(await sha256(bytes)!==evidence.sha256)throw Error('Evidence checksum mismatch: '+evidence.id);
      verifiedEvidence.push({...evidence,bytes});
      if(evidence.kind==='rigid-body-replay')customReplays[evidence.id]=createReplay(JSON.parse(new TextDecoder().decode(bytes)),scene);
    }
    let stageTime=0;
    chapters=customProject.stages.map((stage,i)=>{
      const start=stageTime;stageTime+=stage.replay?Math.max(12,(customReplays[stage.replay]?.duration||0)+1):12;
      if(stage.replay){const run=customReplays[stage.replay];if(!run)throw Error('Stage references a missing replay');return {start,end:stageTime,label:stage.id,category:'EXPERIMENT / '+customProject.name.toUpperCase(),title:stage.title,replay:stage.replay,status:stage.status,description:stage.description,
        facts:[[String(run.data.bodies.length),'named rigid bodies'],[String(run.data.frames.length),'saved states'],[stage.status,'evidence status']],note:run.data.scope,caption:'Recorded body poses. No new simulation runs in this view.'};}
      const m=models[stage.model];if(!m)throw Error('Stage references a missing model');
      return {start,end:stageTime,label:stage.id,category:'PROJECT / '+customProject.name.toUpperCase(),title:stage.title,model:stage.model,
        status:stage.status,description:stage.description,facts:[[String(m.meta.partCount),'authored component groups'],[m.meta.revision,'source revision'],[stage.status,'recorded stage status']],
        note:'This project retains experimental status. Display geometry is not a physical or solver validation.',caption:stage.description};
    });
    duration=stageTime;$('#scrub').max=duration;setupChapters();manifest=customProject;
    mountProjectRecord(customProject,models,verifiedEvidence);
  }else{
    [manifest,history,replay]=await Promise.all([json('data/provenance.json'),json('data/evolution.json'),json('data/physics.json')]);
    // Serial loading bounds peak memory on small devices.
    for(const id of ['body','prototype','baseline','mechanical']){models[id]=await loadModel(id);$('#loading small').textContent=`Verified ${Object.keys(models).length} / 4 model snapshots`;}
    physics=makePhysics(replay);setupTelemetry();setupDiagram();
    mountProjectRecord({name:'Vehicle Lab / preserved design register',revisionHeading:'Preserved revisions',description:history.meaning||'Historical revision identities and parent links. These records do not establish physical acceptance.',revisions:history.nodes.map(n=>({id:n.id,parents:n.parent_ids,decision:n.label+' · recorded status: '+n.status+' · '+n.track}))},models,[]);
  }
  window.vehicleTour={ready:true,duration,chapters,seek:showTime,play,pause,models,manifest,physics,replay,customReplays,renderer,scene,camera,
    inspect:()=>({ready:true,time:clock,chapter:current,playing,sourceChecks:Object.fromEntries(Object.entries(models).map(([id,m])=>[id,{parts:m.meta.partCount,triangles:m.meta.triangleCount,withheld:m.meta.omitted.length,sha256:m.meta.binarySha256}])),physicsFrame:lastPhysicsFrame?.t??null,hardwareRelease:false})};
  $('#loading').hidden=true;$('#app').setAttribute('aria-busy','false');$('#play').disabled=false;$('#scrub').disabled=false;
  for(const b of $('#chapters').children)b.disabled=false;
  const requested=Number(new URLSearchParams(location.search).get('t')||0);showTime(Number.isFinite(requested)?requested:0);
  // Motion always starts with an explicit action, including reduced-motion users.
  if(reducedMotion)$('#geometry-note').textContent='Reduced motion · play only when requested';
}
start().catch(e=>{pause();window.vehicleTour.ready=false;window.vehicleTour.error=e.message;$('#play').disabled=true;$('#scrub').disabled=true;$('#loading').hidden=true;$('#error').hidden=false;$('#error p').textContent=e.message;$('#app').setAttribute('aria-busy','false');console.error(e);});
