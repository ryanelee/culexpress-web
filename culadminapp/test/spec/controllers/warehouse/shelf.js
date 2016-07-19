'use strict';

describe('Controller: WarehouseShelfCtrl', function () {

  // load the controller's module
  beforeEach(module('culAdminApp'));

  var WarehouseShelfCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    WarehouseShelfCtrl = $controller('WarehouseShelfCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(WarehouseShelfCtrl.awesomeThings.length).toBe(3);
  });
});
