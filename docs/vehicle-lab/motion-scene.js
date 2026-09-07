import * as T from 'three';
import {validateGeometry} from './project-contract.js';
import {createNativeInspectionPose, rearPoseFromWheelHeights} from './native-inspection-pose.js';
import {createObstacleScene, obstacleWheelHeights} from './obstacle-inspection.js';
import {readPinned, sampleAt, validateRun} from './motion-data.js';

const vector = values => new T.Vector3(...values);
const material = (color, extra = {}) => new T.MeshStandardMaterial({color, roughness: .85, ...extra});
const line = color => new T.Line(new T.BufferGeometry().setFromPoints([new T.Vector3(), new T.Vector3()]), new T.LineBasicMaterial({color}));

function shapeGeometry(shape) {
  if (shape.kind === 'box') return new T.BoxGeometry(...shape.dimensions_m);
  if (shape.kind !== 'cylinder') throw Error('Unknown recorded collision shape');
  const geometry = new T.CylinderGeometry(shape.dimensions_m[0], shape.dimensions_m[0], shape.dimensions_m[1], 48);
  geometry.rotateX(Math.PI / 2);
  return geometry;
}

function landscape(scene) {
  const root = new T.Group();
  root.name = 'Visual scenery outside the recorded contact course';
  // The scenic base stays below every recorded pit floor and support surface.
  const base = new T.Mesh(new T.PlaneGeometry(55, 32), material(0x293c2d));
  base.position.set(7, 0, -.3); base.receiveShadow = true; root.add(base);
  const bark = material(0x4a3829), leaves = [material(0x233d31), material(0x315244), material(0x3e5a43)];
  // Trees are outside the widest six-metre rigid contact lane. Seeded layout
  // is only scenery; it neither adds contacts nor changes any solver sample.
  for (let i = 0; i < 46; i++) {
    const x = -7 + i % 23 * .85, y = (i < 23 ? -1 : 1) * (4 + (i * 17 % 7) * .27);
    const height = 1.25 + (i * 13 % 9) * .16;
    const trunk = new T.Mesh(new T.CylinderGeometry(.045, .065, height, 7), bark);
    trunk.rotation.x = Math.PI / 2; trunk.position.set(x, y, height / 2 - .3); root.add(trunk);
    for (let tier = 0; tier < 3; tier++) {
      const foliage = new T.Mesh(new T.ConeGeometry(.62 - tier * .12, height * .65, 7), leaves[(i + tier) % leaves.length]);
      foliage.rotation.x = Math.PI / 2; foliage.position.set(x, y, height * (.62 + tier * .24) - .3); root.add(foliage);
    }
  }
  for (const y of [-3.6, 3.6]) {
    const verge = new T.Mesh(new T.BoxGeometry(35, .7, .08), material(0x34483a));
    verge.position.set(6, y, -.045); verge.receiveShadow = true; root.add(verge);
  }
  scene.add(root);
  return root;
}

