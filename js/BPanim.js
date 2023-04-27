//get window size in px
var w = window.innerWidth;
var h = window.innerHeight;

//convert piece size in vw to px
let pieceSizeVW = setPieceSizeVW();
console.log(pieceSizeVW + "vw per piece");
let pieceSize = (pieceSizeVW/w*10000);
console.log("size in px: " + pieceSize);

//these will be the css values that will fill grid-template-columns/rows at the end
let columns = pieceSize+ "px";
let rows = pieceSize + "px";

//set limits on number of columns/rows dependent on window size
let limitCol = Math.trunc(w/pieceSize);
let limitRow = Math.trunc(h/pieceSize);

console.log(limitCol + " grid columns");
console.log(limitRow + " grid rows");
console.log(limitCol*limitRow + " pieces total");

var sheet = document.styleSheets[2];
var rules = sheet.cssRules || sheet.rules;

rules[0].style.animation = '0.5s burn-grow forwards';

$(document).ready(function () {
    //dynamically load grid column/row css and pieces
    loadColumnsRowsPieces();

    //activate allowing clicking on piece to create burn circle
    $(".piece").click( function () {
        expandCircle($(this));
    });
});

//reload to adjust to new resolution; changes number of pieces loaded and size of each piece
$(window).on('resize', function () {
    location.reload();
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
    } else if (w < 2500) {
        return 8;
    } else {
        return 25;
    }
}

//helper function get id because i'm so lazy
function getPieceID(piece) {
    return parseInt(piece.attr("id").substring(1));
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

    //set expansion limits so that circle does not wrap around grid
    let thisID = getPieceID(firstPiece);
    let rowPos = thisID % (limitCol+1);
    let q1Limit = thisID + Math.trunc(limitCol+1 - rowPos);
    let q3Limit = thisID - rowPos;
    let q2Limit = q3Limit - limitCol-1;
    let q4Limit = q1Limit + limitCol+1;

    let delay = 0; //animation delay value; increments each time after all four quadrants have been expanded
    let countFinishedQuads = 0; //counts number of finished quadrants
    let outOfPieces = 0; //check if this quadrant is finished

    //burn first five
    for (let i = 0; i < 5; i++) {
        burnOnePiece(delay, quadLeads[i]);
        quadLeads[i].removeClass('burn');
    }

    let expansionLimit;
    //expand each quadrant while not all quadrants are done expanding
    while (countFinishedQuads < 4) {
        //since while loop has proceeded past initial check, it must mean that the number of finished quads is not yet four so reset the count
        countFinishedQuads = 0;
        //increment delay to have staggered animation effect between rounds
        delay++;

        for (let q = 1; q <= 4; q++) {
            outOfPieces = 0;
            
            //have fun with shapes - change expansion limits to change the shape
            if (w < 768) {
                q1Limit = 1000; //arbitrary top limit for small devices - prob won't generate more than 1000 pieces total
                q3Limit = 0;
             } else if (w < 1024) {
                
             } else if (w < 1500) {
                
            } else {                
                q1Limit = q1Limit + limitCol;
                quadLeads[2] = null;
                quadLeads[3] = null;
                q4Limit = q4Limit + limitCol;
            }

            if (!quadLeads[q]) { countFinishedQuads++; continue;}

            //set limits per quadrant
            switch (q) {
                case 1: expansionLimit = q1Limit; break;
                case 2: expansionLimit = q2Limit; break;
                case 3: expansionLimit = q3Limit; break;
                case 4: expansionLimit = q4Limit; break;
            }

            outOfPieces = expandQuadrants(q, expansionLimit, delay, quadLeads[q]);//expandQuadrants returns 0 if successful round of expansion. returns 1 if quadrant is completely expanded.
            //console.log("expand output: " + outOfPieces);

            if (outOfPieces) { countFinishedQuads++; }
        }
    }
    
    if(w>1500)setTimeout(() => { location.reload(); }, delay*100);
}

