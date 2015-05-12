/**
 * Created by boss on 4/20/2015.
 */

/*
 Controller for incident portion of incident form
 */
bikeMapApp.controller('IncidentCtrl', function($scope, $state, $window, $ionicModal, $location, $anchorScroll, Constants, IncidentReportService, CyclingFrequencyService, BirthYearService, BirthMonthService, GenderService, YesNoService, Coord_Service, Collision_Service, Nearmiss_Service) {

    $scope.incidentDetails = {
        selectedDateTime: null,
        maxDate: new Date(),
        incidentTypeChoices: IncidentReportService.incidentChoices,
        selectedIncidentType: {
            key: Constants.FORM_DEFAULT, text: Constants.FORM_DEFAULT
        },
        incidentObjectChoices: IncidentReportService.objectChoices,
        selectedObjectType: {
            key: Constants.FORM_DEFAULT, text: Constants.FORM_DEFAULT
        },
        incidentInjuryChoices: IncidentReportService.injuredChoices,
        selectedInjuryType: {
            key: Constants.FORM_DEFAULT, text: Constants.FORM_DEFAULT
        },
        incidentPurposeChoices: IncidentReportService.purposeChoices,
        selectedPurposeType: IncidentReportService.purposeChoices[0]
        };

    $scope.conditions = {
        incidentConditionsChoices: IncidentReportService.conditionChoices,
        selectedConditions: IncidentReportService.conditionChoices[0],
        sightConditionsChoices: IncidentReportService.sightConditionsChoices,
        selectSightConditions: IncidentReportService.sightConditionsChoices[0],
        carsParkedChoices: IncidentReportService.carsParkedChoices,
        selectedCarsParked: IncidentReportService.carsParkedChoices[0],
        ridingOnChoices: IncidentReportService.ridingOnChoices,
        selectedRidingOn: {
            text: Constants.FORM_DEFAULT
        },
        lightChoices: IncidentReportService.lightChoices,
        selectedLight: IncidentReportService.lightChoices[0],
        terrainChoices: IncidentReportService.terrainChoices,
        selectedTerrain: IncidentReportService.terrainChoices[0],
        directionChoices: IncidentReportService.directionChoices,
        selectedDirection: IncidentReportService.directionChoices[0],
        turningChoices: IncidentReportService.turningChoices,
        selectedTurning: IncidentReportService.turningChoices[0]
    };

    $scope.description = {
        details: ""
    };

    /* Personal details pane */
    $scope.personalDetails = {
        birthYearChoices: BirthYearService,
        selectedIncidentBirthYear: BirthYearService[0],
        birthMonthChoices: BirthMonthService,
        selectedIncidentBirthMonth: BirthMonthService[0],
        genderChoices: GenderService,
        selectedIncidentGender: GenderService[0],
        cyclingFrequencyChoices: CyclingFrequencyService,
        selectedIncidentCyclingFrequency: CyclingFrequencyService[0],
        helmetChoices: IncidentReportService.helmetChoices,
        selectedHelmet: IncidentReportService.helmetChoices[0],
        intoxicatedChoices: IncidentReportService.intoxicatedChoices,
        selectedIntoxicated: IncidentReportService.intoxicatedChoices[0]
    };

    $scope.model = {
        incidentChecked: false,
        dateAlert: false,
        incidentTypeAlert: false,
        incidentObjectAlert: false,
        incidentInjuryAlert: false,
        p_type: ""
    };

    $scope.markCheckbox = function() {
        $scope.model.incidentChecked = !$scope.model.incidentChecked;
    };

    /* If user has previously checked the box, keep the box checked when opening
     the form in the future.
     */
    if($window.localStorage['rememberCheck']) {
        if(typeof $window.localStorage['rememberCheck'] == 'string') {
            $scope.model.incidentChecked = JSON.parse($window.localStorage['rememberCheck']);
        }
        else {
            $scope.model.incidentChecked = $window.localStorage['rememberCheck'];
        }
    }

    $scope.submitIncident = function() {
        if( $scope.validateForm() ) {
            console.log("Form is valid");

            if($scope.incidentDetails.selectedIncidentType.key === IncidentReportService.incidentChoices[1].items[0].key ||
                $scope.incidentDetails.selectedIncidentType.key === IncidentReportService.incidentChoices[1].items[1].key) {
                $scope.model.p_type = 'nearmiss';
            } else {
                $scope.model.p_type = 'collision';
            }
                var incidentForm = {
                "geometry": {
                    "type": "Point",
                    "coordinates": [
                        Coord_Service.coordinates[0],
                        Coord_Service.coordinates[1]
                    ]
                },
                "properties": {
                    // Incident details to POST
                    "date": $scope.incidentDetails.selectedDateTime,
                    "i_type": $scope.incidentDetails.selectedIncidentType.key,
                    "incident_with": $scope.incidentDetails.selectedObjectType.key,
                    "injury": $scope.incidentDetails.selectedInjuryType.key,
                    "trip_purpose": $scope.incidentDetails.selectedPurposeType.key,
                    // Conditions to POST
                    "road_conditions": $scope.conditions.selectedConditions.key,
                    "sightlines": $scope.conditions.selectSightConditions.key,
                    "cars_on_roadside": $scope.conditions.selectedCarsParked.key,
                    "riding_on": $scope.conditions.selectedRidingOn.key,
                    "bike_lights": $scope.conditions.selectedLight.key,
                    "terrain": $scope.conditions.selectedTerrain.key,
                    "direction": $scope.conditions.selectedDirection.key,
                    "turning": $scope.conditions.selectedTurning.key,

                    //Description to POST
                    "details": $scope.description.details,

                    // Personal details to POST
                    "age": $scope.personalDetails.selectedIncidentBirthYear.key,
                    "birthmonth": $scope.personalDetails.selectedIncidentBirthMonth.key,
                    "sex": $scope.personalDetails.selectedIncidentGender.key,
                    "regular_cyclist": $scope.personalDetails.selectedIncidentCyclingFrequency.key,
                    "helmet": $scope.personalDetails.selectedHelmet.key,
                    "intoxicated": $scope.personalDetails.selectedIntoxicated.key,

                    "p_type": $scope.model.p_type
                }
            };

            var post;

            // Is this a collision/fall or a near miss?
            if($scope.model.p_type === 'nearmiss') {
                post = Nearmiss_Service.save(incidentForm);
            } else {
                post = Collision_Service.save(incidentForm);
            }

            post.$promise.then(
                Coord_Service.dirty = true,
                $state.go('app')
                );

        }
        else {
            console.log("Form is invalid");
        }
    };

    $scope.validateForm = function() {
        if( $scope.incidentDetails.selectedDateTime === null || $scope.incidentDetails.selectedIncidentType.key === Constants.FORM_DEFAULT ||
            $scope.incidentDetails.selectedObjectType.key === Constants.FORM_DEFAULT || $scope.incidentDetails.selectedInjuryType.key === Constants.FORM_DEFAULT) {
            if ($scope.incidentDetails.selectedDateTime === null) {
                $scope.model.dateAlert = true;
            } else {
                $scope.model.dateAlert = false;
            }
            if ($scope.incidentDetails.selectedIncidentType.key === Constants.FORM_DEFAULT) {
                $scope.model.incidentTypeAlert = true;
            } else {
                $scope.model.incidentTypeAlert = false;
            }
            if ($scope.incidentDetails.selectedObjectType.key === Constants.FORM_DEFAULT) {
                $scope.model.incidentObjectAlert = true;
            } else {
                $scope.model.incidentObjectAlert = false;
            }
            if ($scope.incidentDetails.selectedInjuryType.key === Constants.FORM_DEFAULT) {
                $scope.model.incidentInjuryAlert = true;
            } else {
                $scope.model.incidentInjuryAlert = false;
            }
            return false;
        }
        else {
            $scope.model.dateAlert = false;
            $scope.model.incidentTypeAlert = false;
            $scope.model.incidentObjectAlert = false;
            $scope.model.incidentInjuryAlert = false;

            return true;
        }
    };

    $scope.cancelIncident = function() {
        $state.go('app');
    }
});

