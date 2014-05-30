'use strict';

angular.module('cyanogenmodDistributionApp')
  .controller('MainCtrl', function ($scope, $http, $q) {
    $http.get('scripts/data-04-07-2014.json')
      .success(function(data) {
        var version = data.result.version;
        var builds =
          _.chain(version)
            .map(function(v) { return { name: v[1], downloads: v[0] }; })
            .filter(function(build) { return build.downloads > 10000; })
            .value();

        $scope.barData = builds;
      });

    var data0422 = $http.get('scripts/data-04-22-2014.json'),
        data0426 = $http.get('scripts/data-04-26-2014.json'),
        data0501 = $http.get('scripts/data-05-01-2014.json'),
        data0502 = $http.get('scripts/data-05-02-2014.json');

    $q.all([data0422, data0426, data0501, data0502]).then(function(data) {
      var builds = _.chain(data)
        .map(function(d) { return { version: d.data.result.version, date: d.data.result.date }; })
        .each(function(d) {
          d.version = _.chain(d.version)
            .map(function(v) { return { name: v[1], downloads: v[0] }; })
            .sortBy(function(b) { return b.downloads; })
            .last(20)
            .value();

          return d;
      })
      .value();

      $scope.lineData = builds;
    });
  });
