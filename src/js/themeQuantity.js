// http://bl.ocks.org/crayzeewulf/9719255

function themeQuantityChart(removeTheme, getThemeIndex, colorScale) {
    var width = 640,
        height = 480,
        xlabel = "X Axis Label",
        ylabel = "Y Axis Label",
        legendMarginLeft = 10,
        legendMarginTop = 10,
        radiusSelected = 6,
        defaultRadius = 3;

    var xScale, yScale, datasets;

    function chart(selection) {
        selection.each(function(datasets_) {
            datasets = datasets_;
            /*
             * datasets is the form of:
             * [{
             *     theme: string,
             *     values: [{date: string, talks: int}, ...]
             * }, ...]
             */

            var margin = {top: 20, right: 80, bottom: 30, left: 50},
                innerwidth = width - margin.left - margin.right,
                innerheight = height - margin.top - margin.bottom ;

            var xMin = d3.min(datasets, function(d) { return d3.min(d.values, function(d) { return parseTime(d.date); }); }),
                xMax = d3.max(datasets, function(d) { return d3.max(d.values, function(d) { return parseTime(d.date); }); });
            xScale = d3.scaleTime()
                .range([0, innerwidth])
                .domain([xMin, xMax]) ;
            var yMax = d3.max(datasets, function(d) { return d3.max(d.values, function(d) { return d.talks; }); });
            yScale = d3.scaleLinear()
                .range([innerheight, 0])
                .domain([0, yMax]) ;
            var yTicks = (function() {
                if(yMax <= 5) return yMax;
                else if(yMax < 10) return Math.floor(yMax/2);
                else if(yMax < 30) return Math.floor(yMax/5);
                else return Math.floor(yMax/10);
            })();
            var x = d3.axisBottom(xScale).ticks(d3.timeYear.every(2)),
                y = d3.axisLeft(yScale).tickFormat(d3.format("d")).ticks(yTicks);

            function make_x_gridlines() {
                return d3.axisBottom(xScale).ticks(d3.timeYear.every(1)).tickSize(-innerheight).tickFormat("");
            }

            function make_y_gridlines() {
                return d3.axisLeft(yScale).ticks(yTicks).tickSize(-innerwidth).tickFormat("");
            }

            var svg = d3.select(this),
                content = null;

            if(!svg.select("g").empty()) {
                svg.select(".x.axis").call(x);
                svg.select(".y.axis").call(y);
                svg.select(".x.grid").call(make_x_gridlines());
                svg.select(".y.grid").call(make_y_gridlines());
                content = svg.select(".content").selectAll("circle, text")
                    .remove()
					.exit()
					.data(datasets)
                    .enter();
            } else {
                svg = svg.attr("width", width)
                    .attr("height", height)
                    .append("g")
                    .attr("class", "wrapper")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")") ;

                svg.append("g")			
                    .attr("class", "x grid")
                    .attr("transform", "translate(0," + innerheight + ")")
                    .call(make_x_gridlines())

                svg.append("g")			
                    .attr("class", "y grid")
                    .call(make_y_gridlines())

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

                content = svg.selectAll(".wrapper").data(datasets)
                    .enter()
                    .append("g")
                    .attr("class", "content");
            }

            content.selectAll("circle")
                .data(function(d, i) { return d.values.map(function(dd) {
                    dd.theme = d.theme; // Add theme to access it in children (in circles)
                    return dd;
                }); })
                .enter()
                .append("circle")
                .attr("class", "dot")
                .attr("r", 3)
                .attr("cx", function(d, i) { return xScale(parseTime(d.date)); })
                .attr("cy", function(d) { return yScale(d.talks); })
                .attr("fill", function(d) { return colorScale(getThemeIndex(d.theme)); });
            
            content.append("text")
                .attr("transform", function(d, i) { return ( "translate(" + legendMarginLeft + "," + (legendMarginTop + i * 20) + ")" ); })
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

    chart.date = function(date) {
        var svg = d3.select("#themeQuantityOverTime");

        if(svg.select("g").empty()) {
            throw "The cart must be created first.";
        }
        
        var content = svg.select(".content").selectAll("circle")
            .remove()
            .exit()
            .data(datasets)
            .enter();

        content.selectAll("circle")
            .data(function(d, i) { return d.values.map(function(dd) {
                dd.theme = d.theme; // Add theme to access it in children (in circles)
                return dd;
            }); })
            .enter()
            .append("circle")
            .attr("class", "dot")
            .attr("r", function(d) { return d.date == date ? radiusSelected : defaultRadius })
            .attr("cx", function(d, i) { return xScale(parseTime(d.date)); })
            .attr("cy", function(d) { return yScale(d.talks); })
            .attr("fill", function(d) { return colorScale(getThemeIndex(d.theme)); });
    };

    return chart;
}
