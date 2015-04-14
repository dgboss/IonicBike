/**
 * Created by boss on 4/10/2015.
 */

bikeMapApp.service('PushNotificationService', function PushNotificationService($rootScope, $location, $cordovaPush, $cordovaDialogs, $cordovaMedia, $cordovaToast, $http, $window, $ionicPopup){


    var service = {
        'somethingForShow': 'Something for show',

        'register': function(){
            console.log(this.somethingForShow);
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
                console.log(ionic.Platform);
                $cordovaToast.showShortCenter('Registered for push notifications');
                // ** NOTE: Android regid result comes back in the pushNotificationReceived, only iOS returned here
                if (ionic.Platform.isIOS()) {
                    storeDeviceToken("ios");
                }
            }, function (err) {
                console.log("Register error " + err)
            });
        },

        'handleAndroid': function(notification){
            // ** NOTE: ** You could add code for when app is in foreground or not, or coming from coldstart here too
            //             via the console fields as shown.
            console.log("In foreground " + notification.foreground  + " Coldstart " + notification.coldstart);
            if (notification.event == "registered") {
                $window.localStorage["regid"] = notification.regid;
                this.storeDeviceToken("android");
            }
            else if (notification.event == "message") {
                if(notification.foreground){
                    var confirmPopup = $ionicPopup.confirm({
                        title: "Foreground",
                        template: "Notification received while in the foreground"
                    });
                    confirmPopup.then(function(res){
                        if(res){
                            console.log("You clicked YES!");
                            $location.path("/");
                            $rootScope.$broadcast("PushNotificationService.panToPoint", {data: notification});
                        }
                        else{
                            console.log("You clicked NO!");
                        }}
                    )}

                }

            else if (notification.event == "error")
                $cordovaDialogs.alert(notification.msg, "Push notification error event");
            else $cordovaDialogs.alert(notification.event, "Push notification handler - Unprocessed Event");
        },

        'storeDeviceToken': function(type){

            console.log("Post token for registered device with data " + JSON.stringify(type));

            var name;
            if($window.localStorage["user"] && $window.localStorage["user"] !== 'Guest'){
                name = $window.localStorage["user"];
            }

            else{
                name = "anonymous";
            }

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
        }}

    return service;
});
