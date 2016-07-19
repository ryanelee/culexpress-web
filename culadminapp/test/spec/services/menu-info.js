'use strict';

describe('Service: menuInfo', function () {

  // load the service's module
  beforeEach(module('culAdminApp'));

  // instantiate service
  var menuInfo;
  beforeEach(inject(function (_menuInfo_) {
    menuInfo = _menuInfo_;
  }));

  it('should do something', function () {
    expect(!!menuInfo).toBe(true);
  });

});
