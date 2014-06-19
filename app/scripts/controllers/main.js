'use strict';

angular.module('cyanogenmodDistributionApp')
  .controller('MainCtrl', function ($scope, $http, $q) {
    $http.get('api/versions')
      .success(function(data) {
        $scope.barData = _.last(data).statistics;

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
