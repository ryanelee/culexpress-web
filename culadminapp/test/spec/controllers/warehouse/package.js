'use strict';

describe('Controller: WarehousePackageCtrl', function () {

  // load the controller's module
  beforeEach(module('culAdminApp'));

  var WarehousePackageCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    WarehousePackageCtrl = $controller('WarehousePackageCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(WarehousePackageCtrl.awesomeThings.length).toBe(3);
  });
});
