/**
 * Created by angeboss on 3/18/2015.
 */

angular.module('bikeMapApp.services', ['ngResource'])

    .factory('Point_Service',  function($resource){
        return $resource(
            "http://127.0.0.1:8000/points_api.json/",
            {},
            {get: {method: 'GET'}});
    })

    .factory('Incident_Service',  function($resource){
        return $resource(
            "http://127.0.0.1:8000/incidents_api.json/",
            {},
            {get: {method: 'GET'}});
    })

    .factory('Hazard_Service',  function($resource){
        return $resource(
            "http://127.0.0.1:8000/hazards_api.json/",
            {},
            {get: {method: 'GET'}});
    })

    .factory('Theft_Service',  function($resource){
        return $resource(
            "http://127.0.0.1:8000/thefts_api.json/",
            {},
            {get: {method: 'GET'}});
    })

    .factory('Official_Service',  function($resource){
        return $resource(
            "http://127.0.0.1:8000/official_api.json/",
            {},
            {get: {method: 'GET'}});
    });
