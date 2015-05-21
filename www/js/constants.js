/**
 * Created by boss on 4/8/2015.
 */

angular.module('bikeMapApp.constants',[])
    .factory('Constants',[function(){
        var _API = {
            baseUrl: "http://206.87.171.174:8000/"
        };

        var _timeouts = {
            collection: {
                user : 0
            }
        };


        var constants = {
            DEBUGMODE : false,
            SHOWBROADCAST_EVENTS : true,
            // API: "http://206.87.171.174:8000/",
           // API: "https://bikemaps.org/",
            API: "http://192.168.1.125:8000/",
            timeouts: _timeouts,
            FORM_DEFAULT: '---------'
        };
        return constants;
    }]);
