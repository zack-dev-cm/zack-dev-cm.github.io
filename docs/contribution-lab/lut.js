// Bounded synthetic version of the four-entry example in pydicom PR #2378.
// This is arithmetic for a teaching model, not execution of pydicom or NumPy.
export const LUT = Object.freeze([10, 20, 30, 40]);
export const INPUT_LIMITS = Object.freeze([-128, 640]);
export const FIRST_LIMITS = Object.freeze([-100, 100]);
export const DURATION = 24;
export const CHAPTERS = Object.freeze([
  { at: 0, title: 'Read the table', label: '01 · Read the table' },
  { at: 6, title: 'Cross the boundary', label: '02 · See the wrap' },
  { at: 12, title: 'Keep the endpoint', label: '03 · Preserve the endpoint' },
  { at: 18, title: 'Move the starting value', label: '04 · Shift the range' }
]);
export function mapValue(input, first = 0) {
  if (!Number.isInteger(input) || input < INPUT_LIMITS[0] || input > INPUT_LIMITS[1]) throw new RangeError('Input is outside this bounded integer lesson');
  if (!Number.isInteger(first) || first < FIRST_LIMITS[0] || first > FIRST_LIMITS[1]) throw new RangeError('First mapped input is outside this lesson');
  const offset = input - first;
  // In this bounded example input subtraction itself cannot overflow. The
  // baseline narrows nonnegative offsets to uint8 before clipping the index.
  const narrowed = input < first ? 0 : offset % 256;
  const beforeIndex = Math.min(narrowed, LUT.length - 1);
  const afterIndex = input < first ? 0 : input >= first + LUT.length ? LUT.length - 1 : offset;
  return { input, first, offset, narrowed, beforeIndex, afterIndex, before: LUT[beforeIndex], after: LUT[afterIndex], differs: beforeIndex !== afterIndex };
}
export function tourFrame(time) {
  const t = Math.min(DURATION, Math.max(0, Number.isFinite(time) ? time : 0));
  const chapter = Math.min(3, Math.floor(t / 6));
  const local = (t - chapter * 6) / 6;
  // Hold the exact failing 256 example long enough to inspect it.
  const input = chapter === 0 ? 2 : chapter === 1 ? Math.min(256, 250 + Math.floor(local * 10)) : chapter === 2 ? 256 : 356;
  return { time: t, chapter, local, input, first: chapter === 3 ? 100 : 0, flow: (t % 2.4) / 2.4 };
}
