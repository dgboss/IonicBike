
var bikeMapApp = angular.module('bikeMapApp', ['ionic', 'ionic.contrib.drawer', 'ngResource', 'ngCookies', 'bikeMapApp.services', 'bikeMapApp.icons', 'bikeMapApp.FormServices', 'bikeMapApp.constants', 'ngCordova', 'ui.bootstrap', 'ui.select'])

.run(['$ionicPlatform', '$cookies', '$window', 'djangoAuth', 'PushNotificationService', function($ionicPlatform, $cookies, $window, djangoAuth, PushNotificationService) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }

/*
      if($window.localStorage["notifications"]) {
          PushNotificationService.notifications = $window.localStorage["notifcations"];
      }
*/

    if($window.localStorage["authenticated"]){
        djangoAuth.authenticated = $window.localStorage["authenticated"];
    }

    if($window.localStorage["user"]) {
        djangoAuth.user = $window.localStorage["user"];
        PushNotificationService.register();
    }

  });
}])


.config(function($stateProvider, $urlRouterProvider) {
        $stateProvider

            .state('app', {
                url: "/",
                templateUrl: "templates/map.html"
            })

            .state('login', {
                url: "/login",
                templateUrl: "templates/login.html",
                controller: 'LoginCtrl'
            })

            .state('logout', {
                url: "/logout",
                controller: 'LogoutCtrl'
            })

            .state('share', {
                url: "/share",
                templateUrl: "templates/share.html"
            })

            .state('hazard', {
                url: "/hazard",
                templateUrl: "templates/hazard.html",
                controller: 'HazardCtrl'
            })

            .state('incidentform', {
                url: "/incidentform",
                templateUrl: "templates/incident-form.html"
            })

            .state('notifications', {
                url: "/notifications",
                templateUrl: "templates/notifications.html"
            })

            .state('settings', {
                url: "/settings",
                templateUrl: "templates/settings.html"
            });

        $urlRouterProvider.otherwise('/');
});

