'use strict';

describe('Controller: CommonLeftmenuCtrl', function () {

  // load the controller's module
  beforeEach(module('culAdminApp'));

  var CommonLeftmenuCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    CommonLeftmenuCtrl = $controller('CommonLeftmenuCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(CommonLeftmenuCtrl.awesomeThings.length).toBe(3);
  });
});
