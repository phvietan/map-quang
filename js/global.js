export const myGlobal = {
  windowWidth: window.innerWidth,
  windowHeight: window.innerHeight,

  sizeMapWidth: window.innerWidth * 99 / 100,
  sizeMapHeight: window.innerHeight * 98 / 100,

  zoomIntensity: 0.1, // The higher the faster it zoom
  limitMaxZoomIn: 3, // Limit zoom in for 3 times bigger
  limitMaxZoomOut: 3, // Limit zoom out for 3 times smaller

  defaultPopperWidth: '370px',
};

window.myGlobal = myGlobal;
