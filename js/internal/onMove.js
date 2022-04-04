import { Point } from '../point';

/**
 * Internal event when user is about to move, do not care this function
 * @function
 * @param {MouseEvent} e
 * @param {CanvasMap} map
 */
export function _internalOnMouseDown(e, map) {
  map.isMoving = true;
  map.initMovePoint = new Point(e.offsetX, e.offsetY);
}

export function _internalOnMouseUp(e, map) {
  map.isMoving = false;
}

/**
 * Internal map move, do not care this function
 * @function
 * @param {MouseEvent} event
 * @param {CanvasMap} map
 */
export function _internalOnMove(event, map) {
  const currentMouse = new Point(event.offsetX, event.offsetY);

  const vectorMove = map.initMovePoint.minus(currentMouse);
  map.imgLocation = map.imgLocation.minus(vectorMove);
  map.markers.forEach(marker => {
    marker.X -= vectorMove.x;
    marker.Y -= vectorMove.y;
  });
  map.initMovePoint = currentMouse;
}

/**
 * Check if is hovering on marker
 * @function
 * @param {MouseEvent} event
 * @param {CanvasMap} map
 */
 export function _internalIsHoverMarker(event, map) {
  const currentMouse = new Point(event.offsetX, event.offsetY);
  for (let i = 0; i < map.markers.length; ++i) {
    const marker = map.markers[i];
    const vector = currentMouse.minus(new Point(marker.X, marker.Y));
    const distance = vector.getVal();
    if (distance < marker.size / 2) return true;
  };
  return false;
}
