export const BPM=128, BEAT=60/BPM, TOTAL_BEATS=80, DURATION=TOTAL_BEATS*BEAT;
// Shot boundaries share the score's beat grid. Geometry poses are display studies.
export const SHOTS=[
 {beat:0,end:4,id:'hook',chapter:'01 / INSPECT',eyebrow:'RIDGE R3d / MECHANICAL STUDY',title:'Every part.<br><em>Connected.</em>',subtitle:'Inspect the ideas inside the machine.'},
 {beat:4,end:8,id:'reveal',chapter:'02 / SEPARATE',eyebrow:'SYSTEMS → INDIVIDUAL MEMBERS',title:'Look<br><em>inside.</em>',subtitle:'Frame. Drive. Suspension. Every connection.'},
 {beat:8,end:16,id:'tree',chapter:'03 / EVOLVE',eyebrow:'THE COMPLETE REVISION REGISTER',title:'One idea. <em>Many directions.</em>',subtitle:''},
 {beat:16,end:20,id:'wheel',chapter:'04 / ISOLATE',eyebrow:'RIDGE R3d / WHEEL DETAIL',title:'Closer.<br><em>Still closer.</em>',subtitle:'Inspect the tread, rim and hub.'},
 {beat:20,end:24,id:'bearing',chapter:'05 / INSPECT THE INTERFACE',eyebrow:'RIDGE R3d / AUTHORED BEARING',title:'Detail has<br><em>depth.</em>',subtitle:'Separate the races. Reveal the rolling elements.'},
 {beat:24,end:28,id:'drive',chapter:'06 / TRACE THE DRIVE',eyebrow:'RIDGE R3d / SPROCKET GEOMETRY',title:'Follow<br><em>the detail.</em>',subtitle:'An isolated component, at inspection scale.'},
 {beat:28,end:32,id:'members',chapter:'07 / PART BY PART',eyebrow:'RIDGE R3d / INDIVIDUAL PARTS',title:'A system<br><em>unfolds.</em>',subtitle:'Native component identities stay attached.'},
 {beat:32,end:40,id:'explode',chapter:'08 / EXPLODED INSPECTION',eyebrow:'RIDGE R3d / MECHANICAL STUDY',title:'See how<br><em>it connects.</em>',subtitle:'Separate systems. Inspect their members.'},
 {beat:40,end:44,id:'ag23',chapter:'09 / ANOTHER BRANCH',eyebrow:'BABY AG23 P01 / SIX-WHEEL STUDY',title:'New form.<br><em>Same curiosity.</em>',subtitle:'A seated six-wheel packaging study.'},
 {beat:44,end:48,id:'ag23-explode',chapter:'10 / OPEN THE STUDY',eyebrow:'BABY AG23 P01 / 73 SOURCE PARTS',title:'Open<br><em>the design.</em>',subtitle:'Body, cockpit and drive reservations.'},
 {beat:48,end:56,id:'tree-return',chapter:'11 / KEEP THE HISTORY',eyebrow:'65 REVISIONS / 68 PARENT LINKS',title:'Every branch. <em>One record.</em>',subtitle:''},
 {beat:56,end:64,id:'resolve',chapter:'12 / KEEP EXPLORING',eyebrow:'VEHICLE LAB / EXPERIMENTAL NOTEBOOK',title:'Explore<br><em>what’s inside.</em>',subtitle:'Open the interactive 3D notebook.'}
];
// Preserve the opening and every accepted CAD shot. Motion connects the wheel
// close-up to the mechanism inspection on two additional eight-beat phrases.
for(const shot of SHOTS)if(shot.beat>=20){shot.beat+=16;shot.end+=16;shot.chapter=shot.chapter.replace(/^\d+/,value=>String(Number(value)+2).padStart(2,'0'));}
SHOTS.splice(4,0,
 {beat:20,end:28,id:'terrain',chapter:'05 / EXPLORE THE TERRAIN',eyebrow:'THREE.JS / NATIVE WHEEL INSPECTION',title:'Every contour.<br><em>A response.</em>',subtitle:'Play the log and pit course. Inspect each wheel.'},
 {beat:28,end:36,id:'chrono',chapter:'06 / FOLLOW THE PHYSICS',eyebrow:'CHRONO / RECORDED SOLVER STATES',title:'Watch the<br><em>contact.</em>',subtitle:'Solved motion. Suspension travel. Contact forces.'}
);
export function shotAt(seconds){const beat=Math.max(0,Math.min(TOTAL_BEATS-1e-8,seconds/BEAT));return SHOTS.find(s=>beat>=s.beat&&beat<s.end);}
