// http://bl.ocks.org/crayzeewulf/9719255

function themeQuantityChart(removeTheme, getThemeIndex) {
    var width = 640,
        height = 480,
        xlabel = "X Axis Label",
        ylabel = "Y Axis Label" ;

    function chart(selection) {
        selection.each(function(datasets) {
            //
            // Create the plot.
            //
            var margin = {top: 20, right: 80, bottom: 30, left: 50},
                innerwidth = width - margin.left - margin.right,
                innerheight = height - margin.top - margin.bottom ;

            var xScale = d3.scaleTime()
                .range([0, innerwidth])
                .domain([ d3.min(Object.values(datasets), function(list) { return d3.min(list, function(d) { return parseTime(d.date); }); }),
                          d3.max(Object.values(datasets), function(list) { return d3.max(list, function(d) { return parseTime(d.date); }); }) ]) ;
            var yScale = d3.scaleLinear()
                .range([innerheight, 0])
                .domain([ 0, d3.max(Object.values(datasets), function(list) { return d3.max(list, function(d) { return d.talks; }); }) ]) ;
            var x = d3.axisBottom(xScale),
                y = d3.axisLeft(yScale);

            var draw_line = d3.line()
                .x(function(d) { return xScale(parseTime(d.date)); })
                .y(function(d) { return yScale(d.talks); }) ;

            var svg = d3.select(this),
                lines = null;

            if(!svg.select("g").empty()) {
                svg.select(".x.axis").call(x);
                svg.select(".y.axis").call(y);
                lines = svg.select(".content").selectAll(".line, .text")
                    .remove()
					.exit()
					.data(Object.values(datasets))
                    .enter();
            } else {
                svg = svg.attr("width", width)
                    .attr("height", height)
                    .append("g")
                    .attr("class", "wrapper")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")") ;

                svg.append("g")
                    .attr("class", "x axis")
                    .attr("transform", "translate(0," + innerheight + ")")
                    .call(x)
                    .append("text")
                    .attr("dy", "-.71em")
                    .attr("x", innerwidth)
                    .style("text-anchor", "end")
                    .text(xlabel) ;

                svg.append("g")
                    .attr("class", "y axis")
                    .call(y)
                    .append("text")
                    .attr("transform", "rotate(-90)")
                    .attr("y", 6)
                    .attr("dy", "0.71em")
                    .style("text-anchor", "end")
                    .text(ylabel) ;

                lines = svg.selectAll(".wrapper").data(Object.values(datasets))
                    .enter()
                    .append("g")
                    .attr("class", "content");
            }

            lines.append("path")
                .attr("class", "line")
                .attr("fill", "none")
                .attr("d", function(d) { return draw_line(d); })
                .attr("stroke", function(d, i) { return colorScale(getThemeIndex(Object.keys(datasets)[i])); }) ;
            
            lines.append("text")
                .datum(function(d, i) { return {theme: Object.keys(datasets)[i]}; })
                .attr("transform", function(d, i) { return ( "translate(" + margin.left + "," + (i * 20) + ")" ); })
                .attr("class", "text")
                .attr("x", 3)
                .attr("dy", ".35em")
                .attr("fill", function(d, i) { return colorScale(getThemeIndex(d.theme)); })
                .text(function(d) { return d.theme; })
                .on("click", removeTheme);
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
