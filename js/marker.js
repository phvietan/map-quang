import { Popper } from './popper';
import { CanvasMap } from './map';
import { Point } from './point';
/**
 * Marker class
 * @property StreamURL, CameraName, CameraType, CameraModel, X, Y, iconUrl
 */
export class Marker {
  /** @type CanvasMap */
  map;

  StreamURL = "";
  CameraName = "";
  CameraType = "";
  CameraModel = "";
  X = 0;
  Y = 0;

  id = 0;
  size = 30; // Size of marker default is 50x50 pixel (you can pass into constructor to change this size)
  iconUrl = '/icon/CameraOn_Dark.svg';

  /** @type HTMLImageElement */
  img = null;
  isSelecting = false;

  /** @type Popper */
  popper = null;

  #validateAndAssignCameraJson(json) {
    const requiredKeys = ["StreamURL", "CameraName", "CameraType", "CameraModel", "X", "Y"];
    for (let i = 0; i < requiredKeys.length; ++i) {
      const requiredKey = requiredKeys[i];
      if (!json.hasOwnProperty(requiredKey)) throw new Error(`Wrong marker json: missing key ${requiredKey}`);
    }
  }

  getRealPoint() {
    const p = new Point(this.X, this.Y).minus(this.map.imgLocation).multiply(1 / this.map.scale);
    return p;
  }

  changeIconUrl(newIconUrl) {
    this.iconUrl = newIconUrl;
    this.img = new Image();
    this.img.src = this.iconUrl;
    this.img.onload = () => {
      console.log(`Done loaded icon for marker ${this.id}`);
    }
    window.map.shouldDraw = true; // Dơ vl
  }

  constructor(map, json) {
    this.map = map;
    this.#validateAndAssignCameraJson(json);
    Object.assign(this, json);
    this.img = new Image();
    this.img.src = this.iconUrl;
    this.img.onload = () => {
      console.log(`Done loaded marker ${this.id}`);
    }
    this.popper = new Popper(this);
  }
}

window.Marker = Marker;
