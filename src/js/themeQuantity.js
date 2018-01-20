function themeQuantityChart(svg, width, height, xlabel, ylabel, transitionDuration, onRemove, labelToColor) {
    var chart = {};
    var legendMarginLeft = 30,
        legendMarginTop = 20,
        legendPadding = 5,
        radiusSelected = 6,
        defaultRadius = 3,
        maxYTicks = 8;

    var margin = {top: 5, right: 80, bottom: 40, left: 70},
        innerwidth = width - margin.left - margin.right,
        innerheight = height - margin.top - margin.bottom;

    var xScale = d3.scaleTime()
        .range([0, innerwidth]);
    var yScale = d3.scaleLinear()
        .range([innerheight, 0])

    var x = d3.axisBottom(xScale).ticks(d3.timeYear.every(2)),
        y = d3.axisLeft(yScale).tickFormat(d3.format("d"));

    function make_x_gridlines() {
        return d3.axisBottom(xScale).ticks(d3.timeYear.every(1)).tickSize(-innerheight).tickFormat("");
    }

    function make_y_gridlines(nTicks) {
        return d3.axisLeft(yScale).ticks(nTicks).tickSize(-innerwidth).tickFormat("");
    }

    var line = d3.line()
        .x(function(d) { return xScale(parseTime(d.x)); });

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
        .call(make_y_gridlines(0))

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
        .attr("class", "content")
        .append("g")
        .attr("class", "legend")
        .attr("transform", function(d, i) { return ( "translate(" + legendMarginLeft + "," + legendMarginTop + ")" ); });

    chart.render = function(datasets, xSelected, withLines) {
        if(!datasets.length) return;

        var xMin = d3.min(datasets, function(d) { return d3.min(d.values, function(d) { return parseTime(d.x); }); }),
            xMax = d3.max(datasets, function(d) { return d3.max(d.values, function(d) { return parseTime(d.x); }); });
        xScale.domain([xMin, xMax]);

        var yMax = d3.max(datasets, function(d) { return d3.max(d.values, function(d) { return d.y; }); });
        yScale.domain([0, yMax]) ;
        var yTicks = Math.min(maxYTicks, yMax);
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
            .call(make_x_gridlines());
        svg.select(".y.grid")
            .transition()
            .duration(transitionDuration)
            .call(make_y_gridlines(yTicks));

        svg.selectAll(".theme").remove();
        svg.selectAll(".legend-label, .legend-remove, .legend-box").remove();
        
        var themes = svg.select(".content").selectAll(".theme")
            .data(datasets);
        themes.exit().remove();

        var theme = themes.enter()
            .append("g")
            .attr("class", "theme");

        var circles = theme.selectAll("circle")
            .data(function(d) { return d.values; });
        circles.enter()
            .append("circle")
            .attr("class", "dot")
            .attr("r", function(d) { return d.x == xSelected ? radiusSelected : defaultRadius })
            .attr("cx", function(d, i) { return xScale(parseTime(d.x)); })
            .attr("cy", function(d) { return yScale(d.y); })
            .attr("fill", function(d) { return labelToColor(d.label); });

        if(withLines) {
            line.y(function(d) { return yScale(d.y); });

            theme.append("path")
                .attr("class", "line")
                .attr("d", function(d) { return line(d.values); })
                .attr("fill", "none")
                .attr("stroke-width", 2)
                .attr("stroke", function(d) { return labelToColor(d.label); });
        }
        
        var legend = svg.select(".legend");
        var legendBox = legend.append("rect")
            .attr("class", "legend-box")
            .attr("fill", "#fff")
            .attr("stroke", "#000")
            .attr("stroke-width", 2);
        if(datasets.length > 1) {
            legend.selectAll(".legend-remove")
                .data(datasets)
                .enter()
                .append("text")
                .attr("transform", function(d, i) { return ( "translate(0," + (i * 25) + ")" ); })
                .attr("class", "legend-remove")
                .attr("x", 3)
                .attr("dy", ".35em")
                .attr("fill", function(d) { return labelToColor(d.label); })
                .text(function(d) { return '\uf00d'; })
                .on("click", onRemove);
        }
        legend.selectAll(".legend-label")
            .data(datasets)
            .enter()
            .append("text")
            .attr("transform", function(d, i) { return ( "translate(15," + (i * 25) + ")" ); })
            .attr("class", "legend-label")
            .attr("x", 3)
            .attr("dy", ".35em")
            .attr("fill", function(d, i) { return labelToColor(d.label); })
            .text(function(d) { return d.label; });
        var legendBBox = legend.node().getBBox();
        legendBox.attr("x", legendBBox.x - legendPadding)
            .attr("y", legendBBox.y - legendPadding)
            .attr("height", legendBBox.height + 2*legendPadding)
            .attr("width", legendBBox.width + 2*legendPadding)
    }

    return chart;
}
