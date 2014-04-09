'use strict';

angular.module('cyanogenmodDistributionApp')
  .controller('MainCtrl', function ($scope) {
    $(function() {
      $.getJSON('scripts/data-04-07-2014.json', function(data) {
        var version = data.result.version;
        var downloads = _.chain(version)
                         .map(function(v) { return v[0]; })
                         .filter(function(value) { return value > 10000; })
                         .value();

        var margin = { top: 50, right: 30, bottom: 30, left: 40 },
            width = 960,
            height = 500;

        var y = d3.scale.linear()
            .domain([0, d3.max(downloads)])
            .range([height, 0]);

        var chart = d3.select('.chart')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
          .append('g')
            .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

        var barWidth = width / downloads.length;

        var bar = chart.selectAll('g')
            .data(downloads)
          .enter().append('g')
            .attr('transform', function(d, i) { return 'translate(' + i * barWidth + ', 0)'; });

        bar.append('rect')
            .attr('y', function(d) { return y(d); })
            .attr('height', function(d) { return height - y(d); })
            .attr('width', barWidth - 1);

        bar.append('text')
            .attr('x', barWidth / 2)
            .attr('y', function(d) { return y(d) + 3; })
            .attr('transform', function(d) {
              return 'rotate(90 ' + (barWidth / 2) + ',' + (y(d) - 3) + ')';
            })
            .attr('dy', '.35em')
            .text(function(d) { return d; });
      });
    });
  });
