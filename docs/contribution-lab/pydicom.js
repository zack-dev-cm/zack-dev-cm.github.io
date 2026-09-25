import { LUT, DURATION, CHAPTERS, mapValue, tourFrame } from './lut.js';
const $ = selector => document.querySelector(selector);
const text = (selector, value) => { const node = $(selector); if (node.textContent !== String(value)) node.textContent = value; };
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
let time = 0, playing = false, manual = false, input = 2, first = 0, inspected = null;
let mapping = mapValue(input, first), frame = tourFrame(time), sceneUpdate = () => {}, frameId = 0, lastTick = 0;
const clockText = seconds => `0:${String(Math.floor(seconds)).padStart(2, '0')}`;
function inspect(index) {
  inspected = index;
  document.querySelectorAll('[data-entry]').forEach(button => button.setAttribute('aria-pressed', String(Number(button.dataset.entry) === inspected)));
  if (index === null) text('#entry-detail', 'Select a bar or an index button to inspect its mapping.');
  else {
    const range = index === 0 ? `at or below ${first}` : index === 3 ? `at or above ${first + 3}` : `equal to ${first + index}`;
    text('#entry-detail', `Index ${index} stores ${LUT[index]}. The proposed mapping sends integer inputs ${range} here. Height represents this output value.`);
  }
}
function update() {
  frame = tourFrame(time);
  if (!manual) { input = frame.input; first = frame.first; }
  mapping = mapValue(input, first);
  $('#input-slider').value = input; $('#first-slider').value = first;
  text('#input-value', input); text('#first-value', first);
  text('#input-control-value', input); text('#first-control-value', first);
  text('#before-output', mapping.before); text('#after-output', mapping.after);
  text('#scene-readout', `Input ${input} · Before ${mapping.before} → After ${mapping.after}`);
  text('#before-index', `Index ${mapping.beforeIndex}`); text('#after-index', `Index ${mapping.afterIndex}`);
  text('#comparison-note', mapping.differs ? `The same input maps to ${mapping.before} before and ${mapping.after} with the proposed correction.` : 'Both select the same table entry.');
  text('#before-math', input < first
    ? `${input} < ${first} → index 0 → LUT[0] = 10`
    : `${input} − (${first}) = ${mapping.offset} → uint8: ${mapping.narrowed} → clip: ${mapping.beforeIndex} → LUT[${mapping.beforeIndex}] = ${mapping.before}`);
  text('#after-math', input < first
    ? `${input} < ${first} → first index 0 → LUT[0] = 10`
    : input >= first + 4
      ? `${input} ≥ ${first + 4} → last index 3 → LUT[3] = 40`
      : `${first} ≤ ${input} < ${first + 4} → int32: ${input} − (${first}) = ${mapping.afterIndex} → LUT[${mapping.afterIndex}] = ${mapping.after}`);
  const stages = [
    ['One input. One table entry.', 'The first mapped input is 0. Input 2 selects index 2, whose output is 30. Both paths agree.'],
    ['Watch 255 become 256.', `The baseline narrows the offset to 8 bits before clipping. At 256 that offset becomes 0. The current input is ${input}: ${mapping.differs ? 'the baseline has wrapped to output 10.' : 'both paths still select output 40.'}`],
    ['Keep large values at the top.', 'Input 256 is above the table’s range. The proposed integer path selects the last index directly: 3 → 40. It does not narrow 256 into an 8-bit index.'],
    ['The offset is what matters.', 'Move the first mapped input to 100. Input 356 still has offset 256: the baseline wraps to 0, while the proposed path keeps the final output 40.']
  ];
  text('#stage-label', manual ? 'Explore / Your values' : `${String(frame.chapter + 1).padStart(2, '0')} / ${CHAPTERS[frame.chapter].title}`);
  text('#stage-title', manual ? (mapping.differs ? 'The paths choose different entries.' : 'The paths agree here.') : stages[frame.chapter][0]);
  text('#stage-copy', manual ? `Input ${input}, first mapped input ${first}. ${input < first ? 'Below-range inputs use the first entry.' : input >= first + 4 ? `The proposed mapping uses the last entry. The baseline first narrows offset ${mapping.offset} to ${mapping.narrowed}, then clips the index.` : 'This input falls within the four-entry table, so its offset is its index.'}` : stages[frame.chapter][1]);
  $('#timeline').value = time;
  $('#timeline').setAttribute('aria-valuetext', `${time.toFixed(1)} seconds: ${CHAPTERS[frame.chapter].title}`);
  text('#time', `${clockText(time)} / 0:24`);
  text('#play', playing ? 'Pause' : time >= DURATION ? 'Replay example' : 'Play example');
  text('#scene-play', playing ? 'Pause' : time >= DURATION ? 'Replay' : 'Play');
  $('#scene-play').setAttribute('aria-label', `${playing ? 'Pause' : 'Play'} example beside model`);
  text('#play-state', playing ? 'Playing · guided example' : manual ? 'Paused · exploring your values' : time >= DURATION ? 'Complete · explore below' : 'Paused · guided example');
  document.querySelectorAll('[data-chapter]').forEach(button => {
    if (!manual && Number(button.dataset.chapter) === frame.chapter) button.setAttribute('aria-current', 'step');
    else button.removeAttribute('aria-current');
  });
  document.querySelectorAll('[data-input]').forEach(button => button.setAttribute('aria-pressed', String(Number(button.dataset.input) === input && Number(button.dataset.first) === first)));
  inspect(inspected);
  sceneUpdate(mapping, frame, inspected);
}
function pause() { playing = false; cancelAnimationFrame(frameId); frameId = 0; lastTick = 0; }
function tick(now) {
  if (!playing) return;
  if (lastTick) time = Math.min(DURATION, time + (now - lastTick) / 1000);
  lastTick = now;
  if (time >= DURATION) pause();
  update();
  if (playing) frameId = requestAnimationFrame(tick);
}
$('#play').addEventListener('click', () => {
  if (playing) { pause(); update(); return; }
  if (time >= DURATION) time = 0;
  manual = false; inspected = null; playing = true; lastTick = 0; update(); frameId = requestAnimationFrame(tick);
});
$('#scene-play').addEventListener('click', () => $('#play').click());
$('#restart').addEventListener('click', () => { pause(); manual = false; time = 0; inspected = null; update(); });
$('#timeline').addEventListener('input', event => { pause(); manual = false; time = Number(event.target.value); inspected = null; update(); });
document.querySelectorAll('[data-chapter]').forEach(button => button.addEventListener('click', () => { pause(); manual = false; time = CHAPTERS[Number(button.dataset.chapter)].at; inspected = null; update(); }));
for (const id of ['#input-slider', '#first-slider']) $(id).addEventListener('input', () => { pause(); manual = true; input = Number($('#input-slider').value); first = Number($('#first-slider').value); update(); });
document.querySelectorAll('[data-input]').forEach(button => button.addEventListener('click', () => { pause(); manual = true; input = Number(button.dataset.input); first = Number(button.dataset.first); update(); }));
document.querySelectorAll('[data-entry]').forEach(button => button.addEventListener('click', () => { pause(); inspect(Number(button.dataset.entry)); update(); }));
document.addEventListener('visibilitychange', () => { if (document.hidden && playing) { pause(); update(); } });
reducedMotion.addEventListener('change', event => { if (event.matches) { pause(); update(); } });
update();

