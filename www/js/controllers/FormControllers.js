/**
 * Created by boss on 4/20/2015.
 */

/*
 Controller for incident portion of incident form
 */
bikeMapApp.controller('IncidentCtrl', function($scope, $state, $window, $ionicModal, $ionicPopup, Constants, CollisionReportService, CyclingFrequencyService, BirthYearService, BirthMonthService, GenderService, YesNoService, Coord_Service, Collision_Service, Nearmiss_Service) {

    $scope.incidentDetails = {
        selectedDate: null,
        selectedTime: null,
        maxDate: new Date(),
        incidentTypeChoices: CollisionReportService.incidentChoices,
        selectedIncidentType: {
            key: Constants.FORM_DEFAULT, text: Constants.FORM_DEFAULT
        },
        incidentObjectChoices: CollisionReportService.objectChoices,
        selectedObjectType: {
            key: Constants.FORM_DEFAULT, text: Constants.FORM_DEFAULT
        },
        incidentInjuryChoices: CollisionReportService.injuredChoices,
        selectedInjuryType: {
            key: Constants.FORM_DEFAULT, text: Constants.FORM_DEFAULT
        },
        incidentImpactChoices: CollisionReportService.impactChoices,
        selectedImpactType: {
            key: Constants.FORM_DEFAULT, text: Constants.FORM_DEFAULT
        },
        incidentPurposeChoices: CollisionReportService.purposeChoices,
        selectedPurposeType: CollisionReportService.purposeChoices[0]
        };

    $scope.conditions = {
        incidentConditionsChoices: CollisionReportService.conditionChoices,
        selectedConditions: CollisionReportService.conditionChoices[0],
        sightConditionsChoices: CollisionReportService.sightConditionsChoices,
        selectSightConditions: CollisionReportService.sightConditionsChoices[0],
        carsParkedChoices: CollisionReportService.carsParkedChoices,
        selectedCarsParked: CollisionReportService.carsParkedChoices[0],
        ridingOnChoices: CollisionReportService.ridingOnChoices,
        selectedRidingOn: {
            text: Constants.FORM_DEFAULT
        },
        lightChoices: CollisionReportService.lightChoices,
        selectedLight: CollisionReportService.lightChoices[0],
        terrainChoices: CollisionReportService.terrainChoices,
        selectedTerrain: CollisionReportService.terrainChoices[0],
        directionChoices: CollisionReportService.directionChoices,
        selectedDirection: CollisionReportService.directionChoices[0],
        turningChoices: CollisionReportService.turningChoices,
        selectedTurning: CollisionReportService.turningChoices[0]
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
        helmetChoices: CollisionReportService.helmetChoices,
        selectedHelmet: CollisionReportService.helmetChoices[0],
        intoxicatedChoices: CollisionReportService.intoxicatedChoices,
        selectedIntoxicated: CollisionReportService.intoxicatedChoices[0]
    };

    $scope.model = {
        incidentChecked: false,
        dateAlert: false,
        incidentTypeAlert: false,
        incidentObjectAlert: false,
        incidentInjuryAlert: false,
        incidentImpactAlert: false,
        p_type: "",
        savePersonalDetailsChecked: false
    };

    $scope.togglePersonalDetailsCheckbox = function() {
        $scope.model.savePersonalDetailsChecked = !$scope.model.savePersonalDetailsChecked;
    };

    // Populate Personal Details of form if user has previously saved the data
    function populatePersonalDetails() {
        if($window.localStorage["savePersonalDetails"] === "true") {
            $scope.model.savePersonalDetailsChecked = $window.localStorage["savePersonalDetails"];
            $scope.personalDetails.selectedIncidentBirthYear = JSON.parse($window.localStorage["birthYear"]);
            $scope.personalDetails.selectedIncidentBirthMonth = JSON.parse($window.localStorage["birthMonth"]);
            $scope.personalDetails.selectedIncidentGender = JSON.parse($window.localStorage["gender"]);
            $scope.personalDetails.selectedIncidentCyclingFrequency = JSON.parse($window.localStorage["frequency"]);
        }
    }
    populatePersonalDetails();

    // Save/remove personal details to/from local storage
    function savePersonalDetails() {

        if($scope.model.savePersonalDetailsChecked) {
            $window.localStorage["savePersonalDetails"] = true;
            $window.localStorage["birthYear"] = JSON.stringify($scope.personalDetails.selectedIncidentBirthYear);
            $window.localStorage["birthMonth"] = JSON.stringify($scope.personalDetails.selectedIncidentBirthMonth);
            $window.localStorage["gender"] = JSON.stringify($scope.personalDetails.selectedIncidentGender);
            $window.localStorage["frequency"] = JSON.stringify($scope.personalDetails.selectedIncidentCyclingFrequency);
        }
        else {
            $window.localStorage["savePersonalDetails"] = false;
            $window.localStorage["birthYear"] = '';
            $window.localStorage["birthMonth"] = '';
            $window.localStorage["gender"] = '';
            $window.localStorage["frequency"] = '';
        }
    }

    $scope.markCheckbox = function() {
        $scope.model.incidentChecked = !$scope.model.incidentChecked;
    };

    $scope.submitIncident = function() {
        if( $scope.validateForm() ) {
            Coord_Service.dirty = true;

            $scope.model.p_type = 'collision';

            var coeff = 1000*60*5; //rounding coefficient = millis in 5 min
            var roundedTime = new Date(Math.round($scope.incidentDetails.selectedTime/coeff)*coeff); //round users time selection to nearest 5 min
            // Construct time string from user selected date and time
            var selectedDateTime = $scope.incidentDetails.selectedDate.getFullYear() + "-" +
                ($scope.incidentDetails.selectedDate.getMonth()+1) + "-" +
                $scope.incidentDetails.selectedDate.getDate() + " " +
                roundedTime.getHours() + ":" +
                roundedTime.getMinutes();

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
                    "date": selectedDateTime,
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

            savePersonalDetails();

            var post;

            // Is this a collision/fall or a near miss?
            if($scope.model.p_type === 'nearmiss') {
                post = Nearmiss_Service.save(incidentForm);
            } else {
                post = Collision_Service.save(incidentForm);
            }

            post.$promise.then(function() {
                    Coord_Service.dirty = true;
                    $state.go('app');
                }, function() {
                        var alertPopup = $ionicPopup.alert({
                            title: "Report could not be saved",
                            template: "We're sorry, your report could not be saved. Please check your Internet connection and try again. If the problem persists, please contact us at admin@bikemaps.org.",
                            buttons: [
                                { text: "<span>OK</span>"}
                            ]
                        });
                    }
            );
        }
        else {
            // Should never be reached
            console.log("Form is invalid");
        }
    };

    $scope.validateForm = function() {
        if( $scope.incidentDetails.selectedDate === null || $scope.incidentDetails.selectedTime === null || $scope.incidentDetails.selectedIncidentType.key === Constants.FORM_DEFAULT ||
            $scope.incidentDetails.selectedObjectType.key === Constants.FORM_DEFAULT || $scope.incidentDetails.selectedInjuryType.key === Constants.FORM_DEFAULT || $scope.incidentDetails.selectedImpactType.key === Constants.FORM_DEFAULT ) {
            if ($scope.incidentDetails.selectedDate === null) {
                $scope.model.dateAlert = true;
            } else {
                $scope.model.dateAlert = false;
            }
            if ($scope.incidentDetails.selectedTime === null) {
                $scope.model.timeAlert = true;
            } else {
                $scope.model.timeAlert = false;
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
            if ($scope.incidentDetails.selectedImpactType.key === Constants.FORM_DEFAULT) {
                $scope.model.incidentImpactAlert = true;
            } else {
                $scope.model.incidentImpactAlert = false;
            }
            return false;
        }
        else {
            $scope.model.dateAlert = false;
            $scope.model.timeAlert = false;
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
 Controller for near miss portion of incident form
 */
bikeMapApp.controller('NearmissCtrl', function($scope, $state, $window, $ionicModal, $ionicPopup, Constants, NearmissReportService, CyclingFrequencyService, BirthYearService, BirthMonthService, GenderService, YesNoService, Coord_Service, Collision_Service, Nearmiss_Service) {

    $scope.nearmissDetails = {
        selectedDate: null,
        selectedTime: null,
        maxDate: new Date(),
        nearmissTypeChoices: NearmissReportService.nearmissChoices,
        selectedNearmissType: {
            key: Constants.FORM_DEFAULT, text: Constants.FORM_DEFAULT
        },
        nearmissObjectChoices: NearmissReportService.objectChoices,
        selectedObjectType: {
            key: Constants.FORM_DEFAULT, text: Constants.FORM_DEFAULT
        },
        nearmissInjuryChoices: NearmissReportService.injuredChoices,
        selectedInjuryType: {
            key: Constants.FORM_DEFAULT, text: Constants.FORM_DEFAULT
        },
        nearmissImpactChoices: NearmissReportService.impactChoices,
        selectedImpactType: NearmissReportService.impactChoices[0],
        nearmissPurposeChoices: NearmissReportService.purposeChoices,
        selectedPurposeType: NearmissReportService.purposeChoices[0]
    };

    $scope.conditions = {
        nearmissConditionsChoices: NearmissReportService.conditionChoices,
        selectedConditions: NearmissReportService.conditionChoices[0],
        sightConditionsChoices: NearmissReportService.sightConditionsChoices,
        selectSightConditions: NearmissReportService.sightConditionsChoices[0],
        carsParkedChoices: NearmissReportService.carsParkedChoices,
        selectedCarsParked: NearmissReportService.carsParkedChoices[0],
        ridingOnChoices: NearmissReportService.ridingOnChoices,
        selectedRidingOn: {
            text: Constants.FORM_DEFAULT
        },
        lightChoices: NearmissReportService.lightChoices,
        selectedLight: NearmissReportService.lightChoices[0],
        terrainChoices: NearmissReportService.terrainChoices,
        selectedTerrain: NearmissReportService.terrainChoices[0],
        directionChoices: NearmissReportService.directionChoices,
        selectedDirection: NearmissReportService.directionChoices[0],
        turningChoices: NearmissReportService.turningChoices,
        selectedTurning: NearmissReportService.turningChoices[0]
    };

    $scope.description = {
        details: ""
    };

    /* Personal details pane */
    $scope.personalDetails = {
        birthYearChoices: BirthYearService,
        selectedNearmissBirthYear: BirthYearService[0],
        birthMonthChoices: BirthMonthService,
        selectedNearmissBirthMonth: BirthMonthService[0],
        genderChoices: GenderService,
        selectedNearmissGender: GenderService[0],
        cyclingFrequencyChoices: CyclingFrequencyService,
        selectedNearmissCyclingFrequency: CyclingFrequencyService[0],
        helmetChoices: NearmissReportService.helmetChoices,
        selectedHelmet: NearmissReportService.helmetChoices[0],
        intoxicatedChoices: NearmissReportService.intoxicatedChoices,
        selectedIntoxicated: NearmissReportService.intoxicatedChoices[0]
    };

    $scope.model = {
        nearmissChecked: false,
        dateAlert: false,
        timeAlert: false,
        nearmissTypeAlert: false,
        nearmissObjectAlert: false,
        nearmissInjuryAlert: false,
        p_type: "",
        savePersonalDetailsChecked: false
    };

    $scope.togglePersonalDetailsCheckbox = function() {
        $scope.model.savePersonalDetailsChecked = !$scope.model.savePersonalDetailsChecked;
    };

    // Populate Personal Details of form if user has previously saved the data
    function populatePersonalDetails() {
        if($window.localStorage["savePersonalDetails"] === "true") {
            $scope.model.savePersonalDetailsChecked = $window.localStorage["savePersonalDetails"];
            $scope.personalDetails.selectedIncidentBirthYear = JSON.parse($window.localStorage["birthYear"]);
            $scope.personalDetails.selectedIncidentBirthMonth = JSON.parse($window.localStorage["birthMonth"]);
            $scope.personalDetails.selectedIncidentGender = JSON.parse($window.localStorage["gender"]);
            $scope.personalDetails.selectedIncidentCyclingFrequency = JSON.parse($window.localStorage["frequency"]);
        }
    }
    populatePersonalDetails();

    // Save/remove personal details to/from local storage
    function savePersonalDetails() {

        if($scope.model.savePersonalDetailsChecked) {
            $window.localStorage["savePersonalDetails"] = true;
            $window.localStorage["birthYear"] = JSON.stringify($scope.personalDetails.selectedNearmissBirthYear);
            $window.localStorage["birthMonth"] = JSON.stringify($scope.personalDetails.selectedNearmissBirthMonth);
            $window.localStorage["gender"] = JSON.stringify($scope.personalDetails.selectedNearmissGender);
            $window.localStorage["frequency"] = JSON.stringify($scope.personalDetails.selectedNearmissCyclingFrequency);
        }
        else {
            $window.localStorage["savePersonalDetails"] = false;
            $window.localStorage["birthYear"] = '';
            $window.localStorage["birthMonth"] = '';
            $window.localStorage["gender"] = '';
            $window.localStorage["frequency"] = '';
        }
    }

    $scope.markCheckbox = function() {
        $scope.model.nearmissChecked = !$scope.model.nearmissChecked;
    };

    $scope.submitNearmiss = function() {
        if( $scope.validateForm() ) {
            Coord_Service.dirty = true;

            $scope.model.p_type = 'nearmiss';

            var coeff = 1000*60*5; //rounding coefficient = millis in 5 min
            var roundedTime = new Date(Math.round($scope.nearmissDetails.selectedTime/coeff)*coeff); //round users time selection to nearest 5 min
            // Construct time string from user selected date and time
            var selectedDateTime = $scope.nearmissDetails.selectedDate.getFullYear() + "-" +
                ($scope.nearmissDetails.selectedDate.getMonth()+1) + "-" +
                $scope.nearmissDetails.selectedDate.getDate() + " " +
                roundedTime.getHours() + ":" +
                roundedTime.getMinutes();

            var nearmissForm = {
                "geometry": {
                    "type": "Point",
                    "coordinates": [
                        Coord_Service.coordinates[0],
                        Coord_Service.coordinates[1]
                    ]
                },
                "properties": {
                    // Nearmiss details to POST
                    "date": selectedDateTime,
                    "i_type": $scope.nearmissDetails.selectedNearmissType.key,
                    "incident_with": $scope.nearmissDetails.selectedObjectType.key,
                    "injury": $scope.nearmissDetails.selectedInjuryType.key,
                    "trip_purpose": $scope.nearmissDetails.selectedPurposeType.key,
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
                    "age": $scope.personalDetails.selectedNearmissBirthYear.key,
                    "birthmonth": $scope.personalDetails.selectedNearmissBirthMonth.key,
                    "sex": $scope.personalDetails.selectedNearmissGender.key,
                    "regular_cyclist": $scope.personalDetails.selectedNearmissCyclingFrequency.key,
                    "helmet": $scope.personalDetails.selectedHelmet.key,
                    "intoxicated": $scope.personalDetails.selectedIntoxicated.key,

                    "p_type": $scope.model.p_type
                }
            };

            savePersonalDetails();

            var post = Nearmiss_Service.save(nearmissForm);

            post.$promise.then(function() {
                    Coord_Service.dirty = true;
                    $state.go('app');
                }, function() {
                    var alertPopup = $ionicPopup.alert({
                        title: "Report could not be saved",
                        template: "We're sorry, your report could not be saved. Please check your Internet connection and try again. If the problem persists, please contact us at admin@bikemaps.org.",
                        buttons: [
                            { text: "<span>OK</span>"}
                        ]
                    });
                }
            );
        }
        else {
            // Should never be reached
            console.log("Form is invalid");
        }
    };

    $scope.validateForm = function() {
        if( $scope.nearmissDetails.selectedDate === null || $scope.nearmissDetails.selectedTime === null || $scope.nearmissDetails.selectedNearmissType.key === Constants.FORM_DEFAULT ||
            $scope.nearmissDetails.selectedObjectType.key === Constants.FORM_DEFAULT || $scope.nearmissDetails.selectedInjuryType.key === Constants.FORM_DEFAULT) {
            if ($scope.nearmissDetails.selectedDate === null) {
                $scope.model.dateAlert = true;
            } else {
                $scope.model.dateAlert = false;
            }
            if ($scope.nearmissDetails.selectedTime === null) {
                $scope.model.timeAlert = true;
            } else {
                $scope.model.timeAlert = false;
            }
            if ($scope.nearmissDetails.selectedNearmissType.key === Constants.FORM_DEFAULT) {
                $scope.model.nearmissTypeAlert = true;
            } else {
                $scope.model.nearmissTypeAlert = false;
            }
            if ($scope.nearmissDetails.selectedObjectType.key === Constants.FORM_DEFAULT) {
                $scope.model.nearmissObjectAlert = true;
            } else {
                $scope.model.nearmissObjectAlert = false;
            }
            if ($scope.nearmissDetails.selectedInjuryType.key === Constants.FORM_DEFAULT) {
                $scope.model.nearmissInjuryAlert = true;
            } else {
                $scope.model.nearmissInjuryAlert = false;
            }
            return false;
        }
        else {
            $scope.model.dateAlert = false;
            $scope.model.timeAlert = false;
            $scope.model.nearmissTypeAlert = false;
            $scope.model.nearmissObjectAlert = false;
            $scope.model.nearmissInjuryAlert = false;

            return true;
        }
    };

    $scope.cancelNearmiss = function() {
        $state.go('app');
    }
});

/*
 Controller for hazard portion of incident form
 */
bikeMapApp.controller('HazardCtrl', function ($scope, $state, $window, $ionicModal, $ionicPopup, HazardGroupService, BirthYearService, BirthMonthService, GenderService, CyclingFrequencyService, Coord_Service, Hazard_Service) {
    /* Hazard details pane */
    $scope.hazardDetails = {
        selectedDate: null,
        selectedTime: null,
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
        timeAlert: false,
        hazardTypeAlert: false,
        savePersonalDetailsChecked: false
    };

    $scope.togglePersonalDetailsCheckbox = function() {
        $scope.model.savePersonalDetailsChecked = !$scope.model.savePersonalDetailsChecked;
    };

    // Populate Personal Details of form if user has previously saved the data
    function populatePersonalDetails() {
      if($window.localStorage["savePersonalDetails"] === "true") {
          $scope.model.savePersonalDetailsChecked = $window.localStorage["savePersonalDetails"];
          $scope.personalDetails.selectedHazardBirthYear = JSON.parse($window.localStorage["birthYear"]);
          $scope.personalDetails.selectedHazardBirthMonth = JSON.parse($window.localStorage["birthMonth"]);
          $scope.personalDetails.selectedHazardGender = JSON.parse($window.localStorage["gender"]);
          $scope.personalDetails.selectedHazardCyclingFrequency = JSON.parse($window.localStorage["frequency"]);
      }
    }
    populatePersonalDetails();

    // Save/remove personal details to/from local storage
    function savePersonalDetails() {

        if($scope.model.savePersonalDetailsChecked) {
            $window.localStorage["savePersonalDetails"] = true;
            $window.localStorage["birthYear"] = JSON.stringify($scope.personalDetails.selectedHazardBirthYear);
            $window.localStorage["birthMonth"] = JSON.stringify($scope.personalDetails.selectedHazardBirthMonth);
            $window.localStorage["gender"] = JSON.stringify($scope.personalDetails.selectedHazardGender);
            $window.localStorage["frequency"] = JSON.stringify($scope.personalDetails.selectedHazardCyclingFrequency);
        }
        else {
            $window.localStorage["savePersonalDetails"] = false;
            $window.localStorage["birthYear"] = '';
            $window.localStorage["birthMonth"] = '';
            $window.localStorage["gender"] = '';
            $window.localStorage["frequency"] = '';
        }
    }

    $scope.markCheckbox = function() {
        $scope.model.hazardChecked = !$scope.model.hazardChecked;
    };

    $scope.submitHazard = function() {
        if( $scope.validateForm() ) {
            Coord_Service.dirty = true;
            var coeff = 1000*60*5; //rounding coefficient = millis in 5 min
            var roundedTime = new Date(Math.round($scope.hazardDetails.selectedTime/coeff)*coeff); //round users time selection to nearest 5 min
            // Construct time string from user selected date and time
            var selectedDateTime = $scope.hazardDetails.selectedDate.getFullYear() + "-" +
                ($scope.hazardDetails.selectedDate.getMonth()+1) + "-" +
                    $scope.hazardDetails.selectedDate.getDate() + " " +
                    roundedTime.getHours() + ":" +
                    roundedTime.getMinutes();

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
                    "date": selectedDateTime,
                    "p_type": "hazard",
                    "details": $scope.description.details,
                    "age": $scope.personalDetails.selectedHazardBirthYear.key,
                    "birthmonth": $scope.personalDetails.selectedHazardBirthMonth.key,
                    "sex": $scope.personalDetails.selectedHazardGender.key,
                    "regular_cyclist": $scope.personalDetails.selectedHazardCyclingFrequency.key
                }
            };

            savePersonalDetails();

            var post = Hazard_Service.save(hazardForm);

            post.$promise.then(function() {
                    Coord_Service.dirty = true;
                    $state.go('app');
                }, function() {
                    var alertPopup = $ionicPopup.alert({
                        title: "Report could not be saved",
                        template: "We're sorry, your report could not be saved. Please check your Internet connection and try again. If the problem persists, please contact us at admin@bikemaps.org.",
                        buttons: [
                            { text: "<span>OK</span>"}
                        ]
                    });
                }
            );
        }
        else {
            // Should never be reached
            console.log("Form is invalid");
        }
    };


    $scope.validateForm = function() {
      if( $scope.hazardDetails.selectedDate === null || $scope.hazardDetails.selectedTime === null || $scope.hazardDetails.selectedHazardType.key === "---------" ) {
          if ($scope.hazardDetails.selectedDate === null) {
              $scope.model.dateAlert = true;
          } else {
              $scope.model.dateAlert = false;
          }
          if ($scope.hazardDetails.selectedTime === null) {
              $scope.model.timeAlert = true;
          } else {
              $scope.model.timeAlert = false;
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
        $state.go("app");
    };
});


/*
Controller for theft portion of incident form
*/
bikeMapApp.controller('TheftCtrl', function($scope, $state, $window, $ionicModal, $ionicPopup, Constants, Theft_Service, TheftReportService, CyclingFrequencyService, YesNoService, Coord_Service){

    /* Theft details pane */
    $scope.theftDetails = {
        selectedDate: null,
        selectedTime: null,
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

    $scope.submitTheft = function() {
        if( $scope.validateForm() ) {
            Coord_Service.dirty = true;
            var coeff = 1000*60*5; //rounding coefficient = millis in 5 min
            var roundedTime = new Date(Math.round($scope.theftDetails.selectedTime/coeff)*coeff); //round users time selection to nearest 5 min
            // Construct time string from user selected date and time
            var selectedDateTime = $scope.theftDetails.selectedDate.getFullYear() + "-" +
                ($scope.theftDetails.selectedDate.getMonth()+1) + "-" +
                $scope.theftDetails.selectedDate.getDate() + " " +
                roundedTime.getHours() + ":" +
                roundedTime.getMinutes();

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
                    "date": selectedDateTime,
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
            post.$promise.then(function() {
                    Coord_Service.dirty = true;
                    $state.go('app');
                }, function() {
                    var alertPopup = $ionicPopup.alert({
                        title: "Report could not be saved",
                        template: "We're sorry, your report could not be saved. Please check your Internet connection and try again. If the problem persists, please contact us at admin@bikemaps.org.",
                        buttons: [
                            { text: "<span>OK</span>"}
                        ]
                    });
                }
            );
        }
        else {
            // Should never be reached
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