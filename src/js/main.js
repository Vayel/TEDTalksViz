var parseTime = d3.timeParse("%Y-%m");

$(document).ready(function() {
    var model = Model("https://raw.githubusercontent.com/Vayel/TEDTalksViz/master/data/");

    var themeQuantityData = null,
        thematicDistributionData = null;
    var thematicDistributionIndex = 0,
        thematicDistributionAnimation = false,
        THEMATIC_DISTRIBUTION_ANIMATION_DURATION = 3000;
    var themeQuantityDatasets = {};

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
    function handleThematicDistributionClick(d, i) {
        themeQuantityDatasets[d.theme] = themeQuantityData[d.theme];
        plotThemeQuantityOverTime();
        $("#themeQuantityOverTime").show();
    }

    function increaseThematicDistributionYear() {
        thematicDistributionIndex = Math.min(thematicDistributionData.length - 1, thematicDistributionIndex + 1);
        plotThematicDistribution();
    }

    function plotThematicDistribution() {
        var data = thematicDistributionData[thematicDistributionIndex];
        $("#thematicDistribution .date").html(data.date);
        var chart = thematicDistributionChart(handleThematicDistributionClick)
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

    /*
     * Theme quantity over time
     */
    function removeTheme(d) {
        delete themeQuantityDatasets[d.theme];
        if($.isEmptyObject(themeQuantityDatasets)) {
            $("#themeQuantityOverTime").hide();
        } else {
            plotThemeQuantityOverTime();
        }
    }

    function plotThemeQuantityOverTime() {
        var chart = themeQuantityChart(removeTheme)
            .width(960)
            .height(500)
            .xlabel("Time")
            .ylabel("Number of talks");
        var svg = d3.select("#themeQuantityOverTime svg")
            .datum(themeQuantityDatasets)
            .call(chart); 
    }
});
