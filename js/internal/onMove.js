import { Point } from '../point';
import { CanvasMap } from '../map';
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
  const marker = _internalIsHoverMarker(e, map);
  if (marker !== null) {
    console.log(marker);
  }
}

/**
 * Internal map move, do not care this function
 * @function
 * @param {MouseEvent} event
 * @param {CanvasMap} map
 */
export function _internalOnMove(event, map) {
  event.preventDefault();

  const currentMouse = new Point(event.offsetX, event.offsetY);
  const vectorMove = map.initMovePoint.minus(currentMouse);
  map.imgLocation = map.imgLocation.minus(vectorMove);
  map.markers.forEach(marker => {
    marker.X -= vectorMove.x;
    marker.Y -= vectorMove.y;
    marker.popper.setStyle();
  });
  map.initMovePoint = currentMouse;
  map.shouldDraw = true;
}

/**
 * return the marker that we are hovering on
 * @function
 * @param {MouseEvent} event
 * @param {CanvasMap} map
 */
 export function _internalIsHoverMarker(event, map) {
  const currentMouse = new Point(event.offsetX, event.offsetY);

  let minDistance = 10000000;
  let markerRemember = null;
  for (let i = 0; i < map.markers.length; ++i) {
    const marker = map.markers[i];
    const vector = currentMouse.minus(new Point(marker.X, marker.Y));
    const distance = vector.getVal();
    if (minDistance > distance) {
      minDistance = distance;
      markerRemember = marker;
    }
  };
  if (markerRemember !== null && minDistance < markerRemember.size / 2) {
    document.getElementById("map").style.cursor = "pointer";
    return markerRemember;
  } else {
    document.getElementById("map").style.cursor = "default";
  }
  return null;
}
