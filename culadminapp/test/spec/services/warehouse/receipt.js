'use strict';

describe('Service: warehouse/receipt', function () {

  // load the service's module
  beforeEach(module('culAdminApp'));

  // instantiate service
  var warehouse/receipt;
  beforeEach(inject(function (_warehouse/receipt_) {
    warehouse/receipt = _warehouse/receipt_;
  }));

  it('should do something', function () {
    expect(!!warehouse/receipt).toBe(true);
  });

});
