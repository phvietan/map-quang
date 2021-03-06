import { Point } from '../point';
import { CanvasMap } from '../map';
import { Popper } from '../popper';

/**
 * Internal event when user on mouse down
 * @function
 * @param {MouseEvent} e
 * @param {CanvasMap} map
 */
export function _internalOnMouseDown(e, map) {
  map.isMoving = true;
  map.initMovePoint = new Point(e.offsetX, e.offsetY);
  map.mouseDownPoint = new Point(e.clientX, e.clientY);
}

/**
 * Internal event when user release mouse click
 * @function
 * @param {MouseEvent} e
 * @param {CanvasMap} map
 */
export function _internalOnMouseUp(e, map) {
  e.preventDefault();
  if (!map.isMoving) return; // Edge case: has not click down
  map.isMoving = false;

  // If it is click
  if (map.mouseDownPoint.isEqual(new Point(e.clientX, e.clientY))) {

    // If is moving marker
    if (map.movingMarker) {
      const idx = map.markers.findIndex((mark) => mark.id == map.movingMarker.id);
      if (idx !== -1) {
        map.markers[idx].X = e.offsetX;
        map.markers[idx].Y = e.offsetY;
        map.markers[idx].popper.constructHtml(); // Construct new html because offset X Y has changed
        const realPoint = map.markers[idx].getRealPoint();
        window.afterMoveMarker(map.markers[idx], realPoint.x, realPoint.y);
        map.shouldDraw = true;
      }
      map.movingMarker = null;
      return;
    }

    // If click on a marker
    const marker = _internalIsHoverMarker(e, map);
    if (marker !== null && map.notShowMarkerId !== marker.id) {
      marker.isSelecting = !marker.isSelecting;
      if (!marker.isSelecting) {
        map.notShowMarkerId = marker.id;
        marker.popper.show(false);
      }
    } else { // Click on a empty space
      map.markers.forEach(marker => {
        marker.isSelecting = false;
        marker.popper.show(false);
      });
    }
  }
}

/**
 * Internal event when user move mouse around in canvas (not moving)
 * @function
 * @param {MouseEvent} e
 * @param {CanvasMap} map
 */
export function _internalOnMouseMove(e, map) {
  e.preventDefault();
  if (map.movingMarker !== null) {
    const idx = map.markers.findIndex((mark) => mark.id == map.movingMarker.id);
    if (idx !== -1) {
      map.markers[idx].X = e.offsetX;
      map.markers[idx].Y = e.offsetY;
      map.shouldDraw = true;
    }
  } else {
    const mark = _internalIsHoverMarker(e, map)
    if (mark !== null) {
      if (mark.id !== map.notShowMarkerId) {
        mark.popper.show(true);
      }
    } else {
      map.notShowMarkerId = null;
      map.markers.forEach((marker) => {
        marker.popper.show(marker.isSelecting);
      });
    }
  }
}

/**
 * Internal map move
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
