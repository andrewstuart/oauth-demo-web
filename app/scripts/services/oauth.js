'use strict';

/**
 * @ngdoc service
 * @name oauthApp.oauth
 * @description
 * # oauth
 * Service in the oauthApp.
 */
angular.module('oauthApp')
  .provider('oauth', function oauthProvider() {
    var oap = this;

    oap.callback = '/login';
    oap.clientId = 1;
    oap.clientSecret = 'thing';
    oap.grantType = 'code';

    oap.authServer = 'https://oauth.astuart.co';
    oap.authZPath = '/authorize';
    oap.tokenPath = '/token';

    var state = '1234';

    oap.$get = function($location, $http, $q, $httpParamSerializer) {
      function OA () {
        var oa = this;
        oa.state = function() {
          return state;
        };

        oa.token = function(code) {
          return $http({
            method: 'POST',
            url: oap.authServer + oap.tokenPath,
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'Authorization': 'Basic ' + btoa(oap.clientId + ':' + oap.clientSecret),
            },
            data: $httpParamSerializer({
              grant_type: 'authorization_code',
              client_id: oap.clientId,
              redirect_uri: $location.protocol() + '://' + $location.host() + ($location.port() !== 80 ? ':' + $location.port() : '') + oap.callback,
              code: code
            })
          }).then(function(res) {
            if ( !res.data ) { return $q.reject('No data in response'); }
            if ( res.data.error ) { return $q.reject(res.data); }

            $http.defaults.headers.common.Authorization = "Bearer " + res.data.access_token;

            return res.data;
          });
        };
      }

      return new OA();
    }
  });
