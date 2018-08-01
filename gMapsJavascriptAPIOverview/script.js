var map;

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: 40.7413549,
            lng: -73.9980244
        },
        zoom: 13
    });
    var tribeca = {
        lat: 40.719526,
        lng: -74.0089934
    };
    var marker = new google.maps.Marker({
        position: tribeca,
        map: map,
        title: "First Marker",
        draggable: true,
        animation: google.maps.Animation.DROP
    });
    var infoWindow = new google.maps.InfoWindow({
        content: "This is a Info Window displaying info about the marker"
    });

    marker.addListener('click', function () {
        infoWindow.open(map,marker);
    })
}