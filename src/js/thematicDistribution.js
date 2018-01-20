function thematicDistributionChart(svg, width, height, xlabel, ylabel, transitionDuration, onClick, xToColor) {
    var chart = {};

    var margin = {top: 5, right: 80, bottom: 40, left: 60},
        innerwidth = width - margin.left - margin.right,
        innerheight = height - margin.top - margin.bottom;

    var xScale = d3.scaleBand()
        .rangeRound([0, innerwidth])
        .padding(0.1);
    var yScale = d3.scaleLinear()
        .rangeRound([innerheight, 0]);

    var x = d3.axisBottom(xScale),
        y = d3.axisLeft(yScale).tickFormat(d3.format("d"));

    var wrapper = svg.attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("class", "wrapper")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")") ;
        
    wrapper.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + innerheight + ")")
        .call(x);

    svg.append("text")
        .attr("class", "axis-label")
        .attr("text-anchor", "middle")
        .attr("transform", "translate(" + (width/2) + "," + height + ")")
        .attr("fill", "#000")
        .text(xlabel);

    wrapper.append("g")
        .attr("class", "y axis")
        .call(y);
    
    svg.append("text")
        .attr("class", "y axis-label")
        .attr("text-anchor", "middle")
        .attr("transform", "translate(" + (margin.left/2) + "," + (height/2) + ") rotate(-90)")
        .attr("fill", "#000")
        .text(ylabel);

    wrapper.append("g")
        .attr("class", "content");

    chart.render = function(data) {
        xScale.domain(data.map(function(d) { return d.x; }));
        yScale.domain([0, d3.max(data, function(d) { return d.y; })]);
        y.ticks(yScale.domain()[1]);

        svg.select(".x.axis")
            .transition()
            .duration(transitionDuration)
            .call(x);
        svg.select(".y.axis")
            .transition()
            .duration(transitionDuration)
            .call(y);

        var bars = svg.select(".content").selectAll(".bar")
            .data(data);

        // Bars enter
        bars.enter()
            .append("rect")
            .attr("class", "bar")
            .attr("x", function(d) { return xScale(d.x); })
            .attr("y", function(d) { return yScale(d.y); })
            .attr("width", xScale.bandwidth())
            .attr("height", function(d) { return innerheight - yScale(d.y); })
            .attr("fill", function(d) { return xToColor(d.x); })
            .on("click", onClick);

        // Bars exit
        bars.exit().remove();

        // Bars update
        bars.transition()
            .duration(transitionDuration)
            .attr("x", function(d) { return xScale(d.x); })
            .attr("y", function(d) { return yScale(d.y); })
            .attr("width", xScale.bandwidth())
            .attr("height", function(d) { return innerheight - yScale(d.y); })
            .attr("fill", function(d) { return xToColor(d.x); });
    }
    
    return chart;
}
