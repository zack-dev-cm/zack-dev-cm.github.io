// Rebuild portfolio explainers from recorded shapes, authored geometry and illustration.
// Requires the existing canvas dependency and ffmpeg on PATH. No model calls.
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { pipeline } from 'node:stream/promises';
import { createCanvas, loadImage, GlobalFonts } from '@napi-rs/canvas';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const out = path.join(root, 'public/images');
const inputs = path.join(root, 'public/artifacts/project-media');
const shapes = JSON.parse(await fs.readFile(path.join(root, 'public/artifacts/agnitra-cpu-profile/shape-report.json')));
const manifest = JSON.parse(await fs.readFile(path.join(inputs, 'manifest.json')));
const annotations = JSON.parse(await fs.readFile(path.join(inputs, 'annotations.json')));
const face = await loadImage(path.join(inputs, 'dermaself-synthetic-face.png'));
const retrievalScene = await loadImage(path.join(inputs, 'retrieval-synthetic-scene.png'));
let fontRegistered = false;
for (const font of ['/System/Library/Fonts/Supplemental/Arial.ttf', '/usr/share/fonts/truetype/liberation2/LiberationSans-Regular.ttf']) {
  try { fontRegistered = Boolean(GlobalFonts.registerFromPath(font, 'Portfolio')); } catch {}
  if (fontRegistered) break;
}
if (!fontRegistered) throw new Error('Install Arial or Liberation Sans before rendering project media.');
const W = 1280, H = 720, FPS = 20, SECONDS = 12;
const canvas = createCanvas(W, H), c = canvas.getContext('2d');
const C = { bg: '#11161C', ink: '#F0F3F5', muted: '#A3AEB8', line: '#2D3945', cyan: '#97D8EA', green: '#A7DFC0', coral: '#EF9B86', lilac: '#BEB4F3' };
function text(value, x, y, size = 32, color = C.ink, weight = 400) {
  c.font = `${weight} ${size}px Portfolio, sans-serif`; c.fillStyle = color; c.fillText(value, x, y);
}
function line(x1, y1, x2, y2, color = C.line, width = 2) {
  c.strokeStyle = color; c.lineWidth = width; c.beginPath(); c.moveTo(x1, y1); c.lineTo(x2, y2); c.stroke();
}
function box(x, y, w, h, fill = C.bg, stroke = C.line, radius = 12) {
  c.beginPath(); c.roundRect(x, y, w, h, radius); c.fillStyle = fill; c.fill();
  if (stroke) { c.strokeStyle = stroke; c.lineWidth = 2; c.stroke(); }
}
function dot(x, y, r, color) { c.beginPath(); c.arc(x, y, r, 0, Math.PI * 2); c.fillStyle = color; c.fill(); }
function polygon(points, fill, stroke = C.cyan, width = 2) {
  c.beginPath(); points.forEach(([x, y], i) => i ? c.lineTo(x, y) : c.moveTo(x, y)); c.closePath();
  if (fill) { c.fillStyle = fill; c.fill('evenodd'); }
  c.strokeStyle = stroke; c.lineWidth = width; c.stroke();
}
function reset(kicker, scope, t) {
  c.clearRect(0, 0, W, H); c.fillStyle = C.bg; c.fillRect(0, 0, W, H);
  text(kicker, 48, 48, 23, C.cyan, 700); text(scope, 48, 681, 23, C.muted);
  line(48, 644, 1232, 644); line(48, 709, 48 + 1184 * (t / SECONDS), 709, C.cyan, 4);
}
function stages(labels, active) {
  const width = 1184 / labels.length;
  labels.forEach((label, i) => { dot(60 + i * width, 605, 5, i === active ? C.cyan : C.line); text(label, 78 + i * width, 614, 23, i === active ? C.ink : C.muted); });
}
const ease = x => { x = Math.max(0, Math.min(1, x)); return x * x * (3 - 2 * x); };

