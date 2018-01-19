var parseTime = d3.timeParse("%Y-%m");
var formatTime = d3.timeFormat("%Y-%m");
var colorScale = d3.scaleOrdinal(d3.schemeCategory20);
                
$(document).ready(function() {
    var model = Model("https://raw.githubusercontent.com/Vayel/TEDTalksViz/master/data/");

    var summaryData = null,
        themeQuantityData = null,
        thematicDistributionData = null,
        favoriteThemesData = null;
    var thematicDistributionIndex = 0,
        thematicDistributionAnimation = false,
        thematicDistributionTimeout = null;
    var themeQuantityDatasets = [],
        themeQuantityChartInstance = null;
    var favoriteThemesIndex = 0,
        favoriteThemesAnimation = false,
        favoriteThemesTimeout = null;

    var THEMATIC_DISTRIBUTION_ANIMATION_DURATION = 2000,
        THEME_QUANTITY_MAX_THEMES = 3,
        FAVORITE_THEMES_ANIMATION_DURATION = 1500;

    model.loadData("summary", function(data) {
        summaryData = data;
        colorScale.domain(d3.range(summaryData.themes.length));

        model.loadData("theme_quantity_over_time", function(data) {
            $("#loader").hide();
            themeQuantityData = data;
        });

        model.loadData("thematic_distribution", function(data) {
            $("#loader").hide();
            thematicDistributionData = data;
            plotThematicDistribution();
        });

        model.loadData("favorite_themes_over_time", function(data) {
            $("#loader").hide();
            favoriteThemesData = data;
            plotFavoriteThemes();
        });
    });

    function themeToColor(theme) {
        return colorScale(summaryData.themes.indexOf(theme));
    }

    /*
     * Thematic distribution
     */
    function handleThematicDistributionClick(d, i) {
        // Avoid duplicates
        for(let data of themeQuantityDatasets) {
            if(data.theme == d.theme) return;
        }

        // Limit number of themes
        if(themeQuantityDatasets.length == THEME_QUANTITY_MAX_THEMES) {
            themeQuantityDatasets.shift();
        }

        themeQuantityDatasets.push({
            theme: d.theme,
            values: themeQuantityData[d.theme]
        });
        plotThemeQuantityOverTime();
        updateThemeQuantityDate();
        $("#themeQuantityOverTime").show();
    }

    function handleTimelineClick(date) {
        thematicDistributionData.forEach(function(obj, i) {
            if(obj.date == date) {
                thematicDistributionIndex = i;
            }
        });
        stopThemeDistributionAnimation();
        plotThematicDistribution();
    }

    function plotThematicDistribution() {
        var data = thematicDistributionData[thematicDistributionIndex]; 

        var chart = thematicDistributionChart(handleThematicDistributionClick, themeToColor)
            .width(960)
            .height(500)
            .xlabel("Themes")
            .ylabel("Number of talks (" + data.date + ")");
        d3.select("#thematicDistribution .distribution")
            .datum(data.distribution)
            .call(chart); 
        
        chart = timelineChart(handleTimelineClick, data.date)
            .width(960)
            .height(100);
        d3.select("#thematicDistribution .timeline")
            .datum(thematicDistributionData.map(function(obj) {
                return obj.date;
            }))
            .call(chart); 

        updateThemeQuantityDate();

        if(thematicDistributionAnimation) {
            thematicDistributionTimeout = setTimeout(function() {
                if(thematicDistributionIndex == thematicDistributionData.length - 1) {
                    return stopThemeDistributionAnimation();
                }
                thematicDistributionIndex += 1;
                plotThematicDistribution();
            }, THEMATIC_DISTRIBUTION_ANIMATION_DURATION);
        }
    }

    // Animation
    $("#thematicDistribution .startAnimation").click(function() {
        thematicDistributionAnimation = true;
        plotThematicDistribution();
        $("#thematicDistribution .stopAnimation").show();
        $("#thematicDistribution .startAnimation").hide();
    });

    function stopThemeDistributionAnimation() {
        clearTimeout(thematicDistributionTimeout);
        thematicDistributionAnimation = false;
        thematicDistributionTimeout = null;
        $("#thematicDistribution .startAnimation").show();
        $("#thematicDistribution .stopAnimation").hide();
    }

    $("#thematicDistribution .stopAnimation").click(stopThemeDistributionAnimation);

    /*
     * Theme quantity over time
     */
    function removeTheme(d, i) {
        themeQuantityDatasets.splice(i, 1);
        if(!themeQuantityDatasets.length) {
            $("#themeQuantityOverTime").hide();
            themeQuantityChartInstance = null;
        } else {
            plotThemeQuantityOverTime();
        }
    }

    function plotThemeQuantityOverTime() {
        themeQuantityChartInstance = themeQuantityChart(
            removeTheme,
            themeToColor,
            $("#themeQuantityOverTime .withLines").is(":checked"),
            $("#themeQuantityOverTime .cumulate").is(":checked"),
        ).width(960)
        .height(500)
        .xlabel("Time")
        .ylabel("Number of talks");
        var svg = d3.select("#themeQuantityOverTime svg")
            .datum(themeQuantityDatasets)
            .call(themeQuantityChartInstance); 
        updateThemeQuantityDate();
    }

    function updateThemeQuantityDate() {
        if(themeQuantityChartInstance == null) return;
        var data = thematicDistributionData[thematicDistributionIndex];
        themeQuantityChartInstance.date(data.date);
    }

    $("#themeQuantityOverTime .withLines, #themeQuantityOverTime .cumulate").change(function() {
        if($("#themeQuantityOverTime").is(":visible")) {
            plotThemeQuantityOverTime();
        }
    });

    /*
     * Favorite themes
     */
    function handleFavoriteThemesTimelineClick(date) {
        favoriteThemesData.forEach(function(obj, i) {
            if(obj.date == date) {
                favoriteThemesIndex = i;
            }
        });
        stopFavoriteThemesAnimation();
        plotFavoriteThemes();
    }

    function plotFavoriteThemes() {
        var data = favoriteThemesData[favoriteThemesIndex]; 

        var chart = favoriteThemesChart(themeToColor)
            .width(960)
            .height(500)
            .xlabel("Number of views")
            .ylabel("Number of comments");
        d3.select("#favoriteThemes .viz")
            .datum(data.talks)
            .call(chart); 
        
        chart = timelineChart(handleFavoriteThemesTimelineClick, data.date)
            .width(960)
            .height(100);
        d3.select("#favoriteThemes .timeline")
            .datum(favoriteThemesData.map(function(obj) {
                return obj.date;
            }))
            .call(chart); 

        if(favoriteThemesAnimation) {
            favoriteThemesTimeout = setTimeout(function() {
                if(favoriteThemesIndex == favoriteThemesData.length - 1) {
                    return stopFavoriteThemesAnimation();
                }
                favoriteThemesIndex += 1;
                plotFavoriteThemes();
            }, FAVORITE_THEMES_ANIMATION_DURATION);
        }
    }
    
    // Animation
    $("#favoriteThemes .startAnimation").click(function() {
        favoriteThemesAnimation = true;
        plotFavoriteThemes();
        $("#favoriteThemes .stopAnimation").show();
        $("#favoriteThemes .startAnimation").hide();
    });

    function stopFavoriteThemesAnimation() {
        clearTimeout(favoriteThemesTimeout);
        favoriteThemesAnimation = false;
        favoriteThemesTimeout = null;
        $("#favoriteThemes .startAnimation").show();
        $("#favoriteThemes .stopAnimation").hide();
    }

    $("#favoriteThemes .stopAnimation").click(stopFavoriteThemesAnimation);

});
