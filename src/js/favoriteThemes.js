function favoriteThemesChart(themeToColor, handleClick, selectedThemes) {
    var width = 640,
        height = 480,
        xlabel = "X Axis Label",
        ylabel = "Y Axis Label",
        minRadius = 4,
        maxRadius = 15,
        unselectedOpacity = 0.2;

    function chart(selection) {
        selection.each(function(data) {
            /*
             * data is the form of:
             * {
             *   radius: {min: int, max: int},
             *   x: {min: int, max: int},
             *   y: {min: int, max: int},
             *   values: [{x: int, y: int, radius: int, theme: string}, ...]
             * }
             */

            function getRadius(val) {
                return minRadius + (maxRadius - minRadius) * (val - data.radius.min) / (data.radius.max - data.radius.min);
            }

            var margin = {top: 20, right: 80, bottom: 30, left: 50},
                innerwidth = width - margin.left - margin.right,
                innerheight = height - margin.top - margin.bottom ;

            var xScale = d3.scaleLinear()
                    .range([0, innerwidth])
                    /*
                    .domain([
                        d3.min(data.values, function(d) { return d.x; }),
                        d3.max(data.values, function(d) { return d.x; })
                    ]);
                    */
                    .domain([data.x.min, data.x.max]),
                xTicks = 10; // TODO

            var yScale = d3.scaleLinear()
                    .range([innerheight, 0])
                    /*
                    .domain([
                        d3.min(data.values, function(d) { return d.y; }),
                        d3.max(data.values, function(d) { return d.y; })
                    ]);
                    */
                    .domain([data.y.min, data.y.max]),
                yTicks = 10; // TODO
            
            var x = d3.axisBottom(xScale).tickFormat(d3.format("d")).ticks(xTicks),
                y = d3.axisLeft(yScale).tickFormat(d3.format("d")).ticks(yTicks);

            function make_x_gridlines() {
                return d3.axisBottom(xScale).ticks(xTicks).tickSize(-innerheight).tickFormat("");
            }

            function make_y_gridlines() {
                return d3.axisLeft(yScale).ticks(yTicks).tickSize(-innerwidth).tickFormat("");
            }

            var svg = d3.select(this),
                tooltip = d3.select("#favoriteThemes .tooltip");

            if(!svg.select(".wrapper").empty()) {
                svg.select(".x.axis").call(x);
                svg.select(".y.axis").call(y);
                svg.select(".x.grid").call(make_x_gridlines());
                svg.select(".y.grid").call(make_y_gridlines());
                svg.selectAll(".element").remove();
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
                    .text(xlabel);

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
                    .append("g");
                // TODO: legend
            }
            
            svg.select(".content").selectAll("circle")
                .data(data.values)
                .enter()
                .append("circle")
                .attr("class", "element")
                .attr("r", function(d) { return getRadius(d.radius); })
                .attr("cx", function(d, i) { return xScale(d.x); })
                .attr("cy", function(d) { return yScale(d.y); })
                .attr("fill", function(d) { return themeToColor(d.theme); })
                .attr("fill-opacity", function(d) {
                    if(!selectedThemes.size || selectedThemes.has(d.theme)) {
                        return 1;
                    }
                    return unselectedOpacity;
                })
                .attr("stroke", "#000")
                .attr("stroke-width", function(d) {
                    return selectedThemes.has(d.theme) ? 2 : 0;
                })
                .on("mouseover", function(d) {
                    tooltip.transition()
                        .duration(200)
                        .style("opacity", 1);
                    tooltip.html(
                        '<span class="title">Theme:</span> ' + d.theme +
                        '<br/><span class="title">Languages:</span> ' + d.radius +
                        '<br/><span class="title">Views:</span> ' + d.x + 
                        '<br/><span class="title">Comments:</span> ' + d.y
                    )
                        .style("left", (d3.event.pageX) + "px")
                        .style("top", (d3.event.pageY + 2*getRadius(d.radius)) + "px");
                })
                .on("mouseout", function(d) {
                    tooltip.transition()
                        .duration(200)
                        .style("opacity", 0);
                })
                .on("click", handleClick);
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

    return chart;
}