function tensor(x, y, channels, side = 150, flat = false) {
  for (let i = Math.min(channels, 8) - 1; i >= 0; i--) {
    const dx = i * 20, dy = -i * 12;
    polygon([[x + dx, y + dy], [x + dx + side, y + dy + 32], [x + dx + side, y + dy + (flat ? 49 : side + 32)], [x + dx, y + dy + (flat ? 17 : side)]],
      i === 0 ? '#254550' : '#182934', C.cyan, 2);
    if (!flat && i === 0) for (let g = 1; g < 6; g++) {
      line(x, y + g * side / 6, x + side, y + g * side / 6 + 32, '#507481', 1);
      line(x + g * side / 6, y + g * 32 / 6, x + g * side / 6, y + side + g * 32 / 6, '#507481', 1);
    }
  }
}
function agnitra(t) {
  const i = Math.min(4, Math.floor(t / (SECONDS / 5))), layer = shapes.layers[i];
  reset(`AGNITRA / RECORDED RUN ${shapes.package_release}`, 'Recorded tensor shapes · CPU fixture · no accuracy or speed comparison', t);
  const names = ['Convolution', 'Activation', 'Spatial pooling', 'Flatten', 'Output projection'];
  text(names[i], 48, 126, 54, C.ink, 700);
  text(layer.type, 52, 176, 30, C.cyan);
  tensor(180, 284, layer.input_shapes[0][1], 170, i >= 3);
  const shapeOut = layer.output_shapes[0];
  tensor(800, 284, shapeOut[1], shapeOut.length > 2 && shapeOut[2] === 1 ? 55 : 170, i >= 3);
  const phase = (t % 2.4) / 2.4;
  line(545, 366, 722, 366, '#547885', 3); polygon([[711, 357], [727, 366], [711, 375]], C.cyan);
  dot(548 + ease(phase) * 168, 366, 7, C.cyan);
  text('INPUT', 95, 510, 22, C.muted); text(layer.input_shapes[0].join(' × '), 95, 553, 33);
  text('OUTPUT', 740, 510, 22, C.muted); text(shapeOut.join(' × '), 740, 553, 33);
  stages(['Conv2d', 'ReLU', 'Pool', 'Flatten', 'Linear'], i);
}

function dermaself(t) {
  const i = Math.min(2, Math.floor(t / 4));
  reset('DERMASELF / CAPTURE TO ANALYSIS', 'Illustrated workflow · AI-generated synthetic face · no model predictions', t);
  c.save(); c.beginPath(); c.rect(35, 75, 655, 502); c.clip();
  c.drawImage(face, -83, 66, 886, 498);
  if (i === 0) {
    const y = 160 + ((t % 4) / 4) * 300;
    line(225, y, 565, y, '#97D8EA80', 2);
    for (const [x, y, sx, sy] of [[210, 116, 1, 1], [565, 116, -1, 1], [210, 490, 1, -1], [565, 490, -1, -1]]) {
      line(x, y, x + sx * 36, y, C.cyan, 4); line(x, y, x, y + sy * 36, C.cyan, 4);
    }
  } else {
    // Authored illustrative regions. These are deliberately not segmentation output.
    c.strokeStyle = C.cyan; c.lineWidth = 3; c.fillStyle = '#97D8EA18';
    c.beginPath(); c.ellipse(375, 143, 85, 34, .04, 0, Math.PI * 2); c.fill(); c.stroke();
    c.beginPath(); c.ellipse(290, 321, 43, 38, -.15, 0, Math.PI * 2); c.fill(); c.stroke();
    c.beginPath(); c.ellipse(465, 307, 22, 34, .15, 0, Math.PI * 2); c.fill(); c.stroke();
  }
  c.restore();
  line(700, 108, 700, 550);
  text(['Capture', 'Facial regions', 'Structured results'][i], 740, 174, 46, C.ink, 700);
  const rows = [['Guide framing', 'Check input quality', 'Capture image'], ['Locate regions', 'Prepare model input', 'Analyse texture'], ['Region masks', 'Measurements', 'Mobile / API response']][i];
  rows.forEach((row, j) => { dot(751, 265 + j * 94, 6, C.cyan); text(row, 776, 277 + j * 94, 30); });
  stages(['Guided capture', 'Region analysis', 'Usable results'], i);
}

function scene(x, y, w, h, progress = 0) {
  box(x, y, w, h, '#172732', '#375462');
  c.save(); c.beginPath(); c.rect(x + 2, y + 2, w - 4, h - 4); c.clip();
  c.drawImage(retrievalScene, x, y, w, h);
  // A scanning guide illustrates frame inspection, not a recorded model output.
  line(x + progress * w, y + 1, x + progress * w, y + h - 1, '#97D8EA90', 2);
  c.restore();
}
function retrieval(t) {
  const i = Math.min(2, Math.floor(t / 4));
  reset('MULTIMODAL VIDEO SEARCH', 'Illustrated retrieval sequence · authored scene · illustrative timestamp', t);
  text(['Read a video', 'Combine the signals', 'Return the right moment'][i], 48, 126, 50, C.ink, 700);
  scene(48, 189, 558, 313, (t % 4) / 4);
  text('“Red vehicle by a loading bay”', 48, 554, 29, C.cyan);
  const labels = ['Visual embeddings', 'Speech transcript', 'On-screen text'];
  labels.forEach((label, j) => {
    const y = 227 + j * 94, color = [C.coral, C.cyan, C.lilac][j];
    line(645, y, 697, y, i > 0 ? color : C.line, 3);
    dot(669 + Math.sin(t * 1.2 + j) * 17, y, 5, i > 0 ? color : C.line);
    text(label, 732, y + 12, 31, i > 0 ? C.ink : C.muted);
    line(732, y + 38, 1162, y + 38);
  });
  if (i === 2) {
    box(715, 504, 470, 61, '#20363C', '#6A939C');
    text('Ranked clip  →  00:18', 740, 545, 30, C.cyan, 700);
  } else text('Parallel extraction → hybrid ranking', 716, 549, 24, C.muted);
  stages(['Frames', 'ASR + OCR + vision', 'Timestamped matches'], i);
}

