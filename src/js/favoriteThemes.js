function favoriteThemesChart(svg, width, height, xlabel, ylabel, transitionDuration, onClick, labelToColor) {
    var chart = {};

    var minRadius = 4,
        maxRadius = 15,
        unselectedOpacity = 0.2,
        selectedLabels = new Set();

    var margin = {top: 15, right: 15, bottom: 40, left: 90},
        innerwidth = width - margin.left - margin.right,
        innerheight = height - margin.top - margin.bottom;

    var xScale = d3.scaleLinear()
        .range([0, innerwidth]);
    var yScale = d3.scaleLinear()
        .range([innerheight, 0])

    var x = d3.axisBottom(xScale).ticks(d3.timeYear.every(2)),
        y = d3.axisLeft(yScale).tickFormat(d3.format("d"));

    function make_x_gridlines(nTicks) {
        return d3.axisBottom(xScale).ticks(nTicks).tickSize(-innerheight).tickFormat("");
    }

    function make_y_gridlines(nTicks) {
        return d3.axisLeft(yScale).ticks(nTicks).tickSize(-innerwidth).tickFormat("");
    }

    function getFillOpacity(d) {
        if(!selectedLabels.size || selectedLabels.has(d.label)) {
            return 1;
        }
        return unselectedOpacity;
    }
    
    function getStrokeWidth(d) {
        return selectedLabels.has(d.label) ? 2 : 0;
    }

    var tooltip = d3.select("#favoriteThemes .tooltip");
    
    var wrapper = svg.attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("class", "wrapper")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")") ;

    wrapper.append("g")			
        .attr("class", "x grid")
        .attr("transform", "translate(0," + innerheight + ")")
        .call(make_x_gridlines(0))

    wrapper.append("g")			
        .attr("class", "y grid")
        .call(make_y_gridlines(0))

    wrapper.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + innerheight + ")")
        .call(x)

    svg.append("text")
        .attr("class", "axis-label")
        .attr("text-anchor", "middle")
        .attr("transform", "translate(" + (width/2) + "," + height + ")")
        .attr("fill", "#000")
        .text(xlabel)

    wrapper.append("g")
        .attr("class", "y axis")
        .call(y)
    
    svg.append("text")
        .attr("class", "y axis-label")
        .attr("text-anchor", "middle")
        .attr("transform", "translate(" + (margin.left/2) + "," + (height/2) + ") rotate(-90)")
        .attr("fill", "#000")
        .text(ylabel)

    wrapper.append("g")
        .attr("class", "content")
        .append("g")

    chart.render = function(data) {
        function getRadius(d) {
            var val = d.radius
            return minRadius + (maxRadius - minRadius) * (val - data.radius.min) / (data.radius.max - data.radius.min);
        }

        var xTicks = yTicks = 10; // TODO

        xScale.domain([data.x.min, data.x.max]);
        x.ticks(xTicks);

        yScale.domain([data.y.min, data.y.max]),
        y.ticks(yTicks);

        svg.select(".x.axis")
            .transition()
            .duration(transitionDuration)
            .call(x);
        svg.select(".y.axis")
            .transition()
            .duration(transitionDuration)
            .call(y);
        
        svg.select(".x.grid")
            .transition()
            .duration(transitionDuration)
            .call(make_x_gridlines(xTicks));
        svg.select(".y.grid")
            .transition()
            .duration(transitionDuration)
            .call(make_y_gridlines(yTicks));

        var points = svg.select(".content").selectAll("circle")
            .data(data.values);

        // Element enter
        points.enter()
            .append("circle")
            .attr("class", "element")
            .attr("fill", function(d) { return labelToColor(d.label); })
            .attr("stroke", "#000")
            .attr("fill-opacity", getFillOpacity)
            .attr("stroke-width", getStrokeWidth)
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
                    .style("top", (d3.event.pageY + 2*getRadius(d)) + "px");
            })
            .on("mouseout", function(d) {
                tooltip.transition()
                    .duration(200)
                    .style("opacity", 0);
            })
            .on("click", onClick)
            .transition()
            .duration(transitionDuration)
            .attr("r", getRadius)
            .attr("cx", function(d, i) { return xScale(d.x); })
            .attr("cy", function(d) { return yScale(d.y); })

        // Element exit
        points.exit().remove();
        
        // Element update
        points.transition()
            .duration(transitionDuration)
            .attr("r", getRadius)
            .attr("cx", function(d, i) { return xScale(d.x); })
            .attr("cy", function(d) { return yScale(d.y); })
            .attr("fill-opacity", getFillOpacity)
            .attr("stroke-width", getStrokeWidth)
    }

    chart.select = function(labels) {
        selectedLabels = labels;
        svg.select(".content").selectAll("circle")
            .transition()
            .duration(transitionDuration)
            .attr("fill-opacity", getFillOpacity)
            .attr("stroke-width", getStrokeWidth)
    }

    return chart;
}