function buildReplay(run, wheelMeta, wheelBinary) {
  const root = new T.Group(), bodyRoot = new T.Group(), ground = new T.Group(), forces = new T.Group();
  root.add(bodyRoot, ground, forces);
  const objects = {}, arrows = {}, links = [], springs = [], meshes = [], wheelVisuals = [], wheelAudit = [];
  for (const [name, body] of Object.entries(run.assembly)) {
    const group = new T.Group(); group.name = name;
    for (const [index, shape] of body.shapes.entries()) {
      const payload = name === 'chassis' && !shape.collision;
      const mesh = new T.Mesh(shapeGeometry(shape), material(shape.colour, payload ? {transparent: true, opacity: .13, depthWrite: false} : {}));
      mesh.position.set(...shape.centre_local_m); mesh.quaternion.set(...shape.quaternion_xyzw);
      mesh.castShadow = !payload; mesh.userData.collision = shape.collision; mesh.userData.payload = payload;
      mesh.userData.tyre = name.endsWith('_wheel') || (name === 'rear_spool' && index < 2);
      group.add(mesh); meshes.push(mesh);
    }
    objects[name] = group; bodyRoot.add(group);
  }
  const offset = vector(run.config.tyre_screen_override.initial_world_offset_m);
  const specs = {FL: ['FL_wheel', 0, [900, 300, 0]], FR: ['FR_wheel', 0, [900, -300, 0]], RL: ['rear_spool', 0, [0, 300, 0]], RR: ['rear_spool', 1, [0, -300, 0]]};
  for (const [tag, [name, shapeIndex, nativeCentre]] of Object.entries(specs)) {
    const body = run.assembly[name], contact = body.shapes[shapeIndex], inverse = new T.Quaternion(...body.initial_pose.slice(3)).invert();
    const initial = vector(body.initial_pose.slice(0, 3)), centre = vector(nativeCentre).multiplyScalar(.001);
    const localCentre = centre.clone().add(offset).sub(initial).applyQuaternion(inverse);
    const axis = vector([0, 1, 0]).applyQuaternion(inverse), contactAxis = vector([0, 0, 1]).applyQuaternion(new T.Quaternion(...contact.quaternion_xyzw));
    let radius = 0, minY = Infinity, maxY = -Infinity;
    const parts = wheelMeta.parts.filter(p => p.id.startsWith('WHEEL-' + tag + '-'));
    if (parts.length !== 9) throw Error('Wrong public tyre inventory: ' + tag);
    for (const part of parts) {
      const source = new Float32Array(wheelBinary, part.positionOffset, part.positionCount), positions = new Float32Array(source.length);
      const tyre = /Tyre_|Sidewall_|Shoulder_/.test(part.id);
      for (let i = 0; i < source.length; i += 3) {
        const p = vector([source[i], source[i + 1], source[i + 2]]).multiplyScalar(.001);
        if (tyre) {radius = Math.max(radius, Math.hypot(p.x - centre.x, p.z - centre.z)); minY = Math.min(minY, p.y - centre.y); maxY = Math.max(maxY, p.y - centre.y);}
        p.add(offset).sub(initial).applyQuaternion(inverse); positions.set(p.toArray(), i);
      }
      const geometry = new T.BufferGeometry(); geometry.setAttribute('position', new T.BufferAttribute(positions, 3));
      geometry.setIndex(new T.BufferAttribute(new Uint32Array(wheelBinary, part.indexOffset, part.indexCount), 1)); geometry.computeVertexNormals();
      const mesh = new T.Mesh(geometry, material(new T.Color().setRGB(...part.color, T.SRGBColorSpace), {roughness: tyre ? .85 : .6, metalness: tyre ? 0 : .25}));
      mesh.userData = {id: part.id, tag}; mesh.castShadow = true; objects[name].add(mesh); wheelVisuals.push(mesh);
    }
    const audit = {tag, body: name, centreError: localCentre.distanceTo(vector(contact.centre_local_m)), axisError: 1 - Math.abs(axis.dot(contactAxis)), radius, width: maxY - minY, localCentre: localCentre.toArray()};
    if (audit.centreError > 1e-9 || audit.axisError > 1e-9 || Math.abs(radius - contact.dimensions_m[0]) > .00025 || Math.abs(audit.width - contact.dimensions_m[1]) > .0005) throw Error('Detailed wheel does not match recorded contact: ' + tag);
    wheelAudit.push(audit);
  }
  for (const shape of run.terrain) {
    const mesh = new T.Mesh(shapeGeometry(shape), material(shape.kind === 'box' ? 0x463d31 : 0x94623c));
    mesh.position.set(...shape.centre_m);
    // Geometry's cylinder axis is Z; recorded obstacle cylinders lie on Y.
    if (shape.kind === 'cylinder') mesh.rotation.x = -Math.PI / 2;
    mesh.receiveShadow = true; mesh.castShadow = shape.kind === 'cylinder'; ground.add(mesh);
  }
  for (const name of ['FL_wheel', 'FR_wheel', 'rear_spool', 'chassis']) {
    const arrow = new T.ArrowHelper(new T.Vector3(0, 0, 1), new T.Vector3(), .1, name === 'chassis' ? 0xf2a261 : 0x79e0db, .065, .035);
    arrows[name] = arrow; forces.add(arrow);
  }
  for (const _ of run.distance_links || []) {const item = line(0x7b9aa9); links.push(item); bodyRoot.add(item);}
  for (const _ of run.spring_names) {const item = line(0xffb563); springs.push(item); bodyRoot.add(item);}
  const trail = new T.Line(new T.BufferGeometry().setFromPoints(run.frames.map(frame => vector(frame.bodies.chassis.slice(0, 3)))), new T.LineBasicMaterial({color: 0x82cebb, transparent: true, opacity: .6}));
  root.add(trail);
  return {root, bodyRoot, ground, forces, objects, arrows, links, springs, meshes, trail, run, wheelVisuals, wheelAudit};
}

