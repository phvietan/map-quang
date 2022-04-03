import { myGlobal } from '../global.js';

// Internal: check zoom exceed limit, do not care this function
function _internalCheckMaxZoom(currentScale, zoom) {
  const afterScale = currentScale * zoom;
  return afterScale > myGlobal.limitMaxZoomIn || afterScale < 1/myGlobal.limitMaxZoomOut;
}

/**
 * Internal map zoom, do not care this function
 * @function
 * @param {WheelEvent} event
 * @param {CanvasMap} map
 */
export function _internalOnZoom(event, map) {
  const mouse = new Point(
    event.clientX - map.canvas.offsetLeft,
    event.clientY - map.canvas.offsetTop,
  );

  const wheelDirection = event.deltaY < 0 ? 1 : -1;
  const zoom = Math.exp(wheelDirection * myGlobal.zoomIntensity);
  if (_internalCheckMaxZoom(map.scale, zoom)) return;

  // Translate so the visible origin is at the context's origin.
  map.context.translate(map.origin.x, map.origin.y);

  // Compute the current origin so that zoom
  map.origin.x -= mouse.x/(map.scale*zoom) - mouse.x/map.scale;
  map.origin.y -= mouse.y/(map.scale*zoom) - mouse.y/map.scale;
  map.context.scale(zoom, zoom);

  // Offset the visible origin to it's proper position.
  map.context.translate(-map.origin.x, -map.origin.y);

  // Update scale
  map.scale *= zoom;
}
