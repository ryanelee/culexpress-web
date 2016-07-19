'use strict';

describe('Controller: KnowledgebaseCtrl', function () {

  // load the controller's module
  beforeEach(module('culAdminApp'));

  var KnowledgebaseCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    KnowledgebaseCtrl = $controller('KnowledgebaseCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(KnowledgebaseCtrl.awesomeThings.length).toBe(3);
  });
});
