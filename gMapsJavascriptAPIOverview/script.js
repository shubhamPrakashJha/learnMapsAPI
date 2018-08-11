var map;
var markers = [];
var polygon = null;
var placeMarkers = [];

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
            stylers: [{color: '#3aa724'}]
        },
        {
            featureType: 'poi.park',
            elementType: 'labels.text.fill',
            stylers: [{color: '#6b9a76'}]
        },
        {
            featureType: 'road',
            elementType: 'geometry',
            stylers: [{color: '#617287'}]
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
            stylers: [{color: '#fae3b6'}]
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
            stylers: [{color: '#5d708d'}]
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
            stylers: [{color: '#6395ff'}]
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

    // Add Auto Complete feature to input boxes.
    var timeAutoComplete = new google.maps.places.Autocomplete(document.getElementById('search-within-time-text'));
    var zoomAutoComplete = new google.maps.places.Autocomplete(document.getElementById('zoom-to-area-text'));
    zoomAutoComplete.bindTo('bounds', map);
    var searchBox = new google.maps.places.SearchBox(document.getElementById('places-search'));
    searchBox.setBounds(map.getBounds());

    searchBox.addListener('places_changed', function () {
        searchBoxPlaces(this);
    });
    document.getElementById('go-places').addEventListener('click', textSearchPlaces);

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

    var drawingManager = new google.maps.drawing.DrawingManager({
        drawingMode: google.maps.drawing.OverlayType.POLYGON,
        drawingControl: true,
        drawingControlOptions: {
            position: google.maps.ControlPosition.TOP_CENTER,
            drawingModes: [
                google.maps.drawing.OverlayType.POLYGON
            ]
        }
    });

    for (var i = 0; i < locations.length; i++) {
        var title = locations[i].title;
        var location = locations[i].location;

        var marker = new google.maps.Marker({
            position: location,
            icon: defaultIcon,
            title: title,
            animation: google.maps.Animation.DROP,
            id: i
        });
        markers.push(marker);
        marker.addListener('click', function () {
            populateInfoWindow(this, largeInfoWindow)
        });
        marker.addListener('mouseover', function () {
            this.setIcon(highlightedIcon);
        });
        marker.addListener('mouseout', function () {
            this.setIcon(defaultIcon);
        });
    }

    document.getElementById('show-listings').addEventListener('click', showListings);
    document.getElementById('hide-listings').addEventListener('click', function () {
        hideMarkers(markers);
    });

    document.getElementById('toggle-drawing').addEventListener('click', function () {
        toggleDrawing(drawingManager);
    });

    document.getElementById('zoom-to-area').addEventListener('click', function () {
        zoomToArea();
    });

    document.getElementById('search-within-time').addEventListener('click', function () {
        searchWithinTime();
    });

    drawingManager.addListener('overlaycomplete', function (event) {
        if (polygon) {
            polygon.setMap(null);
            hideMarkers(markers);
        }
        drawingManager.setDrawingMode(null);
        polygon = event.overlay;
        polygon.setEditable(true);
        polygon.setDraggable(true);
        calculateArea(polygon);
        searchWithinPolygon();
        polygon.getPath().addListener('set_at', searchWithinPolygon);
        polygon.getPath().addListener('insert_at', searchWithinPolygon);

    });
}

function populateInfoWindow(marker, infowindow) {
    if (infowindow.marker !== marker) {
        infowindow.marker = marker;
        infowindow.setContent('');
        infowindow.addListener('closeclick', function () {
            infowindow.setMarker(null);
        });
        var streetViewService = new google.maps.StreetViewService();
        var radius = 50;

        function getStreetView(data, status) {
            if (status === google.maps.StreetViewStatus.OK) {
                var nearStreetViewLocation = data.location.latLng;
                var heading = google.maps.geometry.spherical.computeHeading(
                    nearStreetViewLocation, marker.position);
                infowindow.setContent('<div>' + marker.title + '</div><div id="pano"></div>');
                var panoramaOptions = {
                    position: nearStreetViewLocation,
                    pov: {
                        heading: heading,
                        pitch: 30
                    }
                };
                var panorama = new google.maps.StreetViewPanorama(
                    document.getElementById('pano'), panoramaOptions);
            } else {
                infowindow.setContent('<div>' + marker.title + '</div><div>No Street View Found</div>')
            }
        }

        streetViewService.getPanoramaByLocation(marker.position, radius, getStreetView);
        infowindow.open(map, marker);
    }
}