function fallback() {
  sceneUpdate = () => {};
  $('#lut-scene').hidden = true; $('.camera').hidden = true; $('#scene-status').hidden = false;
  text('#scene-status', '3D is unavailable. Playback, timeline, table-entry buttons and all arithmetic controls remain usable.');
}
async function initScene() {
  const T = await import('three');
  const { OrbitControls } = await import('three/addons/controls/OrbitControls.js');
  const canvas = $('#lut-scene');
  const renderer = new T.WebGLRenderer({ canvas, antialias: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.75)); renderer.setClearColor(0x1b1722);
  renderer.outputColorSpace = T.SRGBColorSpace; renderer.toneMapping = T.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.15;
  const scene = new T.Scene();
  const camera = new T.PerspectiveCamera(38, 1, .1, 70);
  const controls = new OrbitControls(camera, canvas); controls.enableDamping = false; controls.enablePan = false; controls.minDistance = 9; controls.maxDistance = 27; controls.maxPolarAngle = Math.PI * .48;
  scene.add(new T.HemisphereLight(0xf8edf8, 0x443448, 2.5));
  const light = new T.DirectionalLight(0xffe3c4, 3); light.position.set(3, 8, 6); scene.add(light);
  const fill = new T.DirectionalLight(0xd4b1eb, 2.2); fill.position.set(-5, 4, -4); scene.add(fill);
  const barGeometry = new T.BoxGeometry(1.18, 1, 1.18);
  const bars = LUT.map((value, index) => {
    const bar = new T.Mesh(barGeometry, new T.MeshStandardMaterial({ color: 0x9886aa, roughness: .35, metalness: .13 }));
    bar.scale.y = value * .075; bar.position.set((index - 1.5) * 2, bar.scale.y / 2, 0); bar.userData.index = index; scene.add(bar); return bar;
  });
  const base = new T.Mesh(new T.BoxGeometry(8.5, .1, 2.5), new T.MeshStandardMaterial({ color: 0x32293d, roughness: .8 })); base.position.y = -.08; scene.add(base);
  const grid = new T.GridHelper(10, 10, 0x5b4969, 0x3b3046); grid.position.y = -.14; scene.add(grid);
  function label(value, position, width = 1.3, color = '#f3edf6') {
    const image = document.createElement('canvas'); image.width = 384; image.height = 128;
    const ctx = image.getContext('2d'); ctx.fillStyle = '#1b1722'; ctx.fillRect(0, 0, 384, 128); ctx.font = '600 52px system-ui'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = color; ctx.fillText(value, 192, 64);
    const texture = new T.CanvasTexture(image); texture.colorSpace = T.SRGBColorSpace;
    const sprite = new T.Sprite(new T.SpriteMaterial({ map: texture, depthTest: false })); sprite.position.copy(position); sprite.scale.set(width, width / 3, 1); scene.add(sprite); return sprite;
  }
  LUT.forEach((value, index) => { label(String(value), new T.Vector3((index - 1.5) * 2, value * .075 + .4, 0), 1.15); label(`index ${index}`, new T.Vector3((index - 1.5) * 2, .05, 1.25), 1.65, '#c9bbd6'); });
  const source = new T.Mesh(new T.SphereGeometry(.18, 20, 12), new T.MeshStandardMaterial({ color: 0xf3edf6, roughness: .3 })); source.position.set(0, 4.8, 3); scene.add(source);
  label('INPUT', new T.Vector3(0, 5.3, 3), 1.75);
  const routeColors = [0xefb878, 0xd4b1eb];
  const routes = routeColors.map(color => {
    const line = new T.Line(new T.BufferGeometry(), new T.LineBasicMaterial({ color, transparent: true, opacity: .8 }));
    const bead = new T.Mesh(new T.SphereGeometry(.12, 16, 10), new T.MeshStandardMaterial({ color, roughness: .2 }));
    const halo = new T.BoxHelper(bars[0], color);
    scene.add(line, bead, halo); return { line, bead, halo, curve: null };
  });
  const inspectOutline = new T.BoxHelper(bars[0], 0xf8f2f8); inspectOutline.visible = false; scene.add(inspectOutline);
  let lastRoutes = '';
  const render = () => renderer.render(scene, camera);
  sceneUpdate = (result, currentFrame, selected) => {
    const indices = [result.beforeIndex, result.afterIndex], key = indices.join(',');
    if (key !== lastRoutes) {
      routes.forEach((route, index) => {
        const bar = bars[indices[index]], x = bar.position.x, height = bar.scale.y;
        route.curve = new T.QuadraticBezierCurve3(source.position.clone(), new T.Vector3(index ? x + 1.1 : x - 1.1, 5, index ? -1.6 : 2.5), new T.Vector3(x + (index ? .23 : -.23), height + .1, 0));
        route.line.geometry.dispose(); route.line.geometry = new T.BufferGeometry().setFromPoints(route.curve.getPoints(36));
        route.halo.setFromObject(bar); route.halo.scale.setScalar(index ? 1.025 : 1.01);
      });
      lastRoutes = key;
    }
    routes.forEach((route, index) => { route.bead.position.copy(route.curve.getPoint((currentFrame.flow + index * .13) % 1)); });
    bars.forEach((bar, index) => bar.material.color.setHex(index === selected ? 0xd9cbe5 : 0x9886aa));
    inspectOutline.visible = selected !== null;
    if (selected !== null) inspectOutline.setFromObject(bars[selected]);
    render();
  };
  function setView(front = false) { camera.position.set(...(front ? [0, 4, 16] : [8.5, 7.5, 11.5])); controls.target.set(0, 2.1, .55); controls.update(); render(); }
  $('#reset-view').addEventListener('click', () => { pause(); update(); setView(); });
  $('#front-view').addEventListener('click', () => { pause(); update(); setView(true); });
  controls.addEventListener('start', () => { pause(); update(); }); controls.addEventListener('change', render);
  const raycaster = new T.Raycaster(); let down = null;
  canvas.addEventListener('pointerdown', event => { down = [event.clientX, event.clientY]; });
  canvas.addEventListener('pointerup', event => {
    const start = down; down = null;
    if (!start || Math.hypot(event.clientX - start[0], event.clientY - start[1]) > 5) return;
    const rect = canvas.getBoundingClientRect(); raycaster.setFromCamera(new T.Vector2((event.clientX - rect.left) / rect.width * 2 - 1, -(event.clientY - rect.top) / rect.height * 2 + 1), camera);
    const hit = raycaster.intersectObjects(bars, false)[0]; if (hit) { pause(); inspect(hit.object.userData.index); update(); }
  });
  canvas.addEventListener('pointercancel', () => { down = null; });
  canvas.addEventListener('webglcontextlost', event => { event.preventDefault(); fallback(); });
  function resize() { if (canvas.hidden) return; const w = canvas.clientWidth, h = canvas.clientHeight; renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix(); render(); }
  canvas.hidden = false; $('.camera').hidden = false; $('#scene-status').hidden = true;
  new ResizeObserver(resize).observe(canvas); setView(); resize(); sceneUpdate(mapping, frame, inspected);
}
initScene().catch(fallback);