function roiGeometry(x, y, scale, dx, dy, color, fill = false) {
  for (const feature of annotations.features) {
    const polygons = feature.geometry.type === 'Polygon' ? [feature.geometry.coordinates] : feature.geometry.coordinates;
    for (const poly of polygons) {
      c.beginPath();
      for (const ring of poly) ring.forEach(([px, py], i) => i ? c.lineTo(x + (px + dx) * scale, y + (py + dy) * scale) : c.moveTo(x + (px + dx) * scale, y + (py + dy) * scale));
      c.closePath(); if (fill) { c.fillStyle = color + '20'; c.fill('evenodd'); }
      c.strokeStyle = color; c.lineWidth = 3; c.stroke();
    }
  }
}
function sectioncheck(t) {
  const i = Math.min(2, Math.floor(t / 4));
  reset('SECTIONCHECK / SYNTHETIC REGISTRATION REVIEW', 'Released fixture coordinates · proposed affine mapping · synthetic data only', t);
  text(['Inspect the source regions', 'Map into target coordinates', 'Review before export'][i], 48, 126, 47, C.ink, 700);
  const x = 48, y = 175, s = .73, frame = 374;
  box(x, y, frame, frame, '#15232D', '#3D5664');
  for (let g = 1; g < 8; g++) { line(x + g * frame / 8, y, x + g * frame / 8, y + frame, '#253947', 1); line(x, y + g * frame / 8, x + frame, y + g * frame / 8, '#253947', 1); }
  roiGeometry(x, y, s, 0, 0, C.cyan, true);
  const tx = manifest.transform.matrix[0][2], ty = manifest.transform.matrix[1][2];
  const progress = i === 0 ? 0 : i === 1 ? ease((t - 4) / 2.7) : 1;
  roiGeometry(x, y, s, tx * progress, ty * progress, C.coral);
  if (i > 0) for (const landmark of manifest.landmarks) {
    const [px, py] = landmark.source_level0_xy;
    line(x + px * s, y + py * s, x + (px + tx * progress) * s, y + (py + ty * progress) * s, C.muted, 1);
  }
  text('Source', 477, 229, 30, C.cyan); text('Proposed target', 477, 280, 30, C.coral);
  text(`+${tx} px`, 860, 243, 59, C.ink, 700); text('RIGHT', 866, 280, 24, C.muted);
  text(`+${ty} px`, 860, 375, 59, C.ink, 700); text('DOWN', 866, 412, 24, C.muted);
  text('2 ROIs · 3 parts · 1 hole', 477, 366, 28);
  text('Exact pixel-coordinate contract', 477, 417, 25, C.muted);
  box(474, 470, 711, 79, '#19272D', '#446271');
  text(i === 2 ? 'Explicit decision required for export' : 'Inspect geometry and source boundaries', 498, 518, 30, C.cyan);
  stages(['Source regions', 'Proposed mapping', 'Review + decision'], i);
}

