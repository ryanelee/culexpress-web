'use strict';

describe('Service: warehouse/inventorySvr', function () {

  // load the service's module
  beforeEach(module('culAdminApp'));

  // instantiate service
  var warehouse/inventorySvr;
  beforeEach(inject(function (_warehouse/inventorySvr_) {
    warehouse/inventorySvr = _warehouse/inventorySvr_;
  }));

  it('should do something', function () {
    expect(!!warehouse/inventorySvr).toBe(true);
  });

});
