'use strict';

describe('Service: oauth', function () {

  // load the service's module
  beforeEach(module('oauthApp'));

  // instantiate service
  var oauth;
  beforeEach(inject(function (_oauth_) {
    oauth = _oauth_;
  }));

  it('should do something', function () {
    expect(!!oauth).toBe(true);
  });

});
