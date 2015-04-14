
bikeMapApp.controller('AppCtrl', function($rootScope, $scope, $ionicPopover, $window, $cordovaPush, $cordovaToast, djangoAuth, PushNotificationService) {

    $scope.authInfo = djangoAuth;
    $scope.notifications = [];


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


    $rootScope.$on("djangoAuth.logged_in", function() {
        if($window.localStorage["regid"] !== "true"){
            PushNotificationService.register();
        }
    });


    $rootScope.$on('djangoAuth.logged_out', function() {
        console.log("From AppController: Logging out");
    });

    // Notification Received
    $rootScope.$on('$cordovaPush:notificationReceived', function (event, notification) {
        $cordovaToast.showShortCenter(notification);
        //console.log("Notification: " + JSON.stringify([notification]));
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

    $scope.clearLocalStorage = function(){
        $window.localStorage.clear();
    };

});

