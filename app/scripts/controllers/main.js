'use strict';

angular.module('cyanogenmodDistributionApp')
  .controller('MainCtrl', function ($scope) {
    $.getJSON('scripts/data-04-07-2014.json', function(data) {
      var version = data.result.version;
      var builds =
        _.chain(version)
          .map(function(v) { return { name: v[1], downloads: v[0] }; })
          .filter(function(build) { return build.downloads > 10000; })
          .value();

      $scope.data = builds;
    });
  });
