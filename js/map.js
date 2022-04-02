const width = global.sizeMapWidth;
const height = global.sizeMapHeight;

// Cannot name Map because there is already a builtin class Map
class CanvasMap {
  // Animator
  scale = 1;
  origin = new Point(0, 0);
  isMoving = false;
  initMovePoint = new Point(0, 0);

  img;
  context;
  canvas;

  draw() {
    // Clear screen then draw image
    this.context.fillStyle = "white";
    this.context.fillRect(this.origin.x, this.origin.y, width/this.scale, height/this.scale);
    this.context.drawImage(this.img, 50, 50, 800, 800);

    // Redraw for each frame
    // TODO: performance boost here
    window.requestAnimationFrame(() => this.draw());
  }

  // To Quang: you can add hook when zoom here if you want
  onZoom(event) {
    event.preventDefault();
    _internalOnZoom(event, this);
  }

  // To Quang: you can add hook when move here if you want
  onMove(event) {
    event.preventDefault();
    console.log(event);
    // this.origin.x -= event.
  }
  
  constructor(imgLocation) {
    // Canvas creation
    this.canvas = document.getElementById('map');
    this.context = this.canvas.getContext('2d');
    this.canvas.width = width;
    this.canvas.height = height;

    // Attach zoom event
    this.canvas.onwheel = (e) => this.onZoom(e);

    // Attach move event
    this.canvas.onmousedown = (e) => {
      this.isMoving = true;
      this.initMovePoint = new Point(e.x, e.y);
    }
    this.canvas.onmouseup = (e) => this.isMoving = false;
    this.canvas.onmousemove = (e) => {
      if (this.isMoving) this.onMove(e)
    };

    // Load image and initialize draw animation
    this.img = new Image();
    this.img.src = imgLocation;
    this.img.onload = () => {
      this.context.drawImage(this.img, 50, 50, 800, 800);
      this.draw();
    }
  }
}

const map = new CanvasMap('/img/sodo.png');