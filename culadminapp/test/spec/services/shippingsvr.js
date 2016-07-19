'use strict';

describe('Service: shippingSvr', function () {

  // load the service's module
  beforeEach(module('culAdminApp'));

  // instantiate service
  var shippingSvr;
  beforeEach(inject(function (_shippingSvr_) {
    shippingSvr = _shippingSvr_;
  }));

  it('should do something', function () {
    expect(!!shippingSvr).toBe(true);
  });

});
