/**
 * Created by boss on 5/6/2015.
 */

bikeMapApp.controller('NotificationCtrl', function($scope, $rootScope, $state, Coord_Service, PushNotificationService) {
   // Sync controller/model notifications with PushNotificationService
   $scope.model = {
        notifications: PushNotificationService.notifications
    };

    // Delete a notification
    $scope.deleteItem = function(notification) {
        PushNotificationService.deleteNotification(notification.payload.pk);
    };

    // View notification on map
    $scope.viewNotificationOnMap = function(notification){
        Coord_Service.coordinates[0] = notification.payload.lng;
        Coord_Service.coordinates[1] = notification.payload.lat;
        Coord_Service.dirty = true;
        $rootScope.$broadcast("BMA.panToPoint", {data: notification});
        $state.go('app');

    };
});

