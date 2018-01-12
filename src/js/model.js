var Model = (function(data_root_url) {
    var module = {};

    module.loadData = function(name, cb) {
        $.ajax({
            type: "GET",
            url: data_root_url + name + ".json",
            dataType: "json",
            success: cb,
        });
    }

    return module;
});
