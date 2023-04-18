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
        console.log("click");
        expandCircle($(this));
    });
});

// ~~~~~~~~~~~~~~~~~~~~~~~
// dynamic load code
// ~~~~~~~~~~~~~~~~~~~~~~~


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

// ~~~~~~~~~~~~~~~~~~~~~~~
// circle expansion code
// ~~~~~~~~~~~~~~~~~~~~~~~

var quadLeads = [0,0,0,0,0];

function expandCircle(firstPiece) {
    //push piece zero, the center of the circle
    quadLeads[0] = firstPiece;
    //set first four quad leads
    findFirstFour(firstPiece);

    //for loop where you call each quadrant
    let delay = 0; //animation delay value; increments each time after all four quadrants have been expanded
    let countFinishedQuads = 0; //counts number of finished quadrants
    let timeout = 0; //debug timeout in case while loop is broken
    let outOfPieces = 0; //check if this quadrant is finished

    //expand each quadrant while not all quadrants are done expanding
    while (countFinishedQuads < 1) {
        //since while loop has proceeded past initial check, it must mean that the number of finished quads is not yet four so reset the count
        countFinishedQuads = 0;

        for (let q = 1; q <= 1; q++) {
            //expandQuadrants returns 0 if successful round of expansion. returns 1 if quadrant is completely expanded.
            outOfPieces = 0;

            //maybe set animation timeouts within the functions themselves?
            //setTimeout(() => { outOfPieces = expandQuadrants(q, circlePieces[q]); }, delay*50);
            outOfPieces = expandQuadrants(q, delay, quadLeads[q]);

            if (outOfPieces) {
                countFinishedQuads++;
            }
        }

        //increment delay to have staggered animation effect between rounds
        delay++;

        console.log(countFinishedQuads);


        //------------
        //debug
        timeout++;
        
        if (timeout > 10000) {
            alert("loop timeout");
            break;
        }
        //------------
    }


    //q functions will return an array of pieces that you can push onto end of big array where at the end you will call animation with delays
    //remember to add initial four to array first
    //when you set delays, set them in groups of 4^n, starting at n=0 to start burn in center, meaning first four one delay, next eight have next delay, and so on
}

//given a quadrant number and the current node, expand outward
function expandQuadrants(quadrant, delay, currPiece) {
    let horizFactor = 1; //horizontal expansion direction changes according which quad

    //prepare to set next piece id
    let thisID = parseInt(currPiece.attr("id").substring(1));
    //set up like cartesian coordinate plane. If q1 or q2, expand upward. If q3 or q4, expand downward. If q2 or q3, expands to left. If q1 or q4, expand to right.
    if (quadrant == 2 || quadrant == 3) {
        horizFactor = -1; 
    }

    //STEP 1: expand horizontally
    nextHorizID = thisID + horizFactor;
    nextHorizPiece = $("#p" + nextHorizID);

    //if no next horizontal piece, then move to diagonal and continue process
    if (!nextHorizPiece.length) {
        let diagonalID = quadrant < 3 ? (thisID + (limitCol + 2) + horizFactor) : (thisID - (limitCol + 2) + horizFactor); //ugh vertical
        
        if ($("#p" + diagonalID).length) {
            quadLeads[quadrant] = $("#p" + diagonalID);
            expandQuadrants(quadrant, $(nextID + diagonalID));
            return 0;
        }

        //error code 1: no more nodes to expand so end this !quadrant's! expansion
        console.log("reached end");
        return 1;
    }

    quadLeads[quadrant] = nextHorizPiece;

    //just burn them as they go and not add to array? because when it reachs the edges the number of nodes start to go down again and that doesn't work so well
    burnOnePiece(delay, nextHorizPiece);
    nextHorizPiece.removeClass('burn');

    cascadeQuadrant(quadrant, horizFactor, delay, quadLeads[quadrant]);

    //code 0: expansion successful, and there are still more nodes to expand. End this !round! of expansion.
    return 0;
}

//burn one piece at a time with delay (and maybe remove it too not sure if that will work)
function burnOnePiece(delay, currPiece) {
    setTimeout(() => { currPiece.addClass('burn'); }, delay*50);
}

//recursive function to cascade up or down depending on quadrant
function cascadeQuadrant(quadrant, horizFactor, delay, currPiece) {
    console.log("i\'ve received ");
    console.log(currPiece);
    nextVertPiece = getVerticalPiece(quadrant, currPiece);
    
    console.log("This is the next vert piece to be cascaded: " + nextVertPiece);
    //if this is a valid piece i.e. we haven't run out of pieces to add, then add to appropriate quadrant array
    if (nextVertPiece.length) {
        burnOnePiece(delay, nextVertPiece);
        nextVertPiece.removeClass('burn');
        console.log("vertical cascade addition");
    }

    //get diagonal
    let diagonalID = parseInt(nextVertPiece.attr("id").substring(1)) - horizFactor;
    //if there is another diagonal node, repeat the above process on that node
    //THIS CURRENTLY DOES NOT STOP AT THE QUADRANT EDGE BUT KEEPS GOING, SEE IF THAT IS ACTUALY A PROBLEM BECAUSE IT WILL DOULBE ADD WITH OTHER QUADRANTS
    if ($(diagonalID).length) {
        console.log("I send the next iteration");
        console.log($("#p" + diagonalID));
        cascadeQuadrant(quadrant, horizFactor, delay, $("#p" + diagonalID));
    }
}

//helper function to cascadeQuadrant
//get the next vertical piece, whether that is up or down
function getVerticalPiece(quadrant, currPiece) {
    let thisID = parseInt(currPiece.attr("id").substring(1));
    let nextVertID;
    
    if (quadrant < 3) {
        nextVertID = "#p" + (thisID - Math.trunc(limitCol + 2));
    } else {
        nextVertID = "#p" + (thisID + Math.trunc(limitCol + 2));
    }
    //get next vertical piece
    return $(nextVertID);
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

    //set as each quadrant's leads in the quadLeads array
    quadLeads[1] = right;
    quadLeads[2] = top;
    quadLeads[3] = left;
    quadLeads[4] = bottom;
}