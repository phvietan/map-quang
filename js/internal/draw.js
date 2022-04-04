import { myGlobal } from '../global.js';
import { CanvasMap } from '../map';

/**
 * Internal map draw, do not care this function
 * @function
 * @param {CanvasMap} map
 */
export function _internalDraw(map) {
  // Clear screen
  const x = -20000;
  const y = -20000;
  const w = 40000;
  const h = 40000;

  map.context.fillStyle = "white";
  map.context.fillRect(x, y, w, h);
  map.context.drawImage(
    map.img,
    map.imgLocation.x,
    map.imgLocation.y,
    map.img.width * map.scale,
    map.img.height * map.scale,
  );
  map.markers.forEach(marker => {
    const x = marker.X - marker.size / 2;
    const y = marker.Y - marker.size / 2;
    map.context.drawImage(marker.img, x, y, marker.size, marker.size);
  });
}
