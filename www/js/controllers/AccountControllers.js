'use strict';

// Registration page controller
bikeMapApp.controller('RegistrationCtrl', function ($scope, $ionicHistory, djangoAuth, Validate) {
    $scope.model = {'username':'','password':'','email':''};
    $scope.complete = false;
    $scope.register = function(formData){
        $scope.errors = [];
        Validate.form_validation(formData,$scope.errors);
        if(!formData.$invalid){
            djangoAuth.register($scope.model.username,$scope.model.password1,$scope.model.password2,$scope.model.email)
                .then(function(data){
                    // success case
                    $scope.complete = true;
                    alert("Registration succeeded!")
                },function(data){
                    // error case
                    $scope.errors = data;
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
bikeMapApp.controller('PasswordResetCtrl', function($scope, $ionicHistory, djangoAuth, Validate){
    $scope.model = {'email':''};
    $scope.complete = false;
    $scope.resetPassword = function(formData){
        $scope.errors = [];
        Validate.form_validation(formData,$scope.errors);
        if(!formData.$invalid){
            djangoAuth.resetPassword($scope.model.email)
                .then(function(data){
                    // success case
                    $scope.complete = true;
                },function(data){
                    // error case
                    $scope.errors = data;
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