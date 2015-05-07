/**
 * Created by Boss on 3/13/2015.
 */

bikeMapApp.controller('MapCtrl', ['$rootScope', '$scope', '$log', '$timeout', '$window', '$state', '$stateParams', 'Collision_Service', 'Nearmiss_Service', 'Theft_Service', 'Hazard_Service', 'AlertArea_Service', 'Coord_Service', 'Icon', 'Popup_Service', 'NotificationPopup_Service', 'djangoAuth',
    function($rootScope, $scope, $log, $timeout, $window, $state, $stateParams, Collision_Service, Nearmiss_Service, Theft_Service, Hazard_Service, AlertArea_Service, Coord_Service, Icon, Popup_Service, NotificationPopup_Service, djangoAuth) {

        $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
            /*if(toState.name === 'app') {
                if(Coord_Service.dirty) {
                    $scope.map.setView(new L.LatLng(Coord_Service.coordinates[1], Coord_Service.coordinates[0]), 15);
                    updateIncidents(true);
                }
                Coord_Service.dirty = false;
                $window.dispatchEvent(new Event('resize'));
            }*/
            $window.dispatchEvent(new Event('resize'));
        });

    // Scope variables
    $scope.map = new L.Map('map');
    $scope.authInfo = djangoAuth;

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

   // Add geocoder to map
   var geocoder = L.Control.geocoder({
        position: "topleft"
   }).addTo($scope.map);

    // Handle geocode searches
    var geocodeMarker;
    geocoder.markGeocode = function(result) {
        $scope.map.fitBounds(result.bbox);
        geocodeMarker && $scope.map.removeLayer(geocodeMarker); //remove old marker if it exists

        geocodeMarker = new L.Marker(result.center, {
            icon: icons["geocodeIcon"]
        })
            .bindPopup(result.name)
            .addTo($scope.map)
            .openPopup();
    };

   // Geolocation
    var userMarker;
    $scope.geolocate = function () {
    $scope.map.locate({setView: true, watch: false, maxZoom: 16, enableHighAccuracy: true})
        .on('locationfound', function (location) {

            if (!userMarker) {
                userMarker = L.userMarker(location.latlng, {
                    smallIcon: true,
                    circleOpts: {weight: 1, opacity: 0.3, fillOpacity: 0.05}
                }).addTo($scope.map);
            }
            userMarker.setLatLng(location.latlng);
            userMarker.setAccuracy(location.accuracy);
        })
        .on('locationerror', function (e) {
            console.log(e);
            if(userMarker) {
                $scope.map.removeLayer(userMarker);
            }
            alert("Location access was denied. Please enable location services.");
        });
    };

    // Add geolocation button to the map
    var glControl = L.easyButton('fa fa-bicycle',$scope.geolocate,'', $scope.map);

   // Leaflet Draw Controls for guest and logged in user
   $scope.editableLayers = new L.FeatureGroup();
   $scope.map.addLayer($scope.editableLayers);

   // Logged in users can add/remove alert areas
   var leafletDrawOptionsUser = {
        draw: {
            polyline: false,
            polygon: {
                allowIntersection: false, // Restricts shapes to simple polygons
                drawError: {
                    color: '#e1e100', // Color the shape will turn when intersects
                    message: '<strong>Oh snap!<strong> you can\'t draw that!' // Message that will show when intersect
                }
            },
            circle: false, // Turns off this drawing tool
            rectangle: false
        },
        edit: {
            featureGroup: $scope.editableLayers, //REQUIRED!!
            remove: true
        }
   };

    // Guests can only report incidents
    var leafletDrawOptionsGuest = {
        draw: {
            polyline: false,
            polygon: false,
            circle: false,
            rectangle: false
        },
        edit: false
    };

    var drawControlUser = new L.Control.Draw(leafletDrawOptionsUser);
    var drawControlGuest = new L.Control.Draw(leafletDrawOptionsGuest);

   /* Provide an initial location to open the map to the CRD. Opening to the extent
      of the world downloads too much incident data
    */
   $scope.map.setView(new L.LatLng(48.5275192374508, -123.40599060058592), 11);

   /* If location services are enabled, center map on users current location
      Consider storing last viewed map center and open map there
   */
   $scope.geolocate();

    /* Add appropriate drawing controls to the map for guest/user */
    if(!$window.localStorage['user'] || $window.localStorage['user'] === 'Guest'  ) {
        $scope.map.addControl(drawControlGuest);
    } else if($window.localStorage['token']) {
        $scope.map.addControl(drawControlUser);
    }
    else {
        $scope.map.addControl(drawControlGuest);
    }



    var incidentData = new L.MarkerClusterGroup({
        maxClusterRadius: 70,
        polygonOptions: {
            color: '#2c3e50',
            weight: 3
        },
       iconCreateFunction: function (cluster) {
            var data = serializeClusterData(cluster);
            return pieChart(data);
        }
    });
    $scope.map.addLayer(incidentData);

    // Handle a click on a single marker
    incidentData.on('click', function(e){
        var layer = e.layer;
        var popupContent = Popup_Service(e.layer);
        layer.bindPopup(popupContent, {closeOnClick: true}).openPopup();
    });


    // Purpose: Initializes the Pie chart cluster icons by getting the needed attributes from each cluster
    // and passing them to the pieChart function
    function serializeClusterData(cluster) {
        var children = cluster.getAllChildMarkers(),
            n = 0,
            colorRef = {};

        for (var icon in icons) {
            // Add a counting field to the icons objects
            icons[icon]["count"] = 0;
            // construct colorRef object for efficiency of bin sort
            colorRef[icons[icon].options.color] = icon;
        }

        //Count the number of markers in each cluster
        children.forEach(function(child) {
            // Match childColor to icon in icons
            var icon = colorRef[child.options.icon.options.color];
            icons[icon].count++;
            n++;
        });

        // Make array of icons data
        var data = $.map(icons, function(v) {
            return v;
        });
        // Push total points in cluster
        data.push(n);

        return data;
    }

        // pieChart
// 	Purpose: Builds the svg DivIcons
// 	inputs: data as list of objects containing "type", "count", "color", outer chart radius, inner chart radius, and total points for cluster
// 	output: L.DivIcon donut chart where each "type" is mapped to the corresponding "color" with a proportional section corresponding to "count"
        function pieChart(data) {
            // Pop total points in cluster
            var total = data.pop();

            outerR = (total >= 10 ? (total < 50 ? 20 : 25) : 15),
                innerR = (total >= 10 ? (total < 50 ? 10 : 13) : 7);

            var arc = d3.svg.arc()
                .outerRadius(outerR)
                .innerRadius(innerR);

            var pie = d3.layout.pie()
                .sort(null)
                .value(function(d) {
                    return d.count;
                });

            // Define the svg layer
            var width = 50,
                height = 50;
            var svg = document.createElementNS(d3.ns.prefix.svg, 'svg');
            var vis = d3.select(svg)
                .data(data)
                .attr('class', 'marker-cluster-pie')
                .attr('width', width)
                .attr('height', height)
                .append("g")
                .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');

            var g = vis.selectAll(".arc")
                .data(pie(data))
                .enter().append("g")
                .attr('class', 'arc');

            g.append('path')
                .attr("d", arc)
                .style("fill", function(d) {
                    return d.data.options.color;
                });

            // Add center fill
            vis.append("circle")
                .attr("cx", 0)
                .attr("cy", 0)
                .attr("r", innerR)
                .attr('class', 'center')
                .attr("fill", "#f1f1f1");

            // Add count text
            vis.append('text')
                .attr('class', 'pieLabel')
                .attr('text-anchor', 'middle')
                .attr('dy', '.3em')
                .text(total)

            var html = serializeXmlNode(svg);

            return new L.DivIcon({
                html: html,
                className: 'marker-cluster',
                iconSize: new L.Point(40, 40)
            });

            // Purpose: Helper function to convert xmlNode to a string
            function serializeXmlNode(xmlNode) {
                if (typeof window.XMLSerializer != "undefined") {
                    return (new window.XMLSerializer()).serializeToString(xmlNode);
                } else if (typeof xmlNode.xml != "undefined") {
                    return xmlNode.xml;
                }
                return "";
            }
        }



    extendedBounds = getExtendedBounds($scope.map.getBounds());
    getIncidents(extendedBounds);
    getAlertAreas();








    // Get icons/markers for the map
    var collisionIcon = Icon.marker('collision');
    var nearmissIcon = Icon.marker('nearmiss');
    var hazardIcon = Icon.marker('hazard');
    var theftIcon = Icon.marker('theft');
    var officialIcon = Icon.marker('official');

    var collisionLayer, nearmissLayer, hazardLayer, theftLayer, officialLayer, alertareaLayer;


    // Get data from the Bike Maps api and add to Marker Cluster Layer
    function getIncidents(bnds){

        // Clear existing data from map
        incidentData.clearLayers();
       /* try {
            $scope.legendControl.removeLayer(hazardLayer);
        }
        catch(err) {
            console.log(err);
        }*/

        // Get collision data from BikeMaps api and add to map
        var collisions = Collision_Service.get({bbox: bnds.toBBoxString()});
        collisions.$promise.then(function () {
            collisionLayer = L.geoJson(collisions.features, {
                pointToLayer: function (feature, latlng) {
                    return L.marker(latlng, {icon: collisionIcon,
                                            ftype: 'collision',
                                            objType: feature.properties.model})
                }
            });
            incidentData.addLayer(collisionLayer);
        });

        // Get nearmiss data from BikeMaps api and add to map
        var nearmiss = Nearmiss_Service.get({bbox: bnds.toBBoxString()});
        nearmiss.$promise.then(function () {
            nearmissLayer = L.geoJson(nearmiss.features, {
                pointToLayer: function (feature, latlng) {
                    return L.marker(latlng, {icon: nearmissIcon,
                                            ftype: 'nearmiss',
                                            objType: feature.properties.model
                    })
                }
            });
            incidentData.addLayer(nearmissLayer);
        });

        // Get hazard data from BikeMaps api and add to map
        var hazards = Hazard_Service.get({bbox: bnds.toBBoxString()});
        hazards.$promise.then(function () {
            hazardLayer = L.geoJson(hazards.features, {
                pointToLayer: function (feature, latlng) {
                    return L.marker(latlng, {icon: hazardIcon,
                                            ftype: 'hazard',
                                            objType: feature.properties.model})
                }
            });
            incidentData.addLayer(hazardLayer);
        });

        // Get theft data from BikeMaps api and add to map
        var thefts = Theft_Service.get({bbox: bnds.toBBoxString()});
        thefts.$promise.then(function () {
            theftLayer = L.geoJson(thefts.features, {
                pointToLayer: function (feature, latlng) {
                    return L.marker(latlng, {icon: theftIcon,
                                            ftype: 'theft',
                                            objType: feature.properties.model})
                }
            });
            incidentData.addLayer(theftLayer);
        });

    }

    // Update incidents data on map
    function updateIncidents(force) {
        console.log("In updateIncidents method");
        newMapBounds = $scope.map.getBounds();

        if(force){
            extendedBounds = getExtendedBounds(newMapBounds);
            getIncidents(extendedBounds);
        } else {
            if(newBoundsWithinExtended(newMapBounds, extendedBounds)){

            } else {
                extendedBounds = getExtendedBounds(newMapBounds);
                getIncidents(extendedBounds);
            }
    }}


   function getAlertAreas(){
       var ath = $window.localStorage["authenticated"];
       var tok = $window.localStorage["token"];

       if($window.localStorage["authenticated"] !== "null" && $window.localStorage["authenticated"] && $window.localStorage["token"] !== "null" && $window.localStorage["token"]) {
           console.log("Going to get alert areas");
           AlertArea_Service.setToken($window.localStorage["token"]);
           var alertareas = AlertArea_Service.getAlertAreas().get();
           alertareas.$promise.then(function() {
               alertareaLayer = L.geoJson(alertareas, {
                   style: function(feature) {
                       return {
                           color: '#3b9972',
                           weight: 2,
                           opacity: 0.6,
                           fillOpacity: 0.1,
                           pk: feature.id,
                           /*Mark the polygon with it's database id*/
                           objType: 'polygon'
                       }}
                   }).addTo($scope.map);
           })
   }}

   function removeAlertAreas(){
       if(alertareaLayer) {
           $scope.map.removeLayer(alertareaLayer);
           alertareaLayer = null;
       }
   }

    $scope.map.on('moveend', function(){
        updateIncidents(false);
    });

    $scope.map.on('overlayremove', function(e) {
        console.log(e);
    })

    $rootScope.$on("djangoAuth.logged_in", function() {
        getAlertAreas();
        $scope.map.removeControl(drawControlGuest);
        $scope.map.addControl(drawControlUser);
        $scope.legend.alertAreas = true;
    });

    $rootScope.$on('djangoAuth.logged_out', function() {
        removeAlertAreas();
        $scope.map.removeControl(drawControlUser);
        $scope.map.addControl(drawControlGuest);
        $scope.legend.alertAreas = false;
    });

    $rootScope.$on('BMA.panToPoint', function(e, notification) {
        if(notification && notification.data && notification.data.payload && notification.data.payload.lat && notification.data.payload.lng) {
            $scope.map.setView(new L.LatLng(notification.data.payload.lat, notification.data.payload.lng), 17);
            updateIncidents(true);
            /*var popup = L.popup({offset: L.point(0,-26)})
             .setLatLng(new L.LatLng(notification.data.payload.lat, notification.data.payload.lng))
             .setContent(NotificationPopup_Service(notification.data.payload));

             }
             popup.openOn($scope.map);*/
            $scope.map.openPopup(NotificationPopup_Service(notification.data.payload), new L.LatLng(notification.data.payload.lat, notification.data.payload.lng) , {offset: L.point(0, -26), minWidth:150});
        }});

        

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
        //console.log(newMapBnds._southWest.lat + ', ' + newMapBnds._southWest.lng + ', ' + newMapBnds._northEast.lat + ', ' + newMapBnds._northEast.lng );
        //console.log(extendedBnds._southWest.lat + ', ' + extendedBnds._southWest.lng + ', ' + extendedBnds._northEast.lat + ', ' + extendedBnds._northEast.lng );
        //console.log(newMapBnds._southWest.lat < extendedBnds._southWest.lat);
        //console.log(newMapBnds._southWest.lng < extendedBnds._southWest.lng );
        //console.log(newMapBnds._northEast.lat > extendedBnds._northEast.lat );
        //console.log(newMapBnds._northEast.lng > extendedBnds._northEast.lng);
        if(newMapBnds._southWest.lat < extendedBnds._southWest.lat ||
            newMapBnds._southWest.lng < extendedBnds._southWest.lng ||
            newMapBnds._northEast.lat > extendedBnds._northEast.lat ||
            newMapBnds._northEast.lng > extendedBnds._northEast.lng) {
            return false;
        }
        else {
            return true;
        }
    }

    /* Define actions triggered by new drawings */
    $scope.map.on('draw:created', function (e) {
        var type = e.layerType;
       // var layer = e.layer;

        if (type === 'marker') {
            Coord_Service.coordinates[0] = e.layer.getLatLng().lng;
            Coord_Service.coordinates[1] = e.layer.getLatLng().lat;
            Coord_Service.dirty = true;
            //console.log(e.layer.getLatLng());
            $state.go('incidentform');
            //layer.bindPopup('A popup!');
            console.log("Going to form state")
        } else if(type == 'polygon') {
            console.log("Something happened with a polygon");
        }

        //$scope.editableLayers.addLayer(layer);
    });

    $scope.legend = {
        incidentData: true,
        collision: true,
        nearmiss: true,
        hazard: true,
        theft: true,
        official: true,
        filter: false,
        stravaHM: true,
        alertAreas: false,
        infrastructure: false
    };


    $scope.$watch('legend.incidentData', function() {
        try {
            if (incidentData && $scope.legend.incidentData) {
                if (collisionLayer && $scope.legend.collision) {
                    incidentData.addLayer(collisionLayer);
                }
                if (nearmissLayer && $scope.legend.nearmiss) {
                    incidentData.addLayer(nearmissLayer);
                }
                if (hazardLayer && $scope.legend.hazard) {
                    incidentData.addLayer(hazardLayer);
                }
                if (theftLayer && $scope.legend.theft) {
                    incidentData.addLayer(theftLayer);
                }
                if (officialLayer && $scope.legend.official) {
                    incidentData.addLayer(officialLayer);
                }
            } else {
                incidentData.clearLayers();
            }
        } catch (err) {
            console.log("One or more layers could not be added to the map")
        }
    });

    $scope.$watch('legend.collision', function() {
        if(collisionLayer) {
            $scope.legend.collision ? incidentData.addLayer(collisionLayer) : incidentData.removeLayer(collisionLayer);
        }
    });
    $scope.$watch('legend.nearmiss', function() {
        if(nearmissLayer) {
            $scope.legend.nearmiss ? incidentData.addLayer(nearmissLayer) : incidentData.removeLayer(nearmissLayer);
        }
    });
    $scope.$watch('legend.hazard', function() {
        if(hazardLayer) {
            $scope.legend.hazard ? incidentData.addLayer(hazardLayer) : incidentData.removeLayer(hazardLayer);
        }
    });
    $scope.$watch('legend.theft', function() {
        if(theftLayer) {
            $scope.legend.theft ? incidentData.addLayer(theftLayer) : incidentData.removeLayer(theftLayer);
        }
    });
    $scope.$watch('legend.official', function() {
        if(officialLayer) {
            $scope.legend.official ? incidentData.addLayer(officialLayer) : incidentData.removeLayer(officialLayer);
        }
    });
    $scope.$watch('legend.stravaHM', function() {
        if(stravaHM) {
            $scope.legend.stravaHM ? $scope.map.addLayer(stravaHM) : $scope.map.removeLayer(stravaHM);
        }
    });
    $scope.$watch('legend.alertAreas', function() {
       if(alertareaLayer) {
           $scope.legend.alertAreas ? $scope.map.addLayer(alertareaLayer) : $scope.map.removeLayer(alertareaLayer);
       }
    });
    $scope.$watch('legend.infrastructure', function() {
        if(infrastructure) {
            $scope.legend.infrastructure ? $scope.map.addLayer(infrastructure) : $scope.map.removeLayer(infrastructure);
        }
    });

    $scope.$watch('legend.filter', function() {
       console.log("Filter changed: " + $scope.legend.filter);
    });


    // Control legend collapsing (modified code from leaflet/src/L.control.layers)
    var container = $('#legend .leaflet-control-layers');

    $scope.legendControl = function() {
        $(window).resize(function (e) {
            if ($(window).width() < 700) {
                var link = $('#legend .leaflet-control-layers-toggle'),
                    mapContainer = $('#map');

                if (!L.Browser.android) {
                    container.mouseenter(expand);
                    container.mouseleave(collapse);
                }

                if (L.Browser.touch) {
                    link.click(function (e) {
                        e.stopPropagation();
                        expand();
                    });
                } else {
                    link.focus(expand);
                }

                mapContainer.click(collapse);
            }

            else {
                expand();
            }
        });
        $(window).trigger('resize'); //Call event handler on load

        function expand() {
            container.addClass('leaflet-control-layers-expanded');
        };

        function collapse() {
            container.removeClass('leaflet-control-layers-expanded');
        };
    };

    $scope.legendControl();


        // Initialize the slider
        $("input.slider").ready(function(){
            var mySlider = $("input.slider").slider({
                step: 1,
                max: (moment().weekYear() - 1970) * 12 + moment().month(), //months since epoch
                min: (moment().weekYear() - 1980) * 12  + moment().month(), //months since epoch minus 10 years

                range: true,
                tooltip: 'hide',
                enabled: false,
                handle: 'custom',

                formatter: function(val){
                    return sliderDate(val[0]).format("MMM-YYYY") + " : " + sliderDate(val[1]).format("MMM-YYYY");
                }
            });
        });

// Convert months since epoch into a moment.js date object
        function sliderDate(m){
            return moment({
                year: 1970 + m/12,
                month: m%12
            });
        };

        $("#filterCheckbox").click(function() {
            if(this.checked) {
                var sliderVal = $('input.slider').slider('getValue')
                $("input.slider").slider("enable");
                $("div.filter .start-date").text(sliderDate(sliderVal[0]).format("MMM-YYYY"));
                $("div.filter .end-date").text(sliderDate(sliderVal[1]).format("MMM-YYYY"));
                // Add filtered points to map
                filterPoints(sliderVal[0], sliderVal[1])
            }
            else {
                $("input.slider").slider("disable");
                $("div.filter .start-date").text("");
                $("div.filter .end-date").text("");
                // Add all points back to map
                resetPoints();
            }
        });

}]);