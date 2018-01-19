function favoriteThemesChart(themeToColor) {
    var width = 640,
        height = 480,
        xlabel = "X Axis Label",
        ylabel = "Y Axis Label";

    function chart(selection) {
        selection.each(function(dataset) {
            /*
             * dataset is the form of:
             * [{
             *     date: string,
             *     talks: [{views: int, comments: int, duration: int, theme: string}, ...]
             * }, ...]
             */

            var margin = {top: 20, right: 80, bottom: 30, left: 50},
                innerwidth = width - margin.left - margin.right,
                innerheight = height - margin.top - margin.bottom ;

            // TODO: xmin, xmax, ymin, ymax over all years so that axes do not change
            var xMin = d3.min(dataset, function(d) { return d.views; }),
                xMax = d3.max(dataset, function(d) { return d.views; }),
                xScale = d3.scaleLinear()
                    .range([0, innerwidth])
                    .domain([xMin, xMax]),
                xTicks = 10; // TODO

            var yMin = d3.min(dataset, function(d) { return d.comments; }),
                yMax = d3.max(dataset, function(d) { return d.comments; }),
                yScale = d3.scaleLinear()
                    .range([innerheight, 0])
                    .domain([yMin, yMax]),
                yTicks = 10; // TODO
            
            var x = d3.axisBottom(xScale).tickFormat(d3.format("d")).ticks(xTicks),
                y = d3.axisLeft(yScale).tickFormat(d3.format("d")).ticks(yTicks);

            function make_x_gridlines() {
                return d3.axisBottom(xScale).ticks(xTicks).tickSize(-innerheight).tickFormat("");
            }

            function make_y_gridlines() {
                return d3.axisLeft(yScale).ticks(yTicks).tickSize(-innerwidth).tickFormat("");
            }

            var svg = d3.select(this);

            if(!svg.select(".wrapper").empty()) {
                svg.selectAll(".talk").remove();
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
                    .style("text-anchor", "end")
                    .text(xlabel) ;

                wrapper.append("g")
                    .attr("class", "y axis")
                    .call(y)
                    .append("text")
                    .attr("transform", "rotate(-90)")
                    .attr("y", 6)
                    .attr("dy", "0.71em")
                    .style("text-anchor", "end")
                    .text(ylabel) ;

                wrapper.append("g")
                    .attr("class", "content")
                    .append("g");
                // TODO: legend
            }
            
            svg.select(".content").selectAll("circle")
                .data(dataset)
                .enter()
                .append("circle")
                .attr("class", "talk")
                .attr("r", 3) // TODO: related to duration
                .attr("cx", function(d, i) { return xScale(d.views); })
                .attr("cy", function(d) { return yScale(d.comments); })
                .attr("fill", function(d) { return themeToColor(d.theme); });
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
