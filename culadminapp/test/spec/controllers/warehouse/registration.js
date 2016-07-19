'use strict';

describe('Controller: WarehouseRegistrationCtrl', function () {

  // load the controller's module
  beforeEach(module('culAdminApp'));

  var WarehouseRegistrationCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    WarehouseRegistrationCtrl = $controller('WarehouseRegistrationCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(WarehouseRegistrationCtrl.awesomeThings.length).toBe(3);
  });
});
