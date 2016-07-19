'use strict';

describe('Controller: WarehouseInventoryCtrl', function () {

  // load the controller's module
  beforeEach(module('culAdminApp'));

  var WarehouseInventoryCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    WarehouseInventoryCtrl = $controller('WarehouseInventoryCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(WarehouseInventoryCtrl.awesomeThings.length).toBe(3);
  });
});