function datarepo(t) {
  const i = Math.min(2, Math.floor(t / 4));
  reset('NEURALINK DATAREPO / QUERY CORRECTNESS', 'Published synthetic fixture · open PR #57 · independent contribution', t);
  text(['A predicate disappeared', 'Make null filtering explicit', 'Return the matching rows'][i], 48, 126, 50, C.ink, 700);
  text('SOURCE TABLE', 48, 189, 23, C.muted);
  const values = ['NULL', '10', 'NULL', '20'];
  values.forEach((value, j) => {
    const match = j === 0 || j === 2;
    box(48, 219 + j * 78, 456, 65, i > 0 && match ? '#20393F' : '#172129', i > 0 && match ? '#69949C' : C.line);
    text(String(j + 1), 79, 263 + j * 78, 31, C.muted);
    text(value, 226, 263 + j * 78, 31, match ? C.cyan : C.ink);
  });
  text('WHERE x IS NULL', 603, 258, 42, C.cyan, 700);
  line(604, 298, 1190, 298);
  text(i === 0 ? 'Before' : 'Expected / patched', 604, 362, 28, C.muted);
  text(i === 0 ? '[1, 2, 3, 4]' : '[1, 3]', 602, 441, 70, i === 0 ? C.coral : C.green, 700);
  text(i === 0 ? 'Unfiltered rows returned' : 'Only the two null rows', 606, 516, 31);
  stages(['Reproduce', 'Preserve predicate', 'Verify backend'], i);
}
function aac() {
  reset('AAC / SOURCE-BASED BROWSER DIAGNOSTIC', 'Synthetic fixture schematic · component methods · not an app screenshot', 0);
  text('Search and the grid disagree', 48, 133, 53, C.ink, 700);
  text('VOCABULARY LEVEL 8', 48, 187, 25, C.cyan);
  text('Visible grid', 64, 278, 38); text('Search results', 698, 278, 38);
  box(64, 322, 472, 94, '#20393F', '#69949C'); text('eight', 99, 381, 40, C.cyan);
  box(698, 322, 504, 94, '#20393F', '#69949C'); text('eight', 734, 381, 40, C.cyan);
  box(698, 436, 504, 94, '#382A2A', '#91675F'); text('ten', 734, 495, 40, C.coral);
  text('Hidden at this level', 906, 494, 25, C.coral);
  text('Released + development', 65, 579, 26, C.muted); text('Chromium + Firefox', 698, 579, 26, C.muted);
}

const previews = [
  ['agnitra-layers', agnitra, 1.1], ['dermaself-workflow', dermaself, 5.8],
  ['video-retrieval', retrieval, 9.5], ['sectioncheck-registration', sectioncheck, 8.8],
  ['datarepo-query', datarepo, 9.0]
];
const chosen = process.argv.slice(2).filter(x => !x.startsWith('--'));
const postersOnly = process.argv.includes('--posters-only');
await fs.mkdir(out, { recursive: true });
for (const [name, render, posterTime] of previews.filter(([name]) => !chosen.length || chosen.includes(name))) {
  // Keep incomplete files outside the public tree until both encoders succeed.
  const work = await fs.mkdtemp(path.join(root, 'node_modules/.project-media-'));
  try {
    const poster = `${name}-poster.png`, movieName = `${name}-preview.mp4`, gifName = `${name}-preview.gif`;
    render(posterTime); await fs.writeFile(path.join(work, poster), canvas.toBuffer('image/png'));
    if (!postersOnly) {
      const movie = path.join(work, movieName);
      const encoder = spawn('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y', '-f', 'image2pipe', '-framerate', String(FPS), '-i', '-', '-an', '-c:v', 'libx264', '-preset', 'slow', '-crf', '23', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', movie], { stdio: ['pipe', 'ignore', 'inherit'] });
      async function* frames() {
        for (let frame = 0; frame < FPS * SECONDS; frame++) {
          render(frame / FPS); yield canvas.toBuffer('image/png');
        }
      }
      try {
        const [, [code]] = await Promise.all([pipeline(frames(), encoder.stdin), once(encoder, 'close')]);
        if (code !== 0) throw new Error(`ffmpeg failed for ${name}: ${code}`);
      } finally {
        if (encoder.exitCode === null) encoder.kill();
      }
      const gif = spawn('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y', '-i', movie, '-filter_complex', 'fps=8,scale=640:-1:flags=lanczos,split[a][b];[a]palettegen=max_colors=96[p];[b][p]paletteuse=dither=bayer:bayer_scale=4', '-loop', '0', path.join(work, gifName)], { stdio: ['ignore', 'ignore', 'inherit'] });
      const [gifCode] = await once(gif, 'close'); if (gifCode !== 0) throw new Error(`GIF failed: ${name}`);
    }
    for (const filename of postersOnly ? [poster] : [poster, movieName, gifName]) {
      await fs.rename(path.join(work, filename), path.join(out, filename));
    }
    console.log(`${name}: ${postersOnly ? 'poster' : 'poster, 12-second MP4 and GIF'}`);
  } finally {
    await fs.rm(work, { recursive: true, force: true });
  }
}
if (!chosen.length || chosen.includes('aac-visibility')) { aac(); await fs.writeFile(path.join(out, 'aac-visibility-poster.png'), canvas.toBuffer('image/png')); }
