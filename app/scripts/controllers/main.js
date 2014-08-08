'use strict';

angular.module('cyanogenmodDistributionApp')
  .controller('MainCtrl', function ($scope, Statistics) {
    var getData = function(sortByVersion) {
      var downloadsPromise = Statistics.getDownloads(sortByVersion);
      downloadsPromise.then(function(data) {
        $scope.barData = data;
      });
    };

    getData();

    $scope.sort = function(byVersion) {
      getData(byVersion);
    };
  });
