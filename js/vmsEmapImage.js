var markerID;
var markerList =[];
var srcImage;
var picTag = 0;
var cameraID = [];


function ShowCameraInfoImage(CameraJson) {
    geostring = CameraJson;
        // Add markers to the map.
    const geojson = JSON.parse(geostring);
    if (cameraID !== null)
        cameraID = [];
    item = $('#zoom-marker-img');
    //srcImage = "data:image/png;base64," + geojson.Image;
    srcImage = geojson.Image;
    item.zoomMarker_CleanMarker();
    item.zoomMarker_ResetImage();
    item.zoomMarker_LoadImage(srcImage);

    for (const marker_info of geojson.Info) {
      // Create a DOM element for each marker.
        if ((marker_info.Long == 0) && (marker_info.Lat==0))
        {
            continue;
        }
        const marker = item.zoomMarker_AddMarker({
                src:"CameraOn_Dark.svg",
                x:marker_info.Long * 1000,
                y:marker_info.ImageHeight - marker_info.Lat*1000,
                size:25,
                draggable: false,
                dialog:{},
        });
            console.log (marker.id);
            //Markers's popup
            marker.param.dialog = {
                value: '\
                        <div class="vms-tabs tabs is-toggle is-fullwidth">\
                            <ul>\
                                <li class="vms-tab is-active" data-tab="profile" data-marker="' + marker.id + '" onClick="switch_popup_tab(event)" >\
                                    <a>\
                                        <span class="icon"><i <i class="fa-solid fa-barcode" aria-hidden="true"></i></span>\
                                        <span>Profile</span>\
                                    </a>\
                                </li>\
                                <li class="vms-tab" data-tab="streaming" data-stream-url="' + marker_info.StreamURL + '" onClick="switch_popup_tab(event)">\
                                    <a>\
                                        <span class="icon"><i class="fa-solid fa-camera" aria-hidden="true"></i></span>\
                                        <span>Streaming</span>\
                                    </a>\
                                </li>\
                            </ul>\
                        </div>\
                        <div class="vms-tabs-content">\
                            <div class="vms-tab-content is-active" data-tab="profile">\
                                <div class="columns">\
                                    <div class="column is-5 vms-profile-title"><p>Name</p></div>\
                                    <div class="column vms-profile-content"><p>' + marker_info.CameraName + '</p></div>\
                                </div>\
                                <div class="columns">\
                                    <div class="column is-5 vms-profile-title"><p>Type</p></div>\
                                    <div class="column vms-profile-content"><p>' + marker_info.CameraType + '</p></div>\
                                </div>\
                                <div class="columns">\
                                    <div class="column is-5 vms-profile-title"><p>Model</p></div>\
                                    <div class="column vms-profile-content"><p>' + marker_info.CameraModel + '</p></div>\
                                </div>\
                                <div class="columns">\
                                    <div class="column is-5 vms-profile-title"><p>Longitude</p></div>\
                                    <div class="column vms-profile-content"><p>' + marker_info.Long + '</p></div>\
                                </div>\
                                <div class="columns">\
                                    <div class="column is-5 vms-profile-title"><p>Lattitude</p></div>\
                                    <div class="column vms-profile-content"><p>' + marker_info.Lat + '</p></div>\
                                </div>\
                            </div>\
                            <div class="vms-tab-content" data-tab="streaming">\
                                <video id="rtc-player" width="100%" controls autoplay></video>\
                            </div>\
                        </div>\
                        ',
            };
        markerList[marker.id] = marker;

        //Click on Marker
        item.on("zoom_marker_click", function(event, marker){
            markerID = marker.id;
            console.log(marker);
            console.log("marker ID: " + marker.id)
        });

        //Click on Image
        item.on("zoom_marker_mouse_click", function(event, position){

        });

        //Move Marker
        item.on("zoom_marker_move_end", function(event, position){
            console.log("Marker moving ended on :" + JSON.stringify(position));
        })
    }
}

function StartPlay(url)
{
    console.log(url);
    window.location.vms_protocol = "http:";
    var sdk = null; // Global handler to do cleanup when replaying.
    //$('#rtc-player').show();
    // Close PC when user replay.
    if (sdk) {
        sdk.close();
    }
    sdk = new SrsRtcPlayerAsync();

    $('#rtc-player').prop('srcObject', sdk.stream);

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


function switch_popup_tab(e) {
    var target_tab = e.currentTarget.getAttribute('data-tab');
    $('.vms-tab').removeClass('is-active');
    $('.vms-tab-content').removeClass('is-active');

    e.currentTarget.className += " is-active";
    $('.vms-tab-content[data-tab="' + target_tab +'"]').addClass('is-active');
    if (target_tab === "streaming") {
        var stream_url = e.currentTarget.getAttribute('data-stream-url');
        StartPlay(stream_url);
    }
    if (target_tab === "profile") {
        var markerID = e.currentTarget.getAttribute('data-marker');
    }
}

function InitImage()
{
    var width1 = $("#zoom-marker-img").parent().width();
    $('#zoom-marker-img').zoomMarker({
        src: "Images/BlackImage.jpg",
        rate: 0.2,
        width: width1,
        min: 500,
        max: 20000
    });
}

$(document).ready(function () {
    InitImage();
})
