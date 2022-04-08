import { Point } from './point.js';
import { Marker } from './marker.js';
import {
  _internalDraw,
  _internalOnZoom,
  _internalOnMove,
  _internalOnMouseUp,
  _internalShouldDraw,
  _internalOnMouseDown,
  _internalOnMouseMove,
  _internalIsHoverMarker,
} from './internal/index.js';
import { myGlobal } from './global.js';

// Cannot name Map because there is already a builtin class Map
export class CanvasMap {

  scale = 1; // Record how much has scaled
  isMoving = false;
  initMovePoint = new Point(0, 0);
  imgLocation = new Point(0, 0);
  shouldDraw = true;
  img;
  canvas;
  context;

  /** @type Marker */
  movingMarker = null;
  mouseDownPoint = new Point(0, 0);

  /**
   * List of markers
   * @type {Marker[]} markers
   */
  markers = [];
  notShowMarkerId = null;
  isDeleted = false;

  #draw() {
    if (this.isDeleted) return;
    if (this.shouldDraw) _internalDraw(this);
    window.requestAnimationFrame(() => this.#draw());
  }

  #initAttachEvents() {
    // Attach zoom event
    this.canvas.onwheel = (e) => _internalOnZoom(e, this);

    // Attach move event
    this.canvas.onmousedown = (e) => _internalOnMouseDown(e, this);
    this.canvas.onmouseup = (e) => _internalOnMouseUp(e, this);
    this.canvas.onmousemove = (e) => {
      if (this.isMoving) _internalOnMove(e, this);
      else _internalOnMouseMove(e, this);
    };
  }

  /**
   * Attempt to add one marker. Must have properties: ["StreamURL", "CameraName", "CameraType", "CameraModel", "X", "Y"], and may have property: "iconUrl"
   * @async
   * @param {any} markerJson
   * @example
   *
   * await map.loadOneMarker({
   *   "StreamURL": "https://...",
   *   "CameraName": "Quang",
   *   "CameraType": "Type 1",
   *   "CameraModel": "Model 1",
   *   "X": 100,
   *   "Y": 100,
   *   "iconUrl": "...",
   * })
   */
  loadOneMarker(markerJson) {
    const marker = new Marker(this, {
      id: this.markers.length,
      ...markerJson,
    });
    this.markers.push(marker);
    this.shouldDraw = true;
  }

  clearMarker(markerId) {
    markerId = parseInt(markerId);
    const idx = this.markers.findIndex((marker) => marker.id == markerId);
    if (idx !== -1) {
      this.markers[idx].popper.clear();
      this.markers.splice(idx, 1);
      this.shouldDraw = true;
    }
  }

  moveMarker(event, markerId) {
    markerId = parseInt(markerId);
    const idx = this.markers.findIndex((marker) => marker.id == markerId);
    if (idx !== -1) {
      this.movingMarker = this.markers[idx];
      this.markers[idx].popper.show(false);
      this.markers[idx].X = event.clientX - this.canvas.offsetLeft;
      this.markers[idx].Y = event.clientY - this.canvas.offsetTop;
      this.shouldDraw = true;
    }
  }

  clearMarkers() {
    this.markers.forEach(marker => marker.popper.clear());
    this.markers = [];
    this.shouldDraw = true;
  }

  clearMap() {
    this.markers = [];
    this.shouldDraw = true;
    this.isDeleted = true;
  }

  /**
   * Initialize Map
   * @constructor
   * @param {string} hrefImg - Href of image into load to map
   */
  constructor(hrefImg) {
    // Canvas creation
    this.canvas = document.getElementById('map');
    this.context = this.canvas.getContext('2d');
    this.canvas.width = myGlobal.sizeMapWidth;
    this.canvas.height = myGlobal.sizeMapHeight;

    this.#initAttachEvents();

    // Load image and initialize draw animation
    this.img = new Image();
    this.img.src = hrefImg;
    this.img.onload = () => this.#draw();
  }
}

window.CanvasMap = CanvasMap;
