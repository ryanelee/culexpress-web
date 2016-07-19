'use strict';

describe('Controller: WarehousePickingCtrl', function () {

  // load the controller's module
  beforeEach(module('culAdminApp'));

  var WarehousePickingCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    WarehousePickingCtrl = $controller('WarehousePickingCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(WarehousePickingCtrl.awesomeThings.length).toBe(3);
  });
});
