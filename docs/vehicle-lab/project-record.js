// Render authored records as text; artifacts are verified before entering this view.
const element=(tag,text='',className='')=>{const node=document.createElement(tag);node.textContent=text;if(className)node.className=className;return node;};
const svg=(tag,attrs={})=>{const node=document.createElementNS('http://www.w3.org/2000/svg',tag);for(const [k,v] of Object.entries(attrs))node.setAttribute(k,v);return node;};
const badge=status=>element('span',status,'record-status '+status);

function revisionGraph(revisions){
  const byID=new Map(revisions.map(r=>[r.id,r])),depth=new Map(),levels=[];
  function layer(id){if(!depth.has(id))depth.set(id,byID.get(id).parents.length?1+Math.max(...byID.get(id).parents.map(layer)):0);return depth.get(id);}
  for(const r of revisions){const n=layer(r.id);(levels[n]??=[]).push(r);}
  const width=Math.max(220,...levels.map(level=>level.length*210)),height=Math.max(100,levels.length*96),positions=new Map();
  for(const [row,level] of levels.entries())for(const [col,r] of level.entries())positions.set(r.id,{x:(col+.5)*width/level.length,y:row*96+36});
  const graph=svg('svg',{viewBox:`0 0 ${width} ${height}`,width,height,role:'img','aria-label':'Revision graph. Arrows connect parent revisions to their children.'});
  graph.style.width='100%';graph.style.minWidth=width+'px';
  const defs=svg('defs'),marker=svg('marker',{id:'revision-arrow',viewBox:'0 0 10 10',refX:9,refY:5,markerWidth:6,markerHeight:6,orient:'auto'});marker.append(svg('path',{d:'M0 0L10 5L0 10Z',fill:'#718b7e'}));defs.append(marker);graph.append(defs);
  for(const r of revisions)for(const parent of r.parents){
    const a=positions.get(parent),b=positions.get(r.id);graph.append(svg('path',{d:`M${a.x} ${a.y+20}C${a.x} ${a.y+48} ${b.x} ${b.y-48} ${b.x} ${b.y-24}`,fill:'none',stroke:'#718b7e','stroke-width':1.5,'marker-end':'url(#revision-arrow)'}));
  }
  for(const [i,r] of revisions.entries()){
    const p=positions.get(r.id),link=svg('a',{href:'#record-revision-'+i,'aria-label':'Read revision '+r.id}),label=svg('text',{x:p.x,y:p.y+4,'text-anchor':'middle'});label.textContent=r.id.length>24?r.id.slice(0,21)+'…':r.id;
    link.append(svg('rect',{x:p.x-88,y:p.y-19,width:176,height:38,rx:4,fill:'#f6f6ef',stroke:'#9bb3a3'}),label);
    link.addEventListener('click',e=>{e.preventDefault();document.getElementById('record-revision-'+i)?.scrollIntoView({block:'nearest'});});graph.append(link);
  }
  const wrap=element('div','','revision-graph');wrap.dataset.focusX=positions.get(revisions[0].id).x;wrap.append(graph);return wrap;
}

export function mountProjectRecord(project,models,evidence){
  const dialog=document.querySelector('#project-record'),content=dialog.querySelector('.record-content'),urls=[];
  content.replaceChildren();dialog.querySelector('#record-title').textContent=project.name;
  content.append(element('p',project.description,'record-intro'),element('p','Recorded outcomes describe individual checks. Physical validation and hardware release remain unverified.','record-boundary'));
  const heading=(text,count)=>element('h3',text+' / '+count);
  content.append(heading(project.revisionHeading||'Revision decisions',project.revisions.length));
  if(project.revisions.length)content.append(revisionGraph(project.revisions));
  else content.append(element('p','No revisions recorded yet. Add a revision ID, its parent IDs and the decision to project.json.'));
  for(const [i,r] of project.revisions.entries()){
    const card=element('article','','record-card');card.id='record-revision-'+i;
    card.append(element('h4',r.id),element('p',r.parents.length?'Parents: '+r.parents.join(', '):'Independent starting revision','record-meta'),element('p',r.decision));
    const assets=Object.entries(models).filter(([,m])=>m.meta.revision===r.id).map(([id])=>id);
    if(assets.length)card.append(element('p','Models: '+assets.join(', '),'record-meta'));content.append(card);
  }
  content.append(heading('Evidence',evidence.length));
  if(!evidence.length)content.append(element('p','No evidence attached yet. Retain the original result, scope, status and SHA-256 when adding an artifact.'));
  for(const e of evidence){
    const card=element('article','','record-card evidence-card'),title=element('h4',e.id);title.append(badge(e.status));
    card.append(title,element('p',e.kind+(e.revision?' · Revision '+e.revision:''),'record-meta'),element('p',e.scope));
    const identity=element('p','','record-meta');identity.append(element('span','SHA-256 verified '),element('code',e.sha256));card.append(identity);
    const url=URL.createObjectURL(new Blob([e.bytes],{type:'application/octet-stream'}));urls.push(url);
    const download=element('a','Download original artifact');download.href=url;download.download=e.path.split('/').at(-1);card.append(download);
    if(/\.(json|txt|csv|md)$/i.test(e.path)&&e.bytes.byteLength<=131072){
      const details=element('details'),summary=element('summary','Read recorded data');details.append(summary,element('pre',new TextDecoder().decode(e.bytes)));card.append(details);
    }
    content.append(card);
  }
  content.append(heading('Model identities',Object.keys(models).length));
  for(const [id,m] of Object.entries(models)){
    const card=element('article','','record-card');card.append(element('h4',id),element('p',m.meta.revision+' · '+m.meta.partCount+' component groups · '+m.meta.triangleCount.toLocaleString()+' triangles','record-meta'));
    for(const [label,value] of [['Source SHA-256',m.meta.sourceSha256],['Display SHA-256',m.meta.binarySha256]]){const p=element('p',label+' ','record-meta');p.append(element('code',value));card.append(p);}content.append(card);
  }
  document.querySelector('#record-toggle').hidden=false;
  const cleanup=()=>urls.forEach(url=>URL.revokeObjectURL(url));window.addEventListener('pagehide',cleanup,{once:true});return cleanup;
}
