
bikeMapApp.controller('AppCtrl', function($rootScope, $scope, $state, $location, $ionicModal, $ionicPopup, $ionicPopover, $window, $cordovaPush, $cordovaMedia, $cordovaDialogs, $http, djangoAuth, Validate, PushNotificationService) {

    $scope.authInfo = djangoAuth;
    $scope.notifications = [];

    /* Popover/main menu */
    $ionicPopover.fromTemplateUrl('templates/popover.html', {
        scope: $scope
    }).then(function(popover) {
        $scope.popover = popover;
    });

    $scope.openPopover = function ($event) {
        $scope.popover.show($event);

    };

    $scope.closePopover = function () {
        $scope.popover.hide();
    };

    //Cleanup the popover when we're done with it!
    $scope.$on('$destroy', function () {
        $scope.popover.remove();
    });


    /* Event listeners */
    /* When a user logs in successfully, register device for push notifications */
    $rootScope.$on("djangoAuth.logged_in", function() {
            PushNotificationService.register();
    });

    /* When a user logs out, the device should no longer receive push notifications */
    $rootScope.$on('djangoAuth.logged_out', function() {
        if($window.localStorage["regid"]){
            PushNotificationService.unregister();
        }
    });


    /* Push Notification received */
    $rootScope.$on('$cordovaPush:notificationReceived', function (event, notification) {
        if (ionic.Platform.isAndroid()) {
            PushNotificationService.handleAndroid(notification);
        }
        else if (ionic.Platform.isIOS()) {
            handleIOS(notification);
            $scope.$apply(function () {
                $scope.notifications.push(JSON.stringify(notification.alert));
            })
        }
    });

    // Login code
    $scope.model = {'username':'','password':''};
    $scope.complete = false;
    $scope.login = function(formData){
        $scope.errors = [];
        Validate.form_validation(formData,$scope.errors);
        if(!formData.$invalid){
            djangoAuth.login($scope.model.username, $scope.model.password)
                .then(function(data){
                    // success case
                    $scope.closeModal();
                },function(data){
                    // error case
                    $scope.errors = data;
                });
        }
    };

    $scope.createAccount = function() {
        $scope.closeModal();
        $state.go("registration");
    };
    $scope.resetPassword = function() {
        $scope.closeModal();
        $state.go("reset-password");
    };

    // Login Modal
    $ionicModal.fromTemplateUrl('templates/login.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.modal = modal;
    });
    $scope.openModal = function() {
        $scope.modal.show();
    };
    $scope.closeModal = function() {
        $scope.modal.hide();
    };
    //Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function() {
        $scope.modal.remove();
    });
    // Execute action on hide modal
    $scope.$on('modal.hidden', function() {
        // Execute action
    });
    // Execute action on remove modal
    $scope.$on('modal.removed', function() {
        // Execute action
    });

    



    /* TEMP: To be removed. For testing purposes */
    $scope.clearLocalStorage = function(){
        $window.localStorage.clear();
    };
});

