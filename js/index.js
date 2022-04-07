import { CanvasMap } from "./map";
import { json } from './test';

window.ShowCameraInfoImage = function(mapInfo) {
  mapInfo = JSON.parse(mapInfo);
  let {
    Image: img,
    ImageWidth: width,
    ImageHeight: height,
    Info: info,
  } = mapInfo;
  img = "/img/sodo.png";
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

window.ShowCameraInfoImage(json);

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
