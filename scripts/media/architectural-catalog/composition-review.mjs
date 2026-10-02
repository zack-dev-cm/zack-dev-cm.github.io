import assert from 'node:assert/strict';

export function checkComposition(frame,time){
  assert(frame.canvas.height>100,'Scene has no usable height at '+time);
  assert(frame.canvas.bottom<=frame.caption.top+.5,'Caption covers the scene at '+time);
  for(const object of frame.objects){
    assert(object.depthTest!==false,'Object bypasses occlusion: '+object.name+' at '+time);
    for(const key of ['minX','maxX','minY','maxY'])assert(Number.isFinite(object[key]),'Invalid object bounds');
    assert(object.minX>-.98&&object.maxX<.98&&object.minY>-.98&&object.maxY<.98,'Scene clipping: '+object.name+' at '+time+' '+JSON.stringify(object));
  }
  return {time,objects:frame.objects.length,captionGap:frame.caption.top-frame.canvas.bottom,fade:frame.fade};
}
