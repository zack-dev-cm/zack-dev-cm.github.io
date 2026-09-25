import test from 'node:test';
import assert from 'node:assert/strict';
import { LUT, mapValue, tourFrame } from '../public/contribution-lab/lut.js';

test('the documented pydicom 8-bit LUT example wraps 256 before the proposed endpoint correction', () => {
  const result = mapValue(256);
  assert.deepEqual(LUT, [10, 20, 30, 40]);
  assert.equal(result.narrowed, 0);
  assert.equal(result.beforeIndex, 0);
  assert.equal(result.before, 10);
  assert.equal(result.afterIndex, 3);
  assert.equal(result.after, 40);
});

test('bounded controls retain in-range lookup and both endpoints for shifted first values', () => {
  for (const first of [-100, 0, 100]) {
    for (const [offset, before, after] of [[-1, 10, 10], [0, 10, 10], [1, 20, 20], [2, 30, 30], [3, 40, 40], [4, 40, 40], [255, 40, 40], [256, 10, 40], [257, 20, 40], [258, 30, 40], [259, 40, 40]]) {
      const result = mapValue(first + offset, first);
      assert.equal(result.before, before, `baseline first=${first}, offset=${offset}`);
      assert.equal(result.after, after, `proposed first=${first}, offset=${offset}`);
    }
  }
});

test('the exposed integer range always agrees with an independent saturated lookup oracle', () => {
  for (const first of [-100, 0, 100]) for (let input = -128; input <= 640; input++) {
    const expected = input <= first ? 10 : input === first + 1 ? 20 : input === first + 2 ? 30 : 40;
    assert.equal(mapValue(input, first).after, expected);
  }
  assert.throws(() => mapValue(1.5), RangeError);
  assert.throws(() => mapValue(641), RangeError);
  assert.throws(() => mapValue(0, 101), RangeError);
});

test('the tour holds the documented failure and then explains the shifted equivalent', () => {
  assert.equal(tourFrame(0).input, 2);
  assert.equal(tourFrame(10).input, 256);
  assert.equal(tourFrame(12).chapter, 2);
  assert.equal(tourFrame(12).input, 256);
  const last = tourFrame(24);
  assert.equal(last.chapter, 3);
  assert.equal(last.input, 356);
  assert.equal(last.first, 100);
  assert.equal(mapValue(last.input, last.first).after, 40);
});
