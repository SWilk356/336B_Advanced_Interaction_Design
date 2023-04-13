//get window size in px
var w = window.innerWidth;
var h = window.innerHeight;

//put in function maybe but needs global scope anyway so whatever

//convert piece size in vw to px
let pieceSizeVW = setPieceSizeVW();
console.log(pieceSizeVW + "vw per piece");
let pieceSize = (pieceSizeVW/w*10000);
console.log("size in px: " + pieceSize);

//these will be the css values that will fill grid-template-columns/rows at the end
let columns = pieceSize+ "px";
let rows = pieceSize + "px";

//set limits on number of columns/rows dependent on window size
let limitCol = w/pieceSize;
let limitRow = h/pieceSize;

console.log(limitCol + " grid columns");
console.log(limitRow + " grid rows");
console.log(limitCol*limitRow + " pieces total");

$(document).ready(function () {
    //dynamically load grid column/row css and pieces
    loadColumnsRowsPieces();

    //activate allowing clicking on piece to create burn circle
    $(".piece").click( function () {
        expandCircle($(this));
    });
});

//dynamically load grid column/row css and pieces
function loadColumnsRowsPieces() {
    //for how many columns that should be made for this resolution, add to css string
    for (let i = 0; i < limitCol; i++) {
        columns = columns.concat(" " + pieceSize + "px");
    }

    //for how many rows that should be made for this resolution, add to css string
    for (let k = 0; k < limitRow; k++) {
        rows = rows.concat(" " + pieceSize + "px");
    }

    //set css now that columns/rows css has been made
    $('#dense-grid').css("grid-template-columns", columns);
    $('#dense-grid').css("grid-template-rows", rows);

    //dynamically load as many pieces as there are columns times rows plus 1
    for (let j = 0; j < limitCol*(limitRow+5); j++) {
        $('#dense-grid').append("<div class=\"piece\" id=\"p" + j + "\"><div>");
        }
        
    //modify the css file or just use inline?
    //document.getElementById("dense-grid").style.gridTemplateColumns = columns;
}

function setPieceSizeVW() {
    if (w < 480) {
        return 2;
    } else if (w < 768) {
        return 3;
    } else if (w < 1024) {
        return 4;
    } else if (w < 1500) {
        return 5;
    } else {
        return 8;
    }
}

//ideas for the way to do circle - recursive
//assign ids to each piece
//first four surrounding initial piece are assigned a quadrant like in cartesian system
//q1 expands forward one and one above current piece
//q2 expands back one and one above
//q3 expands back one and down one
//q4 expands forward one and down one

//every expansion, add those pieces to an array. those are the next pieces to iterate on. array will be of variable length.
//maybe four different arrays for each quadrant?

var circlePieces = [];

function expandCircle(firstPiece) {
    circlePieces.push(firstPiece);
    findFirstFour(firstPiece);

    console.log(circlePieces);

    //for loop where you call each quadrant
    //q functions will return an array of pieces that you can push onto end of big array where at the end you will call animation with delays
    //remember to add initial four to array first
    //when you set delays, set them in groups of 4^n, starting at n=0 to start burn in center, meaning first four one delay, next eight have next delay, and so on


}

//calculate ids of first four based on given piece and push them to circlePieces array
function findFirstFour(firstPiece) {
    //get id of given piece
    let thisIDstr = firstPiece.attr("id");
    let thisIDnum = parseInt(thisIDstr.substring(1));

    //calculate left right top and bottom ids
    let vertDiff = Math.trunc(limitCol + 2);
    let right = $("#p" + (thisIDnum+1));
    let left = $("#p" + (thisIDnum-1));
    let top = $("#p" + (thisIDnum-vertDiff));
    let bottom = $("#p" + (thisIDnum+vertDiff));

    //push to full array
    circlePieces.push(right, left, top, bottom);
}

function getVerticalDifference(currPiece) {

}