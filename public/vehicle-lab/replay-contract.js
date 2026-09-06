// Validate decoded recorded states before creating any scene objects.
export function validateReplay(data){
  const check=(ok,message)=>{if(!ok)throw Error(message);};
  const finite=n=>typeof n==='number'&&Number.isFinite(n);
  check(data?.schemaVersion===1&&data.kind==='rigid-body-replay'&&data.units==='m','Unsupported replay contract');
  check(typeof data.engine==='string'&&data.engine.length>0&&typeof data.scope==='string'&&data.scope.length>0&&data.physicalValidation===false,'Replay needs engine, scope and an explicit validation boundary');
  check(Array.isArray(data.bodies)&&data.bodies.length>0,'Replay needs bodies');
  const ids=new Set();
  for(const b of data.bodies){
    check(typeof b?.id==='string'&&b.id.length>0&&!ids.has(b.id),'Missing or duplicate body identity');ids.add(b.id);
    check(['box','cylinder'].includes(b.shape),'Unsupported replay shape');
    check(Array.isArray(b.dimensions)&&b.dimensions.length===(b.shape==='box'?3:2)&&b.dimensions.every(n=>finite(n)&&n>0),'Invalid replay dimensions');
  }
  check(Array.isArray(data.frames)&&data.frames.length>=2,'Replay needs at least two frames');
  let previous=-Infinity;
  for(const f of data.frames){
    check(finite(f?.t)&&f.t>=0&&f.t>previous,'Frame times must increase');previous=f.t;
    check(f.poses&&typeof f.poses==='object'&&!Array.isArray(f.poses)&&Object.keys(f.poses).length===ids.size&&Object.keys(f.poses).every(id=>ids.has(id)),'Every frame must contain every body');
    for(const pose of Object.values(f.poses)){
      check(Array.isArray(pose)&&pose.length===7&&pose.every(finite),'Pose must contain seven finite numbers');
      check(Math.abs(pose.slice(3).reduce((sum,q)=>sum+q*q,0)-1)<=1e-5,'Quaternion must be normalized (x,y,z,w)');
    }
    if(f.metrics!==undefined)check(f.metrics&&typeof f.metrics==='object'&&!Array.isArray(f.metrics)&&Object.values(f.metrics).every(finite),'Metrics must be finite numbers');
  }
  return data;
}
