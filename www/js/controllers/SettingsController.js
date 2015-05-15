/**
 * Created by angeboss on 5/8/2015.
 */

bikeMapApp.controller('SettingsCtrl', function($scope, $window, PushNotificationService) {
   $scope.model = {
        receiveAlerts: PushNotificationService.enabled
    };

    $scope.toggleReceiveAlerts = function() {
        PushNotificationService.enabled = !PushNotificationService.enabled;
        $window.localStorage["receiveAlerts"] = PushNotificationService.enabled;

        // When toggling we need to enable/disable push notifications for this device on the server
        if(PushNotificationService.enabled) {
            PushNotificationService.register();
        } else {
            PushNotificationService.unregister();
        }
    }

});
