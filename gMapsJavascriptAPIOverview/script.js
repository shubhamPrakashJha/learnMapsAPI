var map;

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: 40.7413549,
            lng: -73.9980244
        },
        zoom: 13
    });
    var locations = [
        {title: 'Park Ave Penthouse', location: {lat: 40.7713024, lng: -73.9632393}},
        {title: 'Chelsea Loft', location: {lat: 40.7444883, lng: -73.9949465}},
        {title: 'Union Square Open Floor Plan', location: {lat: 40.7347062, lng: -73.9895759}},
        {title: 'East Village Hip Studio', location: {lat: 40.7281777, lng: -73.984377}},
        {title: 'TriBeCa Artsy Bachelor Pad', location: {lat: 40.7195264, lng: -74.0089934}},
        {title: 'Chinatown Homey Space', location: {lat: 40.7180628, lng: -73.9961237}}
    ];
    // var tribeca = {
    //     lat: 40.719526,
    //     lng: -74.0089934
    // };
    // var marker = new google.maps.Marker({
    //     position: tribeca,
    //     map: map,
    //     title: "First Marker",
    //     draggable: true,
    //     animation: google.maps.Animation.DROP
    // });
    // var infoWindow = new google.maps.InfoWindow({
    //     content: "This is a Info Window displaying info about the marker"
    // });
    //
    // marker.addListener('click', function () {
    //     infoWindow.open(map,marker);
    // });
}