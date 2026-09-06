// Portable project v1. Keep browser and Python acceptance covered by contract tests.
const ID=/^[a-z0-9][a-z0-9-]{0,63}$/;
const ASSET=/^[A-Za-z0-9_-][A-Za-z0-9._-]*(?:\/[A-Za-z0-9_-][A-Za-z0-9._-]*)*$/;
const SHA=/^[a-f0-9]{64}$/;
const GROUPS=new Set(['frame','body','wheels','drive','suspension','electrical','hardware']);
const STATUSES=new Set(['observed','failed','unverified']);
const matches=(pattern,value)=>typeof value==='string'&&pattern.exec(value)?.[0]===value;
const check=(ok,message)=>{if(!ok)throw Error(message);};
const object=value=>value!==null&&typeof value==='object'&&!Array.isArray(value);
const text=(value,label,max=1000)=>check(typeof value==='string'&&Array.from(value).length>0&&Array.from(value).length<=max,'Missing or excessive '+label);
const fields=(value,required,optional=[])=>check(object(value)&&required.every(k=>Object.hasOwn(value,k))&&Object.keys(value).every(k=>required.includes(k)||optional.includes(k)),'Missing or unsupported object fields: '+required.join(', '));
const id=(value,label)=>check(matches(ID,value),'Invalid '+label+' ID');
const unique=(values,label)=>check(new Set(values).size===values.length,'Duplicate '+label+' IDs');
const finite=value=>typeof value==='number'&&Number.isFinite(value);

export function assetPath(value,base=''){
  check(matches(ASSET,value),'Asset paths need plain relative segments using letters, digits, underscores, hyphens or dots');
  if(base)check(matches(ASSET,base),'Invalid asset base');
  return base?base+'/'+value:value;
}

export function validateProject(data){
  fields(data,['schemaVersion','id','name','description','units','models','stages','revisions','evidence','claims']);
  check(data.schemaVersion===1&&data.units==='mm','Unsupported project version or units');id(data.id,'project');
  text(data.name,'project name');text(data.description,'project description');
  fields(data.claims,['physicalValidation','hardwareRelease']);
  check(Object.values(data.claims).every(v=>v===false),'Both experimental release claims must be false');
  check(Array.isArray(data.models)&&data.models.length>=1&&data.models.length<=20,'Expected 1–20 model assets');
  for(const model of data.models){fields(model,['id','metadata']);id(model.id,'model');assetPath(model.metadata);}
  const models=new Set(data.models.map(m=>m.id));unique(data.models.map(m=>m.id),'model');
  check(Array.isArray(data.revisions)&&data.revisions.length<=200,'Expected at most 200 revisions');
  const revisions=new Map();
  for(const r of data.revisions){
    fields(r,['id','parents','decision']);text(r.id,'revision ID',128);text(r.decision,'revision decision',4000);
    check(Array.isArray(r.parents),'Revision parents must be an array');r.parents.forEach(p=>text(p,'parent revision',128));unique(r.parents,'parent revision');
    check(!revisions.has(r.id),'Duplicate revision IDs');revisions.set(r.id,r);
  }
  const active=new Set(),complete=new Set();
  function visit(ident){
    check(revisions.has(ident),'Unknown parent revision: '+ident);check(!active.has(ident),'Revision graph contains a cycle');
    if(complete.has(ident))return;active.add(ident);revisions.get(ident).parents.forEach(visit);active.delete(ident);complete.add(ident);
  }
  for(const ident of revisions.keys())visit(ident);
  check(Array.isArray(data.evidence)&&data.evidence.length<=200,'Expected at most 200 evidence records');
  for(const e of data.evidence){
    fields(e,['id','kind','path','sha256','scope','status'],['revision']);id(e.id,'evidence');text(e.kind,'evidence kind');text(e.scope,'evidence scope',4000);assetPath(e.path);
    check(matches(SHA,e.sha256),'Invalid evidence SHA-256');check(STATUSES.has(e.status),'Evidence needs an explicit status');
    if(Object.hasOwn(e,'revision'))check(revisions.has(e.revision),'Unknown evidence revision');
  }
  unique(data.evidence.map(e=>e.id),'evidence');
  const replays=new Set(data.evidence.filter(e=>e.kind==='rigid-body-replay').map(e=>e.id));
  check(Array.isArray(data.stages)&&data.stages.length>=1&&data.stages.length<=8,'Expected 1–8 stages');
  for(const s of data.stages){
    fields(s,['id','title','description','status'],['model','replay']);id(s.id,'stage');text(s.title,'stage title');text(s.description,'stage description');
    check(STATUSES.has(s.status),'Stages need an explicit status');
    check((Object.hasOwn(s,'model')&&!Object.hasOwn(s,'replay')&&models.has(s.model))||(Object.hasOwn(s,'replay')&&!Object.hasOwn(s,'model')&&replays.has(s.replay)),'Every stage must reference exactly one existing model or replay');
  }
  unique(data.stages.map(s=>s.id),'stage');return data;
}

