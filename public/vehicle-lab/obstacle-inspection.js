// Deterministic rigid-wheel support profiles for visual inspection only.
// No suspension forces, chassis response, tyre deformation or traction.
export const OBSTACLE_SCENARIOS={
  log:{label:'Log across both tracks',items:[{kind:'log',x:1100,radius:40,side:0}]},
  left_log:{label:'Left wheel log',items:[{kind:'log',x:1100,radius:40,side:1}]},
  staggered:{label:'Alternating left / right logs',items:[{kind:'log',x:1000,radius:40,side:1},{kind:'log',x:1550,radius:40,side:-1}]},
  pits:{label:'Staggered wheel pits',items:[{kind:'pit',x:1000,width:550,depth:80,side:1},{kind:'pit',x:1650,width:550,depth:80,side:-1}]}
};
export const OBSTACLE_RANGE=[-500,2500];
export function supportHeight(item,x,side,radius=183){
  if(item.side&&item.side!==side)return 0;
  const dx=x-item.x;
  if(item.kind==='log'){
    const rr=item.radius+radius;
    return Math.abs(dx)>rr?0:Math.max(0,item.radius-radius+Math.sqrt(Math.max(0,rr*rr-dx*dx)));
  }
  if(item.kind!=='pit')throw Error('Unknown obstacle');
  const half=item.width/2;
  if(Math.abs(dx)>=half)return 0;
  const edge=half-Math.abs(dx);
  return Math.max(-item.depth,edge<radius?Math.sqrt(radius*radius-edge*edge)-radius:-Infinity);
}
export function obstacleWheelHeights(name,progress){
  const scenario=OBSTACLE_SCENARIOS[name];
  if(!scenario||!Number.isFinite(progress)||progress<OBSTACLE_RANGE[0]||progress>OBSTACLE_RANGE[1])throw Error('Invalid obstacle inspection input');
  function height(axle,side){
    const x=progress+(axle==='front'?900:0);
    // Scenarios do not overlap features within a lane. Pits remove the
    // original surface; a ground height of zero must not mask their depth.
    const values=scenario.items.filter(o=>!o.side||o.side===side).map(o=>supportHeight(o,x,side));
    return values.find(v=>v<0)??Math.max(0,...values);
  }
  return {frontLeft:height('front',1),frontRight:height('front',-1),rearLeft:height('rear',1),rearRight:height('rear',-1)};
}
export function createObstacleScene(T,scene,groundZ){
  const group=new T.Group();group.name='Visual obstacle support profile';scene.add(group);
  const materials={ground:new T.MeshStandardMaterial({color:0x889579,roughness:1}),
    soil:new T.MeshStandardMaterial({color:0x655447,roughness:1}),
    log:new T.MeshStandardMaterial({color:0x825a35,roughness:.96}),
    end:new T.MeshStandardMaterial({color:0xc6a16d,roughness:.95})};
  let current=null;
  function clear(){for(const o of [...group.children]){o.geometry.dispose();group.remove(o);}}
  function block(x0,x1,y0,y1,top,bottom=groundZ-140,mat=materials.ground){
    if(x1<=x0||y1<=y0||top<=bottom)return;
    const o=new T.Mesh(new T.BoxGeometry(x1-x0,y1-y0,top-bottom),mat);
    o.position.set((x0+x1)/2,(y0+y1)/2,(top+bottom)/2);o.receiveShadow=true;group.add(o);
  }
  function build(name){
    clear();const items=OBSTACLE_SCENARIOS[name].items;
    // Three uncut strips plus the two wheel lanes. The lane has actual
    // missing ground, a bottom and vertical soil walls where a pit exists.
    for(const [a,b]of[[-1100,-425],[-175,175],[425,1100]])block(-2400,4000,a,b,groundZ);
    for(const side of [1,-1]){
      const y0=side*300-125,y1=side*300+125;
      const pits=items.filter(o=>o.kind==='pit'&&(!o.side||o.side===side)).sort((a,b)=>a.x-b.x);
      let x=-2400;
      for(const p of pits){block(x,p.x-p.width/2,y0,y1,groundZ);block(p.x-p.width/2,p.x+p.width/2,y0,y1,groundZ-p.depth,groundZ-140,materials.soil);x=p.x+p.width/2;}
      block(x,4000,y0,y1,groundZ);
    }
    for(const o of items)if(o.kind==='log'){
      const mesh=new T.Mesh(new T.CylinderGeometry(o.radius,o.radius,o.side?250:880,36),[materials.log,materials.end,materials.end]);
      mesh.position.set(o.x,o.side*300,groundZ+o.radius);mesh.castShadow=true;mesh.receiveShadow=true;group.add(mesh);
    }
    current=name;
  }
  return {group,update({enabled,name,progress}){group.visible=enabled;if(!enabled)return;if(current!==name)build(name);group.position.x=-progress;},
    dispose(){clear();Object.values(materials).forEach(m=>m.dispose());scene.remove(group);}};
}
