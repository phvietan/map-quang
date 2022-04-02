/**
 * Internal event when user is about to move
 * @function
 * @param {MouseEvent} e
 * @param {CanvasMap} map
 */
function _internalOnMouseDown(e, map) {
  map.isMoving = true;
  map.initMovePoint = new Point(
    e.clientX - map.canvas.offsetLeft, 
    e.clientY - map.canvas.offsetTop,  
  );
}

/**
 * Internal map move
 * @function
 * @param {MouseEvent} event
 * @param {CanvasMap} map
 */
function _internalOnMove(event, map) {
  const currentMouse = new Point(
    event.clientX - map.canvas.offsetLeft, 
    event.clientY - map.canvas.offsetTop,  
  );
  const vectorMove = map.initMovePoint.minus(currentMouse).multiply(1/map.scale);
  map.imgLocation = map.imgLocation.minus(vectorMove);
  map.initMovePoint = currentMouse;
}