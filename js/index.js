import { CanvasMap } from "./map";
import { json } from './test';
import { myGlobal } from './global.js';

window.ShowCameraInfoImage = function(mapInfo) {
  mapInfo = JSON.parse(mapInfo);
  let {
    Image: img,
    ImageWidth: width,
    ImageHeight: height,
    Info: info,
  } = mapInfo;
  img = '/img/sodo.png';
  window.map = new CanvasMap(img);
  info.forEach(camera => {
    const x = camera.Long * 1000;
    const y = height - camera.Lat * 1000;
    window.map.loadOneMarker({
      ...camera,
      "X": x,
      "Y": y,
    });
  });
}

console.log(json);

ShowCameraInfoImage(json);

window.InitImage = function(img) {
  img = JSON.parse(img);
  let {
    Image: imgjs,
  } = img;
  imgjs = "data:image/jpeg;base64," + imgjs;
  window.map = new CanvasMap(imgjs);
}

window.AddOneMarker = function(marker){
  marker = JSON.parse(marker);
  let {
    ImageWidth: width,
    ImageHeight: height,
    Info:info,
  } = marker;
  info.forEach(camera =>{
    const x = myGlobal.sizeMapWidth / 2;
    const y = myGlobal.sizeMapHeight /2;
    window.map.loadOneMarker({
      ...camera,
      "X": x,
      "Y": y,
    });
  });
}

window.clearMap = function(mapInfo) {
  window.map.clearMap();
}


window.StartPlay = function(url, rtcPlayerId) {
  console.log(url);
  window.location.vms_protocol = "http:";
  var sdk = null; // Global handler to do cleanup when replaying.
  // Close PC when user replay.
  if (sdk) {
    sdk.close();
  }
  sdk = new SrsRtcPlayerAsync();

  $(`#${rtcPlayerId}`).prop('srcObject', sdk.stream);

  // Optional callback, SDK will add track to stream.
  // sdk.ontrack = function (event) { console.log('Got track', event); sdk.stream.addTrack(event.track); };
  // For example: webrtc://r.ossrs.net/live/livestream

  sdk.play(url).then( session => {
      $('#sessionid').html(session.sessionid);
      $('#simulator-drop').attr('href', session.simulator + '?drop=1&username=' + session.sessionid);
  }).catch( reason => {
      console.error('[StartPlay] [SDK Exception] : ' + reason);
      sdk.close();
      //$('#rtc-player').hide();
  });
}
