$(document).ready(function() {
    $.ajax({
        type: "GET",
        url: "https://raw.githubusercontent.com/Vayel/TEDTalksViz/master/data.csv",
        dataType: "text",
        success: function(data) {
            console.log(data.substr(0, 20));
            $("#loader").hide();
        }
    });
});
