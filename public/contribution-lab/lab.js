import { SHAPE, selectionFor, shapeText } from './selection.js';
const $ = selector => document.querySelector(selector);
const inputs = ['#axis-x', '#axis-y', '#axis-z'].map($);
const describeCell = value => {
  $('#cell-detail').textContent = value ? `Source index [${value.split(',').join(', ')}] is included. This is one synthetic array element.` : state.cells.length ? 'Drag to orbit · scroll to zoom · select a cube to inspect its index.' : 'Zero selected values. The outline describes the source array, not an output volume.';
};
let state, sceneUpdate = () => {}, inspectCell = describeCell;
function update() {
  state = selectionFor(inputs.map(input => input.value));
  $('#expression').textContent = state.expression;
  $('#shape').textContent = shapeText(state.shape);
  $('#scene-shape').textContent = shapeText(state.shape);
  $('#count').textContent = `${state.cells.length} ${state.cells.length === 1 ? 'value' : 'values'} selected`;
  const scalar = state.axes.some(axis => axis.scalar);
  $('#explanation').textContent = !state.cells.length
    ? `No values remain. The empty axis keeps length zero; the other selected lengths survive.${scalar ? ' The integer-indexed axis is removed.' : ''} The wire frame only marks the original source extent.`
    : `${state.cells.length} ${state.cells.length === 1 ? 'value remains' : 'values remain'}. ${scalar ? 'An integer index removes its axis from the result shape.' : 'Each selected X position combines with every selected Y and Z position: orthogonal indexing.'}`;
  $('#axis-summary').textContent = state.axes.map((axis, i) => `${'XYZ'[i]}: ${axis.scalar ? 'integer → removed' : axis.indices.length}`).join(' · ');
  const select = $('#selected-cell'); select.replaceChildren();
  const placeholder = new Option(state.cells.length ? 'Choose an index…' : 'Empty result — no values', ''); select.add(placeholder);
  for (const cell of state.cells) select.add(new Option(`[${cell.join(', ')}]`, cell.join(',')));
  select.disabled = !state.cells.length;
  $('#cell-detail').textContent = state.cells.length ? 'Drag to orbit · scroll to zoom · select a cube to inspect its index.' : 'Zero selected values. The outline describes the source array, not an output volume.';
  document.querySelectorAll('[data-preset]').forEach(button => button.setAttribute('aria-pressed', String(presets[button.dataset.preset].every((mode, i) => mode === inputs[i].value))));
  sceneUpdate();
}
const presets = { all: ['all', 'all', 'all'], subset: ['alternate', 'alternate', 'alternate'], empty: ['empty', 'all', 'all'], scalar: ['scalar', 'empty', 'all'] };
function exploreSelection(){pauseExample();update();$('#step-title').textContent='Explore your own selection';$('#step-copy').textContent='Change an axis, inspect a value or orbit the cube. Play resumes the guided example; Restart returns to the full cube.';document.querySelectorAll('[data-step]').forEach(button=>button.setAttribute('aria-current','false'));}
inputs.forEach(input => input.addEventListener('change', exploreSelection));
document.querySelectorAll('[data-preset]').forEach(button => button.addEventListener('click', () => { presets[button.dataset.preset].forEach((mode, i) => inputs[i].value = mode); exploreSelection(); }));
$('#selected-cell').addEventListener('change', event => { pauseExample(); inspectCell(event.target.value); });
update();

