'use strict';

describe('Controller: EditreceiptCtrl', function () {

  // load the controller's module
  beforeEach(module('culAdminApp'));

  var EditreceiptCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    EditreceiptCtrl = $controller('EditreceiptCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(EditreceiptCtrl.awesomeThings.length).toBe(3);
  });
});
