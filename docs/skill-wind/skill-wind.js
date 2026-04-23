const windStage = document.getElementById('wind-stage');
const canvas = document.getElementById('wind-canvas');
const labelsRoot = document.getElementById('wind-labels');
const constellationRoot = document.getElementById('wind-constellation');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

const coverMode = new URLSearchParams(window.location.search).has('cover');
document.body.classList.toggle('is-cover-capture', coverMode);

const acts = [
  {
    name: 'embodied',
    warm: 1,
    cool: 0.18,
    fracture: 0.22,
    vessel: 0.08,
    words: ['care', 'memory', 'doubt', 'repair'],
  },
  {
    name: 'rupture',
    warm: 0.92,
    cool: 0.54,
    fracture: 1,
    vessel: 0.22,
    words: ['grief', 'duty', 'mercy', 'patience'],
  },
  {
    name: 'threshold',
    warm: 0.48,
    cool: 0.78,
    fracture: 0.72,
    vessel: 0.46,
    words: ['attention', 'retrieval', 'reflection', 'synthesis'],
  },
  {
    name: 'vessel',
    warm: 0.24,
    cool: 1,
    fracture: 0.36,
    vessel: 1,
    words: ['agency', 'boundary', 'memory', 'meaning'],
  },
];

let activeAct = -1;

const setAct = (index) => {
  if (!windStage || index === activeAct) return;
  activeAct = index;
  windStage.dataset.act = String(index);
  windStage.setAttribute('aria-label', `Animated portfolio cover, ${acts[index].name} act`);
  renderLabels(index);
};

const seededRandom = (seed) => {
  let state = seed >>> 0;
  return () => {
    state += 0x6d2b79f5;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
};

const renderConstellation = () => {
  if (!constellationRoot) return;
  const rand = seededRandom(7241);
  const fragments = Array.from({ length: 30 }, (_, index) => {
    const cluster = index % 5;
    const baseX = cluster < 2 ? 18 + rand() * 24 : cluster < 4 ? 39 + rand() * 26 : 71 + rand() * 16;
    const baseY = cluster < 2 ? 25 + rand() * 48 : 16 + rand() * 66;
    return {
      x: `${baseX.toFixed(2)}%`,
      y: `${baseY.toFixed(2)}%`,
      size: `${(2.5 + rand() * 4.5).toFixed(2)}px`,
      alpha: (0.36 + rand() * 0.5).toFixed(2),
      duration: `${(8 + rand() * 8).toFixed(2)}s`,
      delay: `${(-rand() * 8).toFixed(2)}s`,
    };
  });

  constellationRoot.innerHTML = '';
  for (const fragment of fragments) {
    const node = document.createElement('i');
    node.style.setProperty('--x', fragment.x);
    node.style.setProperty('--y', fragment.y);
    node.style.setProperty('--size', fragment.size);
    node.style.setProperty('--alpha', fragment.alpha);
    node.style.setProperty('--duration', fragment.duration);
    node.style.setProperty('--delay', fragment.delay);
    constellationRoot.appendChild(node);
  }
};

const labelPositions = [
  [
    { top: 13, left: 12 },
    { top: 25, left: 24 },
    { top: 42, left: 33 },
    { top: 57, left: 42 },
  ],
  [
    { top: 11, left: 14 },
    { top: 19, left: 44 },
    { top: 40, left: 56 },
    { top: 56, left: 71 },
  ],
  [
    { top: 14, left: 48 },
    { top: 28, left: 61 },
    { top: 46, left: 69 },
    { top: 62, left: 52 },
  ],
  [
    { top: 12, left: 68 },
    { top: 27, left: 75 },
    { top: 45, left: 63 },
    { top: 60, left: 78 },
  ],
];

const renderLabels = (actIndex) => {
  if (!labelsRoot) return;
  const labels = acts[actIndex].words.map((text) => ({
    text,
    kind: actIndex < 2 ? 'human' : 'ai',
  }));

  labelsRoot.innerHTML = '';
  labels.forEach((item, index) => {
    const label = document.createElement('span');
    const position = labelPositions[actIndex][index];

    label.className = `cover-stage__label cover-stage__label--${item.kind}`;
    label.textContent = item.text;
    label.style.top = `${position.top}%`;
    label.style.left = `${position.left}%`;
    label.style.setProperty('--duration', `${14 + index * 1.6}s`);
    label.style.setProperty('--delay', `${index * -1.2}s`);
    labelsRoot.appendChild(label);
  });
};

if (windStage) {
  const resetPointer = () => {
    windStage.style.setProperty('--pointer-x', '0px');
    windStage.style.setProperty('--pointer-y', '0px');
  };

  windStage.addEventListener('pointermove', (event) => {
    const rect = windStage.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width - 0.5) * 18;
    const y = ((event.clientY - rect.top) / rect.height - 0.5) * 14;
    windStage.style.setProperty('--pointer-x', `${x}px`);
    windStage.style.setProperty('--pointer-y', `${y}px`);
  });

  windStage.addEventListener('pointerleave', resetPointer);
}

