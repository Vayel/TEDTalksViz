function thematicDistributionChart(handleClick) {
    var width = 640,
        height = 480,
        xlabel = "X Axis Label",
        ylabel = "Y Axis Label",
        transitionDuration = 500;

    function chart(selection) {
        selection.each(function(data) {
            var margin = {top: 20, right: 80, bottom: 30, left: 50},
                innerwidth = width - margin.left - margin.right,
                innerheight = height - margin.top - margin.bottom ;

            var xScale = d3.scaleBand()
                .rangeRound([0, innerwidth])
                .padding(0.1)
                .domain(data.map(function(d) { return d.theme; }));
            var yScale = d3.scaleLinear()
                .rangeRound([innerheight, 0])
                .domain([0, d3.max(data, function(d) { return d.talks; })]);
            var x = d3.axisBottom(xScale),
                y = d3.axisLeft(yScale);
            var svg = d3.select(this);
                bars = null;

            if(!svg.select("g").empty()) {
                svg.select(".x.axis").call(x);
                svg.select(".y.axis").call(y);
                bars = svg.select(".content").selectAll(".bar")
                    .remove()
					.exit()
					.data(data);
            } else {
                svg = svg.attr("width", width)
                    .attr("height", height)
                    .append("g")
                    .attr("class", "content")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")") ;

                svg.append("g")
                    .attr("class", "x axis")
                    .attr("transform", "translate(0," + innerheight + ")")
                    .call(x)
                    .append("text")
                    .attr("dy", "-.71em")
                    .attr("x", innerwidth)
                    .style("text-anchor", "end")
                    .text(xlabel);

                svg.append("g")
                    .attr("class", "y axis")
                    .call(y)
                    .append("text")
                    .attr("transform", "rotate(-90)")
                    .attr("y", 6)
                    .attr("dy", "0.71em")
                    .style("text-anchor", "end")
                    .text(ylabel);

                bars = svg.selectAll(".bar").data(data);
            }

            bars.enter().append("rect")
                .attr("class", "bar")
                .attr("x", function(d) { return xScale(d.theme); })
                .attr("y", function(d) { return yScale(d.talks); })
                .attr("width", xScale.bandwidth())
                .attr("height", function(d) { return innerheight - yScale(d.talks); })
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
