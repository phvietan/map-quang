import { Marker } from './marker';

var cntZIndex = 0;

var entityMap = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
  '/': '&#x2F;',
  '`': '&#x60;',
  '=': '&#x3D;'
};

function escapeHtml (string) {
  return String(string).replace(/[&<>"'`=\/]/g, function (s) {
    return entityMap[s];
  });
}

function createElementFromHTML(htmlString) {
  var div = document.createElement('div');
  div.innerHTML = htmlString.trim();

  // Change this to div.childNodes to support multiple top-level nodes.
  return div.firstChild;
}

function valueOrNone(s) {
  if (s === '') return '<i>none</i>';
  return escapeHtml(s);
}

export class Popper {
  width = "230px"; // Default popper's width
  id;
  html;
  tabChoosing = "properties";

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
    const doc = document.getElementById(this.id);
    const canvas = document.getElementById('map');

    const visibility = (this.isShowing) ? "visible" : "hidden";

    doc.style.zIndex = ++cntZIndex;
    doc.style.width = this.width;
    doc.style.visibility = visibility;
    doc.style.left = `${this.marker.X + canvas.offsetLeft}px`;
    doc.style.top = `${this.marker.Y + canvas.offsetTop}px`;
  }

  parsePoint(point) {
    return `(${parseFloat(point.x).toFixed(2)}, ${parseFloat(point.y).toFixed(2)})`;
  }

  constructHtml() {
    try { document.getElementById(this.id).remove(); } catch (e) {}
    const isProperty = this.tabChoosing === 'properties';
    const isStream = this.tabChoosing === 'stream';
    this.html = createElementFromHTML(`
      <div id="${this.id}">
        <div class="tooltip">
          <span class="tooltiptext">Edit location</span>
          <button class="action" onclick="moveMarker(event, '${this.marker.id}')">✏️</button>
        </div>
        <div class="tooltip">
          <span class="tooltiptext">Remove</span>
          <button class="action" onclick="clearMarker('${this.marker.id}')">❌</button>
        </div>
        <div class="tab">
          <button class="${isProperty ? 'activated' : ''}" width="49%" onclick="changeTab('${this.marker.id}', 'properties')">Properties</button>
          <button class="${isStream ? 'activated' : ''}" width="49%" onclick="changeTab('${this.marker.id}', 'stream')">Stream</button>
        </div>
        <div class="property" style="display: ${isProperty ? 'block' : 'none'}">
          <div>
            <span class="type">Camera name:</span>
            <span class="value">${valueOrNone(this.marker.CameraName)}</span>
          </div><br>
          <div>
            <span class="type">Camera type:</span>
            <span class="value">${valueOrNone(this.marker.CameraType)}</span>
          </div><br>
          <div>
            <span class="type">Camera model:</span>
            <span class="value">${valueOrNone(this.marker.CameraModel)}</span>
          </div><br>
          <div>
            <span class="type">Location:</span>
            <span class="value">${this.parsePoint(this.marker.getRealPoint())}</span>
          </div>
        </div>
        <div class="property" style="display: ${isStream ? 'block' : 'none'}">
          <li class="vms-tab" data-tab="streaming" data-stream-url="${this.marker.StreamURL}" onClick="tryPlay('${this.marker.StreamURL}')">\
            <a>
              <span class="icon"><i class="fa-solid fa-camera" aria-hidden="true"></i></span>
              <span>Streaming</span>
            </a>
          </li>
        </div>
      </div>
    `);
    window.document.body.appendChild(this.html);
    this.setStyle();
  }

  constructor(marker) {
    this.marker = marker;
    this.id = `popper-marker-${this.marker.id}`;
    this.constructHtml();
  }
}

window.clearMarker = (markerId) => {
  const marker = window.map.markers[markerId];
  window.map.clearMarker(markerId);
  window.afterDeleteMarker(marker);
}

window.moveMarker = (event, markerId) => {
  window.map.moveMarker(event, markerId);
}

window.tryPlay = (url) => {
  StartPlay(url);
}

window.changeTab = (markerId, value) => {
  const marker = window.map.markers[markerId];
  marker.popper.tabChoosing = value;
  marker.popper.constructHtml();
}