export async function createMotionScene(scene) {
  const response = await fetch('data/motion-provenance.json');
  if (!response.ok) throw Error('Motion provenance unavailable');
  const provenance = await response.json();
  if (provenance.hardwareRelease !== false || provenance.physicalValidation !== false) throw Error('Unexpected motion scope');
  const get = async name => JSON.parse(new TextDecoder().decode(await readPinned(name, provenance.outputs[name])));
  const [wheelMeta, contract, chronoWheels, ...runs] = await Promise.all([
    get('data/r4-wheels.json'), get('data/obstacle-pose.json'), get('data/chrono-wheels.json'), ...provenance.runs.map(row => get(row.path))
  ]);
  const binary = await readPinned('data/r4-wheels.bin', provenance.outputs['data/r4-wheels.bin']);
  const chronoBinary = await readPinned('data/chrono-wheels.bin', provenance.outputs['data/chrono-wheels.bin']);
  await validateGeometry(wheelMeta, binary);
  await validateGeometry(chronoWheels, chronoBinary);
  if (contract.native_sha256 !== wheelMeta.nativeSha256 || contract.part_count !== wheelMeta.wholeSourcePartCount) throw Error('Obstacle model does not match its pose contract');
  const adapter = createNativeInspectionPose({modelKey: 'ridge_r4', manifest: {source_native_sha256: wheelMeta.nativeSha256, part_count: wheelMeta.wholeSourcePartCount}, parts: contract.parts.map(p => ({id: p.part_id}))}, contract);
  const root = new T.Group(), wheelRoot = new T.Group(), wheelObjects = [];
  root.add(wheelRoot); root.scale.setScalar(.001); root.position.z = .183;
  scene.add(root);
  for (const part of wheelMeta.parts) {
    const geometry = new T.BufferGeometry();
    geometry.setAttribute('position', new T.BufferAttribute(new Float32Array(binary, part.positionOffset, part.positionCount), 3));
    geometry.setIndex(new T.BufferAttribute(new Uint32Array(binary, part.indexOffset, part.indexCount), 1));
    geometry.computeVertexNormals(); geometry.computeBoundingBox();
    const color = new T.Color().setRGB(...part.color, T.SRGBColorSpace);
    const mesh = new T.Mesh(geometry, material(color)); mesh.castShadow = true;
    mesh.matrixAutoUpdate = false; mesh.userData.id = part.id; wheelRoot.add(mesh); wheelObjects.push(mesh);
  }
  const obstacles = createObstacleScene(T, root, -183);
  const replays = Object.fromEntries(runs.map((run, i) => {
    validateRun(run); const replay = buildReplay(run, chronoWheels, chronoBinary); scene.add(replay.root);
    return [provenance.runs[i].id, replay];
  }));
  const scenery = landscape(scene);
  let state = {mode: 'obstacle', progress: -500, scenario: 'staggered', time: 0, forces: true, collision: false, trail: true, scenery: true, payload: false};
  let currentFrame = null, currentIndex = null, pose = null, heights = null, active = false;

  function show(value) {
    active = value;
    root.visible = active && state.mode === 'obstacle';
    for (const [id, replay] of Object.entries(replays)) replay.root.visible = active && state.mode === 'chrono-' + id;
    scenery.visible = active && state.scenery;
  }
  function update(values = {}) {
    const next = {...state, ...values};
    if (next.mode !== 'obstacle' && !replays[next.mode.replace('chrono-', '')]) throw Error('Unknown motion study');
    if (next.mode === 'obstacle') {
      heights = obstacleWheelHeights(next.scenario, next.progress);
      const rear = rearPoseFromWheelHeights(contract, heights.rearLeft, heights.rearRight);
      pose = adapter.evaluate({heaveL: heights.frontLeft, heaveR: heights.frontRight, ...rear, steer: 0,
        wheelSpin: ((next.progress / 183 * 180 / Math.PI + 180) % 360 + 360) % 360 - 180});
      for (const mesh of wheelObjects) mesh.matrix.fromArray(pose.matrices[mesh.userData.id]);
      obstacles.update({enabled: true, name: next.scenario, progress: next.progress});
      for (const mesh of obstacles.group.children) if (!Array.isArray(mesh.material)) mesh.material.color.setHex(0x555640);
      currentFrame = null; currentIndex = null;
    } else {
      const replay = replays[next.mode.replace('chrono-', '')];
      const sample = sampleAt(replay.run, next.time); currentFrame = sample.frame; currentIndex = sample.index;
      for (const [name, values] of Object.entries(currentFrame.bodies)) {
        replay.objects[name].position.set(...values.slice(0, 3)); replay.objects[name].quaternion.set(...values.slice(3));
      }
      replay.bodyRoot.updateMatrixWorld(true);
      for (const [index, link] of (replay.run.distance_links || []).entries()) {
        const a = replay.objects[link.body_a].localToWorld(vector(link.a_local_m)), b = replay.objects[link.body_b].localToWorld(vector(link.b_local_m));
        replay.links[index].geometry.setFromPoints([a, b]);
      }
      currentFrame.spring_endpoints_m?.forEach(([a, b], index) => replay.springs[index].geometry.setFromPoints([vector(a), vector(b)]));
      for (const [name, arrow] of Object.entries(replay.arrows)) {
        const force = vector(currentFrame.contact_force_n[name]), length = force.length();
        arrow.position.set(...currentFrame.bodies[name].slice(0, 3)); arrow.visible = length > 1;
        if (length > 1) {arrow.setDirection(force.normalize()); arrow.setLength(Math.min(length / 1500, .95), .065, .035);}
      }
      replay.forces.visible = next.forces; replay.trail.visible = next.trail;
      replay.trail.geometry.setDrawRange(0, sample.index + 1);
      for (const mesh of replay.meshes) {
        mesh.material.wireframe = next.collision && mesh.userData.collision;
        mesh.visible = mesh.userData.payload ? next.payload : mesh.userData.tyre ? next.collision : !next.collision || mesh.userData.collision;
      }
      for (const mesh of replay.wheelVisuals) mesh.visible = !next.collision;
    }
    state = next; show(active); scene.updateMatrixWorld(true);
    return inspect();
  }
  function inspect() {
    const replay = state.mode === 'obstacle' ? null : replays[state.mode.replace('chrono-', '')];
    return {...state, sampleTime: currentFrame?.t ?? null, sampleIndex: currentIndex, frame: currentFrame,
      progress: replay ? null : state.progress, scenario: replay ? null : state.scenario,
      wheelHeights: replay ? null : heights, visibleParts: replay ? Object.keys(replay.objects) : wheelObjects.map(o => o.userData.id),
      status: replay?.run.summary.status ?? 'PRESCRIBED_GEOMETRY', wheelAudit: replay?.wheelAudit ?? null, physicsSimulation: false,
      recordedPhysics: Boolean(replay), nativePose: state.mode === 'obstacle' ? pose : null,
      physicalValidation: false, hardwareRelease: false};
  }
  function framing(view = 'follow') {
    const target = state.mode === 'obstacle' ? new T.Vector3(.45, 0, .35) : vector(currentFrame.bodies.chassis.slice(0, 3));
    if (view === 'course') return {target: new T.Vector3(2, 0, .1), offset: new T.Vector3(5.8, -7.5, 5.7)};
    if (view === 'wheel' && currentFrame) return {target: vector(currentFrame.bodies.FR_wheel.slice(0, 3)), offset: new T.Vector3(.55, -.9, .5)};
    if (view === 'wheel') {
      const tyre = wheelObjects.find(mesh => mesh.userData.id === 'WHEEL-FR-Tyre_rounded_carcass');
      return {target: tyre.localToWorld(tyre.geometry.boundingBox.getCenter(new T.Vector3())), offset: new T.Vector3(.55, -.9, .5)};
    }
    if (view === 'driver') return {target: target.clone().add(new T.Vector3(3.1, 0, .12)), offset: new T.Vector3(-3.25, 0, .6)};
    if (view === 'side') return {target, offset: new T.Vector3(.2, -2.9, 1.0)};
    return {target, offset: new T.Vector3(1.55, -2.05, 1.15)};
  }
  function bounds() {
    if (state.mode === 'obstacle') return new T.Box3().setFromObject(wheelRoot).expandByScalar(.09);
    const replay = replays[state.mode.replace('chrono-', '')];
    const box = new T.Box3();
    replay.bodyRoot.traverse(object => {if (object.isMesh && object.visible) box.expandByObject(object);});
    return box.expandByScalar(.08);
  }
  update(); show(false);
  return {show, update, inspect, framing, bounds, replays, wheelObjects, wheelRoot, obstacles, provenance, wheelMeta, chronoWheelMeta: chronoWheels, contract, scenery};
}
