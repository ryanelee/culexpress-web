'use strict';

describe('Controller: MyaddresscontrollerCtrl', function () {

  // load the controller's module
  beforeEach(module('culwebApp'));

  var MyaddresscontrollerCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    MyaddresscontrollerCtrl = $controller('MyaddresscontrollerCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(MyaddresscontrollerCtrl.awesomeThings.length).toBe(3);
  });
});
