// http://bl.ocks.org/crayzeewulf/9719255

function themeQuantityChart(removeTheme, themeToColor, withLines, cumulative) {
    var width = 640,
        height = 480,
        xlabel = "X Axis Label",
        ylabel = "Y Axis Label",
        legendMarginLeft = 30,
        legendMarginTop = 20,
        legendPadding = 5,
        radiusSelected = 6,
        defaultRadius = 3,
        maxYTicks = 8;

    var xScale, yScale, datasets;

    function chart(selection) {
        selection.each(function(datasets_) {
            /*
             * datasets_ is the form of:
             * [{
             *     theme: string,
             *     values: [{date: string, talks: int}, ...]
             * }, ...]
             */
            datasets = datasets_.map(function(d) {
                d.values = d.values.map(function(dd) {
                    dd.theme = d.theme; // Add theme to access it in children (in circles)
                    return dd;
                });
                return d;
            });

            var margin = {top: 20, right: 80, bottom: 30, left: 50},
                innerwidth = width - margin.left - margin.right,
                innerheight = height - margin.top - margin.bottom ;

            var xMin = d3.min(getDatasets(), function(d) { return d3.min(d.values, function(d) { return parseTime(d.date); }); }),
                xMax = d3.max(getDatasets(), function(d) { return d3.max(d.values, function(d) { return parseTime(d.date); }); });
            xScale = d3.scaleTime()
                .range([0, innerwidth])
                .domain([xMin, xMax]) ;
            var yMax = d3.max(getDatasets(), function(d) { return d3.max(d.values, function(d) { return d.talks; }); });
            yScale = d3.scaleLinear()
                .range([innerheight, 0])
                .domain([0, yMax]) ;
            var yTicks = Math.min(maxYTicks, yMax);
            
            var x = d3.axisBottom(xScale).ticks(d3.timeYear.every(2)),
                y = d3.axisLeft(yScale).tickFormat(d3.format("d")).ticks(yTicks);

            function make_x_gridlines() {
                return d3.axisBottom(xScale).ticks(d3.timeYear.every(1)).tickSize(-innerheight).tickFormat("");
            }

            function make_y_gridlines() {
                return d3.axisLeft(yScale).ticks(yTicks).tickSize(-innerwidth).tickFormat("");
            }

            var svg = d3.select(this);

            if(!svg.select(".wrapper").empty()) {
                svg.select(".x.axis").call(x);
                svg.select(".y.axis").call(y);
                svg.select(".x.grid").call(make_x_gridlines());
                svg.select(".y.grid").call(make_y_gridlines());
                svg.selectAll(".theme").remove();
                svg.selectAll(".legend-label, .legend-remove, .legend-box").remove();
            } else {
                var wrapper = svg.attr("width", width)
                    .attr("height", height)
                    .append("g")
                    .attr("class", "wrapper")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")") ;

                wrapper.append("g")			
                    .attr("class", "x grid")
                    .attr("transform", "translate(0," + innerheight + ")")
                    .call(make_x_gridlines())

                wrapper.append("g")			
                    .attr("class", "y grid")
                    .call(make_y_gridlines())

                wrapper.append("g")
                    .attr("class", "x axis")
                    .attr("transform", "translate(0," + innerheight + ")")
                    .call(x)
                    .append("text")
                    .attr("dy", "-.71em")
                    .attr("x", innerwidth)
                    .attr("fill", "#000")
                    .style("text-anchor", "end")
                    .text(xlabel) ;

                wrapper.append("g")
                    .attr("class", "y axis")
                    .call(y)
                    .append("text")
                    .attr("transform", "rotate(-90)")
                    .attr("y", 6)
                    .attr("dy", "0.71em")
                    .attr("fill", "#000")
                    .style("text-anchor", "end")
                    .text(ylabel) ;

                wrapper.append("g")
                    .attr("class", "content")
                    .append("g")
                    .attr("class", "legend")
                    .attr("transform", function(d, i) { return ( "translate(" + legendMarginLeft + "," + legendMarginTop + ")" ); });
            }
            
            var theme = svg.select(".content").selectAll(".theme")
                .data(getDatasets())
                .enter()
                .append("g")
                .attr("class", "theme");
            theme.selectAll("circle")
                .data(function(d) { return d.values; })
                .enter()
                .append("circle")
                .attr("class", "dot")
                .attr("r", 3)
                .attr("cx", function(d, i) { return xScale(parseTime(d.date)); })
                .attr("cy", function(d) { return yScale(d.talks); })
                .attr("fill", function(d) { return themeToColor(d.theme); });
            if(withLines) {
                var line = d3.line()
                    .x(function(d, i) { return xScale(parseTime(d.date)); })
                    .y(function(d) { return yScale(d.talks); });

                theme.append("path")
                    .attr("class", "line")
                    .attr("d", function(d) { return line(d.values); })
                    .attr("fill", "none")
                    .attr("stroke-width", 2)
                    .attr("stroke", function(d) { return themeToColor(d.theme); });
            }
            
            var legend = svg.select(".legend");
            var legendBox = legend.append("rect")
                .attr("class", "legend-box")
                .attr("fill", "#fff")
                .attr("stroke", "#000")
                .attr("stroke-width", 2);
            if(datasets.length > 1) {
                legend.selectAll(".legend-remove")
                    .data(getDatasets())
                    .enter()
                    .append("text")
                    .attr("transform", function(d, i) { return ( "translate(0," + (i * 25) + ")" ); })
                    .attr("class", "legend-remove")
                    .attr("x", 3)
                    .attr("dy", ".35em")
                    .attr("fill", function(d, i) { return themeToColor(d.theme); })
                    .text(function(d) { return '\uf00d'; })
                    .on("click", removeTheme);
            }
            legend.selectAll(".legend-label")
                .data(getDatasets())
                .enter()
                .append("text")
                .attr("transform", function(d, i) { return ( "translate(15," + (i * 25) + ")" ); })
                .attr("class", "legend-label")
                .attr("x", 3)
                .attr("dy", ".35em")
                .attr("fill", function(d, i) { return themeToColor(d.theme); })
                .text(function(d) { return d.theme; });
            var legendBBox = legend.node().getBBox();
            legendBox.attr("x",(legendBBox.x - legendPadding))
                .attr("y",(legendBBox.y - legendPadding))
                .attr("height",(legendBBox.height + 2*legendPadding))
                .attr("width",(legendBBox.width + 2*legendPadding))
        });
    }

    function getDatasets() {
        if(!cumulative) {
            return datasets;
        }
        
        return datasets.map(function(d) {
            var counter = 0, talks;
            return {
                theme: d.theme,
                values: d.values.map(function(dd) {
                    if(cumulative) {
                        counter += dd.talks;
                        talks = counter;
                    } else {
                        talks = dd.talks;
                    }
                    return {
                        theme: d.theme, // Add theme to access it in children (in circles)
                        talks: talks,
                        date: dd.date,
                    };
                })
            };
        });
    }

    chart.width = function(value) {
        if (!arguments.length) return width;
        width = value;
        return chart;
    };

    chart.height = function(value) {
        if (!arguments.length) return height;
        height = value;
        return chart;
    };

    chart.xlabel = function(value) {
        if(!arguments.length) return xlabel ;
        xlabel = value ;
        return chart ;
    } ;

    chart.ylabel = function(value) {
        if(!arguments.length) return ylabel ;
        ylabel = value ;
        return chart ;
    } ;

    chart.date = function(date) {
        var svg = d3.select("#themeQuantityOverTime");
        svg.select(".content").selectAll("circle")
            .attr("r", function(d) { return d.date == date ? radiusSelected : defaultRadius });
    };

    return chart;
}
