function timelineChart(svg, width, height, onClick) {
    var chart = {}

    var margin = {top: 0, right: 80, bottom: 30, left: 20},
        innerwidth = width - margin.left - margin.right,
        innerheight = height - margin.top - margin.bottom;

    var topScale = d3.scaleBand()
        .range([0, innerwidth])
    var bottomScale = d3.scaleBand()
        .range([0, innerwidth])
    var rightScale = d3.scaleBand()
        .range([innerheight, 0])

    var top = d3.axisBottom(topScale)
        .tickSizeOuter(0)
    var bottom = d3.axisTop(bottomScale)
        .tickSizeOuter(0)
    var right = d3.axisRight(rightScale)
        .tickSizeOuter(0)
    
    svg = svg.attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("class", "wrapper")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")") ;

    svg.append("g")
        .attr("class", "top axis")
        .attr("transform", "translate(0, 0)")
        .call(top);

    svg.append("g")
        .attr("class", "bottom axis")
        .attr("transform", "translate(0," + innerheight + ")")
        .call(bottom);

    svg.append("g")
        .attr("class", "right axis")
        .attr("transform", "translate(" + innerwidth + ", 0)")
        .call(right);


    chart.render = function(dates) {
        topScale.domain(dates.slice(0, dates.length/2-1))
        rightScale.domain(dates.slice(dates.length/2-1, dates.length/2+1).reverse())
        bottomScale.domain(dates.slice(dates.length/2+1).reverse())

        svg.selectAll(".top.axis").call(top)
        svg.selectAll(".right.axis").call(right)
        svg.selectAll(".bottom.axis").call(bottom)
        svg.selectAll(".axis .tick").on("click", onClick)
    }

    chart.date = function(date) {
        svg.selectAll(".tick text")
            .attr("class", function(d, i) {
                return d == date ? "selected" : "";
            })
            .attr("fill", function(d, i) {
                return d == date ? "#e62b1e" : "#000";
            });
    }

    return chart;
}
