/**
 * Created by boss on 4/8/2015.
 */

angular.module('bikeMapApp.constants',[])
    .factory('Constants',[function(){

        var constants = {
            API: "https://bikemaps.org/",
            FORM_DEFAULT: '---------'
        };
        return constants;
    }]);
