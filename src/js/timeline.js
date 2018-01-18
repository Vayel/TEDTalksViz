function timelineChart(handleClick, currentDate) {
    var width = 640,
        height = 480;

    function chart(selection) {
        selection.each(function(dates) {
            var margin = {top: 0, right: 80, bottom: 30, left: 20},
                innerwidth = width - margin.left - margin.right,
                innerheight = height - margin.top - margin.bottom ;

            var x1 = d3.axisBottom(d3.scaleBand()
                .range([0, innerwidth])
                .domain(dates.slice(0, dates.length/2-1))
            ).tickSizeOuter(0);
            var x2 = d3.axisTop(d3.scaleBand()
                .range([0, innerwidth])
                .domain(dates.slice(dates.length/2+1).reverse())
            ).tickSizeOuter(0);
            var y = d3.axisRight(d3.scaleBand()
                .range([innerheight, 0])
                .domain(dates.slice(dates.length/2-1, dates.length/2+1).reverse())
            ).tickSizeOuter(0);

            var svg = d3.select(this);

            if(svg.select("g").empty()) {
                svg = svg.attr("width", width)
                    .attr("height", height)
                    .append("g")
                    .attr("class", "wrapper")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")") ;

                svg.append("g")
                    .attr("class", "x axis")
                    .attr("transform", "translate(0, 0)")
                    .call(x1);

                svg.append("g")
                    .attr("class", "x axis")
                    .attr("transform", "translate(0," + innerheight + ")")
                    .call(x2);
                svg.append("g")
                    .attr("class", "x axis")
                    .attr("transform", "translate(" + innerwidth + ", 0)")
                    .call(y);

                svg.selectAll(".axis .tick").on("click", handleClick);
            }

            var ticks = svg.selectAll(".tick text");
            ticks.attr("class", function(d, i) {
                return d == currentDate ? "selected" : "";
            });
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

    return chart;
}
