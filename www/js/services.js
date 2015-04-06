/**
 * Created by angeboss on 3/18/2015.
 */

angular.module('bikeMapApp.services', ['ngResource'])

    .factory('Point_Service',  function($resource){
        return $resource(
            "http://127.0.0.1:8000/points/\\.json",
            {},
            {get: {method: 'GET'}});
    })

    .factory('Incident_Service',  function($resource){
        return $resource(
            "http://127.0.0.1:8000/incidents/\\.json",
            {},
            {get: {method: 'GET'}});
    })

    .factory('Collision_Service',  function($resource){
        return $resource(
            "http://127.0.0.1:8000/collisions/\\.json/",
            {},
            {get: {method: 'GET'}});
    })

    .factory('Nearmiss_Service',  function($resource){
        return $resource(
            "http://127.0.0.1:8000/nearmiss/\\.json",
            {},
            {get: {method: 'GET'}});
    })

    .factory('Hazard_Service',  function($resource){
        return $resource(
            "http://127.0.0.1:8000/hazards/\\.json",
            {},
            {get: {method: 'GET'}});
    })

    .factory('Theft_Service',  function($resource){
        return $resource(
            //"http://127.0.0.1:8000/thefts_api.json/",
            "http://127.0.0.1:8000/thefts/\\.json",
            {},
            {get: {method: 'GET'}});
    })

    .factory('Official_Service',  function($resource){
        return $resource(
            "http://127.0.0.1:8000/official/\\.json",
            {},
            {get: {method: 'GET'}});
    })

    .factory('AlertArea_Service', function($resource, $cookies) {
        console.log("Inside alert area service");
        return $resource(
            "http://127.0.0.1:8000/alertareas/\\.json",
            {},{
            get: {
                method: 'GET',
                headers: {'Authorization': 'Token ' + $cookies.token}
            }});
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
                popup += '<br><strong>Data source: </strong> ' + feature.properties.data_source + '<a href="#" data-toggle="collapse" data-target="#official-metadata"><small> (metadata)</small></a><br>' + '<div id="official-metadata" class="metadata collapse">' + '<strong>Metadata: </strong><small>' + feature.properties.metadata + '</small></div>';

            } else return "error";

            return popup;
        };
    })