renderConstellation();
setAct(0);

if (canvas && windStage && !reduceMotion.matches) {
  const context = canvas.getContext('2d', { alpha: true });
  const rand = seededRandom(1987);

  const ribbons = Array.from({ length: 18 }, (_, index) => ({
    y: 0.13 + index * 0.045,
    amplitude: 10 + index * 1.9,
    frequency: 0.72 + index * 0.055,
    speed: 0.00018 + index * 0.000018,
    width: 0.65 + index * 0.12,
    warm: index % 4 === 0 || index % 7 === 0,
    phase: rand() * Math.PI * 2,
  }));

  const createParticle = () => ({
    progress: rand(),
    lane: rand(),
    speed: 0.0001 + rand() * 0.00026,
    size: 1.4 + rand() * 4.4,
    arc: 10 + rand() * 42,
    phase: rand() * Math.PI * 2,
    warm: rand() > 0.48,
    alpha: 0.18 + rand() * 0.48,
  });

  const particles = Array.from({ length: 96 }, createParticle);
  const nodes = Array.from({ length: 34 }, () => ({
    x: 0.66 + rand() * 0.23,
    y: 0.19 + rand() * 0.62,
    radius: 1.1 + rand() * 2.8,
    phase: rand() * Math.PI * 2,
    alpha: 0.24 + rand() * 0.52,
  }));

  const textFragments = ['care', 'doubt', 'mercy', 'repair', 'boundary', 'meaning', 'memory'];

  const resize = () => {
    const dpr = window.devicePixelRatio || 1;
    const rect = windStage.getBoundingClientRect();
    const width = Math.max(1, Math.round(rect.width * dpr));
    const height = Math.max(1, Math.round(rect.height * dpr));
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    }
    context.setTransform(dpr, 0, 0, dpr, 0, 0);
  };

  const drawRibbon = (ribbon, width, height, time, act) => {
    const y = height * ribbon.y;
    const colorA = ribbon.warm ? `rgba(240, 171, 118, ${0.08 + act.warm * 0.13})` : `rgba(160, 236, 255, ${0.08 + act.cool * 0.12})`;
    const colorB = ribbon.warm ? `rgba(160, 236, 255, ${0.06 + act.cool * 0.1})` : `rgba(240, 171, 118, ${0.06 + act.warm * 0.08})`;
    const gradient = context.createLinearGradient(0, y, width, y);
    gradient.addColorStop(0, 'rgba(243, 236, 223, 0)');
    gradient.addColorStop(0.16, colorA);
    gradient.addColorStop(0.5, `rgba(243, 236, 223, ${0.08 + act.fracture * 0.12})`);
    gradient.addColorStop(0.84, colorB);
    gradient.addColorStop(1, 'rgba(243, 236, 223, 0)');

    context.beginPath();
    for (let step = 0; step <= 64; step += 1) {
      const progress = step / 64;
      const x = progress * width;
      const thresholdPull = Math.exp(-Math.pow(progress - 0.47, 2) * 18) * act.fracture * 20;
      const wave = Math.sin(progress * Math.PI * ribbon.frequency * 2 + time * ribbon.speed * 4200 + ribbon.phase) * ribbon.amplitude;
      const sway = Math.cos(progress * Math.PI * 4.4 + time * ribbon.speed * 1800) * (ribbon.amplitude * 0.34);
      const nextY = y + wave + sway - thresholdPull + Math.sin(time * ribbon.speed * 1200 + step) * 2;
      if (step === 0) context.moveTo(x, nextY);
      else context.lineTo(x, nextY);
    }

    context.lineWidth = ribbon.width * (1 + act.fracture * 0.5);
    context.strokeStyle = gradient;
    context.stroke();
  };

  const particleY = (particle, width, height, time, act) => {
    const base = height * (0.16 + particle.lane * 0.62);
    const sweep = Math.sin(time * 0.0014 + particle.phase + particle.progress * 5) * particle.arc;
    const pinch = Math.sin(particle.progress * Math.PI * 2 + time * 0.00044) * (7 + act.fracture * 9);
    return base + sweep + pinch + (0.5 - particle.lane) * (width > 860 ? 24 : 11);
  };

  const drawParticles = (width, height, time, act) => {
    particles.forEach((particle) => {
      particle.progress += particle.speed * (width > 900 ? 1.2 : 0.86) * (1 + act.fracture * 0.55);
      if (particle.progress > 1.08) {
        Object.assign(particle, createParticle(), { progress: -0.05 });
      }

      const x = particle.progress * width;
      const y = particleY(particle, width, height, time, act);
      const glow = particle.size * (4.8 + act.fracture * 2.6);
      const color = particle.warm ? '240,171,118' : '160,236,255';
      const alpha = particle.alpha * (particle.warm ? act.warm : act.cool);

      const gradient = context.createRadialGradient(x, y, 0, x, y, glow);
      gradient.addColorStop(0, `rgba(${color}, ${alpha})`);
      gradient.addColorStop(1, `rgba(${color}, 0)`);

      context.beginPath();
      context.fillStyle = gradient;
      context.arc(x, y, glow, 0, Math.PI * 2);
      context.fill();
    });
  };

  const drawFaultLine = (width, height, time, act) => {
    const x = width * (0.43 + Math.sin(time * 0.00034) * 0.01);
    const gradient = context.createLinearGradient(x - 80, 0, x + 120, height);
    gradient.addColorStop(0, 'rgba(243, 236, 223, 0)');
    gradient.addColorStop(0.42, `rgba(255, 226, 184, ${0.08 + act.fracture * 0.26})`);
    gradient.addColorStop(0.58, `rgba(160, 236, 255, ${0.08 + act.cool * 0.18})`);
    gradient.addColorStop(1, 'rgba(243, 236, 223, 0)');

    context.save();
    context.globalCompositeOperation = 'lighter';
    context.beginPath();
    context.moveTo(x - 26, height * 0.08);
    context.bezierCurveTo(x + 42, height * 0.25, x - 44, height * 0.43, x + 24, height * 0.58);
    context.bezierCurveTo(x + 70, height * 0.71, x - 18, height * 0.82, x + 38, height * 0.96);
    context.lineWidth = 2 + act.fracture * 6;
    context.strokeStyle = gradient;
    context.shadowColor = `rgba(255, 226, 184, ${0.12 + act.fracture * 0.32})`;
    context.shadowBlur = 32;
    context.stroke();
    context.restore();
  };

  const drawVessel = (width, height, time, act) => {
    if (act.vessel <= 0.04) return;
    context.save();
    context.globalCompositeOperation = 'lighter';
    nodes.forEach((node, index) => {
      const x = width * node.x + Math.sin(time * 0.0007 + node.phase) * 8;
      const y = height * node.y + Math.cos(time * 0.00064 + node.phase) * 7;
      const alpha = node.alpha * act.vessel;

      context.beginPath();
      context.fillStyle = `rgba(160, 236, 255, ${alpha})`;
      context.arc(x, y, node.radius * (1 + act.vessel * 0.7), 0, Math.PI * 2);
      context.fill();

      if (index % 3 === 0) {
        const linked = nodes[(index + 7) % nodes.length];
        const x2 = width * linked.x + Math.sin(time * 0.0007 + linked.phase) * 8;
        const y2 = height * linked.y + Math.cos(time * 0.00064 + linked.phase) * 7;
        const distance = Math.hypot(x - x2, y - y2);
        if (distance < width * 0.22) {
          context.beginPath();
          context.moveTo(x, y);
          context.lineTo(x2, y2);
          context.strokeStyle = `rgba(160, 236, 255, ${0.05 * act.vessel})`;
          context.lineWidth = 1;
          context.stroke();
        }
      }
    });
    context.restore();
  };

  const drawMemoryWords = (width, height, time, act) => {
    if (width < 540) return;
    context.save();
    context.globalCompositeOperation = 'screen';
    context.font = '700 11px Avenir Next, Helvetica Neue, sans-serif';
    context.textBaseline = 'middle';

    textFragments.forEach((word, index) => {
      const progress = (time * 0.00003 + index * 0.141) % 1;
      const x = width * (0.2 + progress * 0.5);
      const y = height * (0.22 + ((index * 0.119) % 0.52)) + Math.sin(time * 0.001 + index) * 10;
      const alpha = (0.1 + act.fracture * 0.16) * (1 - Math.abs(progress - 0.5));
      context.fillStyle = index % 2 === 0 ? `rgba(240, 171, 118, ${alpha})` : `rgba(160, 236, 255, ${alpha})`;
      context.fillText(word, x, y);
    });

    context.restore();
  };

  const draw = (time) => {
    const cycleMs = coverMode ? 18000 : 16000;
    const cycleProgress = (time % cycleMs) / cycleMs;
    const actIndex = Math.min(acts.length - 1, Math.floor(cycleProgress * acts.length));
    setAct(actIndex);

    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const act = acts[activeAct];

    context.clearRect(0, 0, width, height);
    context.globalCompositeOperation = 'lighter';

    ribbons.forEach((ribbon) => drawRibbon(ribbon, width, height, time, act));
    drawFaultLine(width, height, time, act);
    drawParticles(width, height, time, act);
    drawVessel(width, height, time, act);
    drawMemoryWords(width, height, time, act);

    context.globalCompositeOperation = 'source-over';
    requestAnimationFrame(draw);
  };

  resize();
  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(windStage);
  window.addEventListener('resize', resize);
  requestAnimationFrame(draw);
} else {
  setAct(1);
}
