import { myGlobal } from '../global.js';

/**
 * Internal map draw, do not care this function
 * @function
 * @param {CanvasMap} map
 */
export function _internalDraw(map) {
  // Clear screen
  // const x = -myGlobal.sizeMapWidth / map.scale;
  // const y = -myGlobal.sizeMapHeight / map.scale
  // const w = myGlobal.sizeMapWidth / map.scale * 2;
  // const h = myGlobal.sizeMapHeight / map.scale * 2;
  const x = -10000;
  const y = -10000;
  const w = 20000;
  const h = 20000;

  map.context.fillStyle = "white";
  map.context.fillRect(x, y, w, h);
  map.context.drawImage(map.img, map.imgLocation.x, map.imgLocation.y);

  map.markers.forEach(marker => {

    const deltaX = marker.X - map.imgLocation.x;
    const deltaY = marker.Y - map.imgLocation.y;
    const x = deltaX * map.scale + map.imgLocation.x;
    const y = deltaY * map.scale + map.imgLocation.y;

    map.context.translate(x, y);
    map.context.scale(1/map.scale, 1/map.scale);
    map.context.drawImage(marker.img, 0, 0, 100, 100);
    map.context.scale(map.scale, map.scale);
    map.context.translate(-x, -y);
  });
}
