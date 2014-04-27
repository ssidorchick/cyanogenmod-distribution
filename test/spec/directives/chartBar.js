'use strict';

describe('Directive: chartBar', function () {

  // load the directive's module
  beforeEach(module('cyanogenmodDistributionApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<chart-bar></chart-bar>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the chartBar directive');
  }));
});
