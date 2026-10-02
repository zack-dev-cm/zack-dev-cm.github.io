import * as T from 'three';
import {line,textSprite} from './cabinets.js';
import {smooth,CHAPTERS} from './timeline.js';
import {roomContext,ROOM} from './room-context.js';

const EVIDENCE_SHA256='26401084a0874e6ebfc19c02e04e9156dc795f8d3b047149542980a4102d587a';
const sha=async bytes=>Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',bytes)),v=>v.toString(16).padStart(2,'0')).join('');
async function verified(url,expected){const r=await fetch(url);if(!r.ok)throw Error('Workflow evidence unavailable');const b=await r.arrayBuffer();if(await sha(b)!==expected)throw Error('Workflow evidence checksum mismatch');return b;}
export async function workflowScene(scene,materials){
  const evidence=JSON.parse(new TextDecoder().decode(await verified('data/workflow-evidence.json',EVIDENCE_SHA256)));
  const textures={},loader=new T.TextureLoader();
  await Promise.all(Object.entries(evidence.examples).flatMap(([code,example])=>Object.entries(example.assets).map(async([role,asset])=>{
    const b=await verified(asset.path,asset.sha256),url=URL.createObjectURL(new Blob([b],{type:'image/png'}));
    try{const texture=await loader.loadAsync(url);texture.colorSpace=T.SRGBColorSpace;texture.anisotropy=4;textures[code+'-'+role]=texture;}finally{URL.revokeObjectURL(url);}
  })));
  const groups=CHAPTERS.map(c=>{const g=new T.Group();g.name='Workflow: '+c.id;scene.add(g);return g;});
  const cream=new T.MeshStandardMaterial({color:0xe8e1d5,roughness:.8}),charcoal=new T.MeshStandardMaterial({color:0x1a242b,roughness:.6});
  const cyan=new T.MeshBasicMaterial({color:0x97d8ea,toneMapped:false}),amber=new T.MeshBasicMaterial({color:0xe3b574,toneMapped:false});
  function box(w,h,d,m,name){const o=new T.Mesh(new T.BoxGeometry(w,h,d),m);o.name=name;o.castShadow=true;o.receiveShadow=true;return o;}
  function board(code,role,height=1.6){
    const texture=textures[code+'-'+role],w=height*texture.image.width/texture.image.height,g=new T.Group();g.name=code+' original '+role;
    g.add(box(w+.035,height+.035,.035,charcoal,'Document frame'));
    const sheet=new T.Mesh(new T.PlaneGeometry(w,height),new T.MeshBasicMaterial({map:texture,toneMapped:false,side:T.DoubleSide}));sheet.position.z=.019;sheet.name=code+' '+role+' image';g.add(sheet);
    g.userData={width:w,height,asset:evidence.examples[code].assets[role].path};return g;
  }
  function badge(text,x,y,z,width=1,color='#97d8ea'){
    const g=new T.Group();g.add(box(width,.18,.035,charcoal,'Evidence label'));
    const sprite=textSprite(text,color,width*.92);
    const s=new T.Mesh(new T.PlaneGeometry(width*.92,width*.92*100/512),new T.MeshBasicMaterial({map:sprite.material.map,transparent:true,depthTest:true,depthWrite:false,alphaTest:.02,toneMapped:false}));
    sprite.material.dispose();s.position.z=.021;s.name='Label text: '+text;g.add(s);g.position.set(x,y,z);return g;
  }
  const drawing={},extract={},catalog={},renderBoards={};
  for(const code of ['B3000','B3100']){
    const g=new T.Group(),b=board(code,'drawing',1.85);g.add(b);
    const scan=box(b.userData.width+.04,.014,.009,cyan,'Drawing scan line');scan.position.z=.03;g.add(scan);
    // Use the recorded native-PDF box and crop rather than guessing image pixels.
    const item=evidence.examples[code],source=item.extraction.bbox_pdf_points[0];
    const crop=item.drawingCropPdfPoints, nx=((source[0]+source[2])/2-crop[0])/(crop[2]-crop[0]),ny=((source[1]+source[3])/2-crop[1])/(crop[3]-crop[1]);
    const fw=(source[2]-source[0])/(crop[2]-crop[0])*b.userData.width+.055,fh=(source[3]-source[1])/(crop[3]-crop[1])*1.85+.05;
    const focus=line([[-fw/2,-fh/2,0],[fw/2,-fh/2,0],[fw/2,fh/2,0],[-fw/2,fh/2,0],[-fw/2,-fh/2,0]],0x97d8ea);
    focus.position.set((nx-.5)*b.userData.width,(.5-ny)*1.85,.032);g.add(focus);
    g.position.set(0,1.08,0);groups[0].add(g);drawing[code]={g,b,scan,focus};
    const ex=new T.Group(),paper=board(code,'drawing',1.35);paper.position.set(-.78,1.03,-.1);paper.rotation.y=.12;ex.add(paper);
    const token=badge(code,.73,1.48,.15,1.05),page=badge('p. '+evidence.examples[code].drawingPage+' / 3 mentions',.73,1.13,.15,1.05),quantity=badge('Quantity pending',.73,.78,.15,1.05,'#e3b574');
    paper.updateMatrixWorld(true);const origin=new T.Vector3((nx-.5)*paper.userData.width,(.5-ny)*1.35,.06).applyMatrix4(paper.matrixWorld);
    const connection=line([origin.toArray(),origin.toArray(),origin.toArray()],0x97d8ea);ex.add(token,page,quantity,connection);groups[1].add(ex);extract[code]={g:ex,paper,token,page,quantity,connection,origin};
    const card=board(code,'catalog',1.12);card.position.set(code==='B3000'?-.8:.8,1.74,-.38);groups[2].add(card);
    const link=line([[card.position.x,1.07,-.35],[card.position.x,.86,.02],[card.position.x,.5,.28]]);groups[2].add(link);catalog[code]={card,link};
    const rb=board(code,'render',1.9);rb.position.set(.22,1.07,0);groups[5].add(rb);renderBoards[code]=rb;
  }
  const known=badge('Family confirmed',0,1.58,-.15,1.65),unknown=badge('Site / qty / price pending',0,1.31,-.15,1.65,'#e3b574');groups[4].add(known,unknown);
  const renderLabel=badge('Recorded 36-inch oak concept',.22,2.17,0,1.85);groups[5].add(renderLabel);
  // A small architectural room, explicitly authored rather than inferred from the drawings.
  const room=groups[6],plaster=new T.MeshStandardMaterial({color:0xd5cbb9,roughness:.9}),stone=new T.MeshStandardMaterial({color:0xb8ac94,roughness:.78}),trim=new T.MeshStandardMaterial({color:0x383c37,roughness:.45}),counterMaterial=new T.MeshStandardMaterial({color:0xefe9dd,roughness:.32});
  const textureCanvas=document.createElement('canvas');textureCanvas.width=textureCanvas.height=256;const tc=textureCanvas.getContext('2d'),pixels=tc.createImageData(256,256);
  for(let j=0;j<256;j++)for(let i=0;i<256;i++){const k=(j*256+i)*4,n=((Math.imul(i+7,374761393)^Math.imul(j+9,668265263))>>>8)%21;pixels.data[k]=pixels.data[k+1]=pixels.data[k+2]=127+n;pixels.data[k+3]=255;}
  tc.putImageData(pixels,0,0);const grain=new T.CanvasTexture(textureCanvas);grain.wrapS=grain.wrapT=T.RepeatWrapping;grain.repeat.set(5,5);plaster.bumpMap=grain;plaster.bumpScale=.002;stone.bumpMap=grain;stone.bumpScale=.0015;
  const slab=box(3.5,.07,2.9,stone,'Illustrative stone floor');slab.position.set(0,-.035,.35);room.add(slab);
  const back=box(3.5,2.25,.08,plaster,'Growing plaster wall');back.position.set(0,1.125,-1.08);room.add(back);
  const walls=[back];
  for(const [height,y,depth,z] of [[.55,.275,2.9,.35],[.4,2.05,2.9,.35],[1.3,1.2,.28,-.96],[1.3,1.2,.35,1.625]]){
    const wall=box(.075,height,depth,plaster,'Window wall');wall.position.set(-1.75,y,z);wall.userData.fullY=y;walls.push(wall);room.add(wall);
  }
  back.userData.fullY=1.125;
  const window=new T.Group();window.name='Daylight window';
  for(const z of [-.79,.48,1.43]){const mullion=box(.055,1.3,.035,trim,'Window mullion');mullion.position.set(-1.727,1.2,z);window.add(mullion);}
  for(const y of [.56,1.2,1.85]){const rail=box(.055,.035,2.23,trim,'Window rail');rail.position.set(-1.727,y,.32);window.add(rail);}
  const glass=new T.Mesh(new T.PlaneGeometry(2.23,1.28),new T.MeshBasicMaterial({color:0xb8d9db,transparent:true,opacity:.23,depthWrite:false,side:T.DoubleSide,toneMapped:false}));glass.rotation.y=Math.PI/2;glass.position.set(-1.765,1.2,.32);window.add(glass);room.add(window);
  const tileLines=new T.Group();for(let x=-1.75;x<=1.75;x+=.58)tileLines.add(line([[x,.0002,-1.1],[x,.0002,1.8]],0x8e8677));for(let z=-1.1;z<1.81;z+=.58)tileLines.add(line([[-1.75,.0002,z],[1.75,.0002,z]],0x8e8677));room.add(tileLines);
  const sunlight=new T.Group();sunlight.name='Window light on floor';
  for(let i=0;i<3;i++){const ray=new T.Mesh(new T.PlaneGeometry(.45,1.7),new T.MeshBasicMaterial({color:0xffedbd,transparent:true,opacity:.13,depthWrite:false,toneMapped:false}));ray.rotation.x=-Math.PI/2;ray.rotation.z=-.38;ray.position.set(-.75+i*.58,.001,.7);sunlight.add(ray);}room.add(sunlight);
  const context=roomContext(room,materials,box,stone,trim,counterMaterial);
  const bay=new T.Group();bay.name='Adjustable bay guides';
  for(const x of [-.5,.5])bay.add(line([[x,.006,-1.04],[x,.006,-.40],[x,1.00,-.40]],0x216275));
  bay.add(line([[-.5,.006,-.40],[.5,.006,-.40]],0x216275));room.add(bay);
  const bayLabel=badge('NOMINAL FIT BAY',0,1.36,-1.018,.76);room.add(bayLabel);
  const decor=new T.Group();decor.name='Authored vase and plant';
  const vase=new T.Mesh(new T.LatheGeometry([new T.Vector2(.035,0),new T.Vector2(.06,.03),new T.Vector2(.065,.105),new T.Vector2(.04,.15),new T.Vector2(.035,.175)],32),cream);vase.castShadow=true;decor.add(vase);
  const leafMaterial=new T.MeshStandardMaterial({color:0x647454,roughness:.85,side:T.DoubleSide});
  for(let j=0;j<13;j++){const angle=j*2.4,stem=new T.Mesh(new T.CylinderGeometry(.001,.002,.18+j%3*.03,6),leafMaterial);stem.position.set(Math.sin(angle)*.026,.22,Math.cos(angle)*.026);stem.rotation.z=Math.sin(angle)*.36;decor.add(stem);const leaf=new T.Mesh(new T.SphereGeometry(1,10,6),leafMaterial);leaf.scale.set(.025,.055,.007);leaf.position.set(Math.sin(angle)*.055,.25+j%4*.035,Math.cos(angle)*.055);leaf.rotation.set(.3,angle,.45);leaf.castShadow=true;decor.add(leaf);}
  room.add(decor);
  const packageGroup=groups[7],handoff=new T.Group();handoff.name='Evidence handoff';
  const packageNames=['Drawing + catalog','Agent review','Draft BOM + render'];
  const cards=packageNames.map((text,i)=>{const b=badge(text,1.18,1.9-i*.27,.35,1.27);handoff.add(b);return b;});packageGroup.add(handoff);
  let state={};
  function update({pose,manual,selected,width,bayWidth,models,separate=0,opening=0}){
    const i=pose.chapter,id=CHAPTERS[i].id,p=pose.progress,roomMode=id==='room'||id==='result',cabinetMode=manual&&!roomMode;
    groups.forEach((g,j)=>g.visible=!cabinetMode&&(j===i||(roomMode&&j===6)));
    for(const code of ['B3000','B3100']){
      drawing[code].g.visible=code===selected;drawing[code].g.rotation.y=-.09+.18*smooth(p);
      drawing[code].scan.position.y=.9-1.8*smooth(p);drawing[code].focus.scale.setScalar(.92+.08*smooth(p));
      const ex=extract[code];ex.g.visible=code===selected;ex.token.position.copy(ex.origin).lerp(new T.Vector3(.73,1.48,.15),smooth(p/.55));ex.token.scale.setScalar(.3+.7*smooth(p/.55));
      ex.page.scale.setScalar(.65+.35*smooth((p-.15)/.5));ex.quantity.scale.setScalar(.65+.35*smooth((p-.4)/.5));ex.connection.geometry.setFromPoints([ex.origin,new T.Vector3(.2,1.48,.15),ex.token.position.clone()]);ex.connection.visible=p>.1;
      catalog[code].card.rotation.y=(code==='B3000'?1:-1)*.12*(1-smooth(p));catalog[code].link.material.opacity=.15+.7*smooth(p);
      renderBoards[code].visible=code===selected;renderBoards[code].rotation.y=.22*(1-smooth(p));renderBoards[code].scale.setScalar(.72+.28*smooth(p));
    }
    known.position.y=1.67;unknown.position.y=1.4;known.scale.setScalar(.92+.08*smooth(p/.45));unknown.scale.setScalar(.92+.08*smooth((p-.2)/.45));
    const build=id==='room'?smooth(p/.32):1,alignment=id==='room'?smooth((p-.15)/.22):1;
    const fits=bayWidth+1e-6>=width*25.4,exploded=manual&&separate>.01;
    const placement=fits&&!exploded?(id==='room'?smooth((p-.4)/.42):1):0;
    const cabinetZ=.38+(ROOM.cabinetZ-.38)*placement;
    if(roomMode){
      bayLabel.visible=id==='room'&&build>.68;bayLabel.scale.x=Math.min(.76,bayWidth/1000-.1)/.76;decor.visible=placement>.98;decor.position.set(-width*.0254*.23,ROOM.cabinetY+.025,cabinetZ);
      for(const wall of walls){wall.visible=build>.01;wall.scale.y=Math.max(.002,build);wall.position.y=wall.userData.fullY*build;}
      window.visible=build>.01;window.scale.y=Math.max(.002,build);sunlight.visible=build>.35;tileLines.visible=build>.15;
      slab.scale.set(1,1,1);bay.scale.x=bayWidth/1000;
      bay.traverse(o=>{if(o.isLine){o.material.color.set(fits?0x216275:0xb66128);o.material.opacity=.95;}});
      context.update({bayWidth,width,progress:p,roomChapter:id==='room',insertion:placement,fits,separate,opening});
      cards.forEach((card,j)=>{const reveal=smooth((p-j*.12)/.45);card.position.x=1.05;card.position.y=1.9-j*.27+.08*(1-reveal);card.position.z=-1.018;card.scale.setScalar(.96+.04*reveal);card.visible=id==='result'&&p>=j*.12;});
    }
    const showPair=cabinetMode||id==='match'||id==='inspect'||id==='review';
    models.forEach((model,j)=>{
      model.root.visible=showPair||(roomMode&&model.root.userData.catalogCode===selected);
      model.root.scale.setScalar(id==='match'&&!manual?.18+.82*smooth(p):1);
      model.root.position.set(roomMode?.60*(1-alignment):(j===0?-1:1)*(model.width/2+.24),0,roomMode?cabinetZ:0);
    });
    const primary=models.find(m=>m.root.userData.catalogCode===selected),bounds=new T.Box3().setFromObject(primary.root);
    state={stage:cabinetMode?'manual-inspection':id,asset:!cabinetMode&&['drawing','extract','match','render'].includes(id)?evidence.examples[selected].assets[id==='render'?'render':id==='match'?'catalog':'drawing'].path:null,scanY:drawing[selected].scan.position.y,tokenX:extract[selected].token.position.x,catalogAngle:catalog[selected].card.rotation.y,renderScale:renderBoards[selected].scale.x,wallScale:back.scale.y,placement:primary.root.position.toArray(),roomVisible:room.visible,visibleGroups:groups.filter(g=>g.visible).map(g=>g.name),bayWidthMm:bayWidth,cabinetWidthMm:width*25.4,sideClearanceMm:(bayWidth-width*25.4)/2,fits,exactNominalFit:Math.abs(bayWidth-width*25.4)<1e-6,placementBlocked:roomMode&&!fits,explodedInFront:roomMode&&exploded,selectedBounds:{min:bounds.min.toArray(),max:bounds.max.toArray()},roomContext:context.inspect(),roomGeometry:'Authored teaching/workroom and courtyard; site layout, dimensions and quantity unknown',recordedImageWidthInches:36,recordedImageFinish:'oak',evidenceHashesVerified:true};
    return state;
  }
  return {update,inspect:()=>state,evidence,groups};
}
