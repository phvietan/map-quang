import { Marker } from './marker';

function createElementFromHTML(htmlString) {
  var div = document.createElement('div');
  div.innerHTML = htmlString.trim();

  // Change this to div.childNodes to support multiple top-level nodes.
  return div.firstChild;
}

export class Popper {
  id;
  html;

  /** @type Marker */
  marker;
  isShowing = false;

  show(shouldShow) {
    if (this.isShowing !== shouldShow) {
      this.isShowing = shouldShow;
      this.setStyle();
    }
  }

  clear() {
    this.isShowing = false;
    this.setStyle();
  }

  setStyle() {
    const doc = document.getElementById(`popper-marker-${this.id}`);
    const canvas = document.getElementById('map');

    const visibility = (this.isShowing) ? "visible" : "hidden";

    doc.style.visibility = visibility;
    doc.style.left = `${this.marker.X + canvas.offsetLeft}px`;
    doc.style.top = `${this.marker.Y + canvas.offsetTop}px`;
  }

  constructHtmlAndAttachDOM() {
    try { document.getElementById(this.id).remove(); } catch (e) {}
    this.html = createElementFromHTML(`
      <div id="popper-marker-${this.id}">
        <button onclick="clearMarker('${this.marker.id}')">❌</button>
        <div class="property">
          <div>
            <span class="type">Camera name:</span>
            <span class="value">${this.marker.CameraName}</span>
          </div><br>
          <div>
            <span class="type">Camera type:</span>
            <span class="value">${this.marker.CameraType}</span>
          </div><br>
          <div>
            <span class="type">Camera model:</span>
            <span class="value">${this.marker.CameraModel}</span>
          </div>
          <div>
            <span class="type">Location:</span>
            <span class="value">(${this.marker.X}, ${this.marker.Y})</span>
          </div>
        </div>
      </div>
    `);
    window.document.body.appendChild(this.html);
  }

  constructor(marker) {
    this.marker = marker;
    this.id = `popper-marker-${this.marker.id}`;
    this.constructHtmlAndAttachDOM();
    this.setStyle();
  }
}

window.clearMarker = (markerId) => {
  window.map.clearMarker(markerId);
}