function showListings() {
    var bounds = new google.maps.LatLngBounds();
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(map);
        bounds.extend(markers[i].position);
    }
    map.fitBounds(bounds);
}

function hideMarkers(markers) {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
    }
}

function makeMarkerIcon(markerColor) {
    var markerImage = {
        url: "http://maps.google.com/mapfiles/ms/icons/" + markerColor + ".png",
        size: new google.maps.Size(71, 71),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(50, 50)
    };
    return markerImage;
}

function toggleDrawing(drawingManager) {
    if (drawingManager.map) {
        drawingManager.setMap(null);
        if (polygon) {
            polygon.setMap(null);
        }
    } else {
        drawingManager.setMap(map);
    }
}

function searchWithinPolygon() {
    for (var i = 0; i < markers.length; i++) {
        if (google.maps.geometry.poly.containsLocation(markers[i].position, polygon)) {
            markers[i].setMap(map);
        } else {
            markers[i].setMap(null);
        }
    }
}

function calculateArea(polygon) {
    area = google.maps.geometry.spherical.computeArea(polygon.getPath());
    window.alert(area + " Sq. Meters");
}

function zoomToArea() {
    var geocoder = new google.maps.Geocoder();
    var address = document.getElementById('zoom-to-area-text').value;
    if (address === '') {
        window.alert('You must enter an area, or address.');
    } else {
        geocoder.geocode({
            address: address,
            componentRestrictions: {locality: 'New York'}
        }, function (results, status) {
            if (status === google.maps.GeocoderStatus.OK) {
                map.setCenter(results[0].geometry.location);
                map.setZoom(15);
            } else {
                window.alert('we Could not find that location - try entering a more specific place')
            }
        });
    }
}

function searchWithinTime() {
    var distanceMatrixService = new google.maps.DistanceMatrixService();
    var address = document.getElementById('search-within-time-text').value;
    if (address === '') {
        window.alert('You must enter an address.')
    } else {
        hideMarkers(markers);
        var origins = [];
        for (var i = 0; i < markers.length; i++) {
            origins[i] = markers[i].position;
        }
        var destination = address;
        var mode = document.getElementById('mode').value;
        distanceMatrixService.getDistanceMatrix({
            origins: origins,
            destinations: [destination],
            travelMode: mode,
            unitSystem: google.maps.UnitSystem.IMPERIAL
        }, function (response, status) {
            if (status !== google.maps.DistanceMatrixStatus.OK) {
                window.alert('Error was:' + status);
            } else {
                // console.log(response);
                displayMarkersWithinTime(response);
            }
        })
    }
}

function displayMarkersWithinTime(response) {
    var maxDuration = document.getElementById('max-duration').value;
    var origins = response.originAddresses;
    var destinations = response.destinationAddresses;
    var atLeastOne = false;
    console.log(response);
    for (var i = 0; i < origins.length; i++) {
        results = response.rows[i].elements;
        for (var j = 0; j < results.length; j++) {
            var element = results[j];
            if (element.status === "OK") {
                var distanceText = element.distance.text;
                var duration = element.distance.value / 60;
                var durationText = element.duration.text;
                if (duration <= maxDuration) {
                    markers[i].setMap(map);
                    atLeastOne = true;
                    var infowindow = new google.maps.InfoWindow({
                        content: durationText + ' away, ' + distanceText +
                        '<br><br>' +
                        '<div>' +
                        '<input type=\"button\" value=\"View Route\" onclick=\"displayDirections(&quot;' + origins[i] + '&quot;)\">' +
                        '</div>'
                    });
                    infowindow.open(map, markers[i]);

                    markers[i].infowindow = infowindow;
                    google.maps.event.addListener(markers[i], 'click', function () {
                        this.infowindow.close();
                    });

                }
            }
        }
    }
    if (!atLeastOne) {
        window.alert('We Could Not Find Any Location Within that Distance');
    }
}