const steps = [
  ['Start with three axes', '105 values occupy a 3 × 5 × 7 source array. Orbit the cube or separate its X layers to see all three dimensions.', 'all'],
  ['Select independently along each axis', 'Every other position gives 2 × 3 × 4 = 24 values. Each X index combines with every selected Y and Z index.', 'subset'],
  ['Zero X positions, not zero dimensions', 'All the values disappear. The expected shape is (0, 5, 7): the five Y positions and seven Z positions still belong to the selection metadata.', 'empty'],
  ['An integer index removes its axis', 'Select X index 1, then no Y positions. X is removed, Y remains empty, and Z keeps seven positions: shape (0, 7).', 'scalar'],
  ['Recover the full selection', 'Restore all three axes and the 105 values return. Try your own selectors: changing any control pauses the example so you can inspect the result.', 'all']
];
let exampleTime=0,examplePlaying=false,exampleFrame=null,exampleLast=0,exampleStep=-1;
const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)');
function playbackLabel(){const label=examplePlaying?'Pause example':'Play example';$('#play-example').textContent=label;$('#scene-play').textContent=label;$('#scene-play').setAttribute('aria-label',label+' in model');}
function pauseExample(){examplePlaying=false;exampleLast=0;if(exampleFrame!==null)cancelAnimationFrame(exampleFrame);exampleFrame=null;playbackLabel();}
function seekExample(time){
  exampleTime=Math.max(0,Math.min(30,time));const step=Math.min(4,Math.floor(exampleTime/6));
  if(step!==exampleStep){exampleStep=step;presets[steps[step][2]].forEach((mode,i)=>inputs[i].value=mode);update();}
  $('#step-title').textContent=`0${step+1} / ${steps[step][0]}`;$('#step-copy').textContent=steps[step][1];
  $('#example-time').value=String(exampleTime);$('#example-clock').textContent=`00:${String(Math.floor(exampleTime)).padStart(2,'0')} / 00:30`;
  document.querySelectorAll('[data-step]').forEach(button=>button.setAttribute('aria-current',Number(button.dataset.step)===step?'step':'false'));
  // Display separation exposes positions; it does not change array indices or lengths.
  const phase=(exampleTime%6)/6;
  $('#separation').value=String(step===0||step===4?.6*Math.sin(Math.PI*phase):.5);
  sceneUpdate();
}
function tickExample(now){if(!examplePlaying)return;if(exampleLast)seekExample(exampleTime+Math.min(.1,(now-exampleLast)/1000));exampleLast=now;if(exampleTime>=30){pauseExample();return;}exampleFrame=requestAnimationFrame(tickExample);}
function playExample(){if(exampleTime>=30)exampleTime=0;exampleStep=-1;seekExample(exampleTime);examplePlaying=true;exampleLast=0;playbackLabel();exampleFrame=requestAnimationFrame(tickExample);}
$('#play-example').onclick=()=>examplePlaying?pauseExample():playExample();
$('#scene-play').onclick=()=>examplePlaying?pauseExample():playExample();
$('#restart-example').onclick=()=>{pauseExample();exampleStep=-1;seekExample(0);};
$('#example-time').oninput=()=>{pauseExample();exampleStep=-1;seekExample(Number($('#example-time').value));};
document.querySelectorAll('[data-step]').forEach(button=>button.onclick=()=>{pauseExample();exampleStep=-1;seekExample(Number(button.dataset.step)*6);});
document.addEventListener('visibilitychange',()=>{if(document.hidden)pauseExample();});
reducedMotion.addEventListener('change',event=>{if(event.matches)pauseExample();});
$('#separation').addEventListener('input',pauseExample);

