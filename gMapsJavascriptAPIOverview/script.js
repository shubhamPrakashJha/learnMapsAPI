var map;
var markers = [];

function initMap() {
    var styles = [
        {elementType: 'geometry', stylers: [{color: '#242f3e'}]},
        {elementType: 'labels.text.stroke', stylers: [{color: '#242f3e'}]},
        {elementType: 'labels.text.fill', stylers: [{color: '#746855'}]},
        {
            featureType: 'administrative.locality',
            elementType: 'labels.text.fill',
            stylers: [{color: '#d59563'}]
        },
        {
            featureType: 'poi',
            elementType: 'labels.text.fill',
            stylers: [{color: '#d59563'}]
        },
        {
            featureType: 'poi.park',
            elementType: 'geometry',
            stylers: [{color: '#263c3f'}]
        },
        {
            featureType: 'poi.park',
            elementType: 'labels.text.fill',
            stylers: [{color: '#6b9a76'}]
        },
        {
            featureType: 'road',
            elementType: 'geometry',
            stylers: [{color: '#38414e'}]
        },
        {
            featureType: 'road',
            elementType: 'geometry.stroke',
            stylers: [{color: '#212a37'}]
        },
        {
            featureType: 'road',
            elementType: 'labels.text.fill',
            stylers: [{color: '#9ca5b3'}]
        },
        {
            featureType: 'road.highway',
            elementType: 'geometry',
            stylers: [{color: '#746855'}]
        },
        {
            featureType: 'road.highway',
            elementType: 'geometry.stroke',
            stylers: [{color: '#1f2835'}]
        },
        {
            featureType: 'road.highway',
            elementType: 'labels.text.fill',
            stylers: [{color: '#f3d19c'}]
        },
        {
            featureType: 'transit',
            elementType: 'geometry',
            stylers: [{color: '#2f3948'}]
        },
        {
            featureType: 'transit.station',
            elementType: 'labels.text.fill',
            stylers: [{color: '#d59563'}]
        },
        {
            featureType: 'transit.station',
            stylers: [{color: '#d59563'}, {weight: 9}]
        },
        {
            featureType: 'water',
            elementType: 'geometry',
            stylers: [{color: '#17263c'}]
        },
        {
            featureType: 'water',
            elementType: 'labels.text.fill',
            stylers: [{color: '#515c6d'}]
        },
        {
            featureType: 'water',
            elementType: 'labels.text.stroke',
            stylers: [{color: '#17263c'}]
        }
    ];

    map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: 40.7413549,
            lng: -73.9980244
        },
        zoom: 13,
        styles: styles,
        mapTypeControl: false
    });
    var locations = [
        {title: 'Park Ave Penthouse', location: {lat: 40.7713024, lng: -73.9632393}},
        {title: 'Chelsea Loft', location: {lat: 40.7444883, lng: -73.9949465}},
        {title: 'Union Square Open Floor Plan', location: {lat: 40.7347062, lng: -73.9895759}},
        {title: 'East Village Hip Studio', location: {lat: 40.7281777, lng: -73.984377}},
        {title: 'TriBeCa Artsy Bachelor Pad', location: {lat: 40.7195264, lng: -74.0089934}},
        {title: 'Chinatown Homey Space', location: {lat: 40.7180628, lng: -73.9961237}}
    ];
    //
    var defaultIcon = makeMarkerIcon('red-dot');
    var highlightedIcon = makeMarkerIcon('blue-dot');

    var largeInfoWindow = new google.maps.InfoWindow();

    for (var i = 0; i < locations.length; i++) {
        var title = locations[i].title;
        var location = locations[i].location;

        var marker = new google.maps.Marker({
            position: location,
            icon: defaultIcon,
            title: title,
            animation: google.maps.Animation.BOUNCE,
            id: i
        });
        markers.push(marker);
        marker.addListener('click',function () {
            populateInfoWindow(this, largeInfoWindow)
        });
        marker.addListener('mouseover', function () {
            this.setIcon(highlightedIcon);
        });
        marker.addListener('mouseout', function () {
            this.setIcon(defaultIcon);
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

    function makeMarkerIcon(markerColor) {
        var markerImage = {
            url: "http://maps.google.com/mapfiles/ms/icons/"+markerColor+".png",
            size: new google.maps.Size(71,71),
            origin: new google.maps.Point(0,0),
            anchor: new google.maps.Point(17,34),
            scaledSize: new google.maps.Size(50,50)
        };
        return markerImage;
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