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
      return $q.all([
        $http.get('https://oauth-service.astuart.co/stuff').then(function(res) {
          $scope.data = res.data;
        }).catch(function(err) {
          $scope.error.push(err);
        }),
        $http.get('https://oauth.astuart.co/token_info', {params: { token: $scope.token.access_token }})
        .then(function(res) {
          $scope.tokenInfo = res.data;
        }).catch(function(err) {
          $scope.error.push(err);
        })
      ]);
    });

    if ( $routeParams.error ) {
      $scope.error.push($routeParams.error);
    }
  });
