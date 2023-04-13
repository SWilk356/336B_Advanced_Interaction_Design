var w = window.innerWidth;
var h = window.innerHeight;

//dynamically load grid column/row css and pieces
$(document).ready(function () {
    let limitCol = w/26;
    let limitRow = h/34;
    let columns = "3vw";
    let rows = "3vw"
    //set column num
    for(let i = 0; i < limitCol; i++) {
        columns = columns.concat(" 3vw");
    }

    //set row num
    for(let k = 0; k < limitRow; k++) {
        rows = rows.concat(" 3vw");
    }

    for(let j = 0; j < limitCol*limitRow; j++) {
        $('#dense-grid').append("<div class=\"piece\"><div>");
    }

    $('#dense-grid').css("grid-template-columns", columns);
    $('#dense-grid').css("grid-template-rows", rows);

    //document.getElementById("dense-grid").style.gridTemplateColumns = columns;
});