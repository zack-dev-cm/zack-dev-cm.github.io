export const DURATION = 36;
export const CHAPTERS = [
  { at: 0, label: 'Two neighboring pixels', title: 'Start on the output grid.', copy: 'Reprojection asks which source value belongs at each output pixel. Both forward mappings are finite in this regression.' },
  { at: 6, label: 'A valid return', title: 'Pixel 0 comes back.', copy: 'Output pixel (0, 0) maps to source pixel (0, 0) and returns to (0, 0). Its value 1 and footprint 1 stay intact.' },
  { at: 12, label: 'The inverse is undefined', title: 'Pixel 1 loses its way back.', copy: 'Output pixel (1, 0) maps forward to source pixel (1, 0). The inverse returns (NaN, 0), so there is no finite return point to plot.' },
  { at: 19, label: 'The old check', title: 'NaN slips past the comparison.', copy: 'The old check only asks whether the round-trip distance exceeds one pixel. abs(NaN − 1) > 1 is false. Value 2 survives with footprint 1.' },
  { at: 26, label: 'The proposed correction', title: 'Check that the inverse is finite.', copy: 'The added finiteness check rejects the undefined return. Pixel 1 becomes NaN with footprint 0; the valid neighbor keeps value 1.' },
  { at: 32, label: 'Inspect the result', title: 'A valid neighbor stays valid.', copy: 'The recorded proposed output is [1, NaN], with footprint [1, 0]. Inspect either pixel and switch between the two versions.' }
];

export function guidedState(seconds) {
  const time = Math.min(DURATION, Math.max(0, Number(seconds) || 0));
  const chapter = CHAPTERS.reduce((index, item, next) => time >= item.at ? next : index, 0);
  return { time, chapter, pixel: time < 12 ? 0 : 1, mode: time < 26 ? 'baseline' : 'proposed' };
}

export function inspectPixel(fixture, mode, pixel) {
  if (!['baseline', 'proposed'].includes(mode) || ![0, 1].includes(pixel)) throw Error('Unknown fixture selection');
  const version = fixture[mode];
  return { ...version.pixels[pixel], value: version.output[0][pixel], footprint: version.footprint[0][pixel] };
}
