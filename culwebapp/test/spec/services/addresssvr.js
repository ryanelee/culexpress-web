'use strict';

describe('Service: addressSvr', function () {

  // load the service's module
  beforeEach(module('culwebApp'));

  // instantiate service
  var addressSvr;
  beforeEach(inject(function (_addressSvr_) {
    addressSvr = _addressSvr_;
  }));

  it('should do something', function () {
    expect(!!addressSvr).toBe(true);
  });

});
