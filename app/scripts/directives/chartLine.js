'use strict';

angular.module('cyanogenmodDistributionApp')
  .directive('chartLine', function () {
    return {
      restrict: 'E',
      scope: {
        data: '='
      },
      link: function(scope, element, attrs) {
        var margin = { top: 50, right: 0, bottom: 90, left: 60 },
            width = element.width() - margin.left - margin.right,
            height = 400;

        var chart = d3.select(element[0])
          .append('svg')
            .classed('chart', true)
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
          .append('g')
            .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

        var parseDate = d3.time.format('%m-%d-%Y').parse;

        scope.$watch('data', function(data) {
          chart.selectAll('*').remove();

          if (_.isEmpty(data)) {
            return;
          }

          data = _.chain(data)
            .map(function(d) {
              var result =  _.chain(d.version)
                .map(function(d) {
                  return [d.name, d.downloads];
                })
                .object()
                .value();
              result.date = parseDate(d.date);

              return result;
            })
            .value();

          var color = d3.scale.category20();

          color.domain(d3.keys(data[0]).filter(function(key) { return key !== "date"; }));

          var versions = color.domain().map(function(name) {
            return {
              name: name,
              values: data.map(function(d) {
                return { date: d.date, downloads: +d[name]};
              })
            };
          });

          var x = d3.scale.ordinal()
              .domain(d3.extent(data, function(d) { return d.date; }))
              .range([0, width]);

          var y = d3.scale.linear()
              .domain([
                d3.min(versions, function(v) { return d3.min(v.values, function(v) { return v.downloads; }); }),
                d3.max(versions, function(v) { return d3.max(v.values, function(v) { return v.downloads; }); })
              ])
              .range([height, 0]);

          var xAxis = d3.svg.axis()
              .scale(x)
              .orient('bottom');

          var yAxis = d3.svg.axis()
              .scale(y)
              .orient('left');

          var line = d3.svg.line()
              .interpolate('basis')
              .x(function(d) { return x(d.date); })
              .y(function(d) { return y(d.downloads); });


          chart.append("g")
              .attr("class", "x axis")
              .attr("transform", "translate(0," + height + ")")
              .call(xAxis);

          chart.append("g")
              .attr("class", "y axis")
              .call(yAxis)
            .append("text")
              .attr("transform", "rotate(-90)")
              .attr("y", 6)
              .attr("dy", ".71em")
              .style("text-anchor", "end")
              .text("Downloads");

          var version = chart.selectAll(".version")
              .data(versions)
            .enter().append("g")
              .attr("class", "version");

          version.append("path")
              .attr("class", "line")
              .attr("d", function(d) { return line(d.values); })
              .style("stroke", function(d) { return color(d.name); });

          version.append("text")
              .datum(function(d) { return {name: d.name, value: d.values[d.values.length - 1]}; })
              .attr("transform", function(d) { return "translate(" + x(d.value.date) + "," + y(d.value.downloads) + ")"; })
              .attr("x", 3)
              .attr("dy", ".35em")
              .text(function(d) { return d.name; });
        });
      }
    };
  });
