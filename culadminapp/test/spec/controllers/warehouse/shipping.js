'use strict';

describe('Controller: WarehouseShippingCtrl', function () {

  // load the controller's module
  beforeEach(module('culAdminApp'));

  var WarehouseShippingCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    WarehouseShippingCtrl = $controller('WarehouseShippingCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(WarehouseShippingCtrl.awesomeThings.length).toBe(3);
  });
});
