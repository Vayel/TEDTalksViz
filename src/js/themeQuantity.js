// http://bl.ocks.org/crayzeewulf/9719255

function themeQuantityChart() {
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

            var x = d3.scaleTime()
                .range([0, innerwidth])
                .domain([ d3.min(Object.values(datasets), function(list) { return d3.min(list, function(d) { return parseTime(d.date); }); }),
                          d3.max(Object.values(datasets), function(list) { return d3.max(list, function(d) { return parseTime(d.date); }); }) ]) ;

            var y = d3.scaleLinear()
                .range([innerheight, 0])
                .domain([ 0, d3.max(Object.values(datasets), function(list) { return d3.max(list, function(d) { return d.talks; }); }) ]) ;

            var color = d3.scaleOrdinal(d3.schemeCategory10)
                .domain(d3.range(Object.values(datasets).length));

            var draw_line = d3.line()
                .x(function(d) { return x(parseTime(d.date)); })
                .y(function(d) { return y(d.talks); }) ;

            var svg = d3.select(this)
                .attr("width", width)
                .attr("height", height)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")") ;

            svg.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + innerheight + ")")
                .call(d3.axisBottom(x))
                .append("text")
                .attr("dy", "-.71em")
                .attr("x", innerwidth)
                .style("text-anchor", "end")
                .text(xlabel) ;

            svg.append("g")
                .attr("class", "y axis")
                .call(d3.axisLeft(y))
                .append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", 6)
                .attr("dy", "0.71em")
                .style("text-anchor", "end")
                .text(ylabel) ;

            var data_lines = svg.selectAll(".d3_xy_chart_line")
                .data(Object.values(datasets))
                .enter().append("g")
                .attr("class", "d3_xy_chart_line") ;

            data_lines.append("path")
                .attr("class", "line")
                .attr("fill", "none")
                .attr("d", function(d) {return draw_line(d); })
                .attr("stroke", function(_, i) {return color(i);}) ;

            data_lines.append("text")
                .datum(function(d, i) { return {name: Object.keys(datasets)[i], final: d[d.length-1]}; })
                .attr("transform", function(d) {
                    return ( "translate(" + x(parseTime(d.final.date)) + "," +
                             y(d.final.talks) + ")" ) ; })
                .attr("x", 3)
                .attr("dy", ".35em")
                .attr("fill", function(_, i) { return color(i); })
                .text(function(d) { return d.name; }) ;

        }) ;
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
