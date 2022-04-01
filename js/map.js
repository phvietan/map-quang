const width = global.sizeMapWidth;
const height = global.sizeMapHeight;

class Map {
  scale = 1;
  originx = 0;
  originy = 0;
  zoomIntensity = 0.2;

  visibleWidth = width;
  visibleHeight = height;

  img;
  context;
  canvas;

  draw() {
    console.log(this);
    // Clear screen to white.
    this.context.fillStyle = "white";
    this.context.fillRect(this.originx, this.originy, width/this.scale, height/this.scale);
    // Draw the black square.
    this.context.drawImage(this.img, 50, 50, 800, 800);

    // Schedule the redraw for the next display refresh.
    window.requestAnimationFrame(() => this.draw());
  }

  onWheel(event) {
    event.preventDefault();
    // Get mouse offset.
    const mousex = event.clientX - this.canvas.offsetLeft;
    const mousey = event.clientY - this.canvas.offsetTop;
    // Normalize mouse wheel movement to +1 or -1 to avoid unusual jumps.
    const wheel = event.deltaY < 0 ? 1 : -1;
    // Compute zoom factor.
    const zoom = Math.exp(wheel * this.zoomIntensity);

    // Translate so the visible origin is at the context's origin.
    this.context.translate(this.originx, this.originy);
  
    // Compute the new visible origin. Originally the mouse is at a
    // distance mouse/scale from the corner, we want the point under
    // the mouse to remain in the same place after the zoom, but this
    // is at mouse/new_scale away from the corner. Therefore we need to
    // shift the origin (coordinates of the corner) to account for this.
    this.originx -= mousex/(this.scale*zoom) - mousex/this.scale;
    this.originy -= mousey/(this.scale*zoom) - mousey/this.scale;
    
    // Scale it (centered around the origin due to the trasnslate above).
    this.context.scale(zoom, zoom);
    // Offset the visible origin to it's proper position.
    this.context.translate(-this.originx, -this.originy);

    // Update scale and others.
    this.scale *= zoom;
    this.visibleWidth = width / this.scale;
    this.visibleHeight = height / this.scale;
  }
  
  constructor(imgLocation) {
    this.canvas = document.getElementById('map');
    this.context = this.canvas.getContext('2d');

    this.canvas.onwheel = (e) => this.onWheel(e);
    this.canvas.width = width;
    this.canvas.height = height;

    this.img = new Image();
    this.img.src = imgLocation;
    this.img.onload = () => {
      this.context.drawImage(this.img, 50, 50, 800, 800);
    // this.context.drawImage(this.img, 0, 0);
      this.draw();
    }
  }
}

const map = new Map('/img/sodo.png');