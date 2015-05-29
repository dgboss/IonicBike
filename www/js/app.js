
var bikeMapApp = angular.module('bikeMapApp', ['ionic', 'ngResource', 'ngCookies', 'bikeMapApp.services', 'bikeMapApp.icons', 'bikeMapApp.FormServices', 'bikeMapApp.constants', 'ngCordova', 'ui.bootstrap', 'mgcrea.ngStrap' ])

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

    if($window.localStorage["authenticated"]){
        djangoAuth.authenticated = $window.localStorage["authenticated"];
    }

    if($window.localStorage["user"]) {
        djangoAuth.user = $window.localStorage["user"];
        if($window.localStorage["user"] !== 'Guest') {
            PushNotificationService.register();
        }
    }
  });
}])


.config(function($stateProvider, $urlRouterProvider) {
        $stateProvider

            .state('app', {
                url: "/",
                templateUrl: "templates/map.html"
            })

            /*.state('login', {
                url: "/login",
                templateUrl: "templates/login.html",
                controller: 'LoginCtrl'
            })*/

            .state('logout', {
                url: "/logout",
                controller: 'LogoutCtrl'
            })

            .state('share', {
                url: "/share",
                templateUrl: "templates/share.html"
            })

            .state('incident', {
                url: "/incident",
                templateUrl: "templates/incident.html",
                controller: "IncidentCtrl"
            })

            .state('hazard', {
                url: "/hazard",
                templateUrl: "templates/hazard.html",
                controller: "HazardCtrl"
            })

            .state('theft', {
                url: "/theft",
                templateUrl: "templates/theft.html",
                controller: "TheftCtrl"
            })

            .state('notifications', {
                url: "/notifications",
                templateUrl: "templates/notifications.html"
            })

            .state('settings', {
                url: "/settings",
                templateUrl: "templates/settings.html"
            })

            .state('registration', {
                    url: "/registration",
                    templateUrl: "templates/registration.html",
                    controller: "RegistrationCtrl"
            })

            .state('reset-password', {
                url: "/password-reset",
                templateUrl: "templates/password-reset.html",
                controller: "PasswordResetCtrl"

            })

            .state('about', {
                url: "/about",
                templateUrl: "templates/about.html",
                controller: "AboutCtrl"
            })

            .state('tutorial', {
                url: "/tutorial",
                templateUrl: "templates/tutorial.html",
            });

        $urlRouterProvider.otherwise('/');
});