/*
 Controller for hazard portion of incident form
 */
bikeMapApp.controller('HazardCtrl', function ($scope, $state, $window, $ionicModal, HazardGroupService, BirthYearService, BirthMonthService, GenderService, CyclingFrequencyService, Coord_Service, Hazard_Service) {
    /* Hazard details pane */
    $scope.hazardDetails = {
        selectedDateTime: null,
        maxDate: new Date(),
        selectedHazardType: {
            'key': '---------', 'text': '---------'
        },
        hazardGroupChoices: HazardGroupService
    };

    /* Description pane */
    $scope.description = {
        details: ""
    };

    /* Personal details pane */
    $scope.personalDetails = {
        birthYearChoices: BirthYearService,
        selectedHazardBirthYear: BirthYearService[0],
        birthMonthChoices: BirthMonthService,
        selectedHazardBirthMonth: BirthMonthService[0],
        genderChoices: GenderService,
        selectedHazardGender: GenderService[0],
        cyclingFrequencyChoices: CyclingFrequencyService,
        selectedHazardCyclingFrequency: CyclingFrequencyService[0]
    };

    $scope.model = {
        hazardChecked: false,
        dateAlert: false,
        hazardTypeAlert: false
    };

    $scope.markCheckbox = function() {
        $scope.model.hazardChecked = !$scope.model.hazardChecked;
    };

    /* If user has previously checked the box, keep the box checked when opening
        the form in the future.
    */
    if($window.localStorage['rememberCheck']) {
        if(typeof $window.localStorage['rememberCheck'] == 'string') {
            $scope.model.hazardChecked = JSON.parse($window.localStorage['rememberCheck']);
        }
        else {
            $scope.model.hazardChecked = $window.localStorage['rememberCheck'];
        }
    }

    $scope.submitHazard = function() {
        if( $scope.validateForm() ) {
            console.log("Form is valid");
            var hazardForm = {
                "geometry": {
                    "type": "Point",
                    "coordinates": [
                        Coord_Service.coordinates[0],
                        Coord_Service.coordinates[1]
                    ]
                },
                "properties": {
                    "i_type": $scope.hazardDetails.selectedHazardType.key,
                    "date": $scope.hazardDetails.selectedDateTime,
                    "p_type": "hazard",
                    "details": $scope.description.details,
                    "age": $scope.personalDetails.selectedHazardBirthYear.key,
                    "birthmonth": $scope.personalDetails.selectedHazardBirthMonth.key,
                    "sex": $scope.personalDetails.selectedHazardGender.key,
                    "regular_cyclist": $scope.personalDetails.selectedHazardCyclingFrequency.key
                }
            };

            var post = Hazard_Service.save(hazardForm);
            post.$promise.then(
                Coord_Service.dirty = true,
                $state.go('app')
            );


        }
        else {
            console.log("Form is invalid");
        }
    };


    $scope.validateForm = function() {
      if( $scope.hazardDetails.selectedDateTime === null || $scope.hazardDetails.selectedHazardType.key === "---------" ) {
          if ($scope.hazardDetails.selectedDateTime === null) {
              $scope.model.dateAlert = true;
          } else {
              $scope.model.dateAlert = false;
          }
          if ($scope.hazardDetails.selectedHazardType.key === "---------") {
              $scope.model.hazardTypeAlert = true;
          } else {
              $scope.model.hazardTypeAlert = false;
          }
          return false;
      }
      else {
          $scope.model.dateAlert = false;
          $scope.model.hazardTypeAlert = false;
          return true;
      }
    };

    $scope.cancelHazard = function() {
        $state.go("app", {lng: Coord_Service.coordinates[0], lat: Coord_Service.coordinates[1]})
    };

    $scope.rememberCheck = function() {
        console.log("remember check func " + $scope.model.hazardChecked);
        $window.localStorage['rememberCheck'] = $scope.model.hazardChecked;
    }
});


