import { sleep } from './internal/sleep';

/**
 * Marker class
 * @property StreamURL, CameraName, CameraType, CameraModel, X, Y, iconUrl
 */
export class Marker {
  id = "";
  StreamURL = "";
  CameraName = "";
  CameraType = "";
  X = 0;
  Y = 0;

  iconUrl = '/icon/map-marker.png';
  img = null;
  finishedLoad = false;

  #validateAndAssignCameraJson(json) {
    const requiredKeys = ["StreamURL", "CameraName", "CameraType", "CameraModel", "X", "Y"];
    for (let i = 0; i < requiredKeys.length; ++i) {
      const requiredKey = requiredKeys[i];
      if (!json.hasOwnProperty(requiredKey)) throw new Error(`Wrong marker json: missing key ${requiredKey}`);
      this[requiredKey] = json[requiredKey]; // Only load required keys
    }
  }

  async waitFinishLoad() {
    while (!this.finishedLoad) await sleep(50);
  }

  constructor(json, markerId = 'marker-0', iconUrl = '/icon/map-marker.png') {
    this.#validateAndAssignCameraJson(json);
    this.id = markerId;
    this.iconUrl = iconUrl;

    this.img = new Image();
    this.img.src = this.iconUrl;
    this.img.onload = () => this.finishedLoad = true;
  }
}

window.Marker = Marker;
