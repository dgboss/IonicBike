'use strict';


  bikeMapApp.controller('LogoutCtrl', function ($scope, $state, djangoAuth) {
    djangoAuth.logout();
    $state.go("app");
  });
