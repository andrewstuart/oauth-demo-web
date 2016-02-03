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
      var TOKEN_KEY = 'token';

      /**
       * @function OA
       * @description The class for oauth service
       */
      function OA() {
        var oa = this;
        oa.state = function() {
          return state;
        };

        var token;

        try {
          token = JSON.parse(localStorage.getItem(TOKEN_KEY));
        } catch (e) {
          console.log(e);
        }

        oa.token = function(code) {
          return $q(function(resolve) {
            if (token) {
              resolve(token);
              return;
            }

            var p = $http({
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

              return res.data;
            });

            resolve(p);
          }).then(function(token) {
              $http.defaults.headers.common.Authorization = "Bearer " + token.access_token;
              localStorage.setItem(TOKEN_KEY, JSON.stringify(token));
              return token;
          });
        };
      }

      return new OA();
    }
  });
