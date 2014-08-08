'use strict';

/**
 * @ngdoc service
 * @name cyanogenmodDistributionApp.statistics
 * @description
 * # statistics
 * Service in the cyanogenmodDistributionApp.
 */
angular.module('cyanogenmodDistributionApp')
  .service('Statistics', function Statistics($http, $q) {

    var parseVersion = function(data) {
      var versionRegex = /(\d+)(\.(\d+)(\.(\d+))?)?/;

      _.each(data, function(d) {
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

      return data;
    };

    var sortByVersion = function(data) {
      return _.chain(data)
        .groupBy(function(d) { return d.version; })
        .map(function(group, key) { return { key: +key, group: group }; })
        .sortBy(function(d) { return d.key ? d.key : -1; })
        .reverse()
        .map(function(d) {
          return _.sortBy(d.group, function(d) { return d.downloads; }).reverse();
        })
        .flatten()
        .value();
    };

    this.getDownloads = function(sort) {
      return $http.get('api/versions', { cache: true })
        .then(function(response) {
          return _.last(response.data).statistics;
        })
        .then(parseVersion)
        .then(function(data) {
          return sort ? sortByVersion(data) : data;
        });
    };
  });
