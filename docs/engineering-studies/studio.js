import * as T from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {agnitraModel} from './agnitra-model.js';
import {retrievalModel} from './retrieval-model.js';
import {v} from './scene-kit.js';
import {TIMELINES,DURATION,shotAt} from './timeline.js';
const $=s=>document.querySelector(s),params=new URLSearchParams(location.search),project=params.get('project')==='retrieval'?'retrieval':'agnitra',capture=params.has('capture');
document.body.classList.toggle('capture',capture);
const app=window.neuralFilm={ready:false,error:null,duration:DURATION,project};
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
let time=0,playing=false,manual=!capture,userCamera=false,wire=false,last=0,sound=false,audioAttempt=0;
let layoutKey='';
const music=$('#music');let model,renderer,camera,controls,scene,selectionOutline,selectedStage=null,focusActive=false;
const raycaster=new T.Raycaster(),pointer=new T.Vector2(),markers=new Map();
async function json(path){const r=await fetch(path);if(!r.ok)throw Error('Unable to load '+path);return r.json();}
async function init(){
 const verified={},provenance=await json('data/provenance.json'),files={};
 const needed=project==='agnitra'?['agnitra-shapes.json']:['retrieval.json','retrieval-still.png'];
 for(const name of needed){
  const response=await fetch('data/'+name);if(!response.ok)throw Error('Missing fixture: '+name);
  const bytes=await response.arrayBuffer(),hash=Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',bytes)),b=>b.toString(16).padStart(2,'0')).join('');
  if(hash!==provenance.files[name].sha256)throw Error('Fixture checksum mismatch: '+name);verified[name]=hash;files[name]=bytes;
 }
 const decode=name=>JSON.parse(new TextDecoder().decode(files[name]));
 let sceneScope;
 if(project==='agnitra'){model=agnitraModel(decode('agnitra-shapes.json'));sceneScope=provenance.displayGeometry;}
 else{const texture=await new T.TextureLoader().loadAsync(URL.createObjectURL(new Blob([files['retrieval-still.png']],{type:'image/png'})));texture.colorSpace=T.SRGBColorSpace;model=retrievalModel(decode('retrieval.json'),texture);sceneScope=provenance.retrievalScope;}
 document.body.dataset.project=project;
 renderer=new T.WebGLRenderer({canvas:$('#scene'),antialias:true,preserveDrawingBuffer:true});
 renderer.setPixelRatio(capture?1:Math.min(devicePixelRatio,1.5));renderer.setClearColor(0x0c1822);renderer.outputColorSpace=T.SRGBColorSpace;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.05;
 renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFSoftShadowMap;
 scene=new T.Scene();scene.fog=new T.Fog(0x0c1822,28,60);scene.add(model.root);
 selectionOutline=new T.Box3Helper(new T.Box3(),project==='agnitra'?0xd6eeb3:0xefb89a);selectionOutline.name='Selected stage outline';selectionOutline.material.depthTest=false;selectionOutline.material.transparent=true;selectionOutline.material.opacity=.9;selectionOutline.renderOrder=10;selectionOutline.visible=false;scene.add(selectionOutline);
 camera=new T.PerspectiveCamera(34,1,.05,100);camera.up.set(0,0,1);
 controls=new OrbitControls(camera,renderer.domElement);controls.enableDamping=false;controls.minDistance=2;controls.maxDistance=65;controls.maxPolarAngle=Math.PI*.91;
 controls.addEventListener('start',()=>{pause();userCamera=true;});controls.addEventListener('change',()=>{if(userCamera)render();});
 scene.add(new T.HemisphereLight(0xd9f6ff,0x29414d,3.1));
 const key=new T.DirectionalLight(0xfff1df,3.6);key.position.set(1,-3,10);key.castShadow=true;key.shadow.mapSize.set(2048,2048);Object.assign(key.shadow.camera,{left:-15,right:15,top:15,bottom:-15,near:.1,far:30});key.shadow.normalBias=.025;scene.add(key);
 const rim=new T.DirectionalLight(0x7ff4e4,2.5);rim.position.set(-5,3,4);scene.add(rim);
 const warm=new T.DirectionalLight(0xffbb85,1.5);warm.position.set(6,4,3);scene.add(warm);
 const floor=new T.Mesh(new T.PlaneGeometry(200,200),new T.MeshStandardMaterial({color:0x0c1b26,roughness:.8,metalness:.15}));floor.position.z=-1.8;floor.receiveShadow=true;scene.add(floor);
 const grid=new T.GridHelper(100,100,0x365363,0x243e4f);grid.rotation.x=Math.PI/2;grid.position.z=-1.79;grid.material.transparent=true;grid.material.opacity=.12;scene.add(grid);
 $('#source-link').href=project==='agnitra'?'https://pypi.org/project/agnitra/0.2.4/':'https://zack-dev-cm.github.io/projects/multimodal-video-search-platform/';
 $('#fixture-link').href='data/'+(project==='agnitra'?'agnitra-shapes.json':'retrieval.json');
 $('#fixture-link').textContent=project==='agnitra'?'View recorded shapes ↗':'View authored example ↗';
 $('#download').href=`models/${project}.glb`;document.title=(project==='agnitra'?'Agnitra':'Multimodal video search')+' — Explore the work in 3D';
 for(const stage of model.inspection){
  const option=document.createElement('option');option.value=stage.id;option.textContent=String(stage.number).padStart(2,'0')+' · '+stage.name;$('#stage-select').append(option);
  const marker=document.createElement('button');marker.type='button';marker.className='stage-marker';marker.textContent=String(stage.number).padStart(2,'0');marker.title=stage.name;marker.setAttribute('aria-label','Select '+stage.number+': '+stage.name);marker.setAttribute('aria-pressed','false');marker.onclick=()=>selectStage(stage.id);$('#stage-markers').append(marker);markers.set(stage.id,marker);
 }
 TIMELINES[project].forEach((row,i)=>{const b=document.createElement('button');b.type='button';b.textContent=String(i+1).padStart(2,'0')+' '+row[9];b.onclick=()=>{pause();leaveInspection();seek(i*DURATION/8+.2);};$('#chapters').append(b);});
 function resize(){const w=$('#scene').clientWidth,h=$('#scene').clientHeight;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();seek(time);}
 app.seek=seek;app.renderer=renderer;app.inspect=()=>({project,time,shot:manual?'overview':shotAt(project,time).id,playing,manual,selectedStage:selectedStage?.id??null,focusActive,verifiedInputs:verified,facts:model.facts,visibleMeshes:countMeshes(),visibleNodes:visibleNodes(),renderCalls:renderer.info.render.calls,triangles:renderer.info.render.triangles,camera:camera.position.toArray(),sceneScope});
 app.exportGLB=async()=>{const {GLTFExporter}=await import('./vendor/GLTFExporter.js');pause();manual=true;userCamera=false;seek(0);model.root.userData={project,facts:model.facts,scope:sceneScope};const out=await new GLTFExporter().parseAsync(model.root,{binary:true,onlyVisible:true});return Array.from(new Uint8Array(out));};
 $('#play').onclick=()=>{if(playing)pause();else play();};
 $('#inspect').onclick=()=>{pause();manual=true;focusActive=false;userCamera=false;seek(time);};
 $('#reset').onclick=()=>{focusActive=false;userCamera=false;seek(time);};
 $('#stage-select').onchange=()=>selectStage($('#stage-select').value);
 $('#focus-stage').onclick=()=>{if(!selectedStage)return;pause();manual=true;focusActive=true;userCamera=false;seek(time);};
 $('#separate').oninput=()=>{manual=true;seek(time);};
 $('#wire').onchange=()=>{wire=$('#wire').checked;seek(time);};
 $('#timeline').oninput=()=>{pause();leaveInspection();seek(Number($('#timeline').value));};
 $('#sound').onclick=()=>{sound=!sound;audioAttempt++;$('#sound').textContent=sound?'Sound on':'Sound off';$('#sound').setAttribute('aria-pressed',String(sound));if(sound&&playing)startSound();else music.pause();};
 document.addEventListener('visibilitychange',()=>{if(document.hidden)pause();});
 reduced.addEventListener('change',e=>{if(e.matches)pause();});
 let pointerStart=null;
 $('#scene').addEventListener('pointerdown',event=>{pointerStart={x:event.clientX,y:event.clientY};});
 $('#scene').addEventListener('pointerup',event=>{
  if(!manual||!pointerStart||Math.hypot(event.clientX-pointerStart.x,event.clientY-pointerStart.y)>5){pointerStart=null;return;}pointerStart=null;
  const rect=$('#scene').getBoundingClientRect();pointer.set((event.clientX-rect.left)/rect.width*2-1,-(event.clientY-rect.top)/rect.height*2+1);raycaster.setFromCamera(pointer,camera);
  for(const hit of raycaster.intersectObject(model.root,true)){let object=hit.object;while(object&&!object.userData.stageId)object=object.parent;if(object?.userData.stageId){selectStage(object.userData.stageId);break;}}
 });
 $('#scene').addEventListener('pointercancel',()=>{pointerStart=null;});
 window.addEventListener('resize',resize);new ResizeObserver(resize).observe($('#viewport'));resize();
 await renderer.compileAsync(scene,camera);renderer.render(scene,camera);renderer.getContext().finish();
 app.ready=true;$('#loading').hidden=true;$('#play').textContent=playing?'Pause tour':'Play tour';
 requestAnimationFrame(tick);
}
function countMeshes(){let n=0;model.root.traverseVisible(o=>{if(o.isMesh)n++;});return n;}
function visibleNodes(){const nodes=[];model.root.traverseVisible(o=>nodes.push({name:o.name,type:o.type,position:o.position.toArray(),scale:o.scale.toArray(),wireframe:o.isMesh?Boolean(o.material?.wireframe):undefined}));return nodes;}
function render(){renderer.render(scene,camera);updateMarkers();}
function leaveInspection(){manual=false;userCamera=false;focusActive=false;selectedStage=null;$('#stage-select').value='';}
function selectStage(id){
 const stage=model.inspection.find(stage=>stage.id===id)??null;
 if(!manual||focusActive||!stage)userCamera=false;
 pause();manual=true;focusActive=false;selectedStage=stage;$('#stage-select').value=stage?.id??'';seek(time);
}
function boundsFor(object){object.updateWorldMatrix(true,true);const bounds=new T.Box3();object.traverseVisible(child=>{if(child.isMesh){if(!child.geometry.boundingBox)child.geometry.computeBoundingBox();bounds.union(child.geometry.boundingBox.clone().applyMatrix4(child.matrixWorld));}});return bounds;}
function fitInspection(pose,w,h){
 const bounds=boundsFor(focusActive&&selectedStage?selectedStage.object:model.root),focus=bounds.getCenter(new T.Vector3()),dir=pose.dir.clone().normalize();
 const right=v(0,0,1).cross(dir).normalize(),up=dir.clone().cross(right),tanV=Math.tan(T.MathUtils.degToRad(camera.fov)/2),tanH=tanV*w/h;
 let distance=0;
 for(const x of [bounds.min.x,bounds.max.x])for(const y of [bounds.min.y,bounds.max.y])for(const z of [bounds.min.z,bounds.max.z]){const point=v(x,y,z).sub(focus);distance=Math.max(distance,point.dot(dir)+Math.max(Math.abs(point.dot(right))/tanH,Math.abs(point.dot(up))/tanV));}
 return {focus,dir,distance:Math.max(5,distance*1.19)};
}
function updateMarkers(){
 $('#stage-markers').hidden=!manual||capture;
 if(!manual||capture)return;
 const w=$('#scene').clientWidth,h=$('#scene').clientHeight;
 for(const stage of model.inspection){
  const marker=markers.get(stage.id),bounds=boundsFor(stage.object),anchor=bounds.getCenter(new T.Vector3());anchor.z=bounds.max.z+.28;anchor.project(camera);
  const x=(anchor.x+1)*w/2,y=(1-anchor.y)*h/2;
  marker.hidden=anchor.z< -1||anchor.z>1||x<22||x>w-22||y<45||y>h-22;
  marker.style.left=x+'px';marker.style.top=y+'px';marker.setAttribute('aria-pressed',String(selectedStage===stage));
 }
}
function fitStory(index){
 if(!capture)return;
 const key=[index,innerWidth,innerHeight,manual,playing].join(':');if(key===layoutKey)return;layoutKey=key;
 const narrow=matchMedia('(max-width:700px)').matches,title=$('#title'),story=$('#story'),evidence=$('#evidence'),studio=$('#studio');
 title.style.fontSize='';evidence.style.top='';evidence.style.bottom='';
 const rect=()=>story.getBoundingClientRect(),limit=narrow?$('#object-label').getBoundingClientRect().top-12:(capture?$('#scope'):$('#transport')).getBoundingClientRect().top-evidence.getBoundingClientRect().height-32;
 let size=parseFloat(getComputedStyle(title).fontSize);
 while(rect().bottom>limit&&size>(narrow?28:38)){size-=2;title.style.fontSize=size+'px';}
 if(!narrow){evidence.style.top=(rect().bottom-studio.getBoundingClientRect().top+20)+'px';evidence.style.bottom='auto';}
}
function seek(t){
 time=T.MathUtils.clamp(t,0,DURATION-.000001);const shot=shotAt(project,manual?0:time);let pose=model.update(shot.id,shot.u,manual,Number($('#separate').value));
 const w=$('#scene').clientWidth,h=$('#scene').clientHeight,narrow=matchMedia('(max-width:700px)').matches;
 if(manual&&!capture)pose=fitInspection(pose,w,h);
 if(!userCamera){if(!manual)pose.dir.applyAxisAngle(v(0,0,1),(shot.u-.5)*.08);const distance=pose.distance*(capture&&narrow?.86:1);camera.position.copy(pose.focus).addScaledVector(pose.dir.normalize(),distance);camera.lookAt(pose.focus);controls.target.copy(pose.focus);}
 if(capture)camera.setViewOffset(w,h,narrow?0:-w*.185,0,w,h);else camera.clearViewOffset();camera.updateProjectionMatrix();
 model.root.traverse(o=>{if(o.isMesh&&o.material&&!o.material.map)o.material.wireframe=wire;});
 selectionOutline.visible=manual&&Boolean(selectedStage);if(selectionOutline.visible){selectionOutline.box.copy(boundsFor(selectedStage.object)).expandByScalar(.12);}
 $('#eyebrow').textContent=shot.eyebrow;$('#title').innerHTML=shot.title.replaceAll('<br>','<br> ');$('#subtitle').textContent=shot.subtitle;$('#fact-value').textContent=shot.fact;$('#fact-label').textContent=shot.factLabel;
 $('#stage-detail').setAttribute('aria-live',manual?'polite':'off');
 $('#evidence-label').textContent=shot.evidenceLabel;$('#evidence-value').textContent=shot.evidence;$('#evidence-note').textContent=shot.note;
 $('#stage-description').textContent='';
 if(manual){
  $('#evidence-label').textContent=selectedStage?String(selectedStage.number).padStart(2,'0')+' / '+selectedStage.name:'READ THE MODEL';
  $('#evidence-value').textContent=selectedStage?selectedStage.shape:(project==='agnitra'?'Batch × channels × height × width':'Frames → signals → indexes → ranked moments');
  $('#stage-description').textContent=selectedStage?selectedStage.description:(project==='agnitra'?'Each sheet is one channel. Its surface is a 32 × 32 spatial grid; stacking separates channels. Select a numbered stage to follow its input and output shapes.':'Follow the numbered stages. Cyan is the visual path; coral is speech and text; pale marks the OCR branch. Select a stage to see what it adds to the search.');
  $('#evidence-note').textContent=selectedStage?selectedStage.note:(project==='agnitra'?'Recorded Agnitra 0.2.4 shapes. Geometry and spacing explain dimensions; colors do not represent activations.':'An authored architecture example. The still, speech and timestamps illustrate the flow; they are not a recorded retrieval result.');
 }
 $('#focus-stage').disabled=!selectedStage||!manual;
 $('.inspection-tools').hidden=!manual;
 $('#stage-select').value=selectedStage?.id??'';
 $('#object-label').textContent=manual?(selectedStage?'SELECTED / '+selectedStage.name.toUpperCase()+' · RESET VIEW FOR OVERVIEW':'SELECT A NUMBER OR OBJECT · DRAG TO ORBIT'):shot.label.toUpperCase();
 $('#scope').textContent=project==='agnitra'?'Recorded tensor shapes · illustrative depth and timing':'Authored architecture example · no recorded retrieval result';
 $('#timeline').value=time;$('#clock').textContent='00:'+String(Math.floor(time)).padStart(2,'0')+' / 00:30';
 $('#film-progress i').style.width=(time/DURATION*100)+'%';
 fitStory(shot.index);
 [...$('#chapters').children].forEach((b,i)=>{b.classList.toggle('active',i===shot.index);b.setAttribute('aria-current',i===shot.index?'step':'false');});
 render();return {project,time,shot:shot.id,visibleMeshes:countMeshes()};
}
function pause(){playing=false;audioAttempt++;music.pause();$('#play').textContent='Play tour';}
async function startSound(){const attempt=++audioAttempt;music.currentTime=time;try{await music.play();}catch{if(attempt!==audioAttempt||!sound||!playing)return;sound=false;$('#sound').textContent='Sound unavailable';$('#sound').setAttribute('aria-pressed','false');}}
function play(){leaveInspection();playing=true;last=0;$('#play').textContent='Pause tour';seek(time);if(sound)startSound();}
function tick(now){if(playing){if(sound&&!music.paused)seek(music.currentTime%DURATION);else if(last)seek((time+(now-last)/1000)%DURATION);last=now;}else last=0;requestAnimationFrame(tick);}
init().catch(error=>{app.error=error.message;$('#loading').textContent='The 3D scene could not load on this device. '+error.message;const fallback=document.createElement('a');fallback.href='media/'+project+'-film.mp4';fallback.textContent='Watch the project film instead';$('#loading').append(fallback);console.error(error);});
