var parseTime = d3.timeParse("%Y-%m");
var colorScale = d3.scaleOrdinal(d3.schemeCategory20);
                
$(document).ready(function() {
    var model = Model("https://raw.githubusercontent.com/Vayel/TEDTalksViz/master/data/");

    var themes = null;
    var themeQuantityData = null,
        thematicDistributionData = null;
    var thematicDistributionIndex = 0,
        thematicDistributionAnimation = false,
        thematicDistributionTimeout = null;
    var themeQuantityDatasets = {};

    var THEMATIC_DISTRIBUTION_ANIMATION_DURATION = 2500,
        THEME_QUANTITY_MAX_THEMES = 5;

    model.loadData("themes", function(data) {
        themes = data;
        colorScale.domain(d3.range(themes.length));

        model.loadData("theme_quantity_over_time", function(data) {
            $("#loader").hide();
            themeQuantityData = data;
        });

        model.loadData("thematic_distribution", function(data) {
            $("#loader").hide();
            thematicDistributionData = data;
            plotThematicDistribution();
        });
    });

    function getThemeIndex(theme) {
        return themes.indexOf(theme);
    }

    /*
     * Thematic distribution
     */
    function handleThematicDistributionClick(d, i) {
        var themes = Object.keys(themeQuantityDatasets);
        if(themes.length == THEME_QUANTITY_MAX_THEMES) {
            delete themeQuantityDatasets[themes[0]];
        }
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
        var chart = thematicDistributionChart(handleThematicDistributionClick, getThemeIndex)
            .width(960)
            .height(500)
            .xlabel("Themes")
            .ylabel("Number of talks (" + data.date + ")");
        var svg = d3.select("#thematicDistribution svg")
            .datum(data.distribution)
            .call(chart); 

        if(thematicDistributionAnimation) {
            thematicDistributionTimeout = setTimeout(increaseThematicDistributionYear, THEMATIC_DISTRIBUTION_ANIMATION_DURATION);
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
            $("#thematicDistribution .animate").html("Stop");
        } else {
            clearTimeout(thematicDistributionTimeout);
            thematicDistributionTimeout = null;
            $("#thematicDistribution .animate").html("Start");
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
        var chart = themeQuantityChart(removeTheme, getThemeIndex)
            .width(960)
            .height(500)
            .xlabel("Time")
            .ylabel("Number of talks");
        var svg = d3.select("#themeQuantityOverTime svg")
            .datum(themeQuantityDatasets)
            .call(chart); 
    }
});
