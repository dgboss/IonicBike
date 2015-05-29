/**
 * Created by boss on 4/10/2015.
 */

bikeMapApp.service('PushNotificationService', function PushNotificationService($rootScope, $state, $location, $window, $cordovaPush, $http, $ionicPopup, Constants){


    var service = {
        'notifications': $window.localStorage["notifications"] ? JSON.parse($window.localStorage["notifications"]) : [],
        'enabled': $window.localStorage["receiveAlerts"] ? JSON.parse($window.localStorage["receiveAlerts"]) : true,

        'saveNotification': function(notification) {
            // allow max of 20 notifications on the device
            if(this.notifications.length < 20) {
                this.notifications.push(notification);
            } else {
                this.notifications.splice(19, 1);
                this.notifications.push(notification);
            }
            $window.localStorage["notifications"] = JSON.stringify(this.notifications);
        },

        'deleteNotification': function(pk) {
            for(var i in this.notifications) {
                if(this.notifications[i].payload.pk === pk) {
                    this.notifications.splice(i,1);
                    break;
                }
            }
            $window.localStorage["notifications"] = JSON.stringify(this.notifications);
        },

        'register': function(){
            // Only register is the user has not disabled push notification on settings page
            if(this.enabled) {
                var config = null;

                if (ionic.Platform.isAndroid()) {
                    config = {
                        "senderID": "648574514687"
                    };
                }
                else if (ionic.Platform.isIOS()) {
                    config = {
                        "badge": "true",
                        "sound": "true",
                        "alert": "true"
                    }
                }

                $cordovaPush.register(config).then(function (result) {
                    // ** NOTE: Android regid result comes back in the pushNotificationReceived, only iOS returned here
                    if (ionic.Platform.isIOS()) {
                        this.storeDeviceToken("ios");
                    }
                }, function (err) {
                    console.log("Register error " + err)
                });
            }
        },

        'unregister': function(){
            if($window.localStorage["regid"]){
                this.removeDeviceToken();
                $window.localStorage.removeItem("regid");
            }
        },

        'handleAndroid': function(notification){
            if (notification.event == "registered") {
                $window.localStorage["regid"] = notification.regid;
                this.storeDeviceToken("android");
            }
            else if (notification.event == "message") {
                this.saveNotification(notification);
                if(notification.foreground){
                    var confirmPopup = $ionicPopup.confirm({
                        title: "New incident reported",
                        template: "Would you like to view the incident on the map?"
                    });
                    confirmPopup.then(function(res){
                        if(res){
                            $state.go('app');
                            $rootScope.$broadcast("BMA.panToPoint", {data: notification});
                        }
                    })
                } else {
                    $state.go('app');
                    $rootScope.$broadcast("BMA.panToPoint", {data: notification});
                }
            }
        },

        'storeDeviceToken': function(type){

            var name;
            if($window.localStorage["user"] && $window.localStorage["user"] !== 'Guest'){
                name = $window.localStorage["user"];
            } else {
                name = "anonymous";
            }
            $http.post( Constants.API + 'gcmdevices/', JSON.stringify(
                {
                    "name": name,
                    "active": true,
                    "registration_id": $window.localStorage["regid"]
                }), {
                headers: {'Authorization': 'Token ' + $window.localStorage["token"]}
            })
                .success(function (data, status) {
                    console.log("Token stored, device is successfully subscribed to receive push notifications.");
                })
                .error(function (data, status) {
                    console.log("Error storing device token." + data + " " + status)
                });
        },

        'removeDeviceToken': function(){
            if($window.localStorage["regid"]){
                $http({
                    method: 'DELETE',
                    url:  Constants.API + 'gcmdevices/' + $window.localStorage["regid"] + '/'
                })
                    .success(function (data, status) {
                        console.log("Regid successfully deleted");
                    })
                    .error(function(data, status) {
                        console.log("Regid could not be deleted");
                    })
            }
        }};

    return service;
});
