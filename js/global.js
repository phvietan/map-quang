export const myGlobal = {
  windowWidth: window.innerWidth,
  windowHeight: window.innerHeight,

  sizeMapWidth: window.innerWidth * 85 / 100,
  sizeMapHeight: window.innerHeight * 85 / 100,

  zoomIntensity: 0.08, // The higher the faster it zoom
  limitMaxZoomIn: 2, // Limit zoom in for 2 times bigger
  limitMaxZoomOut: 2, // Limit zoom out for 2 times smaller
};

window.myGlobal = myGlobal;

console.log(myGlobal);
