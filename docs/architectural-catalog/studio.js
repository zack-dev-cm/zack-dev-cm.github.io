import * as T from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {GLTFExporter} from 'three/addons/exporters/GLTFExporter.js';
import {materials,cabinet,dimensions,elevationLines} from './cabinets.js';
import {CHAPTERS,DURATION,chapterAt,chapterText,poseAt} from './timeline.js';

const $=s=>document.querySelector(s),capture=new URLSearchParams(location.search).has('capture');
if(capture)document.body.classList.add('capture');
const app=window.catalogStudy={ready:false,error:null};
let facts,renderer,scene,camera,controls,models=[],dimensionGroups=[],schematics=[],materialsSet,outline;
let time=0,playing=false,manual=false,userCamera=false,selected='B3000',selectedPart='',width=36,finish='oak',opening=0,separate=0,last=0;
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
const selection=new T.Raycaster(),pointer=new T.Vector2();

function setStory(t){
  const i=chapterAt(t),c=chapterText(i,width);
  $('#chapter-number').textContent=String(i+1).padStart(2,'0')+' / '+c.label;
  $('#chapter-title').textContent=c.title;$('#chapter-copy').textContent=c.copy;$('#source').textContent=c.source;$('#source').style.whiteSpace='pre-line';
  $('#chapters').querySelectorAll('button').forEach((b,j)=>b.setAttribute('aria-current',i===j?'step':'false'));
  $('#time').value=String(t);$('#timecode').textContent='0:'+String(Math.floor(t)).padStart(2,'0')+' / 0:30';
}
function pause(){playing=false;$('#play').textContent='Play story';}
function inspect(){
  pause();if(!manual){const pose=poseAt(time);opening=pose.opening;separate=pose.separate;$('#opening').value=String(opening);$('#separate').value=String(separate);}
  manual=true;$('#gesture').textContent='Drag to orbit · scroll to zoom · click a part';
}
function selectPart(part){
  selectedPart=part;$('#part').value=part;
  const item=facts.products.find(p=>p.code===selected);
  const desc={drawers:item.drawerCount===1?'One full-width upper drawer. Catalog page 27.':'Two upper drawers, side by side. Catalog page 28.',doors:'Two hinged doors beneath the drawer row.',shelf:'One adjustable shelf in the lower compartment.',carcass:'Cabinet body. Panel construction and hardware are illustrative.'};
  $('#part-description').textContent=part?desc[part]:selected+' · '+(item.drawerCount===1?'one upper drawer':'two side-by-side upper drawers')+', two hinged doors, one adjustable shelf.';
}
function buildModels(){
  for(const m of models){scene.remove(m.root);m.root.traverse(o=>{if(o.isMesh)o.geometry.dispose();});}
  for(const g of [...dimensionGroups,...schematics]){scene.remove(g);g.traverse(o=>{if(o.geometry)o.geometry.dispose();if(o.isSprite){o.material.map.dispose();o.material.dispose();}else if(o.isLine)o.material.dispose();});}
  models=['B3000','B3100'].map((code,i)=>{
    const m=cabinet(code,width,materialsSet,finish);m.root.position.x=(i===0?-1:1)*(m.width/2+.24);scene.add(m.root);return m;
  });
  dimensionGroups=models.map(m=>{const g=dimensions(m.width,m.height,m.depth,width);g.position.x=m.root.position.x;scene.add(g);return g;});
  schematics=models.map((m,i)=>{const g=elevationLines(m.width,m.height,i===0?1:2);g.position.set(m.root.position.x,.08,-.53);scene.add(g);return g;});
  $('#dimensions').textContent=`Selected catalog variant · ${width} W × 34 H × 24 D inches.`;
}
function resize(){
  const r=$('#viewport').getBoundingClientRect();renderer.setSize(r.width,r.height,false);camera.aspect=r.width/r.height;camera.updateProjectionMatrix();render();
}
function cameraPose(pose){
  const state=poseAt(time),o=manual?opening:state.opening,e=manual?separate:state.separate;
  const factor=(camera.aspect<1.15?.85:camera.aspect<1.5?.75:.66)*(1+o*.25+e*.18)*Math.max(1,width/36);
  camera.position.set(pose[0]*factor,pose[1]*factor,pose[2]*factor);camera.lookAt(0,.43,0);controls.target.set(0,.43,0);controls.update();
}
function render(){
  if(!renderer)return;
  const pose=poseAt(time),o=manual?opening:pose.opening,e=manual?separate:pose.separate;
  models.forEach(m=>m.update(o,e));
  dimensionGroups.forEach((g,i)=>g.visible=!manual&&pose.dimensions&&models[i].root.userData.catalogCode===selected);
  if(!manual){$('#opening').value=String(o);$('#separate').value=String(e);}
  schematics.forEach(g=>g.visible=!manual&&pose.blueprint);
  if(!userCamera)cameraPose(pose.camera);
  if(outline){outline.visible=Boolean(selectedPart);if(selectedPart){const index=selected==='B3000'?0:1,b=new T.Box3();for(const group of models[index].parts[selectedPart])b.expandByObject(group);outline.box.copy(b);}}
  renderer.render(scene,camera);
}
function seek(t){time=Math.max(0,Math.min(DURATION,t));setStory(time);render();}
function reset(){
  inspect();userCamera=false;opening=0;separate=0;$('#opening').value='0';$('#separate').value='0';$('#wireframe').checked=false;
  for(const m of Object.values(materialsSet))m.wireframe=false;selectPart('');render();
}
async function init(){
  const response=await fetch('data/catalog-facts.json');if(!response.ok)throw Error('Catalog facts are unavailable');
  const bytes=await response.arrayBuffer();
  const hash=Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',bytes)),b=>b.toString(16).padStart(2,'0')).join('');
  if(hash!==CATALOG_FACTS_SHA256)throw Error('Catalog facts checksum mismatch');
  facts=JSON.parse(new TextDecoder().decode(bytes));
  scene=new T.Scene();scene.background=new T.Color(capture?0x090c10:0x11161c);
  camera=new T.PerspectiveCamera(38,1,.01,50);
  renderer=new T.WebGLRenderer({canvas:$('#scene'),antialias:true,alpha:false,preserveDrawingBuffer:capture});
  renderer.setPixelRatio(capture?1:Math.min(devicePixelRatio,2));renderer.outputColorSpace=T.SRGBColorSpace;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.3;
  renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFSoftShadowMap;
  scene.add(new T.HemisphereLight(0xe6eef1,0x51412f,1.9));
  const key=new T.DirectionalLight(0xfff0da,3.4);key.position.set(-2.4,4.8,3.4);key.castShadow=true;key.shadow.mapSize.set(2048,2048);key.shadow.camera.left=-3;key.shadow.camera.right=3;key.shadow.camera.top=3;key.shadow.camera.bottom=-3;key.shadow.normalBias=.015;key.shadow.bias=-.00008;scene.add(key);
  const rim=new T.DirectionalLight(0xa1d9ee,2);rim.position.set(2,2,-3);scene.add(rim);
  const floor=new T.Mesh(new T.PlaneGeometry(200,200),new T.MeshBasicMaterial({color:capture?0x090c10:0x11161c,toneMapped:false}));floor.rotation.x=-Math.PI/2;floor.position.y=-.03;floor.name='Studio ground';scene.add(floor);
  const shadow=new T.Mesh(new T.PlaneGeometry(20,20),new T.ShadowMaterial({opacity:.28}));shadow.rotation.x=-Math.PI/2;shadow.position.y=-.028;shadow.receiveShadow=true;scene.add(shadow);
  const grid=new T.GridHelper(5,25,0x344049,0x1c252d);grid.position.y=-.025;grid.material.transparent=true;grid.material.opacity=.28;scene.add(grid);
  materialsSet=materials();buildModels();outline=new T.Box3Helper(new T.Box3(),0x97d8ea);outline.visible=false;scene.add(outline);
  controls=new OrbitControls(camera,$('#scene'));controls.enableDamping=false;controls.minDistance=1.5;controls.maxDistance=9;controls.maxPolarAngle=Math.PI*.49;
  controls.addEventListener('start',()=>{inspect();userCamera=true;});controls.addEventListener('change',()=>{if(userCamera)render();});
  $('#chapters').replaceChildren(...CHAPTERS.map((c,i)=>{const b=document.createElement('button');b.type='button';b.innerHTML='<span>'+String(i+1).padStart(2,'0')+'</span>'+c.label;b.onclick=()=>{pause();manual=false;userCamera=false;selectedPart='';$('#part').value='';selectPart('');seek(i*5);};return b;}));
  $('#play').onclick=()=>{if(playing){pause();return;}manual=false;userCamera=false;selectedPart='';selectPart('');if(time>=DURATION)time=0;playing=true;$('#play').textContent='Pause story';last=performance.now();};
  $('#restart').onclick=()=>{pause();manual=false;userCamera=false;selectPart('');seek(0);};
  $('#time').oninput=()=>{pause();manual=false;userCamera=false;selectPart('');seek(Number($('#time').value));};
  $('#opening').oninput=()=>{const value=Number($('#opening').value);inspect();opening=value;$('#opening').value=String(value);render();};
  $('#separate').oninput=()=>{const value=Number($('#separate').value);inspect();separate=value;$('#separate').value=String(value);render();};
  $('#width').onchange=()=>{inspect();width=Number($('#width').value);buildModels();setStory(time);render();};
  $('#finish').onchange=()=>{inspect();finish=$('#finish').value;buildModels();render();};
  $('#wireframe').onchange=()=>{inspect();for(const m of Object.values(materialsSet))m.wireframe=$('#wireframe').checked;render();};
  $('#part').onchange=()=>{inspect();selectPart($('#part').value);render();};
  $('[data-cabinet=B3000]').onclick=()=>choose('B3000');$('[data-cabinet=B3100]').onclick=()=>choose('B3100');
  $('#reset').onclick=reset;
  let start;
  $('#scene').addEventListener('pointerdown',ev=>start=[ev.clientX,ev.clientY]);
  $('#scene').addEventListener('pointerup',ev=>{
    if(!start||Math.hypot(ev.clientX-start[0],ev.clientY-start[1])>6)return;
    const r=$('#scene').getBoundingClientRect();pointer.set((ev.clientX-r.left)/r.width*2-1,-(ev.clientY-r.top)/r.height*2+1);selection.setFromCamera(pointer,camera);
    const hit=selection.intersectObjects(models.map(m=>m.root),true).find(h=>h.object.isMesh);
    if(hit){choose(hit.object.userData.cabinet);selectPart(hit.object.userData.part);render();}
  });
  document.addEventListener('visibilitychange',()=>{if(document.hidden)pause();});reduced.addEventListener('change',()=>{if(reduced.matches)pause();});
  $('#scene').addEventListener('keydown',e=>{if(e.key===' '){e.preventDefault();$('#play').click();}if(e.key==='Escape')reset();});
  new ResizeObserver(resize).observe($('#viewport'));
  app.seek=seek;app.renderer=renderer;
  app.inspect=()=>({time,chapter:CHAPTERS[chapterAt(time)].id,playing,manual,selected,selectedPart,width,finish,opening:manual?opening:poseAt(time).opening,separate:manual?separate:poseAt(time).separate,facts,verifiedSource:true,wireframe:materialsSet.oak.wireframe,camera:camera.position.toArray(),drawers:models.map(m=>m.drawers.length),visibleMeshes:models.reduce((n,m)=>{m.root.traverse(o=>{if(o.isMesh)n++;});return n;},0),renderCalls:renderer.info.render.calls,triangles:renderer.info.render.triangles});
  app.exportGLB=async()=>{const g=new T.Group();g.name='Case Systems catalog family visualization';g.userData={units:'metres',nominalDimensionsInches:{width,height:34,depth:24},catalogSha256:facts.catalog.sha256,scope:'Catalog family visualization. Authored finish, movement and construction; not fabrication geometry.'};for(const m of models)g.add(m.root.clone(true));return Array.from(new Uint8Array(await new GLTFExporter().parseAsync(g,{binary:true})));};
  $('#loading').hidden=true;selectPart('');resize();seek(0);app.ready=true;
  if(!capture)requestAnimationFrame(tick);
}
function choose(code){inspect();selected=code;document.querySelectorAll('[data-cabinet]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.cabinet===code)));selectPart('');render();}
function tick(now){if(playing){time+=Math.min(.1,(now-last)/1000);if(time>=DURATION){time=DURATION;pause();}seek(time);}last=now;requestAnimationFrame(tick);}
init().catch(error=>{
  app.error=error.message;$('#loading').textContent='The 3D scene could not load on this device. '+error.message;
  const a=document.createElement('a');a.href='media/catalog-film.mp4';a.textContent='Watch the catalog film instead';$('#loading').append(a);
  for(const button of document.querySelectorAll('#controls button,#transport button'))button.disabled=true;console.error(error);
});

// Written from the reviewed catalog-facts.json by the grounding preparation script.
const CATALOG_FACTS_SHA256 = '2b037fa4c9f4b79759a0fe650174eb7a9c07c6d5b79be2b03c20a06202242918';
