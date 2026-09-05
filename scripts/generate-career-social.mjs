import { createCanvas } from '@napi-rs/canvas';
import { writeFile } from 'node:fs/promises';

// A typographic share card. It depicts identity and disciplines, not product UI.
const canvas = createCanvas(1200, 630);
const ctx = canvas.getContext('2d');
ctx.fillStyle = '#090c10';
ctx.fillRect(0, 0, 1200, 630);
ctx.fillStyle = '#a5e4df';
ctx.fillRect(64, 66, 56, 5);
ctx.font = '500 20px sans-serif';
ctx.fillText('APPLIED MACHINE LEARNING', 64, 112);
ctx.fillStyle = '#f1f5f6';
ctx.font = '700 72px sans-serif';
ctx.fillText('Zakhar Pashkin', 60, 237);
ctx.font = '500 34px sans-serif';
ctx.fillText('Senior ML Engineer', 64, 300);
ctx.strokeStyle = '#29353e';
ctx.beginPath(); ctx.moveTo(64, 362); ctx.lineTo(1136, 362); ctx.stroke();
ctx.fillStyle = '#b0c0cb';
ctx.font = '400 26px sans-serif';
ctx.fillText('Computer vision  /  Document AI  /  Agentic systems', 64, 418);
ctx.font = '400 22px sans-serif';
ctx.fillText('From R&D to maintained products.', 64, 462);
ctx.fillStyle = '#a5e4df';
ctx.font = '500 20px sans-serif';
ctx.fillText('zack-dev-cm.github.io', 64, 556);
await writeFile(new URL('../public/images/portfolio-social-card-ml-ai-products.png', import.meta.url), canvas.toBuffer('image/png'));
