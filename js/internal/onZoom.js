// Internal: check zoom exceed limit, you do not need to care about this function Quang
function _internalCheckMaxZoom(currentScale, zoom) {
  const afterScale = currentScale * zoom;
  return afterScale > global.limitMaxZoomIn || afterScale < 1/global.limitMaxZoomOut;
}

/**
 * Internal map zoom, you do not need to care about this function Quang
 * @function
 * @param {WheelEvent} event
 * @param {CanvasMap} map
 */
function _internalOnZoom(event, map) {
  const mouse = new Point(
    event.clientX - map.canvas.offsetLeft, 
    event.clientY - map.canvas.offsetTop,  
  );

  const wheelDirection = event.deltaY < 0 ? 1 : -1;
  const zoom = Math.exp(wheelDirection * global.zoomIntensity);
  if (_internalCheckMaxZoom(map.scale, zoom)) return;

  // Translate so the visible origin is at the context's origin.
  map.context.translate(map.origin.x, map.origin.y);

  // Compute the current origin so that zoom
  map.origin.x -= mouse.x/(map.scale*zoom) - mouse.x/map.scale;
  map.origin.y -= mouse.y/(map.scale*zoom) - mouse.y/map.scale;
  map.context.scale(zoom, zoom);

  // Offset the visible origin to it's proper position.
  map.context.translate(-map.origin.x, -map.origin.y);

  // Update scale and others.
  map.scale *= zoom;
}