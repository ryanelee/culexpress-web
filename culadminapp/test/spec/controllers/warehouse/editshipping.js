'use strict';

describe('Controller: WarehouseEditshippingCtrl', function () {

  // load the controller's module
  beforeEach(module('culAdminApp'));

  var WarehouseEditshippingCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    WarehouseEditshippingCtrl = $controller('WarehouseEditshippingCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(WarehouseEditshippingCtrl.awesomeThings.length).toBe(3);
  });
});
