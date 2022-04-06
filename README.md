# MapCanvas

For indoor map navigator and camera viewer.

Server example running here: http://zoom-maker.drstra.in/

For @Quang, please look at demo.html:

You will see `window.afterMoveMarker` and `window.afterDeleteMarker`, that's your hook.

# Development note:

To run this code:

```bash
npm i
npm run build:dev # For development
npm run build:prod # For production, before build for production remember to remove `window.ShowCameraInfoImage(json);` and `img = "/img/sodo.png";` in js/index.js file
```
