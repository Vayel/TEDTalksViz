var parseTime = d3.timeParse("%Y-%m");
var formatTime = d3.timeFormat("%Y-%m");
                
$(document).ready(function() {
    var model = Model("https://raw.githubusercontent.com/Vayel/TEDTalksViz/master/data/");

    function colorScale(n) {
        var colors = ["#3366cc", "#dc3912", "#109618", "#bcbd22", "#990099", "#0099c6", "#dd4477", "#843c39", "#98df8a", "#9edae5"];
        return colors[n % colors.length];
    }

    var summaryData = null;
    var thematicDistribution = {
        chart: thematicDistributionChart(
            d3.select("#thematicDistribution .distribution"),
            960, 500,
            "Themes",
            "Talks",
            500,
            function(d) {
                if(thematicDistribution.selected.has(d.x)) {
                    thematicDistribution.selected.delete(d.x);
                    if(!thematicDistribution.selected.size) {
                        $("#thematicDistribution .clearSelection").removeClass("active")
                    }
                } else {
                    thematicDistribution.selected.add(d.x); 
                    $("#thematicDistribution .clearSelection").addClass("active")
                }
                thematicDistribution.chart.select(thematicDistribution.selected);
            },
            themeToColor
        ),
        timeline: timelineChart(
            d3.select("#thematicDistribution .timeline"),
            960, 100,
            function(date) {
                thematicDistribution.index = dateToIndex(date)
                thematicDistribution.stopAnimation()
                thematicDistribution.plot()
            }
        ),
        index: 0,
        animation: false,
        selected: new Set(),
        ANIMATION_DURATION: 1500,
    }
    var themeQuantity = {
        chart: themeQuantityChart(
            d3.select("#themeQuantity svg"),
            960, 500,
            "Time",
            "Talks",
            500,
            themeToColor
        ),
        selected: new Set(),
    }
    var favoriteThemes = {
        chart: favoriteThemesChart(
            d3.select("#favoriteThemes .viz"),
            960, 500,
            "Cumulative views",
            "Cumulative comments",
            500,
            function(d) {
                if(favoriteThemes.selected.has(d.label)) {
                    favoriteThemes.selected.delete(d.label);
                } else {
                    favoriteThemes.selected.add(d.label); 
                }
                favoriteThemes.chart.select(favoriteThemes.selected);
            },
            themeToColor
        ),
        timeline: timelineChart(
            d3.select("#favoriteThemes .timeline"),
            960, 100,
            function(date) {
                favoriteThemes.index = dateToIndex(date)
                favoriteThemes.stopAnimation()
                favoriteThemes.plot()
            }
        ),
        index: 0,
        animation: false,
        selected: new Set(),
        ANIMATION_DURATION: 1500,
    }

    function themeToColor(theme) {
        return colorScale(summaryData.themes.indexOf(theme));
    }

    function dateToIndex(date) {
        return summaryData.dates.indexOf(date)
    }



    /*
     * Load data
     */

    model.loadData("summary", function(data) {
        summaryData = data
        thematicDistribution.timeline.render(summaryData.dates)
        favoriteThemes.timeline.render(summaryData.dates)

        for(var label of summaryData.themes) {
            $("#themeQuantity .labels").append(
                '<div class="label" style="color: ' + themeToColor(label) + ';"'
                + 'data-label="' + label + '">'
                + '<i class="fa fa-check check" aria-hidden="true"></i>'
                + label
                + '</div>'
            )
        }

        model.loadData("thematic_distribution", function(data) {
            thematicDistribution.data = data;

            model.loadData("theme_quantity_over_time", function(data) {
                $("#loader").hide()
                themeQuantity.data = data

                // Plot
                thematicDistribution.plot()
                themeQuantity.select(summaryData.themes[0])
            })
        })

        model.loadData("favorite_themes_over_time", function(data) {
            favoriteThemes.data = data
            favoriteThemes.plot()
        });
    });



    /*
     * Thematic distribution
     */

    thematicDistribution.clearSelection = function() {
        thematicDistribution.selected = new Set()
        $(this).removeClass("active")
        thematicDistribution.chart.select(thematicDistribution.selected);
    }

    thematicDistribution.plot = function() {
        var data = thematicDistribution.data[thematicDistribution.index]; 

        thematicDistribution.chart.render(data.values);
        thematicDistribution.timeline.date(data.date) 
        themeQuantity.chart.selectX(data.date);

        if(thematicDistribution.animation) {
            thematicDistribution.timeout = setTimeout(function() {
                if(thematicDistribution.index == thematicDistribution.data.length - 1) {
                    return thematicDistribution.stopAnimation();
                }
                thematicDistribution.index += 1;
                thematicDistribution.plot();
            }, thematicDistribution.ANIMATION_DURATION);
        }
    }

    thematicDistribution.startAnimation = function() {
        thematicDistribution.animation = true
        thematicDistribution.plot()
        $("#thematicDistribution .stopAnimation").show()
        $("#thematicDistribution .startAnimation").hide()
    }

    thematicDistribution.stopAnimation = function() {
        clearTimeout(thematicDistribution.timeout)
        thematicDistribution.animation = false
        thematicDistribution.timeout = null
        $("#thematicDistribution .startAnimation").show()
        $("#thematicDistribution .stopAnimation").hide()
    }

    $("#thematicDistribution .startAnimation").click(thematicDistribution.startAnimation)
    $("#thematicDistribution .stopAnimation").click(thematicDistribution.stopAnimation)
    $("#thematicDistribution .clearSelection").click(thematicDistribution.clearSelection)



    /*
     * Theme quantity
     */

    themeQuantity.select = function(label) {
        themeQuantity.selected.add(label);
        $("#themeQuantity .labels").find('[data-label="' + label + '"]').addClass("selected")
        $("#themeQuantity .clearSelection").addClass("active")
        themeQuantity.plot()
    }

    themeQuantity.unselect = function(label) {
        themeQuantity.selected.delete(label) 
        $("#themeQuantity .labels").find('[data-label="' + label + '"]').removeClass("selected")
        if(!themeQuantity.selected.size) {
            $("#themeQuantity .clearSelection").removeClass("active")
        }
        themeQuantity.plot()
    }

    themeQuantity.clearSelection = function() {
        themeQuantity.selected = new Set()
        $("#themeQuantity .label").removeClass("selected")
        $("#themeQuantity .clearSelection").removeClass("active")
        themeQuantity.plot()
    }

    themeQuantity.toggleLabel = function() {
        var label = $(this).attr("data-label")
        if(themeQuantity.selected.has(label)) {
            themeQuantity.unselect(label)
        } else {
            themeQuantity.select(label)
        }
    }

    themeQuantity.plot = function() {
        var yKey = $("#themeQuantity .cumulate").is(":checked") ? "cumulative_y" : "y";
        var datasets = [...themeQuantity.selected].map(function(label) {
            return {
                label: label,
                key: label + yKey,
                values: themeQuantity.data[label].map(function(point) {
                    return {
                        label: label,
                        x: point.x,
                        y: point[yKey]
                    };
                })
            };
        });
        themeQuantity.chart.render(datasets);
    }

    $("#themeQuantity .cumulate").change(themeQuantity.plot)
    $("#themeQuantity .withLines").change(function() {
        themeQuantity.chart.line($(this).is(":checked"))
    })
    $("#themeQuantity .options .clearSelection").click(themeQuantity.clearSelection)
    $("#themeQuantity .options .labels").on("click", ".label", themeQuantity.toggleLabel)



    /*
     * Favorite themes
     */

    favoriteThemes.plot = function() {
        var data = favoriteThemes.data.values[favoriteThemes.index]

        favoriteThemes.chart.render({
            radius: favoriteThemes.data.radius,
            x: favoriteThemes.data.x,
            y: favoriteThemes.data.y,
            values: data.values
        }, favoriteThemes.selected)
        
        favoriteThemes.timeline.date(data.date) 

        if(favoriteThemes.animation) {
            favoriteThemes.timeout = setTimeout(function() {
                if(favoriteThemes.index >= favoriteThemes.data.values.length - 1) {
                    return favoriteThemes.stopAnimation()
                }
                favoriteThemes.index += 1
                favoriteThemes.plot()
            }, favoriteThemes.ANIMATION_DURATION)
        }
    }
    
    favoriteThemes.startAnimation = function() {
        favoriteThemes.animation = true
        favoriteThemes.plot()
        $("#favoriteThemes .stopAnimation").show()
        $("#favoriteThemes .startAnimation").hide()
    }

    favoriteThemes.stopAnimation = function() {
        clearTimeout(favoriteThemes.timeout)
        favoriteThemes.animation = false
        favoriteThemes.timeout = null
        $("#favoriteThemes .startAnimation").show()
        $("#favoriteThemes .stopAnimation").hide()
    }

    $("#favoriteThemes .startAnimation").click(favoriteThemes.startAnimation)
    $("#favoriteThemes .stopAnimation").click(favoriteThemes.stopAnimation)

});