export async function sha256(bytes){
  return [...new Uint8Array(await crypto.subtle.digest('SHA-256',bytes))].map(v=>v.toString(16).padStart(2,'0')).join('');
}

export async function validateGeometry(meta,bytes){
  check(object(meta),'Invalid geometry metadata');
  for(const key of ['id','revision','title'])text(meta[key],'geometry '+key);
  assetPath(meta.binary);
  for(const key of ['binarySha256','sourceSha256'])check(matches(SHA,meta[key]),'Invalid geometry '+key);
  check(await sha256(bytes)===meta.binarySha256,'Geometry checksum mismatch');
  check(meta.units==='mm'&&meta.physicalValidation===false&&meta.physicsGeometry===false,'Model units or display-only claim mismatch');
  check(Array.isArray(meta.parts)&&Number.isInteger(meta.partCount)&&meta.partCount>0&&meta.parts.length===meta.partCount,'Part count mismatch');
  check(Array.isArray(meta.omitted),'Geometry needs an omission list');
  const ids=new Set(),lo=[Infinity,Infinity,Infinity],hi=[-Infinity,-Infinity,-Infinity];let triangles=0;
  const view=new DataView(bytes);
  for(const p of meta.parts){
    check(object(p),'Invalid part record');text(p.id,'part identity');check(!ids.has(p.id),'Duplicate part identity');ids.add(p.id);
    check(GROUPS.has(p.group),'Unsupported subsystem group');
    check(Array.isArray(p.color)&&p.color.length===3&&p.color.every(v=>finite(v)&&v>=0&&v<=1),'Part color must contain three finite sRGB components in 0–1');
    for(const kind of ['position','index']){
      const offset=p[kind+'Offset'],count=p[kind+'Count'];
      check(Number.isSafeInteger(offset)&&Number.isSafeInteger(count)&&offset>=0&&count>0&&offset%4===0&&count%3===0&&offset+4*count<=bytes.byteLength,'Invalid geometry buffer range');
    }
    for(let i=0;i<p.positionCount;i++){
      const v=view.getFloat32(p.positionOffset+i*4,true);check(Number.isFinite(v),'Invalid vertex or triangle index');
      const axis=i%3;lo[axis]=Math.min(lo[axis],v);hi[axis]=Math.max(hi[axis],v);
    }
    for(let i=0;i<p.indexCount;i++)check(view.getUint32(p.indexOffset+i*4,true)<p.positionCount/3,'Invalid vertex or triangle index');
    triangles+=p.indexCount/3;
  }
  check(Number.isSafeInteger(meta.triangleCount)&&triangles===meta.triangleCount,'Triangle count mismatch');
  check(Math.max(...hi.map((v,i)=>v-lo[i]))>0,'Model has no finite spatial extent');return meta;
}
