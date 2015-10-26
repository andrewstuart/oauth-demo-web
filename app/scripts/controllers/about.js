'use strict';

/**
 * @ngdoc function
 * @name oauthApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the oauthApp
 */
angular.module('oauthApp')
  .controller('AboutCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
