'use strict';

angular.module('cyanogenmodDistributionApp')
  .directive('chartBar', function () {
    return {
      restrict: 'E',
      scope: {
        data: '='
      },
      link: function(scope, element, attrs) {
        var margin = { top: 50, right: 0, bottom: 90, left: 60 },
            width = element.width() - margin.left - margin.right,
            height = 400,
            formatNumber = d3.format(',');

        var chart = d3.select(element[0])
          .append('svg')
            .classed('chart', true)
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
          .append('g')
            .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

        scope.$watch('data', function(data) {
          chart.selectAll('*').remove();

          if (!data) {
            return;
          }

          var x = d3.scale.ordinal()
              .rangeRoundBands([0, width], .1)
              .domain(data.map(function(d) { return d.name; }));

          var y = d3.scale.linear()
              .domain([0, d3.max(data, function(d) { return d.downloads; })])
              .range([height, 0]);

          var xAxis = d3.svg.axis()
              .scale(x)
              .orient('bottom');

          var yAxis = d3.svg.axis()
              .scale(y)
              .orient('left');

          var bar = chart.selectAll('g')
              .data(data)
            .enter().append('g')
              .attr('transform', function(d, i) { return 'translate(' + x(d.name) + ', 0)'; });

          bar.append('rect')
              .attr('y', function(d) { return y(d.downloads); })
              .attr('height', function(d) { return height - y(d.downloads); })
              .attr('width', x.rangeBand());

          bar.append('title')
              .text(function(d) { return formatNumber(d.downloads); });

          chart.append('g')
              .attr('class', 'x axis')
              .attr('transform', 'translate(0, ' + height + ')')
              .call(xAxis)
              .selectAll('text')
                  .style('text-anchor', 'end')
                  .attr('dx', '-.8em')
                  .attr('dy', '-.6em')
                  .attr('transform', 'rotate(-90)');

          chart.append('g')
              .attr('class', 'y axis')
              .call(yAxis);
        });
      }
    };
  });
