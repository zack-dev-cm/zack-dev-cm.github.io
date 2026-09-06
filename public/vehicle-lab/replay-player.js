import * as T from 'three';
import {validateReplay} from './replay-contract.js';

// Independent replay adapter: arbitrary named rigid bodies, metres, xyzw.
export function createReplay(data,scene){
  validateReplay(data);
  const root=new T.Group(),objects=Object.create(null);
  for(const b of data.bodies){
    const geometry=b.shape==='box'?new T.BoxGeometry(...b.dimensions):new T.CylinderGeometry(b.dimensions[0],b.dimensions[0],b.dimensions[1],48);
    if(b.shape==='cylinder')geometry.rotateX(Math.PI/2);
    const m=new T.Mesh(geometry,new T.MeshStandardMaterial({color:b.color||'#528780',roughness:.55,metalness:.2}));
    m.castShadow=true;root.add(m);objects[b.id]=m;
  }
  scene.add(root);root.visible=false;
  const origin=data.frames[0].t,last=data.frames.at(-1).t;
  function at(t){
    if(!Number.isFinite(t))throw Error('Replay elapsed time must be finite');
    const recorded=origin+Math.max(0,Math.min(last-origin,t));
    let lo=0,hi=data.frames.length-1;
    while(lo<hi){const mid=Math.ceil((lo+hi)/2);if(data.frames[mid].t<=recorded)lo=mid;else hi=mid-1;}
    const frame=data.frames[lo];
    for(const [id,p] of Object.entries(frame.poses)){const m=objects[id];if(!m)throw Error('Unknown replay body');m.position.set(...p.slice(0,3));m.quaternion.set(...p.slice(3));}
    return frame;
  }
  // Transform local bounds through every saved pose; preserve the recorded frame.
  const bounds=new T.Box3(),local=new Map();
  for(const [id,body] of Object.entries(objects)){body.geometry.computeBoundingBox();local.set(id,body.geometry.boundingBox);}
  const point=new T.Vector3(),position=new T.Vector3(),rotation=new T.Quaternion();
  for(const frame of data.frames)for(const [id,p] of Object.entries(frame.poses)){
    const box=local.get(id);position.set(...p.slice(0,3));rotation.set(...p.slice(3));
    for(const x of [box.min.x,box.max.x])for(const y of [box.min.y,box.max.y])for(const z of [box.min.z,box.max.z])bounds.expandByPoint(point.set(x,y,z).applyQuaternion(rotation).add(position));
  }
  at(0);const center=bounds.getCenter(new T.Vector3()),extent=Math.max(.001,...bounds.getSize(new T.Vector3()).toArray()),radius=bounds.getBoundingSphere(new T.Sphere()).radius;
  return {root,objects,data,duration:last-origin,origin,at,center,extent,radius,bounds};
}
