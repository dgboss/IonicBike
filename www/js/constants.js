/**
 * Created by boss on 4/8/2015.
 */

angular.module('bikeMapApp.constants',[])
    .service('Constants',[function(){
        var _API = {
            baseUrl: "http://192.168.1.125:8000/"
        }

        var _timeouts = {
            collection: {
                user : 0
            }
        }
        var constants = {
            DEBUGMODE : false,
            SHOWBROADCAST_EVENTS : true,
            API: _API,
            IMG: _img,
            timeouts: _timeouts
        };
        return constants;
    }])
