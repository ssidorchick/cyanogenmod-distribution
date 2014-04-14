'use strict';

angular.module('cyanogenmodDistributionApp')
  .controller('MainCtrl', function ($scope) {
    $(function() {
      $.getJSON('scripts/data-04-07-2014.json', function(data) {
        var version = data.result.version;
        var builds = _.chain(version)
                      .map(function(v) { return { name: v[1], downloads: v[0] }; })
                      .filter(function(build) { return build.downloads > 10000; })
                      .value();

        var margin = { top: 50, right: 30, bottom: 30, left: 40 },
            width = 960,
            height = 500;

        var x = d3.scale.ordinal()
            .rangeRoundBands([0, width], .1)
            .domain(builds.map(function(d) { return d.name; }));

        var y = d3.scale.linear()
            .domain([0, d3.max(builds, function(d) { return d.downloads; })])
            .range([height, 0]);

        var chart = d3.select('.chart')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
          .append('g')
            .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

        var bar = chart.selectAll('g')
            .data(builds)
          .enter().append('g')
            .attr('transform', function(d, i) { return 'translate(' + x(d.name) + ', 0)'; });

        bar.append('rect')
            .attr('y', function(d) { return y(d.downloads); })
            .attr('height', function(d) { return height - y(d.downloads); })
            .attr('width', x.rangeBand());

        bar.append('text')
            .attr('x', x.rangeBand() / 2)
            .attr('y', function(d) { return y(d.downloads) + 3; })
            .attr('transform', function(d) {
              return 'rotate(90 ' + (x.rangeBand() / 2) + ',' + (y(d.downloads) - 3) + ')';
            })
            .attr('dy', '.35em')
            .text(function(d) { return d.downloads; });
      });
    });
  });
