import * as T from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {createMotionScene} from './motion-scene.js';
import {OBSTACLE_SCENARIOS, obstacleWheelHeights} from './obstacle-inspection.js';

const $ = value => document.querySelector(value), app = window.vehicleTerrain = {ready: false, error: null};
const colors = ['#87d4d0', '#efaf79', '#b4c77e', '#b39ad2'], names = ['FL', 'FR', 'RL', 'RR'];
const cameras = ['follow', 'side', 'wheel', 'driver', 'course'];
const labels = {'chrono-log': 'Log contact', 'chrono-handling': 'Steering + braking', 'chrono-pit': 'Pit response', obstacle: 'Wheel support inspection'};
let renderer, scene, camera, controls, motion, playing = false, last = 0, raf = null, mode = 'chrono-log', cameraMode = 'follow', freeCamera = false, elapsed = 0, progress = -500;
$('#retry').onclick = () => location.reload();
function fail(error) {pause();app.ready = false;app.error = error.message;$('#error p').textContent = error.message;$('#error').hidden = false;$('#loading').hidden = true;document.querySelectorAll('#controls button,#controls select,#controls input').forEach(e => e.disabled = true);$('.workspace').setAttribute('aria-busy', 'false');}
function render() {renderer?.render(scene, camera);}
function clockCamera(force = false) {
  if (freeCamera && !force) return;
  const frame = motion.framing(cameraMode), narrow = camera.aspect < 1;
  controls.target.copy(frame.target); camera.position.copy(frame.target).addScaledVector(frame.offset, narrow && cameraMode !== 'driver' ? 1.65 : 1);
  camera.fov = cameraMode === 'driver' ? 62 : 42; camera.updateProjectionMatrix();camera.lookAt(controls.target);controls.update();
}
function setCamera(value) {
  if (!cameras.includes(value)) throw Error('Unknown camera');
  cameraMode = value; freeCamera = false; clockCamera(true);render();
  document.querySelectorAll('[data-camera]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.camera === value)));
  $('#camera-note').textContent = ({follow: 'Chase camera', side: 'Side camera', wheel: 'Wheel camera', driver: 'Inspection eye-point', course: 'Landscape camera'})[value] + ' · drag to orbit';
}
function svg(tag, attrs = {}, value) {const e = document.createElementNS('http://www.w3.org/2000/svg', tag);for (const [key, text] of Object.entries(attrs)) e.setAttribute(key, text);if (value !== undefined) e.textContent = value;return e;}
function plot() {
  const group = $('#trace-lines'); group.replaceChildren();
  const obstacle = mode === 'obstacle', run = obstacle ? null : motion.replays[mode.slice(7)].run;
  const samples = obstacle ? Array.from({length: 301}, (_, i) => Object.values(obstacleWheelHeights($('#scenario').value, -500 + i * 10))) : run.frames.map(frame => frame.wheel_heave_m.map(value => value * 1000));
  const max = Math.max(100, ...samples.flat().map(Math.abs));
  for (const value of [-max, 0, max]) {const y = 78 - value / max * 60;group.append(svg('line', {x1: 35, x2: 708, y1: y, y2: y, stroke: '#344951'}), svg('text', {x: 0, y: y + 3}, value.toFixed(0)));}
  for (let wheel = 0; wheel < 4; wheel++) group.append(svg('polyline', {fill: 'none', stroke: colors[wheel], 'stroke-width': 1.8, points: samples.map((sample, i) => (35 + i / (samples.length - 1) * 673) + ',' + (78 - sample[wheel] / max * 60)).join(' ')}));
  $('#trace-title').textContent = obstacle ? 'Prescribed wheel support' : 'Suspension travel';
  $('#trace-units').textContent = obstacle ? 'mm / course position' : 'mm / recorded samples';
}
function table(rows) {
  const table = document.createElement('table');
  for (const row of rows) {const tr = document.createElement('tr');for (const value of row) {const td = document.createElement('td');td.textContent = value;tr.append(td);}table.append(tr);}
  $('#parameters').replaceChildren(table);
}
function configure() {
  const obstacle = mode === 'obstacle', run = obstacle ? null : motion.replays[mode.slice(7)].run;
  $('#scenario-field').hidden = !obstacle;$('#scrub').min = obstacle ? -500 : 0;$('#scrub').max = obstacle ? 2500 : run.summary.duration_s;$('#scrub').step = obstacle ? 1 : .02;
  $('#scrub-label').textContent = obstacle ? 'Course position · mm' : 'Recorded time';
  $('#mode-label').textContent = obstacle ? 'THREE.JS / NATIVE WHEEL INSPECTION' : 'CHRONO 10 / RECORDED SOLVER STATES';
  $('#view-title').textContent = labels[mode];$('#view-note').textContent = obstacle ? '80 mm obstacles · prescribed support geometry' : '18 solved bodies · 36 detailed wheel parts · 1 ms solver step';
  $('#speed-label').textContent = obstacle ? 'FRONT LEFT · MM' : 'SPEED · KM/H';$('#clock-label').textContent = obstacle ? 'POSITION · MM' : 'RECORDED TIME · S';$('#steer-label').textContent = obstacle ? 'FRONT RIGHT · MM' : 'STEERING INPUT · °';$('#brake-label').textContent = obstacle ? 'REAR SPLIT · MM' : 'BRAKE COMMAND';
  for (const id of ['forces', 'collision', 'trail', 'payload']) $('#' + id).disabled = obstacle;
  if (obstacle) {
    $('#outcome').textContent = 'Explore the contact geometry';$('#outcome-note').textContent = 'These wheels follow the existing native inspection equations. Chassis handling, forces and tyre traction are not calculated.';
    $('#contact-note').textContent = '36 original wheel components; four branding components withheld. Logs and pits retain the original support profiles.';
    $('#download').href = 'data/obstacle-pose.json';$('#download').textContent = 'Download the inspection pose contract ↧';
    table([['Native revision', motion.wheelMeta.revision], ['Wheel diameter', '366 mm'], ['Wheelbase / track', '900 / 600 mm'], ['Obstacle height / pit depth', '80 / 80 mm'], ['Physics solver', 'None; prescribed geometric wheel support']]);
  } else {
    const failed = run.summary.status.endsWith('_FAIL');
    $('#outcome').textContent = failed ? 'Obstacle traversal failed' : 'Recorded maneuver screen passed';
    $('#outcome-note').textContent = failed ? 'The rear axle did not clear this obstacle. The complete saved result is retained.' : 'The saved run includes steering, braking and the stationary hold. This is an assumed development model, not physical acceptance.';
    $('#contact-note').textContent = 'Tread is visual; contact uses smooth rigid cylinders. The rear force arrow combines both rear wheels. Payload outline is a display layer.';
    $('#download').href = 'data/chrono-' + mode.slice(7) + '.json';$('#download').textContent = 'Download this run and parameters ↧';
    table([['Engine', run.engine.name + ' ' + run.engine.version], ['Integration step / recorded samples', run.summary.dt_s * 1000 + ' ms / 50 Hz'], ['Rigid bodies / joints', run.summary.dynamic_body_count + ' / ' + run.summary.joint_count], ['Assumed total mass', run.summary.mass_kg.toFixed(3) + ' kg'], ['Assumed contact friction', run.config.contact.friction], ['Contact tyre diameter / width', '366 / 137 mm'], ['Assumed front / rear spring rates', run.config.spring_assumptions.front_rate_n_m + ' / ' + run.config.spring_assumptions.rear_rate_n_m + ' N/m'], ['Assumed drive / brake torque limits', run.config.drive_assumptions.max_axle_torque_nm + ' / ' + run.config.drive_assumptions.max_brake_torque_nm + ' N·m'], ['Saved outcome', run.summary.status]]);
  }
  plot(); update();
}
function update() {
  const state = motion.update({mode, time: elapsed, progress, scenario: $('#scenario').value, ...Object.fromEntries(['forces', 'collision', 'trail', 'scenery', 'payload'].map(id => [id, $('#' + id).checked]))});
  const obstacle = mode === 'obstacle', frame = state.frame, travel = obstacle ? Object.values(state.wheelHeights) : frame.wheel_heave_m.map(value => value * 1000);
  $('#speed').textContent = obstacle ? travel[0].toFixed(1) : (frame.linear_speed_m_s * 3.6).toFixed(2);$('#clock').textContent = obstacle ? progress.toFixed(0) : frame.t.toFixed(2);
  $('#steer').textContent = obstacle ? travel[1].toFixed(1) : frame.column_command_deg.toFixed(1);$('#brake').textContent = obstacle ? (travel[2] - travel[3]).toFixed(1) : frame.braking ? 'ON' : 'OFF';
  $('#scrub').value = obstacle ? progress : frame.t;
  const fraction = obstacle ? (progress + 500) / 3000 : state.sampleIndex / (motion.replays[mode.slice(7)].run.frames.length - 1), x = 35 + fraction * 673;
  $('#trace-cursor').setAttribute('x1', x);$('#trace-cursor').setAttribute('x2', x);
  $('#travel-values').replaceChildren(...travel.map((value, i) => {const e = document.createElement('span');e.textContent = names[i] + ' ' + value.toFixed(1) + ' mm';e.style.color = colors[i];return e;}));
  Object.assign(app, {mode, playing, time: elapsed, progress, state});clockCamera();render();return state;
}
function pause() {playing = false;last = 0;if (raf !== null) cancelAnimationFrame(raf);raf = null;app.playing = false;$('#play').textContent = mode === 'obstacle' ? 'Play course' : 'Play replay';}
function play() {
  if (!app.ready) return;
  const end = mode === 'obstacle' ? 2500 : motion.replays[mode.slice(7)].run.summary.duration_s;
  if ((mode === 'obstacle' ? progress : elapsed) >= end) {elapsed = 0;progress = -500;}
  playing = true;app.playing = true;last = 0;$('#play').textContent = 'Pause';if (raf === null) raf = requestAnimationFrame(loop);
}
function loop(now) {
  raf = null;if (!playing) return;
  try {const delta = last ? Math.min(.1, (now - last) / 1000) * +$('#rate').value : 0;last = now;
    if (mode === 'obstacle') progress = Math.min(2500, progress + delta * 300);else elapsed = Math.min(motion.replays[mode.slice(7)].run.summary.duration_s, elapsed + delta);
    update();if ((mode === 'obstacle' ? progress >= 2500 : elapsed >= motion.replays[mode.slice(7)].run.summary.duration_s)) pause();else raf = requestAnimationFrame(loop);
  } catch (error) {fail(error);}
}
function choose(value) {if (!Object.hasOwn(labels, value)) throw Error('Unknown motion study');pause();mode = value;$('#study').value = value;elapsed = 0;progress = -500;freeCamera = false;configure();pause();}
async function start() {
  renderer = new T.WebGLRenderer({canvas: $('#terrain-canvas'), antialias: true, preserveDrawingBuffer: true});renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));renderer.setClearColor(0x20333b);renderer.outputColorSpace = T.SRGBColorSpace;renderer.toneMapping = T.ACESFilmicToneMapping;renderer.toneMappingExposure = 1.15;renderer.shadowMap.enabled = true;renderer.shadowMap.type = T.PCFSoftShadowMap;
  scene = new T.Scene();scene.fog = new T.Fog(0x20333b, 13, 30);camera = new T.PerspectiveCamera(42, 1, .01, 70);camera.up.set(0, 0, 1);controls = new OrbitControls(camera, renderer.domElement);controls.enableDamping = false;controls.minDistance = .15;controls.maxDistance = 28;
  scene.add(new T.HemisphereLight(0xe1f2fa, 0x405045, 2.5));const sun = new T.DirectionalLight(0xffdfba, 3);sun.position.set(1, -4, 8);sun.castShadow = true;sun.shadow.mapSize.set(2048, 2048);Object.assign(sun.shadow.camera, {left: -10, right: 10, top: 10, bottom: -10, near: .1, far: 30});sun.shadow.normalBias = .002;scene.add(sun);const fill = new T.DirectionalLight(0x9bd5df, 1.2);fill.position.set(-2, 3, 5);scene.add(fill);
  controls.addEventListener('start', () => {freeCamera = true;$('#camera-note').textContent = 'Free orbit · choose a camera to resume tracking';});controls.addEventListener('change', render);
  motion = await createMotionScene(scene);motion.show(true);
  const resize = () => {const rect = $('#terrain-canvas').getBoundingClientRect();renderer.setSize(rect.width, rect.height, false);camera.aspect = rect.width / rect.height;camera.updateProjectionMatrix();if (app.ready) {clockCamera();render();}};
  new ResizeObserver(resize).observe($('.viewport'));resize();
  document.querySelectorAll('#controls button,#controls input,#controls select').forEach(e => e.disabled = false);
  Object.assign(app, {ready: true, renderer, scene, camera, controls, motion, choose, setCamera, play, pause, seek(value) {pause();if (!Number.isFinite(value)) throw Error('Invalid scrub value');if (mode === 'obstacle') progress = Math.max(-500, Math.min(2500, value));else elapsed = Math.max(0, Math.min(12, value));return update();}});
  const requested = new URLSearchParams(location.search).get('study');choose(Object.hasOwn(labels, requested) ? requested : 'chrono-log');
  $('#loading').hidden = true;$('.workspace').setAttribute('aria-busy', 'false');
  $('#play').onclick = () => playing ? pause() : play();$('#restart').onclick = () => app.seek(mode === 'obstacle' ? -500 : 0);$('#study').onchange = event => choose(event.target.value);$('#scenario').onchange = () => {pause();progress = -500;plot();update();};$('#scrub').oninput = event => app.seek(+event.target.value);
  for (const id of ['forces', 'collision', 'trail', 'payload', 'scenery']) $('#' + id).onchange = () => update();
  for (const button of document.querySelectorAll('[data-camera]')) button.onclick = () => setCamera(button.dataset.camera);
  $('#fullscreen').onclick = async () => {try {if (document.fullscreenElement) await document.exitFullscreen();else await $('.workspace').requestFullscreen();} catch {$('#camera-note').textContent = 'Full screen is unavailable in this browser.';}};
  $('#terrain-canvas').onkeydown = event => {if (!app.ready) return;if ([' ', 'ArrowLeft', 'ArrowRight', 'c', 'C'].includes(event.key)) event.preventDefault();if (event.key === ' ') playing ? pause() : play();else if (['ArrowLeft', 'ArrowRight'].includes(event.key)) app.seek((mode === 'obstacle' ? progress : elapsed) + (event.key === 'ArrowRight' ? 1 : -1) * (mode === 'obstacle' ? 40 : .2));else if (event.key.toLowerCase() === 'c') setCamera(cameras[(cameras.indexOf(cameraMode) + 1) % cameras.length]);};
  document.addEventListener('visibilitychange', () => {if (document.hidden) pause();});window.addEventListener('pagehide', pause);
}
start().catch(fail);
