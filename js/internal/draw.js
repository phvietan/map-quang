import { myGlobal } from '../global.js';

/**
 * Internal map draw, do not care this function
 * @function
 * @param {CanvasMap} map
 */
export function _internalDraw(map) {
  // Clear screen
  map.context.fillStyle = "white";
  map.context.fillRect(map.origin.x, map.origin.y, myGlobal.sizeMapWidth/map.scale, myGlobal.sizeMapHeight/map.scale);
  map.context.drawImage(map.img, map.imgLocation.x, map.imgLocation.y, 800, 800);

  map.markers.forEach(marker => {
    map.context.translate(marker.X, marker.Y);
    map.context.scale(1/map.scale, 1/map.scale);

    map.context.drawImage(marker.img, 0, 0, 200, 200);
    map.context.scale(map.scale, map.scale);
    map.context.translate(-marker.X, -marker.Y);
  });
}
