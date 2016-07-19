'use strict';

describe('Controller: WarehouseEditshelfCtrl', function () {

  // load the controller's module
  beforeEach(module('culAdminApp'));

  var WarehouseEditshelfCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    WarehouseEditshelfCtrl = $controller('WarehouseEditshelfCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(WarehouseEditshelfCtrl.awesomeThings.length).toBe(3);
  });
});
