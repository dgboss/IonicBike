/**
 * Created by boss on 4/20/2015.
 */



bikeMapApp.controller('HazardCtrl', function ($scope, HazardTypeService) {

    $scope.selectTime = new  Date();
    $scope.hazardType = [{text: "One"}, {text: "two"}];
    $scope.selectedHazardType;

    $scope.model = {
        dt: null,
        maxDate: new Date()
    };

    //$scope.model.maxDate = $scope.model.maxDate.getDate();


   /* $scope.today = function() {
        $scope.dt = new Date();
    };
    $scope.today();*/

    $scope.clear = function () {
        $scope.dt = null;
    };

    $scope.toggleMin = function() {
        $scope.minDate = $scope.minDate ? null : new Date();
    };
    $scope.toggleMin();

    $scope.open = function($event) {
        if(window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.close();
        }
        $event.preventDefault();
        $event.stopPropagation();

        $scope.opened = true;
    };

    $scope.dateOptions = {
        formatYear: 'yyyy',
        showWeeks: 'false'
    };

});