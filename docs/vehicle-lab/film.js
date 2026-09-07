import * as T from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {validateGeometry} from './project-contract.js';
import {BEAT,DURATION,SHOTS,shotAt} from './film-timeline.js';
import {createMotionScene} from './motion-scene.js';

const $=s=>document.querySelector(s),capture=new URLSearchParams(location.search).has('capture');
if(capture)document.body.classList.add('capture');
const app=window.vehicleFilm={ready:false,error:null,duration:DURATION};
$('#retry').onclick=()=>location.reload();
async function initializeFilm(){
const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v)),smooth=v=>{v=clamp(v);return v*v*(3-2*v);};
const mix=(a,b,t)=>a+(b-a)*t;
const models={},sourceChecks={};let graph,motion,terrainEnvelope,time=0,playing=false,previous=0,raf=null,currentShot='',userCamera=false,manual=false,selected=null,activeModel=null;
let manualGroup=0,manualMembers=0,system='all',wire=false,treeManual=null;
const renderer=new T.WebGLRenderer({canvas:$('#scene'),antialias:true,preserveDrawingBuffer:true});
renderer.setPixelRatio(capture?1:Math.min(devicePixelRatio,1.5));renderer.setClearColor(0x101a23);renderer.outputColorSpace=T.SRGBColorSpace;
renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.2;
renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFSoftShadowMap;
const scene=new T.Scene();scene.fog=new T.Fog(0x101a23,18,42);
const camera=new T.PerspectiveCamera(31,1,.001,90);camera.up.set(0,0,1);
const controls=new OrbitControls(camera,renderer.domElement);controls.enableDamping=false;controls.minDistance=.04;controls.maxDistance=35;
controls.addEventListener('start',()=>{pause();userCamera=true;});controls.addEventListener('change',()=>{if(userCamera)render();});
scene.add(new T.HemisphereLight(0xe6f3ff,0x374d64,2.4));
const key=new T.DirectionalLight(0xffeddd,2.8);key.position.set(2,3,8);key.castShadow=true;key.shadow.mapSize.set(2048,2048);Object.assign(key.shadow.camera,{left:-6,right:6,top:6,bottom:-6,near:.1,far:22});key.shadow.normalBias=.006;scene.add(key);
const rim=new T.DirectionalLight(0x93d6ff,2.1);rim.position.set(-4,-4,5);scene.add(rim);
const front=new T.DirectionalLight(0xffb77c,1.25);front.position.set(5,-1,3);scene.add(front);
const floor=new T.Mesh(new T.PlaneGeometry(100,100),new T.MeshStandardMaterial({color:0x101820,roughness:.92,metalness:.1}));floor.position.z=-.035;floor.receiveShadow=true;scene.add(floor);
const grid=new T.GridHelper(50,100,0x4e879b,0x385164);grid.rotation.x=Math.PI/2;grid.position.z=-.03;grid.material.transparent=true;grid.material.opacity=.1;scene.add(grid);
const raycaster=new T.Raycaster();const pointer=new T.Vector2();

