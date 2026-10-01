import * as T from 'three';

const inch=.0254;
const mesh=(g,m,n)=>{const o=new T.Mesh(g,m);o.name=n;o.castShadow=true;o.receiveShadow=true;return o;};
const box=(w,h,d,m,n)=>mesh(new T.BoxGeometry(w,h,d),m,n);
function panel(w,h,d,m,n){
  const r=Math.min(.003,w/6,h/6,d/3),x=w/2-r,y=h/2-r,s=new T.Shape();
  s.moveTo(-x,-y);s.lineTo(x,-y);s.lineTo(x,y);s.lineTo(-x,y);s.closePath();
  const g=new T.ExtrudeGeometry(s,{depth:Math.max(.001,d-2*r),bevelEnabled:true,bevelSize:r,bevelThickness:r,bevelSegments:2,steps:1});
  g.translate(0,0,-d/2+r);return mesh(g,m,n);
}
function oakTexture(){
  const c=document.createElement('canvas');c.width=256;c.height=512;const x=c.getContext('2d');
  x.fillStyle='#b89770';x.fillRect(0,0,256,512);
  for(let i=0;i<320;i++){
    const a=(Math.sin(i*17.131)*43758.5453)%1,b=Math.abs(a),px=(i*37.71)%256;
    x.strokeStyle=`rgba(${b>.5?'75,46,25':'238,211,168'},${.025+b*.065})`;x.lineWidth=.35+b*1.7;x.beginPath();
    for(let y=0;y<=512;y+=8){const xx=px+Math.sin(y*.015+i*.31)*(1+b*2.5);if(y===0)x.moveTo(xx,y);else x.lineTo(xx,y);}x.stroke();
  }
  const t=new T.CanvasTexture(c);t.colorSpace=T.SRGBColorSpace;t.wrapS=t.wrapT=T.RepeatWrapping;t.anisotropy=4;return t;
}
export function materials(){
  return {
    oak:new T.MeshStandardMaterial({color:0xffffff,map:oakTexture(),roughness:.62,metalness:0}),
    sage:new T.MeshStandardMaterial({color:0x74887a,roughness:.65}),
    porcelain:new T.MeshStandardMaterial({color:0xd7d1c5,roughness:.5}),
    body:new T.MeshStandardMaterial({color:0xc9c3b7,roughness:.56}),
    inside:new T.MeshStandardMaterial({color:0xebe6db,roughness:.7}),
    metal:new T.MeshStandardMaterial({color:0x393d3c,metalness:.84,roughness:.28}),
    base:new T.MeshStandardMaterial({color:0x242b2d,metalness:.28,roughness:.55}),
  };
}
function handle(parent,w,y,z,m){
  const g=new T.Group();g.name='Brushed handle';g.position.set(0,y,z);
  const length=Math.min(.13,w*.5);
  const bar=mesh(new T.CylinderGeometry(.005,.005,length,12),m,'Handle grip');bar.rotation.z=Math.PI/2;bar.position.z=.025;g.add(bar);
  for(const x of [-length*.42,length*.42]){const post=mesh(new T.CylinderGeometry(.004,.004,.025,10),m,'Handle standoff');post.rotation.x=Math.PI/2;post.position.set(x,0,.0125);g.add(post);}
  parent.add(g);
}
function partGroup(root,name,id,position,explode){
  const g=new T.Group();g.name=name;g.userData.part=id;g.position.copy(position);g.userData.origin=position.clone();g.userData.explode=explode;root.add(g);return g;
}
export function cabinet(code,widthIn,m,finish='oak'){
  const root=new T.Group();root.name=code;root.userData.catalogCode=code;root.userData.units='metres';
  const w=widthIn*inch,h=34*inch,d=24*inch,p=.019,base=.1,front=d/2+.008;
  const groups=[],parts={},doors=[],drawers=[];
  function addPart(name,id,pos,exp){const g=partGroup(root,name,id,new T.Vector3(...pos),new T.Vector3(...exp));groups.push(g);(parts[id]??=[]).push(g);return g;}
  const toe=addPart('Recessed toe base','carcass',[0,base/2,-.035],[0,0,0]);toe.add(box(w-.065,base,d-.075,m.base,'Toe base'));
  for(const sign of [-1,1]){const g=addPart(sign<0?'Left body panel':'Right body panel','carcass',[sign*(w/2-p/2),(h+base)/2,0],[sign*.18,.03,0]);g.add(panel(p,h-base,d,m.body,'Side panel'));}
  const bottom=addPart('Cabinet floor','carcass',[0,base+p/2,0],[0,-.035,0]);bottom.add(panel(w-2*p,p,d-p,m.inside,'Bottom panel'));
  const back=addPart('Rear panel','carcass',[0,(h+base)/2,-d/2+p/2],[0,.025,-.2]);back.add(panel(w-2*p,h-base-p,p,m.inside,'Back panel'));
  const top=addPart('Sub-top','carcass',[0,h-p/2,0],[0,.23,0]);top.add(panel(w,p,d,m.body,'Top panel'));
  const shelf=addPart('One adjustable shelf','shelf',[0,.38,-.018],[0,.09,.04]);shelf.add(panel(w-2*p-.01,p,d-.075,m.inside,'Adjustable shelf'));
  const divider=addPart('Drawer-row support','carcass',[0,h-.18,-.015],[0,.12,0]);divider.add(panel(w-2*p,p,d-.045,m.body,'Drawer support'));
  for(const sign of [-1,1]){
    const g=addPart(sign<0?'Left hinged door':'Right hinged door','doors',[sign*(w/2-.012),.401,front],[sign*.09,0,.19]);
    const dw=w/2-.014,dh=h-.19-base-.015;
    const face=panel(dw,dh,p,m[finish],'Door face');face.position.x=-sign*dw/2;g.add(face);
    const assembly=new T.Group();assembly.position.x=-sign*dw/2;handle(assembly,dw,dh*.27,p/2,m.metal);g.add(assembly);
    // Hinge fittings are authored visual details rather than supplier geometry.
    for(const y of [-dh*.31,dh*.31]){const fitting=box(.03,.035,.012,m.metal,'Illustrative hinge');fitting.position.set(-sign*.014,y,-.012);g.add(fitting);}
    doors.push({object:g,sign});
  }
  const count=code==='B3100'?2:1,dw=(w-.014*(count+1))/count,dh=.145,dd=d-.085;
  for(let i=0;i<count;i++){
    const x=count===1?0:(i===0?-1:1)*(dw/2+.007);
    const g=addPart(count===1?'Full-width drawer':i===0?'Left upper drawer':'Right upper drawer','drawers',[x,h-.09,front],[x*.12,.035,.26]);
    g.add(panel(dw,dh,p,m[finish],'Drawer face'));handle(g,dw,0,p/2,m.metal);
    const floor=panel(dw-.028,.012,dd,m.inside,'Drawer floor');floor.position.set(0,-dh*.3,-dd/2);g.add(floor);
    for(const sign of [-1,1]){const side=box(.012,dh*.67,dd,m.inside,'Drawer side');side.position.set(sign*(dw/2-.021),0,-dd/2);g.add(side);}
    const rear=box(dw-.04,dh*.67,.012,m.inside,'Drawer back');rear.position.set(0,0,-dd);g.add(rear);
    for(const sign of [-1,1]){const slide=box(.01,.018,dd*.82,m.metal,'Illustrative drawer slide');slide.position.set(sign*(dw/2-.011),-.025,-dd/2);g.add(slide);}
    drawers.push(g);
  }
  root.traverse(o=>{if(o.isMesh){let p=o.parent;while(p&&!p.userData.part)p=p.parent;o.userData.part=p?.userData.part||'carcass';o.userData.cabinet=code;}});
  function update(opening,separate){
    for(const g of groups)g.position.copy(g.userData.origin).addScaledVector(g.userData.explode,separate);
    for(const {object,sign} of doors)object.rotation.y=sign*opening*1.45;
    for(const g of drawers)g.position.z+=opening*.33;
  }
  return {root,parts,width:w,height:h,depth:d,update,doors,drawers};
}
export function line(points,color=0x97d8ea){return new T.Line(new T.BufferGeometry().setFromPoints(points.map(p=>new T.Vector3(...p))),new T.LineBasicMaterial({color,transparent:true,opacity:.6}));}
function textSprite(text,color='#97d8ea',width=.5){
  const c=document.createElement('canvas');c.width=512;c.height=100;const x=c.getContext('2d');x.font='500 46px system-ui';x.textAlign='center';x.textBaseline='middle';x.fillStyle=color;x.fillText(text,256,50);
  const texture=new T.CanvasTexture(c);texture.colorSpace=T.SRGBColorSpace;const s=new T.Sprite(new T.SpriteMaterial({map:texture,transparent:true,depthTest:false}));s.scale.set(width,width*100/512,1);return s;
}
export function dimensions(w,h,d,widthIn){
  const group=new T.Group();group.name='Selected nominal dimensions';
  const y=.015,z=d/2+.15;
  group.add(line([[-w/2,y,z],[w/2,y,z]]));
  for(const x of [-w/2,w/2])group.add(line([[x,y-.025,z],[x,y+.025,z]]));
  const label=textSprite(widthIn+' in W');label.position.set(0,-.075,z);group.add(label);
  group.add(line([[-w/2-.11,0,0],[-w/2-.11,h,0]]));
  for(const y of [0,h])group.add(line([[-w/2-.13,y,0],[-w/2-.09,y,0]]));
  const height=textSprite('34 in H');height.position.set(-w/2-.18,h/2,.025);group.add(height);
  group.add(line([[w/2+.1,0,-d/2],[w/2+.1,0,d/2]]));
  const depth=textSprite('24 in D');depth.position.set(w/2+.19,.02,0);group.add(depth);
  return group;
}
export function elevationLines(width,height,drawerCount){
  const g=new T.Group();g.name='Catalog elevation schematic';
  const x=width/2,y=height;
  const lines=[[[-x,0,0],[x,0,0],[x,y,0],[-x,y,0],[-x,0,0]],[[-x,.1,0],[x,.1,0]],[[-x,y-.18,0],[x,y-.18,0]],[[0,.1,0],[0,y-.18,0]]];
  if(drawerCount===2)lines.push([[0,y-.18,0],[0,y,0]]);
  for(const points of lines)g.add(line(points,0x71a1b0));
  for(let i=0;i<drawerCount;i++){
    const cx=drawerCount===1?0:(i===0?-1:1)*width/4;
    g.add(line([[cx-.06,y-.09,.002],[cx+.06,y-.09,.002]],0x97d8ea));
  }
  return g;
}
