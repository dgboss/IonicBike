/**
 * Created by boss on 4/20/2015.
 */

bikeMapApp.controller('HazardCtrl', function ($scope, $state, $window, $ionicModal, HazardGroupService, BirthYearService, BirthMonthService, GenderService, CyclingFrequencyService) {

    /*  Accordion defaults */
    $scope.oneAtATime = true;
    $scope.isFirstOpen = true;

    /* Begin form fields and selections */
    /* Hazard details pane */
    $scope.hazardDetails = {
        dateTime: null,
        maxDate: new Date(),
        selectedHazardType: "---------",
        hazardGroupChoices: HazardGroupService
    };

    /* Description pane */
    $scope.description = {
        details: null
    };

    /* Personal details pane */
    $scope.personalDetails = {
        selectedHazardBirthYear: BirthYearService[0].text,
        birthYearChoices: BirthYearService,

        selectedHazardBirthMonth: BirthMonthService[0].text,
        birthMonthChoices: BirthMonthService,

        selectedHazardGender: GenderService[0].text,
        genderChoices: GenderService,

        selectedHazardCyclingFrequency: CyclingFrequencyService[0].text,
        cyclingFrequencyChoices: CyclingFrequencyService

    };
    /* End form fields and selections */

    /* Terms and conditions checkbox */
    $scope.model = {
        hazardChecked: false
    }

    /* If user has previosuly checked the box, keep the box checked when opening
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
        console.log("Submit button clicked");
    }

    $scope.cancelHazard = function() {
        $scope.hazardDetails.selectedHazardType = "---------";
        $scope.description.details = null;
        $scope.personalDetails.selectedHazardBirthYear = BirthYearService[0].text;
        $scope.personalDetails.selectedHazardBirthMonth = BirthMonthService[0].text;
        $scope.personalDetails.selectedHazardGender = GenderService[0].text;
        $scope.personalDetails.selectedHazardCyclingFrequency = CyclingFrequencyService[0].text;
        //$location.path("/");
        $state.go("app")
    }

    $scope.rememberCheck = function() {
        console.log("remember check func " + $scope.model.hazardChecked);
        $window.localStorage['rememberCheck'] = $scope.model.hazardChecked;
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