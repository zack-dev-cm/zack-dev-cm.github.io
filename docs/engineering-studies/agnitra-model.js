import * as T from 'three';
import { v, smooth, box, plate, point, label, tube, tensor, tag } from './scene-kit.js';

const lime = 0xc3e483, jade = 0x74c5a8, blue = 0x8cbbd3, gold = 0xe5bf83, dark = 0x172d2a;
export function agnitraModel(data) {
  const root = new T.Group(); root.name = 'Agnitra / recorded CPU model structure';
  const input = tensor(data.input_shape[1], data.input_shape[2], blue, 'Input / 1 × 3 × 32 × 32');
  const conv = tensor(data.layers[0].output_shapes[0][1], data.layers[0].output_shapes[0][2], lime, 'Conv2d / 1 × 8 × 32 × 32');
  const relu = tensor(data.layers[1].output_shapes[0][1], data.layers[1].output_shapes[0][2], jade, 'ReLU / 1 × 8 × 32 × 32');
  const pool = new T.Group(); pool.name = 'AdaptiveAvgPool2d / 1 × 8 × 1 × 1';
  const flat = new T.Group(); flat.name = 'Flatten / 1 × 8';
  const projection = new T.Group(); projection.name = 'Linear / 8 inputs to 4 outputs';
  const pooled = [], flattened = [];
  for (let i = 0; i < 8; i++) {
    const a = box(.18, .18, .18, lime, `Pooled channel ${i + 1}`); pool.add(a); pooled.push(a);
    const b = box(.27, .27, .27, jade, `Vector element ${i + 1}`); flat.add(b); flattened.push(b);
  }
  const inPoints = [], outPoints = [];
  for (let i = 0; i < 8; i++) { const p = point(.12, jade, `Linear input ${i + 1}`); p.position.set(-1.45, (i - 3.5) * .39, .23); projection.add(p); inPoints.push(p.position.clone()); }
  for (let i = 0; i < 4; i++) { const p = point(.19, gold, `Linear output ${i + 1}`); p.position.set(1.45, (i - 1.5) * .73, .3); projection.add(p); outPoints.push(p.position.clone()); }
  for (const [i, a] of inPoints.entries()) for (const [j, b] of outPoints.entries()) {
    const middle = a.clone().lerp(b, .5); middle.z += .17 + Math.abs(i - j) * .045;
    const edge = tube([a, middle, b], i % 2 ? jade : lime, .011, `Linear weight connection ${i + 1} to ${j + 1}`);
    edge.userData = { meaning: 'Parameter connectivity only; no weight value or activation strength.' }; projection.add(edge);
  }
  const stages = [input, conv, relu, pool, flat, projection];
  const names = ['INPUT / 3 × 32 × 32', 'CONV2D / 8 × 32 × 32', 'RELU / 8 × 32 × 32', 'POOL / 8 × 1 × 1', 'FLATTEN / 8', 'LINEAR / 4'];
  const homes = [v(-4.45, 1.8, 0), v(0, 1.8, 0), v(4.45, 1.8, 0), v(4.45, -3.15, .15), v(0, -3.15, .15), v(-4.45, -3.15, .15)];
  const captions = new T.Group(); captions.name = 'Recorded layer dimensions';
  const bases = new T.Group(); bases.name = 'Illustrative stage carriers';
  for (let i = 0; i < stages.length; i++) {
    root.add(stages[i]);
    const base = plate(3.75, 3.8, .09, dark, names[i] + ' carrier'); base.position.copy(homes[i]).add(v(0, 0, -.18)); bases.add(base);
    const text = tag(names[i], homes[i].x, homes[i].y - 2.18, .1, '#b7cdb7', 3.7); captions.add(text);
  }
  const routes = new T.Group(); routes.name = 'Execution order / illustrative timing';
  for (let i = 0; i < homes.length - 1; i++) {
    const a = homes[i], b = homes[i + 1], mid = a.clone().lerp(b, .5); mid.z = -.04;
    routes.add(tube([a.clone().add(v(0, 0, -.04)), mid, b.clone().add(v(0, 0, -.04))], jade, .032));
  }
  const stencil = new T.Group(); stencil.name = 'Convolution / 3 by 3 kernel footprint';
  for (let c = 0; c < 3; c++) for (let x = 0; x < 3; x++) for (let y = 0; y < 3; y++) {
    const cell = box(.097, .097, .035, gold, `Kernel footprint / channel ${c + 1} / cell ${x + 1},${y + 1}`); cell.position.set((x - 1) * .1, (y - 1) * .1, c * .19 + .05); stencil.add(cell);
  }
  const trace = new T.Group(); trace.name = 'Selected recorded operator names';
  const selectedOperators = ['aten::conv2d', 'aten::convolution', 'aten::reshape', 'aten::copy_', 'aten::relu', 'aten::adaptive_avg_pool2d'];
  for (let i = 0; i < selectedOperators.length; i++) {
    if (!data.recorded_operators.includes(selectedOperators[i])) throw Error('Recorded operator missing: ' + selectedOperators[i]);
    const g = new T.Group(); g.name = selectedOperators[i]; g.position.set((i % 2 - .5) * 4.45, (1 - Math.floor(i / 2)) * 1.4, (i % 3) * .1);
    g.add(plate(4.1, .9, .13, i === 0 ? jade : dark, selectedOperators[i] + ' event label'));
    const text = label(selectedOperators[i], i === 0 ? '#0a2824' : '#c5dac7', 3.8); text.position.z = .17; g.add(text); trace.add(g);
  }
  trace.add(tag('SELECTED OPERATOR NAMES / NO TIMING SCALE', 0, -2.2, .1, '#a0b8a7', 7.6));
  root.add(bases, captions, routes, stencil, trace);
  const facts = { release: data.package_release, input: data.input_shape, output: data.output_shape, layers: data.layers, parameters: 260, linearConnections: 32, device: data.environment.device, dtype: data.dtype, selectedOperators, scope: data.scope };
  function update(shot, u, manual = false, separation = .45) {
    const s = smooth(u); if (manual) shot = 'overview';
    for (let i = 0; i < stages.length; i++) { stages[i].visible = true; stages[i].position.copy(homes[i]); stages[i].scale.setScalar(1); stages[i].rotation.set(0, 0, 0); }
    for (let i = 0; i < 8; i++) { pooled[i].position.set(0, 0, i * .23); pooled[i].scale.setScalar(1); flattened[i].position.set((i - 3.5) * .38, 0, .25); }
    for (const g of [input, conv, relu]) for (let i = 0; i < g.children.length; i++) g.children[i].position.z = i * (manual ? .08 + separation * .37 : .19);
    bases.visible = captions.visible = routes.visible = ['overview', 'resolve'].includes(shot); stencil.visible = trace.visible = false;
    let focus = v(0, -.6, .4), distance = 27, dir = v(.7, -1.6, 2.1);
    if (shot === 'convolution') {
      stages.forEach(g => g.visible = false); input.visible = conv.visible = stencil.visible = true;
      input.position.set(-2.2, 0, .1); conv.position.set(2.25, 0, .1);
      stencil.position.set(-2.2 - 1.35 + 2.7 * s, -.45 + .55 * Math.sin(Math.PI * u), .15);
      focus = v(0, 0, .7); distance = 18.5; dir = v(.55, -1.55, 1.8);
    }
    if (shot === 'activation') {
      stages.forEach(g => g.visible = false); conv.visible = relu.visible = true;
      conv.position.set(-2.2, 0, .1); relu.position.set(2.2, 0, .1); distance = 19; focus = v(0, 0, .7); dir = v(.8, -1.45, 2.1);
    }
    if (shot === 'pooling') {
      stages.forEach(g => g.visible = false); relu.visible = pool.visible = true;
      relu.position.set(-2.15, 0, 0); pool.position.set(2.2, 0, 0);
      for (let i = 0; i < 8; i++) { pooled[i].position.set(0, 0, i * .23); pooled[i].scale.set(1 + (1 - s) * 12, 1 + (1 - s) * 12, 1); }
      distance = 18; focus = v(0, 0, .7); dir = v(.65, -1.8, 1.75);
    }
    if (shot === 'flatten') {
      stages.forEach(g => g.visible = false); flat.visible = true; flat.position.set(0, 0, .3);
      for (let i = 0; i < 8; i++) flattened[i].position.set((i - 3.5) * .63 * s, 0, .22 + (i - 3.5) * .45 * (1 - s));
      distance = 11.6; focus = v(0, 0, .3); dir = v(.6, -1.5, 1.25);
    }
    if (shot === 'projection') {
      stages.forEach(g => g.visible = false); projection.visible = true; projection.position.set(0, 0, 0); projection.scale.setScalar(1.65);
      distance = 14.5; focus = v(0, 0, .25); dir = v(.1, -1.3, 2.2);
    }
    if (shot === 'operators') {
      stages.forEach(g => g.visible = false); trace.visible = true; distance = 17; focus = v(0, 0, .25); dir = v(.2, -1.15, 2.6);
    }
    if (shot === 'resolve') { distance = 27.5; dir = v(.9 - .2 * s, -1.65, 2); }
    root.updateMatrixWorld(true); return { focus, distance, dir };
  }
  return { root, update, facts };
}
