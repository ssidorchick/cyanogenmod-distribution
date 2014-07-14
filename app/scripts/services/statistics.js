'use strict';

/**
 * @ngdoc service
 * @name cyanogenmodDistributionApp.statistics
 * @description
 * # statistics
 * Service in the cyanogenmodDistributionApp.
 */
angular.module('cyanogenmodDistributionApp')
  .service('Statistics', function Statistics($http) {

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

    this.getDownloads = function() {
      return $http.get('api/versions')
        .then(function(response) {
          return _.last(response.data).statistics;
        })
        .then(parseVersion);
    };
  });
