$(document).ready(function() {
    var model = Model("https://raw.githubusercontent.com/Vayel/TEDTalksViz/master/data/");

    model.loadData("theme_quantity_over_time", function(data) {
        $("#loader").hide();
        plotThemeQuantityOverTime({
            internet: data.Internet,
            google: data.Google,
        });
    });

    function plotThemeQuantityOverTime(datasets) {
        var xy_chart = d3_xy_chart()
            .width(960)
            .height(500)
            .xlabel("Time")
            .ylabel("Number of talks");
        var svg = d3.select("#theme_quantity_over_time")
            .datum(datasets)
            .call(xy_chart); 
    }
});
