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
        thematicDistributionSelected = new Set(),
        thematicDistributionTimeout = null;
    var themeQuantityDatasets = [],
        themeQuantityChartInstance = null;
    var favoriteThemesIndex = 0,
        favoriteThemesAnimation = false,
        favoriteThemesTimeout = null,
        favoriteThemesSummary = {
            radius: {min: null, max: null},
            x: {min: null, max: null},
            y: {min: null, max: null},
        },
        favoriteThemesSelected = new Set();

    var THEMATIC_DISTRIBUTION_ANIMATION_DURATION = 2000,
        THEME_QUANTITY_MAX_THEMES = 3,
        FAVORITE_THEMES_ANIMATION_DURATION = 1500;

    var charts = {
        thematicDistribution: thematicDistributionChart(
            d3.select("#thematicDistribution .distribution"),
            960, 500,
            "Themes",
            "Talks",
            500,
            function(d) {
                if(thematicDistributionSelected.has(d.x)) {
                    thematicDistributionSelected.delete(d.x);
                } else {
                    thematicDistributionSelected.add(d.x); 
                }
                charts.thematicDistribution.select(thematicDistributionSelected);
            },
            themeToColor
        ),
        themeQuantity: themeQuantityChart(
            d3.select("#themeQuantity svg"),
            960, 500,
            "Time",
            "Talks",
            500,
            handleThemeQuantityRemove,
            themeToColor
        ),
        favoriteThemes: favoriteThemesChart(
            d3.select("#favoriteThemes .viz"),
            960, 500,
            "Views",
            "Comments",
            500,
            function(d) {
                if(favoriteThemesSelected.has(d.label)) {
                    favoriteThemesSelected.delete(d.label);
                } else {
                    favoriteThemesSelected.add(d.label); 
                }
                charts.favoriteThemes.select(favoriteThemesSelected);
            },
            themeToColor
        )
    };

    model.loadData("summary", function(data) {
        summaryData = data;
        colorScale.domain(d3.range(summaryData.themes.length));

        model.loadData("thematic_distribution", function(data) {
            thematicDistributionData = data;

            model.loadData("theme_quantity_over_time", function(data) {
                $("#loader").hide();
                themeQuantityData = data;
                
                var label;
                for(var i = 0; i < THEME_QUANTITY_MAX_THEMES; i++) {
                    label = thematicDistributionData[thematicDistributionIndex].values[i].x;
                    themeQuantityDatasets.push({
                        label: label,
                        values: themeQuantityData[label]
                    });
                }

                plotThematicDistribution();
                plotThemeQuantity();
            });
        });

        model.loadData("favorite_themes_over_time", function(data) {
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
        var label = d.x;
        // Avoid duplicates
        for(let data of themeQuantityDatasets) {
            if(data.label == label) return;
        }

        // Limit number of themes
        while(themeQuantityDatasets.length >= THEME_QUANTITY_MAX_THEMES) {
            themeQuantityDatasets.shift();
        }

        themeQuantityDatasets.push({
            label: label,
            values: themeQuantityData[label]
        });
        plotThemeQuantity();
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
        charts.thematicDistribution.render(data.values);
        
        chart = timelineChart(handleTimelineClick, data.date)
            .width(960)
            .height(100);
        d3.select("#thematicDistribution .timeline")
            .datum(thematicDistributionData.map(function(obj) {
                return obj.date;
            }))
            .call(chart); 

        charts.themeQuantity.selectX(data.date);

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
    function handleThemeQuantityRemove(d, i) {
        themeQuantityDatasets.splice(i, 1);
        plotThemeQuantity();
    }

    function plotThemeQuantity() {
        var datasets = themeQuantityDatasets.map(function(dataset) {
            return {
                label: dataset.label,
                values: dataset.values.map(function(point) {
                    return {
                        label: dataset.label,
                        x: point.x,
                        y: point[$("#themeQuantity .cumulate").is(":checked") ? "cumulative_y" : "y"]
                    };
                })
            };
        });

        charts.themeQuantity.render(datasets);
    }

    $("#themeQuantity .cumulate").change(plotThemeQuantity);
    $("#themeQuantity .withLines").change(function() {
        charts.themeQuantity.line($(this).is(":checked"));
    });

    /*
     * Favorite themes
     */
    function handleFavoriteThemesTimelineClick(date) {
        favoriteThemesData.values.forEach(function(obj, i) {
            if(obj.date == date) {
                favoriteThemesIndex = i;
            }
        });
        stopFavoriteThemesAnimation();
        plotFavoriteThemes();
    }

    function plotFavoriteThemes() {
        var data = favoriteThemesData.values[favoriteThemesIndex]; 

        charts.favoriteThemes.render({
            radius: {min: favoriteThemesData.radius.min, max: favoriteThemesData.radius.max},
            x: {min: favoriteThemesData.x.min, max: favoriteThemesData.x.max},
            y: {min: favoriteThemesData.y.min, max: favoriteThemesData.y.max},
            values: data.values
        }, favoriteThemesSelected);
        
        var chart = timelineChart(handleFavoriteThemesTimelineClick, data.date)
            .width(960)
            .height(100);
        d3.select("#favoriteThemes .timeline")
            .datum(summaryData.dates)
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
