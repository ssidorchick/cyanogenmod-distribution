'use strict';

angular.module('cyanogenmodDistributionApp')
  .controller('MainCtrl', function ($scope, Statistics) {
    var downloadsPromise = Statistics.getDownloads();
    downloadsPromise.then(function(data) {
      $scope.barData = data;
    });
  });
