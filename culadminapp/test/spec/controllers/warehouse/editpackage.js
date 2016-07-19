'use strict';

describe('Controller: WarehouseEditpackageCtrl', function () {

  // load the controller's module
  beforeEach(module('culAdminApp'));

  var WarehouseEditpackageCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    WarehouseEditpackageCtrl = $controller('WarehouseEditpackageCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(WarehouseEditpackageCtrl.awesomeThings.length).toBe(3);
  });
});
