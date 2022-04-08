import { myGlobal } from './global';
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
  return div.firstChild;
}

function valueOrNone(s) {
  if (s === '') return '<i>none</i>';
  return escapeHtml(s);
}

export class Popper {
  width = myGlobal.defaultPopperWidth; // Default popper's width
  rtcPlayerId;
  id;
  html;
  tabChoosing = "property";
  isStreaming = false;

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
    const isProperty = this.tabChoosing === 'property';
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
          <button class="tab-btn-property ${isProperty ? 'activated' : ''}" width="49%" onclick="changeTab('${this.marker.id}', 'property')">Properties</button>
          <button class="tab-btn-stream ${isStream ? 'activated' : ''}" width="49%" onclick="changeTab('${this.marker.id}', 'stream')">Stream</button>
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
        <div class="stream" style="display: ${isStream ? 'block' : 'none'}">
          <div class="vms-tab-content" data-tab="streaming">
            <video id="${this.rtcPlayerId}" width="100%" controls autoplay></video>
          </div>
        </div>
      </div>
    `);
    window.document.body.appendChild(this.html);
    this.setStyle();
  }

  // I wish I start this project in React :<
  changeTab(tabValue) {
    this.tabChoosing = tabValue;
    const domPopper = document.getElementById(this.id);
    const propertyComponent = domPopper.getElementsByClassName('property');
    const streamComponent = domPopper.getElementsByClassName('stream');
    const propertyBtn = domPopper.getElementsByClassName('tab-btn-property');
    const streamBtn = domPopper.getElementsByClassName('tab-btn-stream');

    if (tabValue === 'property') {
      propertyBtn.item(0).className = 'tab-btn-property activated';
      streamBtn.item(0).className = 'tab-btn-stream';
      propertyComponent.item(0).style.display = 'block';
      streamComponent.item(0).style.display = 'none';
    } else {
      propertyBtn.item(0).className = 'tab-btn-property';
      streamBtn.item(0).className = 'tab-btn-stream activated';
      propertyComponent.item(0).style.display = 'none';
      streamComponent.item(0).style.display = 'block';

      // First time start stream
      if (!this.isStreaming) {
        window.tryPlay(this.marker.StreamURL, this.rtcPlayerId);
        this.isStreaming = true;
      }
    }
  }

  constructor(marker) {
    this.marker = marker;
    this.id = `popper-marker-${this.marker.id}`;
    this.rtcPlayerId = `rtc-player-${this.marker.id}`;
    this.constructHtml();
  }
}

window.clearMarker = (markerId) => {
  window.map.clearMarker(markerId);
  const { markers } = window.map;
  const idx = markers.findIndex((marker) => marker.id == markerId);
  if (idx !== -1) window.afterDeleteMarker(window.map.markers[idx]);
}

window.moveMarker = (event, markerId) => {
  window.map.moveMarker(event, markerId);
}

window.tryPlay = (url, rtcPlayerId) => {
  StartPlay(url, rtcPlayerId);
}

window.changeTab = (markerId, value) => {
  const { markers } = window.map;
  const idx = markers.findIndex((marker) => marker.id == markerId);
  if (idx !== -1) {
    const marker = markers[idx];
    marker.popper.changeTab(value);
  }
}