async function initScene() {
  const T = await import('three');
  const { OrbitControls } = await import('three/addons/controls/OrbitControls.js');
  const canvas = $('#cube');
  const renderer = new T.WebGLRenderer({ canvas, antialias: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.75)); renderer.setClearColor(0x111e2b);
  renderer.outputColorSpace = T.SRGBColorSpace; renderer.toneMapping = T.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.15;
  const scene = new T.Scene();
  const camera = new T.PerspectiveCamera(35, 1, .1, 100); camera.up.set(0, 0, 1);
  const controls = new OrbitControls(camera, canvas); controls.enableDamping = false; controls.minDistance = 7; controls.maxDistance = 36; controls.enablePan = false;
  scene.add(new T.HemisphereLight(0xe4f5ff, 0x273942, 2.5));
  const key = new T.DirectionalLight(0xffdfbd, 3.1); key.position.set(5, -8, 12); scene.add(key);
  const fill = new T.DirectionalLight(0x8cc7ef, 2); fill.position.set(-6, 4, 3); scene.add(fill);
  const root = new T.Group(); scene.add(root);
  const geometry = new T.BoxGeometry(.76, .76, .76);
  const material = new T.MeshStandardMaterial({color:0xa8ded6, roughness:.3, metalness:.15});
  const cells = [];
  for (let x = 0; x < 3; x++) for (let y = 0; y < 5; y++) for (let z = 0; z < 7; z++) {
    const cell = new T.Mesh(geometry, material); cell.userData.index = [x, y, z]; cell.name = `Value at [${x}, ${y}, ${z}]`; root.add(cell); cells.push(cell);
  }
  const extent = new T.LineSegments(new T.EdgesGeometry(new T.BoxGeometry(3, 5, 7)), new T.LineBasicMaterial({color:0x6b8294, transparent:true, opacity:.5})); root.add(extent);
  const selectedBox = new T.BoxHelper(cells[0],0xffcf8a); selectedBox.visible = false; scene.add(selectedBox);
  const labels = [];
  function label(text, color, position) {
    const image = document.createElement('canvas'); image.width=256; image.height=96;
    const ctx=image.getContext('2d'); ctx.fillStyle='#111e2b';ctx.fillRect(0,0,256,96);ctx.font='600 40px system-ui';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillStyle=color;ctx.fillText(text,128,48);
    const texture=new T.CanvasTexture(image);texture.colorSpace=T.SRGBColorSpace;
    const sprite=new T.Sprite(new T.SpriteMaterial({map:texture,depthTest:false}));sprite.scale.set(2.25,.84,1);sprite.position.copy(position);root.add(sprite);labels.push(sprite);return sprite;
  }
  const colors=[0xe0a881,0xb5e5df,0xaaaaf0];
  const arrows=colors.map(color=>{const arrow=new T.ArrowHelper(new T.Vector3(1,0,0),new T.Vector3(),1,color,.28,.16);root.add(arrow);return arrow;});
  label('X / 3', '#e0a881',new T.Vector3(0,-3.3,-4.1));label('Y / 5','#b5e5df',new T.Vector3(-2.8,0,-4.1));label('Z / 7','#aaaaf0',new T.Vector3(-2.8,3,0));
  const render = () => renderer.render(scene, camera);
  let selected = null;
  inspectCell = value => {
    selected=cells.find(cell=>cell.visible&&cell.userData.index.join(',')===value)||null;
    selectedBox.visible=Boolean(selected);if(selected)selectedBox.setFromObject(selected);
    $('#selected-cell').value=selected?value:'';
    describeCell(selected?value:'');
    render();
  };
  sceneUpdate = () => {
    const separation=Number($('#separation').value), step=1+separation*1.2;
    selected=null;selectedBox.visible=false;
    for(const cell of cells){const [x,y,z]=cell.userData.index;cell.position.set((x-1)*step,y-2,z-3);cell.visible=state.axes.every((axis,i)=>axis.indices.includes(cell.userData.index[i]));}
    extent.scale.x=step;
    const origin=new T.Vector3(-1.5*step,-2.5,-3.5);
    arrows.forEach((arrow,i)=>{arrow.position.copy(origin);arrow.setDirection(new T.Vector3(...[0,1,2].map(j=>j===i?1:0)));arrow.setLength(SHAPE[i]*(i===0?step:1),.28,.16);});
    labels[0].position.set(0,-3.3,-4.1);labels[1].position.set(-1.5*step-1.3,0,-4.1);labels[2].position.set(-1.5*step-1.3,3,0);
    inspectCell($('#selected-cell').value);
  };
  const views = { perspective:[10,-12,9], front:[19,0,0], top:[0,-.01,21] };
  function view(name){camera.position.set(...views[name]);controls.target.set(0,0,-.1);controls.update();Object.keys(views).forEach(id=>$('#'+id).setAttribute('aria-pressed',String(id===name)));render();}
  Object.keys(views).forEach(name=>$('#'+name).addEventListener('click',()=>{pauseExample();view(name);}));
  controls.addEventListener('change',render);
  controls.addEventListener('start',()=>{pauseExample();Object.keys(views).forEach(name=>$('#'+name).setAttribute('aria-pressed','false'));});
  $('#separation').addEventListener('input',sceneUpdate);
  const raycaster=new T.Raycaster();let down;
  canvas.addEventListener('pointerdown',event=>down=[event.clientX,event.clientY]);
  canvas.addEventListener('pointerup',event=>{if(!down||Math.hypot(event.clientX-down[0],event.clientY-down[1])>5)return;const rect=canvas.getBoundingClientRect();raycaster.setFromCamera(new T.Vector2((event.clientX-rect.left)/rect.width*2-1,-(event.clientY-rect.top)/rect.height*2+1),camera);const hit=raycaster.intersectObjects(cells.filter(c=>c.visible),false)[0];if(hit)inspectCell(hit.object.userData.index.join(','));down=null;});
  function resize(){const w=canvas.clientWidth,h=canvas.clientHeight;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();render();}
  new ResizeObserver(resize).observe(canvas);view('perspective');sceneUpdate();resize();$('#loading').hidden=true;
}
initScene().catch(()=>{ $('#loading').textContent='3D is unavailable on this device. The selection controls, shape results and source explanation still work.';$('#cube').hidden=true;$('.view-controls').hidden=true; });