async function read(path){const r=await fetch(path);if(!r.ok)throw Error('Missing film asset: '+path);return r.json();}
function partGroup(p){
 const id=p.id,role=p.role;
 if(id.startsWith('AG23-')){
  if(/STEER|COLUMN|PEDAL|DASH|DISPLAY/.test(id))return 'suspension';
  if(/SEAT|FOOT-DECK/.test(id))return 'body';
  if(/TYRE|RIM|HUB-/.test(id))return 'wheels';
 }
 if(id.startsWith('WHEEL-'))return 'wheels';
 // Preserve the complete chassis, matching the native preview grouping.
 if(id.startsWith('BASE-FR_'))return 'frame';
 if(/SHOCK|^FL_|^FR_|^RL_|^RR_/.test(id)||role==='shock_inspection')return 'suspension';
 if(/chain|sprocket|bearing|race|shaft|live_axle/.test(role))return 'drive';
 return p.group;
}
async function loadModel(id){
 const meta=await read(`data/${id}.json`),response=await fetch(`data/${meta.binary}`);if(!response.ok)throw Error('Missing geometry: '+id);
 const bytes=await response.arrayBuffer();await validateGeometry(meta,bytes);
 const root=new T.Group(),rawBounds=new T.Box3();
 for(const part of meta.parts){const v=new Float32Array(bytes,part.positionOffset,part.positionCount);for(let i=0;i<v.length;i+=3)rawBounds.expandByPoint(new T.Vector3(v[i],v[i+1],v[i+2]));}
 const size=rawBounds.getSize(new T.Vector3()),center=rawBounds.getCenter(new T.Vector3()),scale=4/Math.max(...size.toArray());
 const objects=[],groupLists=new Map();
 for(const p of meta.parts){
  const source=new Float32Array(bytes,p.positionOffset,p.positionCount),positions=new Float32Array(source.length),indices=new Uint32Array(bytes,p.indexOffset,p.indexCount);
  for(let i=0;i<source.length;i+=3){positions[i]=(source[i]-center.x)*scale;positions[i+1]=(source[i+1]-center.y)*scale;positions[i+2]=(source[i+2]-rawBounds.min.z)*scale;}
  const geometry=new T.BufferGeometry();geometry.setAttribute('position',new T.BufferAttribute(positions,3));geometry.setIndex(new T.BufferAttribute(indices,1));geometry.computeVertexNormals();geometry.computeBoundingBox();geometry.computeBoundingSphere();
  const group=partGroup(p),color=new T.Color().setRGB(...p.color,T.SRGBColorSpace);
  const material=new T.MeshStandardMaterial({color,roughness:group==='body'?.62:group==='wheels'?.76:.57,metalness:['frame','drive','hardware','suspension'].includes(group)?.3:.04,flatShading:/sprocket|chain_link_plate|bearing.*ring/.test(p.role),side:T.DoubleSide});
  const mesh=new T.Mesh(geometry,material);mesh.castShadow=true;mesh.receiveShadow=false;
  const mid=geometry.boundingBox.getCenter(new T.Vector3());
  // Cockpit controls lift with their surrounding bodywork. This preserves
  // source-relative geometry through the reveal instead of moving a shell
  // through a steering wheel or handlebar. Semantic groups stay unchanged.
  const withBody=id==='ag23'?(p.role==='steering'||p.id.startsWith('AG23-LIGHT-')):/^BASE-(?:Handlebar_|Grip_)/.test(p.id);
  const offset=withBody?[0,0,1.55]:({frame:[-.5,0,0],body:[0,0,1.55],wheels:[Math.sign(mid.x)*.55,Math.sign(mid.y)*1.05,.08],drive:[-1.1,-.2,.25],suspension:[.7,.18,.2],electrical:[.2,.4,.95],hardware:[0,0,.6]}[group]||[0,0,0]);
  mesh.userData={id:p.id,role:p.role,group,mid,offset:new T.Vector3(...offset),original:color.clone()};
  root.add(mesh);objects.push(mesh);if(!groupLists.has(group))groupLists.set(group,[]);groupLists.get(group).push(mesh);
 }
 for(const list of groupLists.values())for(const [i,o] of list.entries()){
  // Local fan separation stays attached to source identity; film only applies
  // member separation to a bounded selected assembly, never the whole model.
  const angle=i*2.3999632297,radius=.1*Math.sqrt(i+1);o.userData.memberOffset=new T.Vector3(Math.cos(angle)*radius,Math.sin(angle)*radius,.1*(i%5));
 }
 scene.add(root);root.visible=false;
 sourceChecks[id]={revision:meta.revision,parts:meta.partCount,sourceParts:meta.sourcePartCount,withheld:meta.omitted.length,triangles:meta.triangleCount,sha256:meta.binarySha256};
 return {root,objects,meta,groupLists};
}
function setVisible(m,filter=()=>true,separation=0,members=0){
 for(const other of Object.values(models))other.root.visible=other===m;
 m.root.visible=true;activeModel=m;
 for(const o of m.objects){
  o.visible=filter(o)&&(!manual||system==='all'||o.userData.group===system);
  o.position.copy(o.userData.offset).multiplyScalar(separation);
  if(members)o.position.addScaledVector(o.userData.memberOffset,members);
  o.material.wireframe=wire;o.material.color.copy(o.userData.original);o.material.emissive.set(0x000000);
 }
 m.root.updateMatrixWorld(true);
}
function boundsFor(objects){const box=new T.Box3();for(const o of objects)if(o.visible)box.union(o.geometry.boundingBox.clone().applyMatrix4(o.matrixWorld));return box;}
function fit(box,direction,padding=1.06,objects=null){
 if(userCamera||box.isEmpty())return;
 const size=box.getSize(new T.Vector3()),target=box.getCenter(new T.Vector3()),dir=new T.Vector3(...direction).normalize();
 const right=new T.Vector3().crossVectors(new T.Vector3(0,0,1),dir).normalize(),up=new T.Vector3().crossVectors(dir,right).normalize();
 const vertical=Math.tan(T.MathUtils.degToRad(camera.fov*.5)),horizontal=vertical*camera.aspect;
 const narrow=camera.aspect<1,usableWidth=narrow?.84:.68,usableHeight=narrow?.52:.77;
 let distance=0;
 const boxes=objects?objects.filter(o=>o.visible).map(o=>o.geometry.boundingBox.clone().applyMatrix4(o.matrixWorld)):[box];
 for(const partBox of boxes)for(const x of [partBox.min.x,partBox.max.x])for(const y of [partBox.min.y,partBox.max.y])for(const z of [partBox.min.z,partBox.max.z]){
  const delta=new T.Vector3(x,y,z).sub(target),depth=delta.dot(dir);
  distance=Math.max(distance,Math.abs(delta.dot(right))/(horizontal*usableWidth)+depth,Math.abs(delta.dot(up))/(vertical*usableHeight)+depth);
 }
 distance=Math.max(.08,distance*padding);controls.target.copy(target);camera.position.copy(target).addScaledVector(dir,distance);camera.lookAt(target);
 const w=$('#scene').clientWidth,h=$('#scene').clientHeight;
 camera.setViewOffset(w,h,narrow?0:-w*.14,narrow?-h*.09:0,w,h);
 camera.near=Math.max(.0001,distance/2000);camera.far=Math.max(90,distance+size.length()*5);camera.updateProjectionMatrix();
}
function subset(prefix){return o=>o.userData.id.startsWith(prefix);}
function modelShot(shot,u){
 const m=shot.id.startsWith('ag23')?models.ag23:models.mechanical;
 let filter=()=>true,separation=0,members=0,angle=[.85,.78,.42],padding=1.04,ground=true,tag='';
 const turn=.12*Math.sin(u*Math.PI);
 switch(shot.id){
  case 'hook':separation=.32*smooth((u-.10)/.40);angle=[.85,.78-turn,.33+turn];break;
  case 'reveal':separation=mix(.32,.88,smooth(u));angle=[.85,.78-turn,.55];break;
  case 'wheel':filter=subset('WHEEL-FL-');angle=[.35,1,.2+u*.12];ground=false;tag='TYRE / TREAD / RIM / HUB\nSource-derived wheel geometry';break;
  case 'bearing':filter=o=>/^R3-AXLE-R-(INNER-RACE|OUTER-RACE|BALL-)/.test(o.userData.id);angle=[.35,-1,.3];ground=false;tag='AUTHORED BEARING\nRaces + rolling elements';break;
  case 'drive':filter=o=>/^R3-(?:SPROCKET|CHAIN)-PRIMARY-/.test(o.userData.id);angle=[.2,1,.3+u*.12];ground=false;tag='PRIMARY CHAIN + 19 / 57 SPROCKETS\nSaved neutral geometry';break;
  case 'members':filter=o=>/^R3-CHAIN-PRIMARY-(?:ROLLER|BUSH|PIN|PLATES)-0$/.test(o.userData.id);angle=[.65,1,.38];ground=false;tag='ONE CHAIN LINK\nRoller · bush · pin · plates';break;
  case 'explode':separation=.9-.15*smooth(u);angle=[.85,.78-u*.18,.62];break;
  case 'ag23':angle=[.9,-.78+turn,.4];padding=1.1;break;
  case 'ag23-explode':separation=.65*smooth(u);angle=[.85,-.78,.52];padding=1.1;break;
  case 'resolve':separation=.8*(1-smooth(u/.7));angle=[.85,.78,.33];break;
 }
 if(manual){separation=manualGroup;members=manualMembers;filter=()=>true;ground=true;}
 setVisible(m,filter,separation,members);
 if(!manual&&shot.id==='bearing'){
  const spread=.15*smooth(u*.9+.1);
  for(const o of m.objects)if(o.visible){if(o.userData.id.endsWith('OUTER-RACE'))o.position.y+=spread;if(o.userData.id.endsWith('INNER-RACE'))o.position.y-=spread;}
 }
 if(!manual&&shot.id==='members'){
  const offsets={ROLLER:0,BUSH:.055,PIN:-.055,PLATES:.12};
  for(const o of m.objects)if(o.visible){const type=o.userData.id.split('-')[3];o.position.y=(offsets[type]||0)*smooth(u*.75+.25);}
 }
 m.root.updateMatrixWorld(true);const box=boundsFor(m.objects);fit(box,angle,padding,m.objects);
 if(ground&&camera.aspect>=1&&!userCamera){camera.position.lerp(controls.target,.16);camera.lookAt(controls.target);}
 floor.visible=ground;grid.visible=ground;key.castShadow=ground;
 if(!manual){$('#system').value='all';system='all';$('#separate').value=separation;$('#members').value=0;}
 $('#detail-tag').hidden=!tag||manual;$('#detail-tag').textContent=tag;
 $('#identity').textContent=`${m.meta.revision} / ${m.objects.filter(o=>o.visible).length.toLocaleString()} VISIBLE PARTS`;
 $('#scope').textContent=separation>.001||members||['bearing','members'].includes(shot.id)?'DISPLAY SEPARATION · ASSEMBLY PATH UNVERIFIED':'DIGITAL STUDY · PHYSICAL VALIDATION OPEN';
 app.visibleParts=m.objects.filter(o=>o.visible).map(o=>o.userData.id);app.model=m.meta.revision;
}

