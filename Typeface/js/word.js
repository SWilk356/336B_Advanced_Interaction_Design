$(document).on( 'mouseover', '.col-1, .col-2, .col-3', function () {
    $(this).css('border-style', 'solid');
    $(this).css('border-color', 'white');
})

$(document).on( 'mouseout', '.col-1, .col-2, .col-3', function () {
    $(this).css('border-style', 'none');
})

// ~~~~~~~~~~~~~~~~~~~~~~~
// fire spreading code
// ~~~~~~~~~~~~~~~~~~~~~~~

const colnames = ["col-1", "col-2", "col-3"];

var elem = document.createElement('style'),
burn_sheet;

// Append style element to head
document.head.appendChild(elem);

// Reference to the stylesheet
burn_sheet = elem.sheet;

var thisCol = "";

$(document).on( "click", '#incendo-grid .col-1, #incendo-grid .col-2, #incendo-grid .col-3' , function() {
    thisCol = $(this).attr('class');
})

$(document).on( "click", '#incendo-grid .letter' , function() {
    let id = $(this).attr('id');
    let lefthand, righthand;
    if(thisCol == "col-1") {
        lefthand = 2;
        righthand = 0;
    } else if (thisCol == "col-2") {
        lefthand = 0;
        righthand = 1;
    } else {
        lefthand = 1;
        righthand = 2;
    }

    //set d1 as increasing variable for delay amount
    let d1 = 0;
    //move left down the letters
    for(let i = parseInt(id) - 1; i > 0; i--) {
        //move lefthand down the columns
        var startingCol = (i == 0) ? lefthand : 2;
        for(let h = startingCol; h > -1; h--) {
            d1++;
            burnColumn(i.toString(), colnames[h], d1);
        }
    }

    //set d2 as new increasing variable for delay amount
    let d2 = 0;
    //move right up the letters
    for(let f = parseInt(id); f < 8; f++) {
        var startingCol = (f == 0) ? righthand : 0;
        //move righthand up the columns
        for(let g = startingCol; g < 3; g++) {
            d2++;
            burnColumn(f.toString(), colnames[g], d2);
        }
    }

    removeBurnClass();
})

//called every time a new column is to be burned
function burnColumn(letterID, colClass, delay) {
    //check only inside clicked letter
    //if col is equal to clicked column, then set whole column on fire
    let colChildren = $("#" + letterID + " ." + colClass).children();

    for(let k = 0; k < colChildren.length; k++) {
        setTimeout(() => { colChildren[k].classList.add('burn'); }, delay*50);
        
        if(colChildren[k].classList.contains("branch")) {
            setTimeout(() => { colChildren[k].style.filter = "invert(1)"; }, 1250);
        }
    }
}

function removeBurnClass() {
    let allpieces = $('.letter').children().children();

    for(let m = 0; m < allpieces.length; m++) {
        allpieces[m].classList.remove("burn");
        if(allpieces[m].classList.contains("branch")) {
            setTimeout(() => { allpieces[m].style.filter = "invert(0)"; }, 3000);
        }
    }
}