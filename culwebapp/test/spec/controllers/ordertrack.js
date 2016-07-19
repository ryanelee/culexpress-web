'use strict';

describe('Controller: OrdertrackCtrl', function () {

  // load the controller's module
  beforeEach(module('culwebApp'));

  var OrdertrackCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    OrdertrackCtrl = $controller('OrdertrackCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(OrdertrackCtrl.awesomeThings.length).toBe(3);
  });
});
