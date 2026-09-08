import * as T from 'three';

export const v = (x, y, z) => new T.Vector3(x, y, z);
export const smooth = t => { t = T.MathUtils.clamp(t, 0, 1); return t * t * (3 - 2 * t); };
export const material = (color, metalness = .28, roughness = .34) => new T.MeshStandardMaterial({ color, metalness, roughness });
export function mesh(geometry, material, name) {
  const object = new T.Mesh(geometry, material);
  object.name = name; object.castShadow = true; object.receiveShadow = true;
  return object;
}
export function box(w, h, d, color, name) { return mesh(new T.BoxGeometry(w, h, d), material(color), name); }
export function point(r, color, name) { return mesh(new T.SphereGeometry(r, 16, 12), material(color, .45, .22), name); }
export function plate(w, h, d, color, name) {
  const r = Math.min(w, h) * .045, shape = new T.Shape();
  shape.moveTo(-w / 2 + r, -h / 2); shape.lineTo(w / 2 - r, -h / 2);
  shape.quadraticCurveTo(w / 2, -h / 2, w / 2, -h / 2 + r); shape.lineTo(w / 2, h / 2 - r);
  shape.quadraticCurveTo(w / 2, h / 2, w / 2 - r, h / 2); shape.lineTo(-w / 2 + r, h / 2);
  shape.quadraticCurveTo(-w / 2, h / 2, -w / 2, h / 2 - r); shape.lineTo(-w / 2, -h / 2 + r);
  shape.quadraticCurveTo(-w / 2, -h / 2, -w / 2 + r, -h / 2);
  return mesh(new T.ExtrudeGeometry(shape, { depth: d, bevelEnabled: true, bevelSize: .025, bevelThickness: .02, bevelSegments: 2, steps: 1 }), material(color), name);
}
export function label(text, color = '#d3e8da', width = 3) {
  const canvas = document.createElement('canvas'); canvas.width = 1024; canvas.height = 128;
  const ctx = canvas.getContext('2d'); ctx.fillStyle = color; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  let size = 42; ctx.font = `500 ${size}px monospace`;
  while (ctx.measureText(text).width > 960 && size > 16) ctx.font = `500 ${--size}px monospace`;
  ctx.fillText(text, 512, 64);
  const texture = new T.CanvasTexture(canvas); texture.colorSpace = T.SRGBColorSpace;
  const object = mesh(new T.PlaneGeometry(width, width / 8), new T.MeshBasicMaterial({ map: texture, transparent: true, depthWrite: false, side: T.DoubleSide }), text);
  object.castShadow = false; object.userData = { label: text }; return object;
}
export function tube(points, color, radius = .025, name = 'relationship') {
  const curve = new T.CatmullRomCurve3(points);
  return mesh(new T.TubeGeometry(curve, 36, radius, 6, false), new T.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: .18, metalness: .25, roughness: .4 }), name);
}
export function rim(w, h, color) {
  const group = new T.Group(); group.name = 'edge frame';
  for (const [x, y, a, b] of [[0, h / 2, w, .025], [0, -h / 2, w, .025], [-w / 2, 0, .025, h], [w / 2, 0, .025, h]]) {
    const edge = box(a, b, .025, color, 'frame edge'); edge.position.set(x, y, .065); group.add(edge);
  }
  return group;
}
export function gridTexture(cells, color) {
  const canvas = document.createElement('canvas'); canvas.width = canvas.height = 512;
  const ctx = canvas.getContext('2d'); ctx.fillStyle = '#' + color.toString(16).padStart(6, '0'); ctx.fillRect(0, 0, 512, 512);
  for (let i = 0; i <= cells; i++) {
    ctx.strokeStyle = i % 8 === 0 ? '#15262388' : '#213b333d'; ctx.lineWidth = i % 8 === 0 ? 2 : 1;
    ctx.beginPath(); ctx.moveTo(i / cells * 512, 0); ctx.lineTo(i / cells * 512, 512); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, i / cells * 512); ctx.lineTo(512, i / cells * 512); ctx.stroke();
  }
  const texture = new T.CanvasTexture(canvas); texture.colorSpace = T.SRGBColorSpace; texture.anisotropy = 4; return texture;
}
export function tensor(channels, spatial, color, name) {
  const group = new T.Group(); group.name = name;
  group.userData = { channels, spatial: [spatial, spatial], values: 'Shape illustration; no activation values.' };
  const texture = gridTexture(spatial, color), size = spatial * .1;
  for (let channel = 0; channel < channels; channel++) {
    const pane = new T.Group(); pane.name = `${name} / channel ${channel + 1}`;
    pane.add(box(size, size, .045, color, 'tensor slice'));
    const face = mesh(new T.PlaneGeometry(size, size), new T.MeshStandardMaterial({ map: texture, metalness: .15, roughness: .45, side: T.DoubleSide }), `${spatial} by ${spatial} grid`);
    face.position.z = .025; face.castShadow = false; pane.add(face); pane.position.z = channel * .19; group.add(pane);
  }
  return group;
}
export function tag(text, x, y, z, color, width = 3.5) {
  const object = label(text, color, width); object.position.set(x, y, z); return object;
}
