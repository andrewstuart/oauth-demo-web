'use strict';

/**
 * @ngdoc function
 * @name oauthApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the oauthApp
 */
angular.module('oauthApp')
  .controller('LoginCtrl', function ($scope, $routeParams, $http, $q, oauth) {
    $scope.rp = $routeParams;

    $scope.error = [];

    $q(function(resolve) {
      if ( !$routeParams.code ) { return resolve(); }
        resolve(oauth.token($routeParams.code).then(function(res) {
          $scope.token = res;
          console.log(res);
        }));
    }).catch(function(err) {
      $scope.error.push(err);
    }).finally(function() {
      return $http.get('https://oauth-service.astuart.co/stuff').then(function(res) {
        $scope.data = res.data;
      });
    }).catch(function(err) {
      console.log(err);
      $scope.error.push(err);
    });

    if ( $routeParams.error ) {
      $scope.error = $routeParams.error;
    }
  });