const NS='http://www.w3.org/2000/svg';
function svgEl(name,attrs={},content){const el=document.createElementNS(NS,name);for(const [k,v]of Object.entries(attrs))el.setAttribute(k,String(v));if(content!==undefined)el.textContent=content;return el;}
let graphLayer,nodeMap,graphBox,treeFocus;
function laneFor(n){
 if(/^(?:CQ-|CHILDFIRST|OEM-|RIDGE-2028)/.test(n.id))return 0;
 if(/^RIDGE-(?:MECH|PROP|BODY)/.test(n.id))return 1;
 if(/^RC25/.test(n.id))return 2;
 if(/AG23|BUGGY|ADULT/.test(n.id))return 3;
 if(/ASSEMBLY|PROGRESS|ACTIONS|HOME-/.test(n.id))return 4;
 return 5;
}
function setupTree(){
 const svg=$('#tree-svg');graphLayer=svgEl('g');svg.append(graphLayer);nodeMap=new Map(graph.nodes.map(n=>[n.id,n]));
 const depth=new Map(),visiting=new Set();function level(n){if(depth.has(n.id))return depth.get(n.id);if(visiting.has(n.id))throw Error('Cyclic revision graph');visiting.add(n.id);const value=Math.max(0,...n.parent_ids.map(id=>{const p=nodeMap.get(id);if(!p)throw Error('Missing revision parent: '+id);return level(p)+1;}));visiting.delete(n.id);depth.set(n.id,value);return value;}
 const lanes=[[],[],[],[],[],[]];for(const n of graph.nodes){n.depth=level(n);lanes[laneFor(n)].push(n);}
 let y=0;
 for(const [index,nodes] of lanes.entries()){
  const rows=new Map();graphLayer.append(svgEl('text',{x:0,y:y-18,class:'lane'},['DESIGN + PROPORTIONS','RIDGE MECHANICAL + BODY','RC PROTOTYPES','SIX WHEELS + OTHER BRANCHES','ASSEMBLY + CAPTURE','ANALYSIS + PLATFORM'][index]));
  let maxRow=0;
  for(const n of nodes){const row=rows.get(n.depth)||0;rows.set(n.depth,row+1);maxRow=Math.max(maxRow,row);n.x=n.depth*232;n.y=y+row*62;}
  y+=(maxRow+1)*62+68;
 }
 const edgeGroup=svgEl('g');graphLayer.insertBefore(edgeGroup,graphLayer.firstChild);
 for(const n of graph.nodes)for(const id of n.parent_ids){const p=nodeMap.get(id),dx=Math.max(45,(n.x-p.x-206)*.5);const edge=svgEl('path',{d:`M${p.x+206} ${p.y+24} C${p.x+206+dx} ${p.y+24},${n.x-dx} ${n.y+24},${n.x} ${n.y+24}`,class:'edge','data-parent':id,'data-child':n.id});edgeGroup.append(edge);}
 for(const n of graph.nodes){
  const g=svgEl('g',{class:'node',transform:`translate(${n.x},${n.y})`,tabindex:'0',role:'button','aria-label':`${n.id}: ${n.label}. ${n.status}`,'data-id':n.id});g.append(svgEl('rect',{width:206,height:48,rx:5}));
  const issue=/issue|fail|rejected/.test(n.status),research=/research|planned|progress|scenario/.test(n.status);g.append(svgEl('circle',{cx:196,cy:10,r:3,fill:research?'none':issue?'#e9a36e':'#8db8c0',stroke:issue?'#e9a36e':'#8db8c0','stroke-width':1}));
  g.append(svgEl('text',{x:10,y:17,class:'node-id'},n.id.length>29?n.id.slice(0,28)+'…':n.id));
  const label=n.label.replace(/^[^·]*·\s*/,'');g.append(svgEl('text',{x:10,y:35,class:'node-label'},label.length>30?label.slice(0,29)+'…':label));
  g.append(svgEl('title',{},`${n.label}\n${n.status}`));g.addEventListener('click',()=>selectNode(n.id));g.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();selectNode(n.id);}});graphLayer.append(g);n.element=g;
 }
 graphBox={x:-24,y:-45,width:Math.max(...graph.nodes.map(n=>n.x))+255,height:y-45};treeFocus=nodeMap.get('RIDGE-MECH-R3D');
 app.graph={nodes:graph.nodes.length,edges:graph.nodes.reduce((v,n)=>v+n.parent_ids.length,0),sourceSha256:graph.sourceSha256};
}
function ancestors(id,set=new Set()){if(set.has(id))return set;set.add(id);for(const parent of nodeMap.get(id)?.parent_ids||[])ancestors(parent,set);return set;}
function focusTree(id){const branch=ancestors(id);for(const n of graph.nodes){n.element.classList.toggle('active',branch.has(n.id));n.element.classList.toggle('focus',n.id===id);}for(const edge of $('#tree-svg').querySelectorAll('.edge'))edge.classList.toggle('active',branch.has(edge.dataset.parent)&&branch.has(edge.dataset.child));}
function treeShot(shot,u){
 for(const m of Object.values(models))m.root.visible=false;floor.visible=false;grid.visible=false;$('#detail-tag').hidden=true;
 const returnShot=shot.id==='tree-return',id=returnShot?'BABY-AG23-P01':'RIDGE-MECH-R3D';focusTree(treeManual?.id||id);
 const n=nodeMap.get(id),wide=graphBox,close={x:Math.max(-30,n.x-600),y:Math.max(-45,n.y-180),width:1050,height:530};
 const zoom=returnShot?1-smooth(u/.65):smooth((u-.48)/.45);
 const box=treeManual||Object.fromEntries(['x','y','width','height'].map(k=>[k,mix(wide[k],close[k],zoom)]));
 $('#tree-svg').setAttribute('viewBox',`${box.x} ${box.y} ${box.width} ${box.height}`);
 $('#identity').textContent=`${graph.nodes.length} RECORDED REVISIONS / ${app.graph.edges} PARENT LINKS`;
 $('#scope').textContent='AUTHORED HISTORY · KNOWN ISSUES RETAINED';app.model=null;app.visibleParts=[];app.treeView=box;
}
function selectNode(id){pause();focusTree(id);const n=nodeMap.get(id);treeManual={x:n.x-430,y:n.y-240,width:1060,height:550,id};$('#selection').textContent=`${n.id} — ${n.label}. Recorded status: ${n.status}. Parents: ${n.parent_ids.join(', ')||'Root branch'}.`;seek(time);}
function motionShot(shot,u){
 for(const m of Object.values(models))m.root.visible=false;activeModel=null;floor.visible=false;grid.visible=false;key.castShadow=true;
 const obstacle=shot.id==='terrain';
 const state=motion.update(obstacle?{mode:'obstacle',scenario:'log',progress:mix(-250,1550,u),scenery:true}:{mode:'chrono-log',time:1.865+u*3.75,forces:true,collision:false,trail:true,payload:false,scenery:true});
 motion.show(true);fit(obstacle?terrainEnvelope:motion.bounds(),obstacle?[1.45,1.25,.62]:[1.4,-2,.9],1.06);
 if(!obstacle&&!userCamera){
  // Move toward the saved contact at beat 32; source playback remains 1x.
  const ease=v=>{v=clamp(v);return v*v*(3-2*v);},push=ease((u-.06)/.44)*(1-.25*ease((u-.78)/.22));
  const close=motion.framing('wheel'),position=close.target.clone().addScaledVector(close.offset,1.65);
  camera.position.lerp(position,push);controls.target.lerp(close.target,push);camera.lookAt(controls.target);
 }
 $('#detail-tag').hidden=false;$('#detail-tag').textContent=obstacle?'LOG / PIT / ALTERNATING TRACKS\n36 native wheel components':`SAVED t = ${state.frame.t.toFixed(2)} s / 1×\nFront travel ${state.frame.wheel_heave_m.slice(0,2).map(v=>(v*1000).toFixed(1)).join(' / ')} mm\nFR contact ${Math.hypot(...state.frame.contact_force_n.FR_wheel).toFixed(0)} N\nLog traversal: failed`;
 $('#identity').textContent=obstacle?'RIDGE R4 / WHEEL CONTACT INSPECTION':'CQ TYRE STUDY / 18 BODIES / 26 JOINTS';
 $('#scope').textContent=obstacle?'PRESCRIBED WHEEL SUPPORT · NOT DYNAMICS':'SAVED CHRONO · LOG TRAVERSAL FAILED';
 $('#selection').textContent=obstacle?'Prescribed native wheel support. Open Motion & terrain for log, alternating-track and pit controls.':'Recorded Chrono response. Open Motion & terrain for full log, pit, steering and braking replays.';
 app.model=obstacle?'RIDGE-R4-P01-WHEEL-INSPECTION':'CQ-PH1.1-CST-REPLAY';app.visibleParts=state.visibleParts;
 app.motionState={mode:state.mode,sampleTime:state.sampleTime,sampleIndex:state.sampleIndex,progress:state.progress,recordedPhysics:state.recordedPhysics,status:state.status};
}
function render(){renderer.render(scene,camera);}
function seek(seconds){
 if(!app.ready)return {ready:false,error:app.error};
 if(!Number.isFinite(seconds))throw Error('Film time must be finite');time=clamp(seconds,0,DURATION);const shot=shotAt(time),u=clamp((time/BEAT-shot.beat)/(shot.end-shot.beat));
 if(currentShot!==shot.id){currentShot=shot.id;userCamera=false;manual=false;treeManual=null;wire=false;$('#wire').setAttribute('aria-pressed','false');clearSelection();$('#eyebrow').textContent=shot.eyebrow;$('#title').innerHTML=shot.title;$('#subtitle').textContent=shot.subtitle;$('#chapter').textContent=shot.chapter;}
 const isTree=shot.id.startsWith('tree'),isMotion=['terrain','chrono'].includes(shot.id);$('#tree').hidden=!isTree;$('#film').classList.toggle('tree-mode',isTree);$('#film').classList.toggle('motion-mode',isMotion);$('#tree-hint').hidden=!isTree;
 for(const id of ['system','separate','members','wire'])$('#'+id).disabled=isTree||isMotion;
 motion.show(false);app.motionState=null;
 if(isTree)treeShot(shot,u);else if(isMotion)motionShot(shot,u);else modelShot(shot,u);
 // Beat accent changes a narrow progress line and fill light, not frame luminance.
 const beatPhase=(time/BEAT)%1;front.intensity=1.2+.12*Math.exp(-beatPhase*7);
 if(selected)selected.material.emissive.set(0x244c50);
 $('#progress').style.transform=`scaleX(${time/DURATION})`;$('#scrub').value=time;$('#time').value=`00:${time.toFixed(1).padStart(4,'0')} / 00:${DURATION}`;
 app.time=time;app.shot=shot.id;render();return inspect();
}
function inspect(){return {ready:app.ready,time,shot:app.shot,model:app.model,visibleParts:app.visibleParts,sourceChecks,graph:app.graph,playing,motion:app.motionState,physicalValidation:false,hardwareRelease:false};}
function play(){if(!app.ready)return;if(time>=DURATION)seek(0);manual=false;userCamera=false;playing=true;previous=0;$('#play').textContent='Pause film';if(raf===null)raf=requestAnimationFrame(loop);}
function pause(){playing=false;previous=0;if(raf!==null)cancelAnimationFrame(raf);raf=null;$('#play').textContent='Play film';}
function loop(now){raf=null;if(!playing)return;const delta=previous?Math.min(.1,(now-previous)/1000):0;previous=now;seek(time+delta);if(time>=DURATION)pause();else raf=requestAnimationFrame(loop);}
function resize(){const w=$('#scene').clientWidth,h=$('#scene').clientHeight;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();if(app.ready){userCamera=false;seek(time);}else render();}
function clearSelection(){if(selected)selected.material.emissive.set(0);selected=null;$('#focus').disabled=true;$('#selection').textContent=currentShot.startsWith('tree')?'Scroll to zoom. Drag to pan. Select a revision to inspect its recorded status and parents.':'Drag to orbit. Scroll to inspect. Select a part to reveal its source identity.';}
function manualChange(){if(!app.ready)return;pause();clearSelection();manual=true;userCamera=false;manualGroup=+$('#separate').value;manualMembers=+$('#members').value;system=$('#system').value;seek(time);}
$('#play').onclick=()=>playing?pause():play();$('#scrub').oninput=e=>{pause();seek(+e.target.value);};
$('#reset').onclick=()=>{pause();manual=false;userCamera=false;treeManual=null;system='all';$('#system').value='all';$('#members').value=0;$('#separate').value=0;wire=false;clearSelection();$('#wire').setAttribute('aria-pressed','false');seek(time);};
$('#tree-button').onclick=()=>{pause();seek(8*BEAT);};for(const id of ['system','separate','members'])$('#'+id).oninput=manualChange;
$('#wire').onclick=()=>{pause();wire=!wire;$('#wire').setAttribute('aria-pressed',String(wire));seek(time);};
$('#focus').onclick=()=>{if(!selected)return;userCamera=false;fit(boundsFor([selected]),[.8,1,.5],1.3);userCamera=true;render();};
let down=null;
$('#scene').addEventListener('pointerdown',e=>{down=[e.clientX,e.clientY];});
$('#scene').addEventListener('pointerup',e=>{if(!app.ready||!activeModel||!down||Math.hypot(e.clientX-down[0],e.clientY-down[1])>5)return;const rect=$('#scene').getBoundingClientRect();pointer.set((e.clientX-rect.left)/rect.width*2-1,-(e.clientY-rect.top)/rect.height*2+1);raycaster.setFromCamera(pointer,camera);const hit=raycaster.intersectObjects(activeModel.objects.filter(o=>o.visible),false)[0];clearSelection();if(hit){selected=hit.object;selected.material.emissive.set(0x244c50);$('#selection').textContent=`${selected.userData.id} · ${selected.userData.group} · ${selected.userData.role}`;$('#focus').disabled=false;}render();});
const tree=$('#tree');let pan=null;
tree.addEventListener('wheel',e=>{if(!app.ready)return;e.preventDefault();pause();const b=treeManual||app.treeView,scale=Math.exp(clamp(e.deltaY,-120,120)*.002);treeManual={...b,x:b.x+b.width*(1-scale)/2,y:b.y+b.height*(1-scale)/2,width:clamp(b.width*scale,350,graphBox.width*1.8),height:clamp(b.height*scale,200,graphBox.height*1.8)};seek(time);},{passive:false});
tree.addEventListener('pointerdown',e=>{if(e.target.closest('.node'))return;pause();pan={x:e.clientX,y:e.clientY,b:{...(treeManual||app.treeView)}};tree.setPointerCapture(e.pointerId);});
tree.addEventListener('pointermove',e=>{if(!pan)return;const factor=pan.b.width/tree.clientWidth;treeManual={...pan.b,x:pan.b.x-(e.clientX-pan.x)*factor,y:pan.b.y-(e.clientY-pan.y)*factor};seek(time);});tree.addEventListener('pointerup',()=>{pan=null;});
document.addEventListener('visibilitychange',()=>{if(document.hidden)pause();});window.addEventListener('pagehide',e=>{pause();if(!e.persisted){controls.dispose();renderer.dispose();}});
new ResizeObserver(resize).observe($('#film'));resize();
async function start(){
 graph=await read('data/film-evolution.json');setupTree();
 for(const id of ['mechanical','ag23']){models[id]=await loadModel(id);$('#loading small').textContent=`Verified ${sourceChecks[id].parts} source parts / ${sourceChecks[id].revision}`;}
 $('#loading small').textContent='Verifying the original terrain and recorded Chrono studies…';motion=await createMotionScene(scene);
 for(const meta of [motion.wheelMeta,motion.chronoWheelMeta])sourceChecks[meta.id]={revision:meta.revision,parts:meta.partCount,sourceParts:meta.sourcePartCount,withheld:meta.omitted.length,triangles:meta.triangleCount,sha256:meta.binarySha256};
 // Fit the native shot once to its complete posed course. Rotating local
 // bounding-box corners would otherwise pump the camera as circular tyres spin.
 terrainEnvelope=new T.Box3();
 for(let frame=0;frame<=120;frame++){
  motion.update({mode:'obstacle',scenario:'log',progress:mix(-250,1550,frame/120)});
  terrainEnvelope.union(new T.Box3().setFromObject(motion.wheelRoot,true));
 }
 terrainEnvelope.expandByScalar(.09);motion.show(false);
 app.ready=true;Object.assign(app,{seek,play,pause,inspect,models,scene,camera,renderer,controls,selectNode,motion});$('#loading').hidden=true;$('#film').setAttribute('aria-busy','false');$('#play').disabled=false;$('#scrub').disabled=false;$('#scrub').max=DURATION;
 for(const element of document.querySelectorAll('.inspection button,.inspection input,.inspection select'))if(element.id!=='focus')element.disabled=false;
 const requested=Number(new URLSearchParams(location.search).get('t')||0);seek(Number.isFinite(requested)?requested:0);
}
await start();
}
initializeFilm().catch(e=>{app.pause?.();app.ready=false;app.error=e.message;$('#loading').hidden=true;$('#error').hidden=false;$('#error p').textContent='The 3D study could not load. '+e.message;$('#film').setAttribute('aria-busy','false');});
