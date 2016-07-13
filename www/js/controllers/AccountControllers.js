'use strict';

// Registration page controller
bikeMapApp.controller('RegistrationCtrl', function ($scope, $ionicHistory, $ionicLoading, djangoAuth, Validate) {
    $scope.model = {'username':'','password':'','email':''};
    $scope.complete = false;
    $scope.register = function(formData){
        $scope.errors = [];
        Validate.form_validation(formData,$scope.errors);
        if(!formData.$invalid){
            $ionicLoading.show({
                template: '<ion-spinner></ion-spinner>',
            });
            djangoAuth.register($scope.model.username,$scope.model.password1,$scope.model.password2,$scope.model.email)
                .then(function(data){
                    // success case
                    $scope.complete = true;
                    $ionicLoading.hide();
                },function(data){
                    // error case
                    $scope.errors = data;
                    $ionicLoading.hide();
                });
        }
    };

    $scope.cancelRegistration = function() {
        $ionicHistory.goBack();
    };

    $scope.continue = function() {
        $ionicHistory.goBack();
    };
});

// Password reset page controller
bikeMapApp.controller('PasswordResetCtrl', function($scope, $ionicHistory, $ionicLoading, djangoAuth, Validate){
    $scope.model = {'email':''};
    $scope.complete = false;
    $scope.resetPassword = function(formData){
        $scope.errors = [];
        Validate.form_validation(formData,$scope.errors);
        if(!formData.$invalid){
            $ionicLoading.show({
                template: '<ion-spinner></ion-spinner>',
            });
            djangoAuth.resetPassword($scope.model.email)
                .then(function(data){
                    // success case
                    $scope.complete = true;
                    $ionicLoading.hide();
                },function(data){
                    // error case
                    $scope.errors = data;
                    $ionicLoading.hide();
                });
        }
    };

    $scope.cancelReset = function() {
        $ionicHistory.goBack();
    };

    $scope.continue = function() {
        $ionicHistory.goBack();
    };
});