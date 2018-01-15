var parseTime = d3.timeParse("%Y-%m");

$(document).ready(function() {
    var model = Model("https://raw.githubusercontent.com/Vayel/TEDTalksViz/master/data/");

    var themeQuantityData = null,
        thematicDistributionData = null;
    var thematicDistributionIndex = 0,
        thematicDistributionAnimation = false,
        THEMATIC_DISTRIBUTION_ANIMATION_DURATION = 3000;

    model.loadData("theme_quantity_over_time", function(data) {
        $("#loader").hide();
        themeQuantityData = data;
    });

    model.loadData("thematic_distribution", function(data) {
        $("#loader").hide();
        thematicDistributionData = data;
        plotThematicDistribution();
    });

    /*
     * Thematic distribution
     */
    function increaseThematicDistributionYear() {
        thematicDistributionIndex = Math.min(thematicDistributionData.length - 1, thematicDistributionIndex + 1);
        plotThematicDistribution();
    }
    function plotThematicDistribution() {
        var data = thematicDistributionData[thematicDistributionIndex];
        $("#thematicDistribution .date").html(data.date);
        var chart = thematicDistributionChart()
            .width(960)
            .height(500)
            .xlabel("Themes")
            .ylabel("Number of talks (" + data.date + ")");
        var svg = d3.select("#thematicDistribution svg")
            .datum(data.distribution)
            .call(chart); 

        if(thematicDistributionAnimation) {
            setTimeout(increaseThematicDistributionYear, THEMATIC_DISTRIBUTION_ANIMATION_DURATION);
        }
    }
    $("#thematicDistribution .left").click(function() {
        thematicDistributionIndex = Math.max(0, thematicDistributionIndex - 1);
        plotThematicDistribution();
    });
    $("#thematicDistribution .right").click(increaseThematicDistributionYear);
    $("#thematicDistribution .animate").click(function() {
        thematicDistributionAnimation = !thematicDistributionAnimation;
        if(thematicDistributionAnimation) {
            plotThematicDistribution();
        }
    });

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
