'use strict';

angular.module('cyanogenmodDistributionApp')
  .controller('MainCtrl', function ($scope, $http, $q) {
    $http.get('api/versions')
      .success(function(data) {
        var barData = _.last(data).statistics,
            versionRegex = /(\d+)(\.(\d+)(\.(\d+))?)?/;
        _.each(barData, function(d) {
          var result = versionRegex.exec(d.name),
              version = +result[1];
          // Correct version for 'nightly-72'.
          if (version === 72) {
            version = 7;
          } else if (version < 6 || version > 11) {
            version = undefined;
          }
          d.version = version;
        });
        $scope.barData = barData;

        var lineData = _.chain(data)
          .map(function(d) {
            return {
              version: d.statistics,
              date: d.timestamp
            };
          })
          .each(function(d) {
            d.version = _.chain(d.version)
              .sortBy(function(b) { return b.downloads; })
              .last(20)
              .value();
          })
          .value();

        $scope.lineData = lineData;
      });
  });
