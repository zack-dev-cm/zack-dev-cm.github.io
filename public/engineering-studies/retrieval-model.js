import * as T from 'three';
import { v, smooth, material, mesh, box, plate, point, label, tube, rim, tag } from './scene-kit.js';

const coral = 0xefaa8b, cyan = 0x82cbd9, ivory = 0xd6d9c9, dark = 0x1d303c;
function videoCard(texture, width, title) {
  const group = new T.Group(); group.name = title;
  const height = width * 9 / 16;
  group.add(plate(width + .15, height + .15, .1, dark, title + ' carrier'));
  const still = mesh(new T.PlaneGeometry(width, height), new T.MeshStandardMaterial({ map: texture, roughness: .63, metalness: 0, side: T.DoubleSide }), 'Generated illustrative still');
  still.position.z = .13; still.castShadow = false; group.add(still, rim(width + .15, height + .15, coral));
  const text = label(title, '#dcc5ad', width); text.position.set(0, -height / 2 - .34, .13); group.add(text);
  group.userData = { input: 'AI-generated still reused at authored timestamps; no private footage.' }; return group;
}
function ring(radius, color, name) { return mesh(new T.TorusGeometry(radius, .065, 12, 64), material(color, .6, .23), name); }
function card(width, height, title, color) {
  const group = new T.Group(); group.name = title; group.add(plate(width, height, .12, dark, title + ' carrier'), rim(width, height, color));
  const text = tag(title, 0, -height / 2 - .26, .1, '#a9c8ce', width + .3); group.add(text); return group;
}
export function retrievalModel(data, texture) {
  const root = new T.Group(); root.name = 'Multimodal video search / public architecture explanation';
  const input = new T.Group(); input.name = 'Illustrative video timeline';
  const frames = [];
  for (let i = 0; i < data.keyframes.length; i++) {
    const frame = videoCard(texture, 3.55, data.keyframes[i].timestamp); frame.position.set((i - 1) * .4, (i - 1) * .25, i * .34); frame.rotation.z = (i - 1) * -.08; input.add(frame); frames.push(frame);
  }
  const vision = card(2.9, 2.15, 'VISUAL EMBEDDING', cyan);
  const lens = ring(.73, cyan, 'Visual signal / illustrative lens'); lens.position.z = .36; vision.add(lens);
  const lensInner = ring(.5, ivory, 'Visual signal / inner ring'); lensInner.position.z = .5; vision.add(lensInner);
  const focus = point(.17, coral, 'Visual signal marker'); focus.position.z = .56; vision.add(focus);
  const speech = card(2.9, 2.15, 'SPEECH / ASR', coral);
  for (let i = 0; i < 17; i++) {
    const height = .16 + Math.abs(Math.sin(i * .77) * Math.cos(i * .29)) * 1.15;
    const bar = box(.09, height, .1, coral, 'Authored waveform bar ' + i); bar.position.set((i - 8) * .135, 0, .28); speech.add(bar);
  }
  const ocr = card(2.9, 2.15, 'ON-SCREEN TEXT / OCR', ivory);
  const noText = tag('NO READABLE TEXT', 0, .16, .3, '#d6d9c9', 2.45); ocr.add(noText);
  const empty = tag('IN THIS STILL', 0, -.27, .3, '#829ea8', 2.1); ocr.add(empty);
  const visualIndex = card(3.1, 2.8, 'VISUAL INDEX', cyan);
  const points = [];
  for (let i = 0; i < 12; i++) {
    const a = i / 12 * Math.PI * 2, p = point(i % 3 === 0 ? .12 : .085, i % 3 === 0 ? coral : cyan, 'Illustrative index node ' + i);
    p.position.set(Math.cos(a) * (i % 2 ? .72 : 1.02), Math.sin(a) * .95, .42 + (i % 3) * .2); visualIndex.add(p); points.push(p.position.clone());
  }
  for (let i = 0; i < points.length; i++) visualIndex.add(tube([points[i], points[i].clone().lerp(points[(i + 5) % points.length], .5).add(v(0, 0, .1)), points[(i + 5) % points.length]], cyan, .011, 'Illustrative index edge'));
  visualIndex.userData = { layout: 'Authored display graph; not computed embedding coordinates.' };
  const textIndex = card(3.1, 2.8, 'DENSE + SPARSE TEXT', coral);
  for (let i = 0; i < 3; i++) {
    const tile = plate(2.4, .5, .07, i === 1 ? coral : 0x2c4652, 'Illustrative text entry'); tile.position.set(0, (i - 1) * .69, .28 + i * .07); textIndex.add(tile);
    const text = label(['LOADING BAY', 'RED VAN', 'DELIVERY'][i], i === 1 ? '#1d303c' : '#c1d6d6', 2.05); text.position.copy(tile.position).add(v(0, 0, .095)); textIndex.add(text);
  }
  const fusion = new T.Group(); fusion.name = 'Hybrid candidate fusion and ranking';
  const fusionBase = plate(3.3, 2.1, .16, dark, 'Fusion carrier'); fusion.add(fusionBase);
  for (let i = 0; i < 3; i++) { const r = ring(.73 - i * .13, i % 2 ? cyan : coral, 'Complementary signal ring'); r.position.set(0, 0, .29 + i * .19); fusion.add(r); }
  fusion.add(tag('RETRIEVE → FUSE → RANK', 0, -1.39, .1, '#dfbeaa', 3.75));
  const result = videoCard(texture, 4.05, data.result.timestamp + ' / ILLUSTRATIVE MATCH'); result.name = 'Timestamped result / authored example';
  const query = new T.Group(); query.name = 'Authored query';
  query.add(plate(7.8, 1.3, .14, dark, 'Query card'), rim(7.8, 1.3, coral));
  query.add(tag(data.query, 0, 0, .2, '#efcab1', 7.2));
  const groups = [input, vision, speech, ocr, visualIndex, textIndex, fusion, result, query];
  const homes = [v(-4.3, 2.5, .1), v(0, 3.35, .15), v(0, .35, .15), v(0, -2.65, .15), v(4.2, 2.65, .15), v(4.2, -1.15, .15), v(.5, -5.75, .2), v(-4.25, -4.25, .2), v(0, 6.2, .35)];
  groups.forEach((group, i) => { group.position.copy(homes[i]); root.add(group); });
  const connections = new T.Group(); connections.name = 'Documented data flow / illustrative timing';
  const edges = [[0, 1, cyan], [0, 2, coral], [0, 3, ivory], [1, 4, cyan], [2, 5, coral], [3, 5, ivory], [4, 6, cyan], [5, 6, coral], [6, 7, coral]];
  const traces = [];
  for (const [a, b, color] of edges) {
    const start = homes[a].clone().add(v(0, 0, -.01)), end = homes[b].clone().add(v(0, 0, -.01));
    const middle = start.clone().lerp(end, .5); middle.z = -.5;
    connections.add(tube([start, middle, end], color, .026, `${groups[a].name} to ${groups[b].name}`));
    const marker = point(.065, color, 'Illustrative data-flow tracer'); connections.add(marker); traces.push({ marker, curve: new T.CatmullRomCurve3([start, middle, end]) });
  }
  root.add(connections);
  const rest = new Map(); for (const group of [vision, speech, ocr, visualIndex, textIndex, fusion]) group.children.forEach((object, i) => rest.set(object, { z: object.position.z, index: i }));
  const facts = { architecture: data.architecture, query: data.query, keyframes: data.keyframes, result: data.result, fixtureKind: data.kind, missingOcr: true, scope: data.scope };
  function update(shot, u, manual = false, separation = .4) {
    const s = smooth(u); if (manual) shot = 'overview';
    groups.forEach((group, i) => { group.position.copy(homes[i]); group.scale.setScalar(1); group.rotation.set(0, 0, 0); group.visible = true; });
    for (let i = 0; i < frames.length; i++) { frames[i].position.set((i - 1) * .4, (i - 1) * .25, i * .34); frames[i].rotation.z = (i - 1) * -.08; }
    for (const [object, restPose] of rest) object.position.z = restPose.z + (manual ? separation * .075 * restPose.index : 0);
    query.visible = false; connections.visible = ['overview', 'resolve'].includes(shot);
    for (let i = 0; i < traces.length; i++) traces[i].marker.position.copy(traces[i].curve.getPoint((u + i * .13) % 1));
    let center = v(0, -.3, .35), distance = 31, dir = v(.65, -1.5, 2.2);
    if (shot === 'frames') {
      groups.forEach(g => g.visible = false); input.visible = true; input.position.set(0, 0, .1);
      for (let i = 0; i < frames.length; i++) { frames[i].position.set((i - 1) * (2.4 + s * 1.55), (i - 1) * .18, (i === 1 ? .6 : 0)); frames[i].rotation.z = 0; }
      distance = 21; center = v(0, 0, .4); dir = v(.45, -1.15, 2.1);
    }
    if (shot === 'signals') {
      groups.forEach(g => g.visible = false); [vision, speech, ocr].forEach((g, i) => { g.visible = true; g.position.set((i - 1) * 3.45, 0, .15 + (i === 1 ? .45 * s : 0)); });
      distance = 20.5; center = v(0, -.2, .4); dir = v(.3, -1.5, 2.2);
    }
    if (shot === 'indexes') {
      groups.forEach(g => g.visible = false); visualIndex.visible = textIndex.visible = true;
      visualIndex.position.set(-2.1, 0, 0); textIndex.position.set(2.1, 0, 0); distance = 16.5; center = v(0, -.2, .4); dir = v(.55, -1.5, 2);
    }
    if (shot === 'query') {
      groups.forEach(g => g.visible = false); query.visible = visualIndex.visible = textIndex.visible = true;
      query.position.set(0, 2.6, .4); visualIndex.position.set(-2.2, -1.4, 0); textIndex.position.set(2.2, -1.4, 0);
      distance = 20; center = v(0, .3, .3); dir = v(.2, -1.3, 2.35);
    }
    if (shot === 'fusion') {
      groups.forEach(g => g.visible = false); visualIndex.visible = textIndex.visible = fusion.visible = true;
      visualIndex.position.set(-2.25, 1.75, .15); textIndex.position.set(2.25, 1.75, .15); fusion.position.set(0, -2.05, .2);
      distance = 20; center = v(0, -.1, .3); dir = v(.5, -1.5, 2.2);
    }
    if (shot === 'result') {
      groups.forEach(g => g.visible = false); result.visible = true; result.position.set(0, 0, .2); result.scale.setScalar(1.6);
      distance = 15; center = v(0, -.15, .4); dir = v(.2, -1.05, 2.55);
    }
    if (shot === 'resolve') dir = v(.8 - .2 * s, -1.55, 2.1);
    root.updateMatrixWorld(true); return { focus: center, distance, dir };
  }
  return { root, update, facts };
}
