/**
 * Created by angeboss on 3/21/2015.
 */

angular.module('bikeMapApp.incidents', ['bikeMapApp.services'])

    .factory('TheftData', ['Incident_Service', 'Theft_Service', 'Hazard_Service',
        function(Incident_Service, Theft_Service, Hazard_Service) {

            var TheftData = function (bnds) {
                this.initialize = function () {
                    var thefts = Theft_Service.get({bbox: bnds.toBBoxString()});
                    var self = this;

                    thefts.$promise.then(function (response) {
                        angular.extend(self, response.data);
                    });
                };
                this.initialize();
            };
            return (TheftData);
        }])