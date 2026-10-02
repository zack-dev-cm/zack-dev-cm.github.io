import * as T from 'three';
import {cabinet,line} from './cabinets.js';
import {smooth} from './timeline.js';

export const ROOM={cabinetY:.8636,cabinetZ:-.7352,depth:.6096,neighborWidth:.6096,counterDepth:.67};

// Authored spatial context. Cabinet families/nominal variants use the real facts;
// furniture quantities, room dimensions and other fixtures are not site evidence.
export function roomContext(room,materials,box,stone,trim,counterMaterial){
  const neighbors=[-1,1].map(sign=>{
    const model=cabinet('B3000',24,materials,'porcelain');model.update(0,0);
    model.root.name=(sign<0?'Left':'Right')+' adjoining B3000 · authored 24-inch placement';
    room.add(model.root);return {sign,model};
  });
  const counter=box(1,.025,ROOM.counterDepth,counterMaterial,'Continuous counter across adjoining cabinets');
  counter.position.set(0,ROOM.cabinetY+.0125,-1.04+ROOM.counterDepth/2);room.add(counter);
  const infillMaterial=materials.porcelain.clone();infillMaterial.color.set(0xc2bbac);
  const fillers=[-1,1].map(sign=>{
    const panel=box(1,ROOM.cabinetY-.1,.019,infillMaterial,'Illustrative side infill');
    panel.position.y=(ROOM.cabinetY+.1)/2;panel.position.z=ROOM.cabinetZ+ROOM.depth/2+.008;room.add(panel);
    const plinth=box(1,.1,ROOM.depth-.075,materials.base,'Infill plinth');plinth.position.set(0,.05,ROOM.cabinetZ-.035);room.add(plinth);
    return {sign,panel,plinth};
  });
  const upper=new T.Group();upper.name='Authored upper storage';
  upper.add(box(.60,.52,.285,materials.body,'Illustrative wall-storage body'));
  for(const sign of [-1,1]){
    const door=box(.286,.495,.018,materials.porcelain,'Wall-storage door');door.position.set(sign*.151,0,.151);upper.add(door);
    const pull=box(.007,.085,.015,trim,'Wall-storage pull');pull.position.set(sign*.035,-.095,.174);upper.add(pull);
  }
  upper.position.set(-.76,1.59,-.895);room.add(upper);
  const workspace=new T.Group();workspace.name='Authored worktable and two chairs';room.add(workspace);
  const tabletop=box(.82,.035,.52,counterMaterial,'Worktable top');tabletop.position.set(-.93,.7425,1.16);workspace.add(tabletop);
  for(const x of [-1.275,-.585])for(const z of [.965,1.355]){
    const leg=box(.028,.725,.028,trim,'Worktable leg');leg.position.set(x,.3625,z);workspace.add(leg);
  }
  function chair(x,z,angle){
    const g=new T.Group();g.name='Authored workroom chair';g.position.set(x,0,z);g.rotation.y=angle;
    const seat=box(.32,.04,.32,materials.porcelain,'Chair seat');seat.position.y=.44;g.add(seat);
    const back=box(.32,.29,.035,materials.porcelain,'Chair back');back.position.set(0,.615,-.145);g.add(back);
    for(const dx of [-.125,.125])for(const dz of [-.12,.12]){
      const leg=box(.022,.42,.022,trim,'Chair leg');leg.position.set(dx,.21,dz);g.add(leg);
    }
    workspace.add(g);
  }
  chair(-.93,1.61,Math.PI);chair(-1.5,1.16,Math.PI/2);
  const notebook=box(.20,.016,.15,new T.MeshStandardMaterial({color:0x637c82,roughness:.85}),'Authored notebook');notebook.position.set(-.95,.768,1.13);notebook.rotation.y=.18;workspace.add(notebook);
  const mug=new T.Mesh(new T.CylinderGeometry(.026,.023,.055,16),materials.inside);mug.name='Authored cup';mug.position.set(-.69,.7875,1.23);mug.castShadow=true;workspace.add(mug);
  const courtyard=new T.Group();courtyard.name='Authored courtyard beyond window';room.add(courtyard);
  const ground=box(.46,.045,2.05,stone,'Courtyard paving');ground.position.set(-2.00,-.0225,.30);courtyard.add(ground);
  const foliage=new T.MeshStandardMaterial({color:0x73886b,roughness:.95});
  for(const z of [-.34,.85]){
    const planter=box(.29,.18,.29,new T.MeshStandardMaterial({color:0xb49379,roughness:.9}),'Courtyard planter');planter.position.set(-2.01,.09,z);courtyard.add(planter);
    const trunk=new T.Mesh(new T.CylinderGeometry(.012,.02,.64,8),trim);trunk.position.set(-2.01,.48,z);trunk.name='Courtyard tree stem';courtyard.add(trunk);
    for(const [y,r] of [[.72,.13],[.87,.16],[1.05,.12]]){
      const crown=new T.Mesh(new T.SphereGeometry(r,12,8),foliage);crown.position.set(-2.01,y,z);crown.scale.y=1.2;crown.name='Courtyard foliage';crown.castShadow=true;courtyard.add(crown);
    }
  }
  const widthGuide=line([[-.5,.02,-.35],[.5,.02,-.35]],0x97d8ea);widthGuide.name='Opening width guide';room.add(widthGuide);
  let measurements={};
  function update({bayWidth,width,progress,roomChapter,insertion,fits,separate=0,opening=0}){
    const bay=bayWidth/1000,cabinetWidth=width*.0254,gap=Math.max(0,(bay-cabinetWidth)/2);
    const reveal=roomChapter?smooth((progress-.1)/.23):1;
    neighbors.forEach(({sign,model})=>{model.root.position.set(sign*(bay/2+ROOM.neighborWidth/2),0,ROOM.cabinetZ);model.root.visible=reveal>.02;model.root.scale.y=reveal;});
    const appear=(start,duration)=>roomChapter?smooth((progress-start)/duration):1;
    const counterRise=appear(.28,.15),upperRise=appear(.30,.15),workspaceRise=appear(.24,.16),courtyardRise=appear(.20,.18);
    counter.scale.set(bay+2*ROOM.neighborWidth+.028,Math.max(.00001,counterRise),1);counter.position.y=ROOM.cabinetY+.0125*counterRise;counter.visible=counterRise>.001;
    upper.position.x=-(bay/2+ROOM.neighborWidth/2);upper.scale.y=Math.max(.00001,upperRise);upper.position.y=1.33+.26*upperRise;upper.visible=upperRise>.001;
    workspace.scale.y=Math.max(.00001,workspaceRise);workspace.visible=workspaceRise>.001&&separate<.01&&(fits||opening<.01);
    courtyard.scale.y=Math.max(.00001,courtyardRise);courtyard.visible=courtyardRise>.001;
    const close=roomChapter?smooth((progress-.83)/.13):1;
    fillers.forEach(({sign,panel,plinth})=>{
      const show=fits&&gap>.000001&&insertion>.98&&close>.02;
      for(const o of [panel,plinth]){o.visible=show;o.scale.x=Math.max(.000001,gap*close);o.position.x=sign*(cabinetWidth/2+gap/2);}
    });
    widthGuide.scale.x=bay;widthGuide.visible=reveal>.98;
    widthGuide.material.color.set(fits?0x97d8ea:0xe3b574);
    measurements={neighborNominalWidthMm:609.6,neighborNominalHeightMm:863.6,neighborNominalDepthMm:609.6,counterRunWidthMm:bayWidth+1219.2,sideInfillMm:gap*1000,context:['Two adjoining 24-inch B3000 variants','Continuous counter','Upper storage','Worktable and two chairs','Courtyard'],layout:'Authored teaching/workroom concept; site layout and quantity unknown'};
  }
  const bounds=o=>{const b=new T.Box3().setFromObject(o);return {min:b.min.toArray(),max:b.max.toArray()};};
  return {update,inspect:()=>({...measurements,neighbors:neighbors.map(({model})=>bounds(model.root)),counter:bounds(counter),fillers:fillers.map(({panel})=>({visible:panel.visible,...bounds(panel)}))}),counter};
}
