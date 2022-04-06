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
  let found = false;
  map.markers.forEach(marker => {
    if (marker.img.complete && marker.img.naturalHeight !== 0) {
      const x = marker.X - marker.size / 2;
      const y = marker.Y - marker.size / 2;
      map.context.drawImage(marker.img, x, y, marker.size, marker.size);
    } else {
      console.log('Found a marker has not loaded, will redraw');
      found = true; // Should redraw if there is a marker has not fully loaded
    }
  });
  map.shouldDraw = found;
}
