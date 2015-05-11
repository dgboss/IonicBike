/**
 * Created by boss on 4/8/2015.
 */

angular.module('bikeMapApp.constants',[])
    .factory('Constants',[function(){
        var _API = {
            baseUrl: "http://206.87.170.92:8000/"
        };

        var _timeouts = {
            collection: {
                user : 0
            }
        };


        var constants = {
            DEBUGMODE : false,
            SHOWBROADCAST_EVENTS : true,
            API: _API,
            timeouts: _timeouts,
            FORM_DEFAULT: '---------'
        };
        return constants;
    }]);
