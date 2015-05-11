/**
 * Created by boss on 4/10/2015.
 */

bikeMapApp.service('PushNotificationService', function PushNotificationService($rootScope, $state, $location, $window, $cordovaPush, $cordovaDialogs, $cordovaMedia, $http, $resource, $ionicPopup){


    var service = {
       /* 'notifications': $window.localStorage["notifications"] ? JSON.parse($window.localStorage["notifications"]) : [],
       */ 'enabled': $window.localStorage["receiveAlerts"] ? JSON.parse($window.localStorage["receiveAlerts"]) : true,
        'notifications': [{
            payload: {
                type: "hazard",
                i_type: "Poor Signage",
                pk: 1,
                lat: 49,
                lng: -121
            }
        },{
            payload: {
                type: "theft",
                i_type: "Some type of theft",
                pk: 17
            }
        },{
            payload: {
                type: "collision",
                i_type: "Some type of collision",
                pk: 3
            }
        }
        ],

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
                console.log("Register success " + result);
                // ** NOTE: Android regid result comes back in the pushNotificationReceived, only iOS returned here
                if (ionic.Platform.isIOS()) {
                    this.storeDeviceToken("ios");
                }
            }, function (err) {
                console.log("Register error " + err)
            });
        },

        'unregister': function(){
            if($window.localStorage["regid"]){
                this.removeDeviceToken();
                $window.localStorage.removeItem("regid");
            }
        },

        'handleAndroid': function(notification){
            // ** NOTE: ** You could add code for when app is in foreground or not, or coming from coldstart here too
            //             via the console fields as shown.
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
                            $location.path("/");
                            $rootScope.$broadcast("BMA.panToPoint", {data: notification});
                        }
                    })
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
            console.log($window.localStorage["token"]);
            $http.post('http://192.168.1.125:8000/gcmdevices/', JSON.stringify(
                {
                    "name": name,
                    "active": true,
                    "registration_id": $window.localStorage["regid"]
                }))
                .success(function (data, status) {
                    console.log("Token stored, device is successfully subscribed to receive push notifications.");
                })
                .error(function (data, status) {
                    console.log("Error storing device token." + data + " " + status)
                });
        },

        'removeDeviceToken': function(){
            console.log("About to unregister a device");
            if($window.localStorage["regid"]){
                $http({
                    method: 'DELETE',
                    url: 'http://192.168.1.125:8000/gcmdevices/' + $window.localStorage["regid"] + '/'
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
