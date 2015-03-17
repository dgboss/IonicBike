/**
 * Created by Boss on 3/13/2015.
 */

bikeMapApp.controller('mapController', ['$scope', '$log', function($scope, $log){

    // Initialize map
    $scope.map = new L.Map('map');

    // Add OSM Base Layer
    $scope.osmBase = new L.tileLayer('http://otile{s}.mqcdn.com/tiles/1.0.0/map/{z}/{x}/{y}.jpeg', {
        attribution: 'Help', // 'Tiles Courtesy of <a href="http://www.mapquest.com/">MapQuest</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        subdomains: '1234'
    }).addTo($scope.map);

    $scope.map.setView(new L.LatLng(49.6289109, -125.0276107), 15);


    // Add Strava data
    $scope.stravaHM = L.tileLayer('https://d2z9m7k9h4f0yp.cloudfront.net/tiles/cycling/color5/{z}/{x}/{y}.png', {
        minZoom: 3,
        maxZoom: 17,
        opacity: 0.8,
        attribution: '<a href=http://labs.strava.com/heatmap/>http://labs.strava.com/heatmap/</a>'
    }).addTo($scope.map);

    // Add OSM bike infrastructure hosted at BikeMaps.org
    $scope.infrastructure = new L.tileLayer.wms("https://bikemaps.org/WMS", {
        layers: 'bikemaps_infrastructure',
        format: 'image/png',
        transparent: true,
        version: '1.3.0'
    }).addTo($scope.map);






    // Add a marker
    $scope.marker = L.marker([49.6289109, -125.0276107]).addTo($scope.map);

    // Add a circle
    $scope.circle = L.circle([51.508, -0.11], 500, {
        color: 'red',
        fillColor: '#f03',
        fillOpacity: 0.5
    }).addTo($scope.map);

    // Add a polygon
    $scope.polygon = L.polygon([
        [51.509, -0.08],
        [51.503, -0.06],
        [51.51, -0.047]
    ]).addTo($scope.map);

    // Bing popups to marker, circle and polygon
    $scope.marker.bindPopup("<b>Hello world!</b><br>I am a popup.").openPopup();
    $scope.circle.bindPopup("I am a circle.");
    $scope.polygon.bindPopup("I am a polygon.");

    // Show a popup when you click the map
    $scope.popup = L.popup();
    $scope.onMapClick = function onMapClick(e) {
        $scope.popup
            .setLatLng(e.latlng)
            .setContent("You clicked the map at " + e.latlng.toString())
            .openOn($scope.map);
    }

    $scope.map.on('click', $scope.onMapClick);

    // Show a GeoJSON feature with marker options
    $scope.geojsonFeature = {
        "type": "Feature",
        "properties": {
            "name": "Coors Field",
            "amenity": "Baseball Stadium",
            "popupContent": "This is where the Rockies play!"
        },
        "geometry": {
            "type": "Point",
            "coordinates": [-104.99404, 39.75621]
        }
    };

    $scope.geojsonMarkerOptions = {
        radius: 8,
        fillColor: "#ff7800",
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
    };

    $scope.myLayer2 = L.geoJson($scope.geojsonFeature, {
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng, $scope.geojsonMarkerOptions);
        }
    }).addTo($scope.map);




}])