var parseTime = d3.timeParse("%Y-%m");

$(document).ready(function() {
    var model = Model("https://raw.githubusercontent.com/Vayel/TEDTalksViz/master/data/");

    var themeQuantityOverTime = null,
        thematicDistributionOverTime = null;

    model.loadData("theme_quantity_over_time", function(data) {
        $("#loader").hide();
        themeQuantityOverTime = data;
    });

    model.loadData("thematic_distribution", function(data) {
        $("#loader").hide();
        thematicDistributionOverTime = data;
        plotThematicDistributionOverTime(data[0]);
    });

    function plotThematicDistributionOverTime(data) {
        var chart = thematicDistributionChart()
            .width(960)
            .height(500)
            .xlabel("Themes")
            .ylabel("Number of talks (" + data.date + ")");
        var svg = d3.select("#thematic_distribution")
            .datum(data.distribution)
            .call(chart); 
    }

    function plotThemeQuantityOverTime(datasets) {
        var chart = themeQuantityChart()
            .width(960)
            .height(500)
            .xlabel("Time")
            .ylabel("Number of talks");
        var svg = d3.select("#theme_quantity_over_time")
            .datum(datasets)
            .call(chart); 
    }
});
