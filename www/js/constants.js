/**
 * Created by boss on 4/8/2015.
 */

angular.module('bikeMapApp.constants',[])
    .factory('Constants',[function(){

        var constants = {
            //API: "https://bikemaps.org/",
            API: "http://192.168.1.125:8000/",
            FORM_DEFAULT: '---------'
        };
        return constants;
    }]);
