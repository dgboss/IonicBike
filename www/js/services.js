/**
 * Created by boss on 3/18/2015.
 */

angular.module('bikeMapApp.services', ['ngResource', 'bikeMapApp.constants'])

    .factory('Collision_Service',  function($resource, Constants){
        return $resource(
            Constants.API + "collisions/\\.json/",
            {},
            {get: {method: 'GET'},
             save: {method:'POST'}});
    })

    .factory('Nearmiss_Service',  function($resource, Constants){
        return $resource(
            Constants.API + "nearmiss/\\.json",
            {},
            {get: {method: 'GET'},
             save: {method:'POST'}});
    })

    .factory('Hazard_Service',  function($resource, Constants){
        return $resource(
            Constants.API + "hazards/\\.json",
            {},
            {get: {method: 'GET'},
             save: {method:'POST'}});
    })

    .factory('Theft_Service',  function($resource, Constants){
        return $resource(
            Constants.API + "thefts/\\.json",
            {},
            {get: {method: 'GET'},
             save: {method:'POST'}});
    })

    .factory('Official_Service',  function($resource, Constants){
        return $resource(
            Constants.API + "official/\\.json",
            {},
            {get: {method: 'GET'}});
    })


    .factory('AlertArea_Service', function($resource, Constants) {
        var service = {};
        var _token;

        service.setToken = function(tkn){
            _token = tkn;
        };

        service.AlertAreas = function(){
                return $resource(
                    Constants.API + "alertareas/:id/\\.json",
                    {}, {
                        get: {
                            method: 'GET',
                            headers: {'Authorization': 'Token ' + _token}
                        },
                        save: {
                            method: 'POST',
                            headers: {'Authorization': 'Token ' + _token}
                        },
                        delete: {
                            method: 'DELETE',
                            headers: {'Authorization': 'Token ' + _token}
                        }
                    })
                };
        return service;
        })

    .factory('Popup_Service', function() {
        return function getPopup(layer) {
            var feature = layer.feature,
                type = layer.options.ftype,
                popup;

            if (type === "collision" || type === "nearmiss") {
                popup = '<strong>Type:</strong> ' + feature.properties.i_type + '<br><strong>';
                if (feature.properties.i_type != "Fall") popup += 'Incident with';
                else popup += 'Due to';
                popup += ':</strong> ' + feature.properties.incident_with + '<br><strong>Date:</strong> ' + moment(feature.properties.date).format("MMM. D, YYYY, h:mma");

                if(feature.properties.details){
                    popup += '<br><div class="popup-details"><strong>Details:</strong> ' + feature.properties.details + '</div>';
                }

            } else if (type === "hazard") {
                popup = '<strong>Hazard type:</strong> ' + feature.properties.i_type + '<br><strong>Date:</strong> ' + moment(feature.properties.date).format("MMM. D, YYYY, h:mma");
                if(feature.properties.details){
                    popup += '<br><div class="popup-details"><strong>Details:</strong> ' + feature.properties.details + '</div>';
                }

            } else if (type === "theft") {
                popup = '<strong>Theft type:</strong> ' + feature.properties.i_type + '<br><strong>Date:</strong> ' + moment(feature.properties.date).format("MMM. D, YYYY, h:mma");
                if(feature.properties.details){
                    popup += '<br><div class="popup-details"><strong>Details:</strong> ' + feature.properties.details + '</div>';
                }

            } else if (type === "official") {
                popup = "<strong>Type:</strong> " + feature.properties.official_type;
                if(feature.properties.details){
                    popup += " (" + feature.properties.details + ")";
                }
                if(feature.properties.time){
                    var date = moment(feature.properties.date + "T" + feature.properties.time).format("MMM. D, YYYY, h:mma");
                }else{
                    var date = moment(feature.properties.date).format("MMM. D, YYYY");
                }
                popup += '<br><strong>Date:</strong> ' + date;
                popup += '<br><strong>Data source: </strong> ' + feature.properties.data_source + '<a href="#" ng-show="feature.properties.metadata" data-toggle="collapse" data-target="#official-metadata"><small> (metadata)</small></a><br>' + '<div id="official-metadata" class="metadata collapse">' + '<strong>Metadata: </strong><small>' + feature.properties.metadata + '</small></div>';

            } else return "error";

            return popup;
        };
    })


    .factory('NotificationPopup_Service', function() {
        return function getNotificationPopup(data) {
            var type = data.type;
            var i_type = data.i_type;
            var date = data.date;
            var details = data.details;
            var incident_with = data.incident_with;
            var popup;

            if (type === "collision" || type === "nearmiss") {
                popup = '<strong>Type:</strong> ' + i_type + '<br><strong>';
                if (i_type != "Fall") popup += 'Incident with';
                else popup += 'Due to';
                popup += ':</strong> ' + incident_with + '<br><strong>Date:</strong> ' + moment(date).format("MMM. D, YYYY, h:mma");

                if(details){
                    popup += '<br><div class="popup-details"><strong>Details:</strong> ' + details + '</div>';
                }

            } else if (type === "hazard") {
                popup = '<strong>Hazard type:</strong> ' + i_type + '<br><strong>Date:</strong> ' + moment(date).format("MMM. D, YYYY, h:mma");
                if(details){
                    popup += '<br><div class="popup-details"><strong>Details:</strong> ' + details + '</div>';
                }

            } else if (type === "theft") {
                popup = '<strong>Theft type:</strong> ' + i_type + '<br><strong>Date:</strong> ' + moment(date).format("MMM. D, YYYY, h:mma");
                if(details){
                    popup += '<br><div class="popup-details"><strong>Details:</strong> ' + details + '</div>';
                }

            } else return "error";

            return popup;
        };
    })

    /* Service to share point where pins are dropped */
    .service('Coord_Service', function () {
        return {
            "dirty": false,
            "coordinates": [0,0]
        }
    });



