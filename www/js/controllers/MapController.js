/**
 * Created by Boss on 3/13/2015.
 */

bikeMapApp.controller('mapController', ['$scope', '$log', '$timeout', 'Incident_Service', 'Theft_Service', 'Hazard_Service', 'Icon',
    function($scope, $log, $timeout, Incident_Service, Theft_Service, Hazard_Service, Icon) {

    // Scope variables
    $scope.map = new L.Map('map');

    //Controller variables
    var extendedBounds;
    var newMapBounds;




    // Add OSM Base Layer
   var osmBase = L.tileLayer('http://otile{s}.mqcdn.com/tiles/1.0.0/map/{z}/{x}/{y}.jpeg', {
        attribution: 'Tiles Courtesy of <a href="http://www.mapquest.com/">MapQuest</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        subdomains: '1234'
    }).addTo($scope.map);

    // Add Strava data
    var stravaHM = L.tileLayer('https://d2z9m7k9h4f0yp.cloudfront.net/tiles/cycling/color5/{z}/{x}/{y}.png', {
        minZoom: 3,
        maxZoom: 17,
        opacity: 0.8,
        attribution: '<a href=http://labs.strava.com/heatmap/>http://labs.strava.com/heatmap/</a>'
    }).addTo($scope.map);

    // Add OSM bike infrastructure hosted at BikeMaps.org
    var infrastructure = new L.tileLayer.wms("https://bikemaps.org/WMS", {
        layers: 'bikemaps_infrastructure',
        format: 'image/png',
        transparent: true,
        version: '1.3.0'
    }).addTo($scope.map);

    $scope.map.setView(new L.LatLng(49.6289109, -125.0276107), 15);

    $scope.legendControl = L.control.layers({},{}).addTo($scope.map);
    $scope.legendControl.addOverlay(osmBase, 'OSM');
    $scope.legendControl.addOverlay(stravaHM, 'Strave Ridership Data');
    $scope.legendControl.addOverlay(infrastructure, 'Infrastructure');


    extendedBounds = getExtendedBounds($scope.map.getBounds());
    getIncidents(extendedBounds);

    // Geolocation
    $scope.geolocate = function () {
        var yourLocation;
        var locationCircle;
        $scope.map.locate({setView: true, watch: true, maxZoom: 15})
            .on('locationfound', function (e) {

                if(yourLocation) {
                    $scope.map.removeLayer(yourLocation);
                    $scope.map.removeLayer(locationCircle);
                }

                glIcon = L.icon({
                    iconUrl: 'img/bluedot.png',
                    iconSize: [17, 17],
                    iconAnchor: [9, 9]
                });

                yourLocation = L.marker([e.latitude, e.longitude], {icon: glIcon}).bindPopup('Your are here.');
                locationCircle = L.circle([e.latitude, e.longitude], e.accuracy / 2, {
                    weight: 1,
                    color: 'blue',
                    fillColor: '#cacaca',
                    fillOpacity: 0.2
                });
                $scope.map.addLayer(yourLocation);
                $scope.map.addLayer(locationCircle);
                $scope.map.stopLocate();
            })
            .on('locationerror', function (e) {
                console.log(e);
                if(yourLocation) {
                    $scope.map.removeLayer(yourLocation);
                    $scope.map.removeLayer(locationCircle);
                }
                $scope.map.stopLocation();
                alert("Location access denied");
            });
    };

    $scope.glControl = L.easyButton('fa fa-bicycle',$scope.geolocate,'', $scope.map);




    //var currentMapBoundsStr;
    $scope.map.on('moveend', updateIncidents);
    $scope.incidents;
    $scope.hazards;
    //$scope.theft_layer = L.geoJson({atyle: Icon.marker('theft') }).addTo($scope.map);
    $scope.incident_layer;
   //$scope.theft_layer.marker.setIcon(icon.marker('theft'));
    $scope.hazard_layer;


   $scope.theftIcon = Icon.marker('theft');

    var theft_layer;

    // Get incidents within the specified bounds and add them to the map
    function getIncidents(bnds){
        var thefts = Theft_Service.get({bbox: bnds.toBBoxString()});
        thefts.$promise.then(function () {
            //console.log('Thefts: ' + thefts.features);
            theft_layer = L.geoJson(thefts.features, {
                pointToLayer: function (feature, latlng) {
                    return L.marker(latlng, {icon: $scope.theftIcon})
                }
            }).addTo($scope.map);
            $scope.legendControl.addOverlay(theft_layer, {'<i class="theft fa fa-bicycle icon-black"></i><small> Bike Theft</small>': theft_layer});

        });
    }


    // Update incidents data on map and legend control
    function updateIncidents(e) {
        newMapBounds = $scope.map.getBounds();

        if(newBoundsWithinExtended(newMapBounds, extendedBounds)){
            return;
        }
        else {
            //$scope.legendControl.removeLayer(theft_layers);
            extendedBounds = getExtendedBounds(newMapBounds);

            getIncidents(extendedBounds);
            //console.log($scope.currentMapBoundsStr);
            // Get incident data
            //$scope.incidents = Incident_Service.get({bbox: $scope.currentMapBoundsStr});
            //$scope.incidents.$promise.then(function(){
            //    console.log('Incidents: ' + $scope.incidents.features[0]);
            //    $scope.incident_layer = L.geoJson($scope.incidents.features[0]).addTo($scope.map);
            //});

            // Get theft data
            // if(theft_layer) {

            //}
            /*var thefts = Theft_Service.get({bbox: newMapBoundsStr});
            thefts.$promise.then(function () {
                //console.log('Thefts: ' + $scope.thefts.features);
                theft_layer = L.geoJson(thefts.features, {
                    pointToLayer: function (feature, latlng) {
                        return L.marker(latlng, {icon: $scope.theftIcon})
                    }
                }).addTo($scope.map);
                $scope.legendControl.addOverlay(theft_layer, 'Thefts');

            });*/
        }
    };

    // Arbitrarily increase size of bounding box
    function getExtendedBounds(bnds){
        // get the coordinates for the sake of readability
        var swlat = bnds._southWest.lat;
        var swlng = bnds._southWest.lng;
        var nelat = bnds._northEast.lat;
        var nelng = bnds._northEast.lng;

        // Increase size of bounding box in each direction by 50%
        swlat = swlat - Math.abs(0.5*(swlat - nelat)) > -90 ? swlat - Math.abs(0.5*(swlat - nelat)) : -90;
        swlng = swlng - Math.abs(0.5*(swlng - nelng)) > -180 ? swlng - Math.abs(0.5*(swlng - nelng)) : -180;
        nelat = nelat + Math.abs(0.5*(swlat - nelat)) < 90 ? nelat + Math.abs(0.5*(swlat - nelat)) : 90;
        nelng = nelng + Math.abs(0.5*(swlng - nelng)) < 180 ? nelng + Math.abs(0.5*(swlng - nelng)) : 180;

        return L.latLngBounds(L.latLng(swlat, swlng), L.latLng(nelat, nelng));
    };

    // Determine if the new bounding box is with in the old bounding box
    // Return true if new BBox is contained within the old BBox
    function newBoundsWithinExtended(newMapBnds, extendedBnds) {
        if(newMapBnds._southWest.lat > extendedBnds._southWest.lat ||
            newMapBnds._southWest.lng > extendedBnds._southWest.lng ||
            newMapBnds._northEast.lat < extendedBnds._northEast.lat ||
            newMapBnds._northEast.lng < extendedBnds._northEast.lng) {
            return true;
        }
        else {
            return false;
        }
    };


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

    // Bind popups to marker, circle and polygon
  //  $scope.marker.bindPopup("<b>Hello world!</b><br>I am a popup.").openPopup();
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

    $scope.map.on('contextmenu', $scope.onMapClick);

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