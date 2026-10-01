export const CHAPTER_SECONDS=8;
export const CHAPTERS=[
  {id:'drawing',label:'Read the drawing',title:'Start on the original sheet.',copy:'A scan follows the real elevation crop to the selected cabinet callout. The drawing page and original source stay attached to that code.',action:'Scan the original elevation → find the callout'},
  {id:'extract',label:'Extract the callout',title:'Lift the code into a record.',copy:'The recorded native-text extraction preserves three code occurrences and their PDF coordinates. Three mentions still leave physical quantity unresolved.',action:'Code → page + coordinates + occurrence record'},
  {id:'match',label:'Match the catalog',title:'Connect the exact family.',copy:'The original catalog diagrams resolve B3000 to one upper drawer and B3100 to two side-by-side drawers. The code connection becomes a cabinet.',action:'Original catalog diagram → matching 3D family'},
  {id:'inspect',label:'Open & inspect',title:'Let the construction explain it.',copy:'Drawers pull forward, doors swing open and the components separate. One drawer versus two becomes visible; both families have two doors and one adjustable shelf.',action:'Pull drawers → open doors → expose the shelf'},
  {id:'review',label:'Review dimensions',title:'Keep known facts and open questions.',copy:'Nominal catalog dimensions align around the model. Source facts are confirmed; installed size, physical quantity, specified finish and price stay pending.',action:'Align nominal sizes → retain unresolved fields'},
  {id:'render',label:'Reveal the render',title:'See the recorded agent result.',copy:'The model hands over to the actual ImageGen interior concept from the recorded Codex run. This image depicts the 36-inch oak example; the live 3D controls are independent.',action:'Procedural family → recorded ImageGen interior concept'},
  {id:'room',label:'Fit in a room',title:'Build the room. Place the cabinet.',copy:'Walls rise, daylight enters and the selected cabinet slides into an illustrative bay. Change cabinet or bay width to see clearance or a width shortfall.',action:'Construct room → place cabinet → measure the bay'},
  {id:'result',label:'Take the result',title:'A room view with evidence attached.',copy:'The final cabinet stays fitted in the room while the drawing, catalog, review, draft BOM and render form the handoff. Open the working demo to inspect or run the full agent flow.',action:'Final room + source record + review + draft BOM + render'},
].map((c,i)=>({...c,start:i*CHAPTER_SECONDS,end:(i+1)*CHAPTER_SECONDS}));
export const DURATION=CHAPTERS.length*CHAPTER_SECONDS;
export const smooth=x=>{x=Math.max(0,Math.min(1,x));return x*x*(3-2*x);};
export function chapterAt(t){return Math.min(CHAPTERS.length-1,Math.floor(Math.max(0,t)/CHAPTER_SECONDS));}
export function chapterText(index,width=36,code='B3000'){
  const c=CHAPTERS[index],dp=code==='B3000'?1:3,cp=code==='B3000'?27:28;
  const source={drawing:`Original elevation · page ${dp}\n${code} · recovered source crop`,extract:`${code} · drawing page ${dp}\n3 recorded occurrences · quantity pending`,match:`B3000 · catalog p. 27 · one drawer\nB3100 · catalog p. 28 · two drawers`,inspect:'Both families · two hinged doors\nOne adjustable shelf · catalog p. 27 / 28',review:`${width} W × 34 H × 24 D inches\nSelected nominal catalog variant`,render:`${code} · recorded Mode 1 / Codex run\nImageGen concept · 36-inch oak example`,room:`${code} · ${width}-inch nominal width\nAuthored room · site dimensions unknown`,result:`${code} · source-linked recorded example\nDraft BOM · quantity / price pending`}[c.id];
  return {...c,source,copy:c.id==='review'?`This study uses a catalog-allowed ${width} × 34 × 24 inch variant. The dimension guides show nominal sizing; installed size, physical quantity, specified finish and price stay pending.`:c.copy};
}
export function poseAt(t){
  const chapter=chapterAt(t),progress=Math.max(0,Math.min(1,(t-CHAPTERS[chapter].start)/CHAPTER_SECONDS)),p=smooth(progress),id=CHAPTERS[chapter].id;
  const inspect=id==='inspect',review=id==='review';
  return {chapter,progress,opening:inspect?smooth(progress/.48):review?.8*(1-p):0,separate:inspect?.68*smooth((progress-.35)/.5):0,dimensions:review,blueprint:false,camera:inspect?[1.5-p*.7,1.5,4.4]:review?[1.3+p*.5,1.55,4.6]:[2.2,1.45,4]};
}
