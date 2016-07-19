'use strict';

describe('Directive: styleSwicher', function () {

  // load the directive's module
  beforeEach(module('culAdminApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<style-swicher></style-swicher>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the styleSwicher directive');
  }));
});
