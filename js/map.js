import { Point } from './point.js';
import { Marker } from './marker.js';
import {
  _internalDraw,
  _internalOnZoom,
  _internalOnMove,
  _internalOnMouseUp,
  _internalOnMouseDown,
} from './internal/index.js';
import { myGlobal } from './global.js';

// Cannot name Map because there is already a builtin class Map
export class CanvasMap {

  scale = 1;
  origin = new Point(0, 0);
  isMoving = false;
  initMovePoint = new Point(0, 0);
  imgLocation = new Point(0, 0);
  shouldDraw = true;
  img;
  canvas;
  context;

  /**
   * List of markers
   * @type {Marker[]} markers
   */
  markers = [];
  isDeleted = false;

  #draw() {
    if (this.isDeleted) return;
    if (this.shouldDraw) {
      _internalDraw(this);
      this.shouldDraw = false;
    }
    window.requestAnimationFrame(() => this.#draw());
  }

  #onZoom(event) {
    event.preventDefault();
    _internalOnZoom(event, this);
    this.shouldDraw = true;
  }

  #onMove(event) {
    event.preventDefault();
    _internalOnMove(event, this);
    this.shouldDraw = true;
  }

  #initAttachEvents() {
    // Attach zoom event
    this.canvas.onwheel = (e) => this.#onZoom(e);

    // Attach move event
    this.canvas.onmousedown = (e) => _internalOnMouseDown(e, this);
    this.canvas.onmouseup = (e) => _internalOnMouseUp(e, this);
    this.canvas.onmousemove = (e) => {
      if (this.isMoving) this.#onMove(e)
    };
  }

  async #waitForMarkersLoad() {
    for (let i = 0; i < this.markers.length; ++i) {
      await this.markers[i].waitFinishLoad();
    }
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
  async loadOneMarker(markerJson) {
    const marker = new Marker({
      id: `marker-${this.markers.length}`,
      ...markerJson,
    });
    await marker.waitFinishLoad();
    this.markers.push(marker);
    this.shouldDraw = true;
  }

  clearMarkers() {
    localStorage.setItem('markers', '[]');
    this.markers = [];
  }

  clearMap() {
    this.markers = [];
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
    this.img.onload = async () => {
      await this.#waitForMarkersLoad();
      this.#draw();
    };
  }
}

window.CanvasMap = CanvasMap;
