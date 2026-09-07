export function sampleAt(run, seconds) {
  if (!Number.isFinite(seconds)) throw Error('Replay time must be finite');
  const frames = run.frames;
  let low = 0, high = frames.length - 1;
  while (low < high) {
    const middle = Math.floor((low + high) / 2);
    if (frames[middle].t < seconds) low = middle + 1;
    else high = middle;
  }
  if (low > 0 && Math.abs(frames[low - 1].t - seconds) <= Math.abs(frames[low].t - seconds)) low--;
  return {frame: frames[low], index: low};
}

export function validateRun(run) {
  const finite = values => Array.isArray(values) && values.every(Number.isFinite);
  if (!run.assembly || !run.frames?.length || !run.terrain?.length || run.engine?.name !== 'pychrono') throw Error('Recorded Chrono model is incomplete');
  const names = Object.keys(run.assembly);
  if (names.length !== run.summary.dynamic_body_count || run.summary.physical_validation !== false || run.summary.production_release !== false) throw Error('Recorded model scope changed');
  let previous = -Infinity;
  for (const frame of run.frames) {
    if (!Number.isFinite(frame.t) || frame.t <= previous || !Number.isFinite(frame.speed_m_s)) throw Error('Invalid recorded sample grid');
    previous = frame.t;
    if (Object.keys(frame.bodies).length !== names.length) throw Error('Recorded body inventory changed');
    for (const name of names) {
      const pose = frame.bodies[name];
      if (!finite(pose) || pose.length !== 7 || Math.abs(Math.hypot(...pose.slice(3)) - 1) > 1e-5) throw Error('Invalid recorded pose: ' + name);
    }
    if (!finite(frame.wheel_heave_m) || frame.wheel_heave_m.length !== 4 || !Number.isFinite(frame.roll_deg) || !Number.isFinite(frame.linear_speed_m_s) || frame.linear_speed_m_s < 0 || !Number.isFinite(frame.column_command_deg) || typeof frame.braking !== 'boolean') throw Error('Invalid recorded telemetry');
    for (const value of Object.values(frame.contact_force_n)) if (!finite(value) || value.length !== 3) throw Error('Invalid recorded contact force');
  }
  if (Math.abs(previous - run.summary.duration_s) > 1e-8 || run.frames.length !== run.summary.sample_count) throw Error('Incomplete recorded run');
  return run;
}

export async function readPinned(path, expected) {
  const response = await fetch(path);
  if (!response.ok) throw Error('Motion asset unavailable: ' + path);
  const bytes = await response.arrayBuffer();
  const hash = Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', bytes)), n => n.toString(16).padStart(2, '0')).join('');
  if (hash !== expected) throw Error('Motion asset changed: ' + path);
  return bytes;
}
