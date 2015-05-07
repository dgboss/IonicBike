
bikeMapApp.controller('AppCtrl', function($rootScope, $scope, $location, $ionicPopup, $ionicPopover, $window, $cordovaPush, $cordovaMedia, $cordovaDialogs, $http, djangoAuth, PushNotificationService) {

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

    /* TEMP: To be removed. For testing purposes */
    $scope.clearLocalStorage = function(){
        $window.localStorage.clear();
    };
});

