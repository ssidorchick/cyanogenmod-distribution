'use strict';

angular.module('cyanogenmodDistributionApp')
  .directive('chartBar', function () {
    return {
      restrict: 'E',
      scope: {
        data: '='
      },
      templateUrl: 'partials/chart-bar',
      link: function(scope, element, attrs) {
        var margin = { top: 50, right: 0, bottom: 90, left: 60 },
            width = element.width() - margin.left - margin.right,
            height = 400,
            barMinWidth = 20,
            formatNumber = d3.format(',');

        var chart = d3.select(element[0])
          .select('svg')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
          .append('g')
            .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

        scope.slider = {
          value: [0.00, 1.00]
        };

        scope.$watch('slider.value', function(value) {
          var data = scope.data,
              start = Math.floor(data.length * value[0]),
              end = Math.ceil(data.length * value[1]);

          var filtered = data.slice(start, end);
          updateChart(filtered);
        });

        scope.$watch('data', function(data) {
          updateChart(data);
        });

        var updateChart = function(data) {
          chart.selectAll('*').remove();

          if (!data) {
            return;
          }

          var optimalWidth = Math.max(data.length * barMinWidth, width);

          d3.select(element[0])
            .select('svg')
              .attr('width', optimalWidth + margin.left + margin.right);

          var x = d3.scale.ordinal()
              .rangeRoundBands([0, optimalWidth], 0.1, 0.1)
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
              .attr('transform', function(d) { return 'translate(' + (x(d.name) - 0) + ', 0)'; });

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
        };
      }
    };
  });
