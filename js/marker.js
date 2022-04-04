import { sleep } from './internal/sleep';

/**
 * Marker class
 * @property StreamURL, CameraName, CameraType, CameraModel, X, Y, iconUrl
 */
export class Marker {
  StreamURL = "";
  CameraName = "";
  CameraType = "";
  X = 0;
  Y = 0;

  id = 'marker-0';
  size = 50; // Size of marker default is 50x50 pixel (you can pass into constructor to change this size)
  iconUrl = '/icon/CameraOn_Dark.svg';
  img = null;
  finishedLoad = false;

  #validateAndAssignCameraJson(json) {
    const requiredKeys = ["StreamURL", "CameraName", "CameraType", "CameraModel", "X", "Y"];
    for (let i = 0; i < requiredKeys.length; ++i) {
      const requiredKey = requiredKeys[i];
      if (!json.hasOwnProperty(requiredKey)) throw new Error(`Wrong marker json: missing key ${requiredKey}`);
    }
  }

  async waitFinishLoad() {
    while (!this.finishedLoad) await sleep(50);
  }

  constructor(json) {
    this.#validateAndAssignCameraJson(json);
    delete json["finishedLoad"]; // should not assign finishedLoad param
    Object.assign(this, json);
    this.img = new Image();
    this.img.src = this.iconUrl;
    this.img.onload = () => {
      this.finishedLoad = true;
    }
  }
}

window.Marker = Marker;
