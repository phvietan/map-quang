var global = {
  windowWidth: window.innerWidth,
  windowHeight: window.innerHeight,

  sizeMapWidth: window.innerWidth * 85 / 100,
  sizeMapHeight: window.innerHeight * 85 / 100,

  zoomIntensity: 0.08, // The higher the faster it zoom
  limitMaxZoomIn: 10, // Limit zoom into 4 times bigger
  limitMaxZoomOut: 3, // Limit zoom out 3 times smaller
};