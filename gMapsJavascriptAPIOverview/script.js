var map;
var markers = [];

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

    var largeInfoWindow = new google.maps.InfoWindow();

    for (var i = 0; i < locations.length; i++) {
        var title = locations[i].title;
        var location = locations[i].location;

        var marker = new google.maps.Marker({
            position: location,
            title: title,
            animation: google.maps.Animation.BOUNCE,
            id: i
        });
        markers.push(marker);
        marker.addListener('click',function () {
            populateInfoWindow(this, largeInfoWindow)
        });

        document.getElementById('show-listings').addEventListener('click',showListings);
        document.getElementById('hide-listings').addEventListener('click',hideListings);
    }

    function populateInfoWindow(marker, infowindow) {
        if(infowindow.marker != marker){
            infowindow.marker = marker;
            infowindow.setContent('<div>'+marker.title+'</div>');
            infowindow.open(map,marker);
            infowindow.addListener('closeclick', function () {
                infowindow.setMarker(null);
            });
        }
    }

    function showListings() {
        var bounds = new google.maps.LatLngBounds();
        for(var i = 0; i < markers.length; i++){
            markers[i].setMap(map);
            bounds.extend(markers[i].position);
        }
        map.fitBounds(bounds);
    }

    function hideListings() {
        for(var i = 0; i < markers.length; i++){
            markers[i].setMap(null);
        }
    }

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