//given a quadrant number and the current node, expand outward
function expandQuadrants(quadrant, expansionLimit, delay, currPiece) {
    let horizFactor = 1; //horizontal expansion direction changes according which quad
    
    //STEP 1:
    //burn the current quadLead piece
    burnOnePiece(delay, currPiece);
    currPiece.removeClass('burn');
    //cascade up/down from current piece
    if (w > 768) { cascadeQuadrant(quadrant, horizFactor, delay, quadLeads[quadrant]); }

    //STEP 2:
    //get the next quadLead piece
    let thisID;
    //prepare to get next piece id
    if (currPiece.attr("id")) {
        thisID = parseInt(currPiece.attr("id").substring(1));
    } else {
        return 1;
    }

    //set up like cartesian coordinate plane. If q1 or q2, expand upward. If q3 or q4, expand downward. If q2 or q3, expands to left. If q1 or q4, expand to right.
    if (quadrant == 2 || quadrant == 3) {
        horizFactor = -1; 
    }

    //get next id
    nextHorizID = thisID + horizFactor;

    //check if this piece is past expansion limits i.e. has it exceeded the original piece's row?
    if (quadrant == 1 || quadrant == 4) {
        
        if (nextHorizID > expansionLimit) {
            //console.log("1 or 4 exceeded");
            return 1;
        }
    } else {
        if (nextHorizID < expansionLimit) {
            //console.log("2 or 3 exceeded");
            return 1;
        }
    }

    let nextHorizPiece = $("#p" + nextHorizID);
    if (!nextHorizPiece.attr("id")) {
        //console.log(nextHorizPiece);
        return 1;
    }

    //set this next piece as the next quad lead
    quadLeads[quadrant] = nextHorizPiece;

    //code 0: expansion successful, and there are still more nodes to expand. End this !round! of expansion.
    return 0;
}

//recursive function to cascade up or down depending on quadrant
function cascadeQuadrant(quadrant, horizFactor, delay, currPiece) {
    let nextVertPiece = getVerticalPiece(quadrant, currPiece);

    //if this is a valid piece i.e. we haven't run out of pieces to add, then burn it. otherwise, return.
    if (!nextVertPiece) {
        return;
    }

    burnOnePiece(delay, nextVertPiece);
    nextVertPiece.removeClass('burn');

    let diagonalID;
    //get diagonal
    if (nextVertPiece.attr("id")) {
        diagonalID = (quadrant == 2 || quadrant == 3) ? parseInt(nextVertPiece.attr("id").substring(1)) + horizFactor : parseInt(nextVertPiece.attr("id").substring(1)) - horizFactor;
        cascadeQuadrant(quadrant, horizFactor, delay, $("#p" + diagonalID));
    }
    
    //if there is another diagonal node, repeat the above process on that node
    //THIS CURRENTLY DOES NOT STOP AT THE QUADRANT EDGE BUT KEEPS GOING, SEE IF THAT IS ACTUALY A PROBLEM BECAUSE IT WILL DOULBE ADD WITH OTHER QUADRANTS

    return;
}

function setShapeBasedOnWindow() {
    if (w < 480) {
        return -1;
    } else if (w < 768) {
        return -1;
    } else if (w < 1024) {
        return -1;
    } else if (w < 1500) {
        return -1;
    } else {
        return -1;
    }
}

//burn one piece at a time with delay (and maybe remove it too not sure if that will work)
function burnOnePiece(delay, currPiece) {
    setTimeout(() => { currPiece.addClass('burn'); }, delay*100);
}

//helper function to cascadeQuadrant
//get the next vertical piece, whether that is up or down
function getVerticalPiece(quadrant, currPiece) {
    let thisID = parseInt(currPiece.attr("id"));
    if (currPiece.attr("id")) {
        thisID = parseInt(currPiece.attr("id").substring(1));
    } else {
        return null;
    }

    let nextVertID;
    
    if (quadrant < 3) {
        nextVertID = "#p" + (thisID - Math.trunc(limitCol + 1));
    } else {
        nextVertID = "#p" + (thisID + Math.trunc(limitCol + 1));
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
    let vertDiff = Math.trunc(limitCol + 1);
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