export const DURATION = 96;
export const CHAPTERS = [
  {start:0,end:10,label:'Overview',category:'THE COMPLETE WORKFLOW',title:'From idea to<br><em>inspectable</em><br>machine.',model:'body',
   description:'A working notebook that connects design intent, native geometry and the evidence behind each revision.',
   facts:[['4','distinct 3D studies'],['6','stages in one workflow'],['1','traceable engineering notebook']],
   note:'Digital engineering studies. Physical validation remains open.',
   caption:'Vehicle Lab connects ideation, prototyping, inspection, evolution, physics and assembly planning.'},
  {start:10,end:22,label:'Ideation',category:'01 / DEFINE THE PROBLEM',title:'Start with<br>the <em>constraints.</em>',model:'baseline',
   description:'Explore packaging, interfaces and mechanism choices before committing to a complete vehicle.',
   facts:[['Package','component and occupant envelopes'],['Mechanism','four-link versus swingarm studies'],['Trade-offs','mass, gearing and terrain requirements']],
   note:'CQ-L1: preserved packaging study. Supplier motor solids and fitting proxies are withheld from this public view.',
   caption:'The baseline makes assumptions visible. Geometry helps ask better questions before parts are selected.'},
  {start:22,end:35,label:'Prototype',category:'02 / BUILD A DIGITAL PROTOTYPE',title:'Make the<br>mechanism<br><em>tangible.</em>',model:'prototype',
   description:'RC25 translates the mechanism into a separate 250 mm bench-scale design with split chassis, gears and suspension.',
   facts:[['250 mm','designed bumper length'],['138','authored component groups'],['R0','unprinted digital prototype']],
   note:'The known R0 steering failure remains open. No printing, physical assembly or driving is demonstrated.',
   caption:'This is the actual RC25 CAD export. Separating the parts is an inspection animation, not a proven assembly path.'},
  {start:35,end:48,label:'Inspect',category:'03 / INSPECT THE CONNECTIONS',title:'Look beneath<br>the <em>body.</em>',model:'mechanical',
   description:'Inspect the frame, suspension and transmission as connected systems. Keep interference findings attached to their revision.',
   facts:[['R3d','preserved mechanical revision'],['22','undeclared interferences in scoped audit'],['Open','load paths, clearance and interfaces']],
   note:'Counts are from the recorded scoped audit, not a new collision check. Eight supplier motor solids are omitted.',
   caption:'Native mesh geometry exposes the chain, bearing and frame detail. Detail alone does not close mechanical fit.'},
  {start:48,end:61,label:'Evolution',category:'04 / PRESERVE THE DECISIONS',title:'Keep the ideas.<br>Keep the<br><em>history.</em>',model:'comparison',
   description:'Compare separate branches and follow the recorded reasons for each revision. Retain rejected approaches and unresolved findings.',
   facts:[['Snapshot','revision identity and source hashes'],['Compare','packaging, bench and body studies'],['Trace','recorded parent links and decisions']],
   note:'Models are normalized for visual comparison. These are distinct studies at different scales, not successive qualified vehicles.',
   caption:'Design evolution is a revision history. No evolutionary optimizer or physical prototype campaign is claimed.'},
  {start:61,end:76,label:'Physics',category:'05 / LEARN FROM THE SOLVER',title:'Let the<br><em>failures</em><br>teach.',model:'physics',
   description:'Replay an archived Project Chrono obstacle run with the exact saved body poses, contact forces and wheel travel.',
   facts:[['18 / 26','dynamic bodies / constraints'],['0.5 ms','recorded integration timestep'],['Failed','rear axle did not clear the obstacle']],
   note:'Historical simplified physics model; separate from Ridge CAD. Unmeasured inputs and incomplete qualification remain open.',
   caption:'A real saved solver run, replayed at 1× during the motion segment. The failed obstacle test stays visible.'},
  {start:76,end:89,label:'Assembly',category:'06 / PLAN THE NEXT EXPERIMENT',title:'Plan each<br><em>connection.</em>',model:'prototype',
   description:'Separate the digital assembly into understandable systems, then return to the complete model for the next review.',
   facts:[['Frame','split chassis and retention details'],['Systems','suspension, drive and electrical'],['Next','fit coupons and guarded bench tests']],
   note:'Exploded display only. Tool access, physical fit and the assembly sequence still require bench verification.',
   caption:'Assembly planning connects part identity to the next experiment. Physical verification is the next engineering step.'},
  {start:89,end:96,label:'Notebook',category:'SOURCE / GEOMETRY / EVIDENCE',title:'An open<br>engineering<br><em>notebook.</em>',model:'body',
   description:'Explore the studies. Inspect the evidence. Reuse the software to make your own design decisions traceable.',
   facts:[['Local','static 3D viewer; no account needed'],['Recorded','physics data with source provenance'],['Reusable','analysis code, checks and capture tools']],
   note:'Open source software release candidate. The vehicle designs remain experimental and unqualified for fabrication or riding.',
   caption:'Vehicle Lab · an experimental pipeline from design intent to inspectable evidence.'}
];
export function chapterAt(time) {
  if (!Number.isFinite(time)) throw new TypeError('Tour time must be finite');
  const t = Math.max(0, Math.min(DURATION, time));
  return CHAPTERS.findIndex(c => t >= c.start && (t < c.end || c.end === DURATION));
}
