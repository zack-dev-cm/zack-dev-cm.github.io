import { CHAPTERS, DURATION, guidedState, inspectPixel } from './reproject-model.js';

const $ = selector => document.querySelector(selector);
const setText = (selector, value) => { $(selector).textContent = value; };
const coordinate = value => `(${value.join(', ')})`;
const clock = seconds => `0:${String(Math.floor(seconds)).padStart(2, '0')}`;
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
let fixture, time = 0, pixel = 0, mode = 'baseline', manual = false, playing = false, lastTick = 0, frameId;
let sceneUpdate = () => {}, resetCamera = () => {};

function pause() { playing = false; lastTick = 0; cancelAnimationFrame(frameId); }
function update() {
  if (!fixture) return;
  const frame = guidedState(time);
  if (!manual) { pixel = frame.pixel; mode = frame.mode; }
  const item = CHAPTERS[frame.chapter], result = inspectPixel(fixture, mode, pixel);
  setText('#play', playing ? 'Pause' : 'Play example');
  setText('#play-state', playing ? 'Playing · guided example' : time === DURATION ? 'Finished · explore either pixel' : manual ? 'Paused · inspecting your selection' : 'Paused · guided example');
  $('#timeline').value = String(time);
  $('#timeline').setAttribute('aria-valuetext', `${time.toFixed(1)} seconds: ${item.label}`);
  setText('#time', `${clock(time)} / 0:36`);
  setText('#stage-label', manual ? 'Manual inspection / Recorded fixture' : `${String(frame.chapter + 1).padStart(2, '0')} / ${item.label}`);
  setText('#stage-title', manual ? `Pixel ${pixel} · ${result.inverseFinite ? 'valid return' : 'undefined return'}` : item.title);
  setText('#stage-copy', manual ? 'The selected version replays its recorded Python coordinates, acceptance decision, output and footprint. Select a chapter to return to the guided story.' : item.copy);
  for (const [id, key] of [['output', 'outputPixel'], ['world', 'world'], ['source', 'sourcePixel'], ['inverse', 'inverseOutputPixel']]) setText(`#${id}-coordinate`, coordinate(result[key]));
  $('#inverse-coordinate').classList.toggle('is-undefined', !result.inverseFinite);
  setText('#distance-check', String(result.distanceRejects));
  setText('#finite-check', String(result.inverseFinite));
  setText('#decision-version', `${mode === 'baseline' ? 'Baseline' : 'Proposed'} decision`);
  setText('#decision', result.accepted ? 'Accepted' : 'Rejected');
  const distance = `abs(${result.inverseOutputPixel[0]} − ${result.outputPixel[0]}) > 1 → ${result.distanceRejects}`;
  setText('#check-math', mode === 'proposed' ? `${distance}; inverse finite → ${result.inverseFinite}` : distance);
  setText('#result-title', `${mode === 'baseline' ? 'Baseline' : 'Proposed'} result`);
  for (let index = 0; index < 2; index++) {
    setText(`#value-${index}`, String(fixture[mode].output[0][index]));
    setText(`#footprint-${index}`, String(fixture[mode].footprint[0][index]));
    $(`[data-result="${index}"]`).dataset.selected = String(index === pixel);
    $(`[data-result="${index}"]`).dataset.missing = String(fixture[mode].footprint[0][index] === 0);
  }
  setText('#outcome', result.inverseFinite ? 'The valid pixel is retained.' : result.accepted ? 'Undefined return accepted: value 2, footprint 1.' : 'Undefined return rejected: NaN, footprint 0. Pixel 0 still has value 1.');
  document.querySelectorAll('[data-pixel]').forEach(button => button.setAttribute('aria-pressed', String(Number(button.dataset.pixel) === pixel)));
  document.querySelectorAll('[data-mode]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.mode === mode)));
  document.querySelectorAll('[data-chapter]').forEach(button => {
    if (!manual && Number(button.dataset.chapter) === frame.chapter) button.setAttribute('aria-current', 'step');
    else button.removeAttribute('aria-current');
  });
  sceneUpdate(result, frame, pixel);
}
function tick(stamp) {
  if (!playing) return;
  if (lastTick) time = Math.min(DURATION, time + Math.min((stamp - lastTick) / 1000, .15));
  lastTick = stamp;
  if (time === DURATION) pause();
  update();
  if (playing) frameId = requestAnimationFrame(tick);
}
$('#play').addEventListener('click', () => {
  if (playing) pause();
  else { if (time === DURATION) { time = 0; resetCamera(); } manual = false; playing = true; lastTick = 0; frameId = requestAnimationFrame(tick); }
  update();
});
$('#restart').addEventListener('click', () => { pause(); manual = false; time = 0; resetCamera(); update(); });
$('#timeline').addEventListener('input', event => { pause(); manual = false; time = Number(event.target.value); update(); });
document.querySelectorAll('[data-chapter]').forEach(button => button.addEventListener('click', () => { pause(); manual = false; time = CHAPTERS[Number(button.dataset.chapter)].at; update(); }));
document.querySelectorAll('[data-pixel]').forEach(button => button.addEventListener('click', () => { pause(); manual = true; pixel = Number(button.dataset.pixel); update(); }));
document.querySelectorAll('[data-mode]').forEach(button => button.addEventListener('click', () => { pause(); manual = true; mode = button.dataset.mode; update(); }));
document.addEventListener('visibilitychange', () => { if (document.hidden && playing) { pause(); update(); } });
reducedMotion.addEventListener('change', event => { if (event.matches) { pause(); update(); } });

function fallback() {
  sceneUpdate = () => {}; resetCamera = () => {};
  $('#coordinate-scene').hidden = true; $('.camera').hidden = true; $('#scene-status').hidden = false;
  setText('#scene-status', '3D is unavailable. Use the pixel buttons, coordinate steps and result grid to follow the same complete example.');
}
async function initScene() {
  const T = await import('three');
  const { OrbitControls } = await import('three/addons/controls/OrbitControls.js');
  const canvas = $('#coordinate-scene'), renderer = new T.WebGLRenderer({ canvas, antialias: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.75)); renderer.setClearColor(0x11161c);
  const scene = new T.Scene(), camera = new T.PerspectiveCamera(35, 1, .1, 80);
  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = false; controls.enablePan = false; controls.minDistance = 8; controls.maxDistance = 30; controls.maxPolarAngle = Math.PI * .65;
  scene.add(new T.HemisphereLight(0xffffff, 0x22303a, 2.6));
  const light = new T.DirectionalLight(0xd4f3ff, 2.3); light.position.set(-4, 6, 10); scene.add(light);
  const render = () => renderer.render(scene, camera);
  function label(text, x, y, z, width = 3, color = '#f0f3f5') {
    const c = document.createElement('canvas'), ctx = c.getContext('2d');
    ctx.font = '600 60px system-ui'; c.width = Math.max(180, Math.ceil(ctx.measureText(text).width) + 64); c.height = 128;
    ctx.fillStyle = '#11161c'; ctx.fillRect(0, 0, c.width, c.height);
    ctx.fillStyle = color; ctx.font = '600 60px system-ui'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(text, c.width / 2, 64);
    const texture = new T.CanvasTexture(c); texture.colorSpace = T.SRGBColorSpace;
    const sprite = new T.Sprite(new T.SpriteMaterial({ map: texture, depthTest: false })); sprite.position.set(x, y, z); sprite.scale.set(width, width * c.height / c.width, 1); scene.add(sprite); return sprite;
  }
  const positions = [new T.Vector3(-4.8, 0, .8), new T.Vector3(0, 1.5, -1.2), new T.Vector3(4.8, 0, .8)];
  const titles = ['OUTPUT', 'SOURCE', 'RETURN'];
  const colors = [0x506d7e, 0x648d7e, 0x506d7e], tiles = [];
  positions.forEach((position, plane) => {
    const board = new T.Mesh(new T.BoxGeometry(4.1, 2.5, .12), new T.MeshStandardMaterial({ color: 0x1b2934, roughness: .75 })); board.position.copy(position); scene.add(board);
    label(titles[plane], position.x, position.y + 1.75, position.z + .1, 3.8, '#a3c4d2');
    const row = [];
    for (let index = 0; index < 2; index++) {
      const tile = new T.Mesh(new T.BoxGeometry(1.65, 1.6, .17), new T.MeshStandardMaterial({ color: colors[plane], roughness: .55, transparent: true }));
      tile.position.copy(position).add(new T.Vector3((index - .5) * 1.9, 0, .16)); tile.userData.pixel = index; scene.add(tile); row.push(tile);
      label(plane === 1 ? String(index + 1) : `(${index},0)`, tile.position.x, tile.position.y - .05, tile.position.z + .2, 1.6);
    }
    tiles.push(row);
  });
  const world = new T.Mesh(new T.SphereGeometry(.17, 20, 12), new T.MeshStandardMaterial({ color: 0x97d8ea }));
  world.position.set(-2.4, 3.2, .5); scene.add(world); label('WORLD', -2.4, 3.8, .5, 1.8, '#97d8ea');
  const gapLabel = label('undefined', 4.8, -1.8, 1, 2.4, '#f0bd80'); gapLabel.visible = false;
  const line = new T.Line(new T.BufferGeometry(), new T.LineBasicMaterial({ color: 0x97d8ea, transparent: true, opacity: .85 })); scene.add(line);
  const bead = new T.Mesh(new T.SphereGeometry(.12, 16, 10), new T.MeshStandardMaterial({ color: 0xf0f3f5 })); scene.add(bead);
  const outlines = tiles.map(row => { const box = new T.BoxHelper(row[0], 0x97d8ea); scene.add(box); return box; });
  let currentPixel = -1, currentFinite = null, path;
  sceneUpdate = (result, frame, selected) => {
    if (selected !== currentPixel || result.inverseFinite !== currentFinite) {
      currentPixel = selected; currentFinite = result.inverseFinite;
      const points = [tiles[0][selected].position.clone().add(new T.Vector3(0, .1, .35)), world.position.clone(), tiles[1][selected].position.clone().add(new T.Vector3(0, .1, .35))];
      if (result.inverseFinite) points.push(tiles[2][selected].position.clone().add(new T.Vector3(0, .1, .35)));
      path = new T.CatmullRomCurve3(points); line.geometry.dispose(); line.geometry = new T.BufferGeometry().setFromPoints(path.getPoints(64));
    }
    outlines.forEach((outline, plane) => { outline.visible = plane !== 2 || result.inverseFinite; outline.setFromObject(tiles[plane][selected]); });
    tiles[2][1].material.opacity = result.inverseFinite ? 1 : .28;
    gapLabel.visible = !result.inverseFinite;
    bead.position.copy(path.getPoint(reducedMotion.matches || !playing ? .6 : (frame.time % 6) / 6));
    line.material.color.setHex(result.accepted ? 0x97d8ea : 0xf0bd80); render();
  };
  function setView(front = false) {
    // Keep the complete coordinate path framed on narrow screens.
    const distance = Math.max(11.5, 14.8 / (2 * Math.tan(camera.fov * Math.PI / 360) * camera.aspect));
    camera.position.set(front ? 0 : 1.6, front ? 1.8 : 4.5, distance);
    controls.target.set(0, 1.1, 0); controls.maxDistance = Math.max(30, distance + 8); controls.update(); render();
  }
  resetCamera = () => setView();
  $('#reset-view').addEventListener('click', () => { pause(); setView(); update(); });
  $('#front-view').addEventListener('click', () => { pause(); setView(true); update(); });
  controls.addEventListener('start', () => { pause(); update(); }); controls.addEventListener('change', render);
  const raycaster = new T.Raycaster(); let down;
  canvas.addEventListener('pointerdown', event => { down = [event.clientX, event.clientY]; });
  canvas.addEventListener('pointerup', event => {
    if (!down || Math.hypot(event.clientX - down[0], event.clientY - down[1]) > 5) { down = null; return; }
    down = null; const rect = canvas.getBoundingClientRect();
    raycaster.setFromCamera(new T.Vector2((event.clientX - rect.left) / rect.width * 2 - 1, -(event.clientY - rect.top) / rect.height * 2 + 1), camera);
    const hit = raycaster.intersectObjects(tiles.flat(), false)[0];
    if (hit) { pause(); manual = true; pixel = hit.object.userData.pixel; update(); }
  });
  canvas.addEventListener('pointercancel', () => { down = null; });
  canvas.addEventListener('webglcontextlost', event => { event.preventDefault(); fallback(); });
  let previousWidth;
  function resize() {
    if (canvas.hidden) return;
    const width = canvas.clientWidth, height = canvas.clientHeight;
    renderer.setSize(width, height, false); camera.aspect = width / height; camera.updateProjectionMatrix();
    if (previousWidth !== width) { previousWidth = width; setView(); } else render();
  }
  canvas.hidden = false; $('.camera').hidden = false; $('#scene-status').hidden = true;
  new ResizeObserver(resize).observe(canvas); resize(); update();
}

async function init() {
  const response = await fetch('reproject-fixture.json');
  if (!response.ok) throw Error('Fixture unavailable');
  fixture = await response.json(); update(); initScene().catch(fallback);
}
init().catch(() => {
  setText('#scene-status', 'The recorded fixture could not load. Reload to retry, or inspect the linked source regression below.');
  $('#scene-status').hidden = false;
  document.querySelectorAll('button,input').forEach(control => { control.disabled = true; });
});
