'use strict';

describe('Controller: WarehouseregistrationCtrl', function () {

  // load the controller's module
  beforeEach(module('culAdminApp'));

  var WarehouseregistrationCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    WarehouseregistrationCtrl = $controller('WarehouseregistrationCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(WarehouseregistrationCtrl.awesomeThings.length).toBe(3);
  });
});
