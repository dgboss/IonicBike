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
            if(ionic.Platform.isAndroid()) {
                for (var i in this.notifications) {
                    if (this.notifications[i].payload.pk === pk) {
                        this.notifications.splice(i, 1);
                        break;
                    }
                }
            }
            else if(ionic.Platform.isIOS()) {
                for (var i in this.notifications) {
                    if (this.notifications[i].pk === pk) {
                        this.notifications.splice(i, 1);
                        break;
                    }
                }
            }
            $window.localStorage["notifications"] = JSON.stringify(this.notifications);
        },

        'register': function(){
            // Only register if the user has not disabled push notification on settings page
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
                        $window.localStorage["regid"] = result;
                        $http.post(Constants.API + 'apnsdevices/', JSON.stringify(
                            {
                                "name": name,
                                "active": true,
                                "registration_id": result
                            }), {
                            headers: {'Authorization': 'Token ' + $window.localStorage["token"]}
                        })
                            .success(function (data, status) {
                                //console.log("Token stored, device is successfully subscribed to receive push notifications.");
                            })
                            .error(function (data, status) {
                                //console.log("Error storing device token." + data + " " + status)
                            });
                        console.log(result);
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
                this.storeDeviceToken();
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

        'handleIOS': function(notification){
            this.saveNotification(notification);
            if(notification.foreground === "1") {
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
            }
            else {
                $state.go('app');
                $rootScope.$broadcast("BMA.panToPoint", {data: notification});
            }
            console.log(notification);
        },

        'storeDeviceToken': function(){

            var name;
            if($window.localStorage["user"] && $window.localStorage["user"] !== 'Guest'){
                name = $window.localStorage["user"];
            } else {
                name = "anonymous";
            }
            if(ionic.Platform.isAndroid()) {
                $http.post(Constants.API + 'gcmdevices/', JSON.stringify(
                    {
                        "name": name,
                        "active": true,
                        "registration_id": $window.localStorage["regid"]
                    }), {
                    headers: {'Authorization': 'Token ' + $window.localStorage["token"]}
                })
                    .success(function (data, status) {
                        //console.log("Token stored, device is successfully subscribed to receive push notifications.");
                    })
                    .error(function (data, status) {
                        //console.log("Error storing device token." + data + " " + status)
                    });
            }
            else{
                // Nothing to do
            }
        },

        'removeDeviceToken': function(){
            if($window.localStorage["regid"]){
                if(ionic.Platform.isAndroid()) {
                    $http({
                        method: 'DELETE',
                        url: Constants.API + 'gcmdevices/' + $window.localStorage["regid"] + '/'
                    })
                        .success(function (data, status) {
                            //console.log("Regid successfully deleted");
                        })
                        .error(function (data, status) {
                            //console.log("Regid could not be deleted");
                        })
                }
                else if(ionic.Platform.isIOS()){
                    $http({
                        method: 'DELETE',
                        url: Constants.API + 'apnsdevices/' + $window.localStorage["regid"] + '/'
                    })
                        .success(function (data, status) {
                            //console.log("Regid successfully deleted");
                        })
                        .error(function (data, status) {
                            //console.log("Regid could not be deleted");
                        })
                }
            }
        }};

    return service;
});
