'use strict';


  bikeMapApp.controller('LogoutCtrl', function ($scope, $location, djangoAuth) {
    djangoAuth.logout();
    $location.path("/");
  });
