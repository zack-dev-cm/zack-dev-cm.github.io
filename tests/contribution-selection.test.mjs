import test from 'node:test';
import assert from 'node:assert/strict';
import { selectionFor, shapeText } from '../public/contribution-lab/selection.js';

test('orthogonal selections preserve empty axes and remove only scalar axes', () => {
  for (const [modes, expected, count] of [
    [['all','all','all'],[3,5,7],105],
    [['alternate','alternate','alternate'],[2,3,4],24],
    [['empty','all','all'],[0,5,7],0],
    [['all','empty','all'],[3,0,7],0],
    [['scalar','empty','all'],[0,7],0],
    [['empty','scalar','scalar'],[0],0],
    [['scalar','scalar','scalar'],[],1],
    [['empty','empty','empty'],[0,0,0],0]
  ]) { const result=selectionFor(modes);assert.deepEqual(result.shape,expected);assert.equal(result.cells.length,count); }
  assert.equal(shapeText([0]),'(0,)'); assert.equal(shapeText([]),'()');
});
test('orthogonal subset is a Cartesian product, not pairwise vector indexing', () => {
  const result=selectionFor(['alternate','alternate','scalar']);
  assert.deepEqual(result.cells,[[0,0,1],[0,2,1],[0,4,1],[2,0,1],[2,2,1],[2,4,1]]);
  assert.deepEqual(result.shape,[2,3]);
});
