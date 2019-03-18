
initGrid = function (containerId, loadDataUrl, fields) {

    $("#" + containerId).jsGrid({
        width: "100%",
        height: "700px",
        filtering: true,
        sorting: true,
        paging: true,
        autoload: true,
        rowClick: function(element, index, event){
            document.location.href = element.item.url;
        },
        controller: {
            loadData: function(filter) {
                return $.ajax({
                    type: "GET",
                    url: loadDataUrl, // "/catalog/books/book_load_grid",
                    dataType: "json",
                    data: filter
                });
            }
        },
        fields: fields
    });
}


