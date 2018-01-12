$(document).ready(function() {
    var model = Model("https://raw.githubusercontent.com/Vayel/TEDTalksViz/master/data/");

    model.loadData("theme_quantity_over_time", function(data) {
        $("#loader").hide();
        console.log(data);
    });
});
