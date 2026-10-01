export const DURATION = 30;
export const CHAPTERS = [
  {id:'callout',label:'Read the callout',title:'Start with the evidence.',copy:'B3000 appears in the original elevation template. Its catalog entry identifies a cabinet family; the drawing still needs its own dimensions and quantities.',source:'Original elevation · page 1\nCase Systems catalog · page 27'},
  {id:'match',label:'Resolve the code',title:'One code. One family.',copy:'The exact B3000 match gives one upper drawer, two hinged doors and an adjustable shelf. Each fact points back to the catalog.',source:'B3000 · catalog page 27\nOne drawer / two doors / one shelf'},
  {id:'compare',label:'Compare families',title:'That second drawer matters.',copy:'B3100 has two drawers side by side. Similar codes and silhouettes are not enough: the catalog diagram resolves the difference.',source:'B3000 · page 27 / B3100 · page 28\nBoth codes occur in the original elevations'},
  {id:'open',label:'Open & inspect',title:'Look inside the match.',copy:'Open the doors, pull out the drawers and separate the parts. Both families include one adjustable shelf beneath the drawer row.',source:'Catalog facts: door, drawer and shelf counts\nMovement & construction details: illustrative'},
  {id:'size',label:'Check dimensions',title:'A code is not a dimension.',copy:'This study uses a catalog-allowed 36 × 34 × 24 inch variant. Change the width to explore options; an installed size still needs drawing evidence.',source:'36 W × 34 H × 24 D inches\nSelected catalog variant'},
  {id:'review',label:'Keep it reviewable',title:'Carry the evidence forward.',copy:'A useful draft BOM carries source references and unresolved fields. A repeated callout is not automatically another cabinet; quantity and price need their own evidence.',source:'Exact code + catalog facts + source page\nInstalled dimensions / quantity / price: review'},
];
export const smooth = x => { x=Math.max(0,Math.min(1,x));return x*x*(3-2*x); };
export function chapterText(index,width=36){
  const chapter=CHAPTERS[index];
  return chapter.id==='size'?{...chapter,copy:`This study uses a catalog-allowed ${width} × 34 × 24 inch variant. Change the width to explore options; an installed size still needs drawing evidence.`,source:`${width} W × 34 H × 24 D inches\nSelected catalog variant`}:chapter;
}
export function chapterAt(t){return Math.min(5,Math.floor(Math.max(0,t)/5));}
export function poseAt(t){
  const i=chapterAt(t),p=smooth((t-i*5)/5);
  const openings=[0,0,.18,.15,.9,.28,0],separations=[0,0,0,0,.45,0,0];
  const opening=openings[i]+(openings[i+1]-openings[i])*p;
  const separate=separations[i]+(separations[i+1]-separations[i])*p;
  const cameras=[[2.2,1.45,4],[.8,1.3,3.9],[.45,1.22,4.25],[1.5,1.55,3.45],[1.05,1.5,4.1],[2.3,1.45,4.1],[2.2,1.45,4]];
  return {opening,separate,dimensions:i===4,blueprint:i===0||i===1,camera:cameras[i].map((v,k)=>v+(cameras[i+1][k]-v)*p),chapter:i};
}