function displayDirections(origin) {
    hideMarkers(markers);
    var directoinsService = new google.maps.DirectionsService();
    var destinationAddress = document.getElementById('search-within-time-text').value;
    var mode = document.getElementById('mode').value;
    directoinsService.route({
        origin: origin,
        destination: destinationAddress,
        travelMode: google.maps.TravelMode[mode]
    }, function (result, status) {
        if (status === google.maps.DirectionsStatus.OK) {
            directionDisplay = new google.maps.DirectionsRenderer({
                map: map,
                directions: result,
                draggable: true,
                polylineOptions: {
                    strokeColor: 'red'
                }
            })
        } else {
            window.alert('Direction request failed due to' + status);
        }
    })

}

function searchBoxPlaces(searchBox) {
    hideMarkers(placeMarkers);
    var places = searchBox.getPlaces();
    createMarkersForPlaces(places);
    if(places.length === 0){
        window.alert("We did not find any place matching that search");
    }
}

function textSearchPlaces() {
    var bounds = map.getBounds();
    hideMarkers(placeMarkers);
    var placesService = new google.maps.places.PlacesService(map);
    placesService.textSearch({
        query: document.getElementById('places-search').value,
        bounds: bounds
    }, function(results, status) {
        if(status === google.maps.places.PlacesServiceStatus.OK){
            createMarkersForPlaces(results);
        }
    })
}

function createMarkersForPlaces(places) {
    var bounds = new google.maps.LatLngBounds();
    for(var i=0; i< places.length; i++){
        var place = places[i];
        var icon = {
            url: place.icon,
            size: new google.maps.Size(71, 71),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(17, 34),
            scaledSize: new google.maps.Size(25, 25)
        };
        var marker = new google.maps.Marker({
            map: map,
            icon: icon,
            title: place.name,
            position: place.geometry.location,
            id: place.place_id
        });
        var placeInfoWindow = new google.maps.InfoWindow();
        marker.addListener('click', function () {
            if(placeInfoWindow.marker == this){
                console.log("This infoWindow is already on this marker!");
            } else {
                getPlaceDetails(this, placeInfoWindow);
            }
        });
        placeMarkers.push(marker);
        if(place.geometry.viewport){
            bounds.union(place.geometry.viewport);
        }else {
            bounds.extend(place.geometry.location);
        }
        map.fitBounds(bounds);
    }
}

function getPlaceDetails(marker, infowindow) {
    var service = new google.maps.places.PlacesService(map);
    service.getDetails({
        placeId: marker.id
    }, function (place, status) {
        if( status === google.maps.places.PlacesServiceStatus.OK){
            infowindow.marker = marker;
            var innerHTML = '<div>';
            if(place.name){
                innerHTML += '<strong>'+ place.name +'</strong>';
            }
            if(place.formatted_address){
                innerHTML += '<br>'+ place.formatted_address;
            }
            if(place.formatted_phone_number){
                innerHTML += '<br>'+ place.formatted_phone_number;
            }
            if(place.opening_hours){
                innerHTML += '<br><br><strong>Hours:</strong><br>'+
                        place.opening_hours.weekday_text[0] + '<br>' +
                        place.opening_hours.weekday_text[1] + '<br>' +
                        place.opening_hours.weekday_text[2] + '<br>' +
                        place.opening_hours.weekday_text[3] + '<br>' +
                        place.opening_hours.weekday_text[4] + '<br>' +
                        place.opening_hours.weekday_text[5] + '<br>' +
                        place.opening_hours.weekday_text[6];
            }
            if(place.photos){
                innerHTML += '<br><br><img src="'+ place.photos[0].getUrl({'maxWidth': 300, 'maxHeight': 150}) +'">'
            }
            innerHTML += '</div>';
            infowindow.setContent(innerHTML);
            infowindow.open(map, marker);
            infowindow.addListener('closeclick', function () {
                infowindow.marker = null;
            })
        }
    });
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
