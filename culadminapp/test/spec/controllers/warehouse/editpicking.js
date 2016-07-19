'use strict';

describe('Controller: WarehouseEditpickingCtrl', function () {

  // load the controller's module
  beforeEach(module('culAdminApp'));

  var WarehouseEditpickingCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    WarehouseEditpickingCtrl = $controller('WarehouseEditpickingCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(WarehouseEditpickingCtrl.awesomeThings.length).toBe(3);
  });
});
