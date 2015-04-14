
var bikeMapApp = angular.module('bikeMapApp', ['ionic', 'ionic.contrib.drawer', 'ngResource', 'ngCookies', 'bikeMapApp.services', 'bikeMapApp.icons', 'ngCordova'])

.run(['$ionicPlatform', '$cookies', '$window', 'djangoAuth', function($ionicPlatform, $cookies, $window, djangoAuth) {
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
    }
  });






}])


.config(function($stateProvider, $urlRouterProvider) {
        $stateProvider

            .state('app', {
                url: "/",
                templateUrl: "templates/main.html",
                controller: 'MapCtrl'
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

        $urlRouterProvider.otherwise('/');
})

