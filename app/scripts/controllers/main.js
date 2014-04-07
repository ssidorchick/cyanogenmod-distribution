'use strict';

angular.module('cyanogenmodDistributionApp')
  .controller('MainCtrl', function ($scope) {
    $(function() {
      $.getJSON('scripts/data-04-07-2014.json', function(data) {
        var version = data.result.version;
        var downloads = _.map(version, function(v) { return v[0]; });

        var width = 500,
            barHeight = 20;

        var x = d3.scale.linear()
          .domain([0, d3.max(downloads)])
          .range([0, width]);

        var chart = d3.select('.chart')
          .attr('width', width + 100)
          .attr('height', barHeight * downloads.length);

        var bar = chart.selectAll('g')
          .data(downloads)
          .enter()
          .append('g')
          .attr('transform', function(d, i) { return 'translate(0, ' + i * barHeight + ')'; });

        bar.append('rect')
          .attr('width', function(d) { return x(d); })
          .attr('height', barHeight - 1);

        bar.append('text')
          .attr('x', function(d) { return x(d) + 50; })
          .attr('y', barHeight / 2)
          .attr('dy', '.35em')
          .text(function(d) { return d; });
      });
    });
  });
