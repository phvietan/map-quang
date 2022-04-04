import { myGlobal } from '../global.js';
import { CanvasMap } from '../map'
import { Point } from '../point.js';

// Internal: check zoom exceed limit, do not care this function
function _internalCheckMaxZoom(currentScale, zoom) {
  const afterScale = currentScale * zoom;
  return afterScale > myGlobal.limitMaxZoomIn || afterScale < 1/myGlobal.limitMaxZoomOut;
}

function translateAfterZoom(beforePoint, mouse, zoom) {
  return new Point(
    mouse.x - zoom * (mouse.x - beforePoint.x),
    mouse.y - zoom * (mouse.y  - beforePoint.y),
  )
}

/**
 * Internal map zoom, do not care this function
 * @function
 * @param {WheelEvent} event
 * @param {CanvasMap} map
 */
export function _internalOnZoom(event, map) {
  const mouse = new Point(event.offsetX, event.offsetY);

  const wheelDirection = event.deltaY < 0 ? 1 : -1;
  const zoom = Math.exp(wheelDirection * myGlobal.zoomIntensity);
  if (_internalCheckMaxZoom(map.scale, zoom)) return;

  map.imgLocation = translateAfterZoom(map.imgLocation, mouse, zoom);
  map.markers.forEach(marker => {
    const newMarkerPoint = translateAfterZoom(
      new Point(marker.X, marker.Y),
      mouse,
      zoom,
    );
    marker.X = newMarkerPoint.x;
    marker.Y = newMarkerPoint.y;
  });
  map.scale *= zoom;
}