/*
Controller for theft portion of incident form
*/
bikeMapApp.controller('TheftCtrl', function($scope, $state, $window, $ionicModal, Constants, Theft_Service, TheftReportService, CyclingFrequencyService, YesNoService, Coord_Service){

    /* Theft details pane */
    $scope.theftDetails = {
        selectedDateTime: null,
        maxDate: new Date(),
        theftChoices: TheftReportService.theftChoices,
        selectedTheftChoice: {
            key: Constants.FORM_DEFAULT, text: Constants.FORM_DEFAULT
        },
        lockedChoices: TheftReportService.lockedChoices,
        selectedLockedChoice: {
            key: Constants.FORM_DEFAULT, text: Constants.FORM_DEFAULT
        },
        lockTypeChoices: TheftReportService.lockTypeChoices,
        selectedLockTypeChoice: {
            key: Constants.FORM_DEFAULT, text: Constants.FORM_DEFAULT
        },
        locationChoices: TheftReportService.locationChoices,
        selectedLocationChoice: {
            key: Constants.FORM_DEFAULT, text: Constants.FORM_DEFAULT
        },
        lightingChoices: TheftReportService.lightingChoices,
        selectedLightingChoice: {
            key: Constants.FORM_DEFAULT, text: Constants.FORM_DEFAULT
        },
        trafficChoices: TheftReportService.trafficChoices,
        selectedTrafficChoice: {
            key: Constants.FORM_DEFAULT, text: Constants.FORM_DEFAULT
        }
    };

    /* Description pane */
    $scope.theftDescription = {
        details: ""
    };

    /* Personal details pane */
    $scope.personalDetails = {
        cyclingFrequencyChoices: CyclingFrequencyService,
        selectedHazardCyclingFrequency: CyclingFrequencyService[0],
        policeReportChoices: YesNoService,
        selectedPoliceReportChoice: YesNoService[0],
        policeReportNumber: '',
        insuranceClaimChoices: YesNoService,
        selectedInsuranceClaimChoice: YesNoService[0],
        insuranceClaimNumber: ''
    };

    $scope.model = {
        theftChecked: false,
        dateAlert: false,
        theftChoiceAlert: false,
        theftLockedAlert: false,
        theftLockTypeAlert: false,
        theftLocationAlert: false,
        theftLightingAlert: false,
        theftTrafficAlert: false
    };

    $scope.markCheckbox = function() {
        $scope.model.theftChecked = !$scope.model.theftChecked;
    };

    /* If user has previously checked the box, keep the box checked when opening
     the form in the future.
     */
    if($window.localStorage['rememberCheck']) {
        if(typeof $window.localStorage['rememberCheck'] == 'string') {
            $scope.model.theftChecked = JSON.parse($window.localStorage['rememberCheck']);
        }
        else {
            $scope.model.theftChecked = $window.localStorage['rememberCheck'];
        }
    }

    $scope.submitTheft = function() {
        if( $scope.validateForm() ) {
            console.log("Form is valid");
            var theftForm = {
                "geometry": {
                    "type": "Point",
                    "coordinates": [
                        Coord_Service.coordinates[0],
                        Coord_Service.coordinates[1]
                    ]
                },
                "properties": {
                    "i_type": $scope.theftDetails.selectedTheftChoice.key,
                    "date": $scope.theftDetails.selectedDateTime,
                    "p_type": "theft",
                    "details": $scope.theftDescription.details,
                    "how_locked": $scope.theftDetails.selectedLockedChoice.key,
                    "lock": $scope.theftDetails.selectedLockTypeChoice.key,
                    "locked_to": $scope.theftDetails.selectedLocationChoice.key,
                    "lighting": $scope.theftDetails.selectedLightingChoice.key,
                    "traffic": $scope.theftDetails.selectedTrafficChoice.key,
                    "police_report": $scope.personalDetails.selectedPoliceReportChoice.key,
                    "police_report_num": $scope.personalDetails.policeReportNumber,
                    "insurance_claim": $scope.personalDetails.selectedInsuranceClaimChoice.key,
                    "insurance_claim_num": $scope.personalDetails.insuranceClaimNumber,
                    "regular_cyclist": $scope.personalDetails.selectedHazardCyclingFrequency.key
                }
            };

            var post = Theft_Service.save(theftForm);
            post.$promise.then(
                Coord_Service.dirty = true,
                $state.go('app')
            );
        }
        else {
            console.log("Form is invalid");
        }
    };

    $scope.validateForm = function() {
        if( $scope.theftDetails.selectedDateTime === null || $scope.theftDetails.selectedTheftChoice.key === Constants.FORM_DEFAULT ||
            $scope.theftDetails.selectedLockedChoice.key === Constants.FORM_DEFAULT || $scope.theftDetails.selectedLockTypeChoice.key === Constants.FORM_DEFAULT ||
            $scope.theftDetails.selectedLocationChoice.key === Constants.FORM_DEFAULT || $scope.theftDetails.selectedLightingChoice.key === Constants.FORM_DEFAULT ||
            $scope.theftDetails.selectedTrafficChoice.key === Constants.FORM_DEFAULT) {
            if ($scope.theftDetails.selectedDateTime === null) {
                $scope.model.dateAlert = true;
            } else {
                $scope.model.dateAlert = false;
            }
            if ($scope.theftDetails.selectedTheftChoice.key === Constants.FORM_DEFAULT) {
                $scope.model.theftChoiceAlert = true;
            } else {
                $scope.model.theftChoiceAlert = false;
            }
            if ($scope.theftDetails.selectedLockedChoice.key === Constants.FORM_DEFAULT) {
                $scope.model.theftLockedAlert = true;
            } else {
                $scope.model.theftLockedAlert = false;
            }
            if ($scope.theftDetails.selectedLockTypeChoice.key === Constants.FORM_DEFAULT) {
                $scope.model.theftLockTypeAlert = true;
            } else {
                $scope.model.theftLockTypeAlert = false;
            }
            if ($scope.theftDetails.selectedLocationChoice.key === Constants.FORM_DEFAULT) {
                $scope.model.theftLocationAlert = true;
            } else {
                $scope.model.theftLocationAlert = false;
            }
            if ($scope.theftDetails.selectedLightingChoice.key === Constants.FORM_DEFAULT) {
                $scope.model.theftLightingAlert = true;
            } else {
                $scope.model.theftLightingAlert = false;
            }
            if ($scope.theftDetails.selectedTrafficChoice.key === Constants.FORM_DEFAULT) {
                $scope.model.theftTrafficAlert = true;
            } else {
                $scope.model.theftTrafficAlert = false;
            }
            return false;
        }
        else {
            $scope.model.dateAlert = false;
            $scope.model.theftChoiceAlert = false;
            $scope.model.theftLockAlert = false;
            $scope.model.theftLockTypeAlert = false;
            $scope.model.theftLocationAlert = false;
            $scope.model.theftLightingAlert = false;
            $scope.model.theftTrafficAlert = false;

            return true;
        }
    };

    $scope.cancelTheft = function() {
        $state.go('app');
    }

});

bikeMapApp.controller('TermsAndConditionsCtrl', function($scope, $ionicModal) {
    $ionicModal.fromTemplateUrl('templates/terms-conditions.html', function (modal) {
        $scope.modal = modal;
    }, {
        scope: $scope,
        animation: 'slide-in-up'
    });

    $scope.openModal = function () {
        $scope.modal.show();
    };
    $scope.closeModal = function () {
        $scope.modal.hide();
    };
//Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function () {
        $scope.modal.remove();
    });
// Execute action on hide modal
    $scope.$on('modal.hidden', function () {
// Execute action
    });
// Execute action on remove modal
    $scope.$on('modal.removed', function () {
    })
});