// Bounded teaching fixture from netCDF4 PR #1499. This does not execute netCDF-C.
export const SHAPE = [3, 5, 7];
export function selectionFor(modes) {
  if (modes.length !== 3) throw new Error('Select exactly three axes');
  const axes = modes.map((mode, axis) => {
    const all = Array.from({ length: SHAPE[axis] }, (_, i) => i);
    switch (mode) {
      case 'all': return { indices: all, scalar: false, expression: ':' };
      case 'alternate': return { indices: all.filter(i => i % 2 === 0), scalar: false, expression: '::2' };
      case 'empty': return { indices: [], scalar: false, expression: 'EMPTY' };
      case 'scalar': return { indices: [1], scalar: true, expression: '1' };
      default: throw new Error('Unknown axis selection');
    }
  });
  const shape = axes.filter(axis => !axis.scalar).map(axis => axis.indices.length);
  const cells = [];
  for (const x of axes[0].indices) for (const y of axes[1].indices) for (const z of axes[2].indices) cells.push([x, y, z]);
  return { axes, shape, cells, expression: `data[${axes.map(a => a.expression).join(', ')}]` };
}
export const shapeText = shape => `(${shape.join(', ')}${shape.length === 1 ? ',' : ''})`;
