// ~~~~~~~~~~~~~~~~~~~~~~~
//bonfire animation code
// ~~~~~~~~~~~~~~~~~~~~~~~

var bonfire = document.getElementsByClassName("fireplace");
var sparks = bonfire[0].getElementsByTagName("main");

var littleFire = document.getElementsByClassName("fireplace__flame");
var bigFire = document.getElementsByClassName("fireplace__flame_big");

$(document).on( "mousedown", '.fireplace', function() {
    //set fire animation to running
    setFireAnimation("running");
} )

$(document).on( "mouseup", '.fireplace', function() {
    //set fire animation to pause
    setFireAnimation("paused");
} )

//set fire animation to play according to whether mouse is holding down on it or not
function setFireAnimation(state) {
    littleFire[0].style.animationPlayState = state;
    bigFire[0].style.animationPlayState = state;

    sparks[0].style.animationPlayState = state;
    sparks[1].style.animationPlayState = state;
    sparks[2].style.animationPlayState = state;
    sparks[3].style.animationPlayState = state;
}

// ~~~~~~~~~~~~~~~~~~~~~~~
// move letters to fire animation code
// ~~~~~~~~~~~~~~~~~~~~~~~
var letters = document.getElementsByClassName("letter");
var fireplace = document.getElementById("fp");

// getOffset() from https://stackoverflow.com/questions/442404/retrieve-the-position-x-y-of-an-html-element
// calculate x and y pos based on relative distance to body
function getOffset(el) {
    const rect = el.getBoundingClientRect();
    return {
      left: rect.left + window.scrollX,
      top: rect.top + window.scrollY
    };
}

const fireX = getOffset(fp).left + 100;
const fireY = getOffset(fp).top + 100;


$(document).on( "click", '#moon', function() {
    //make new stylesheet to contain all translation rules
    var element = document.createElement('style'),
	sheet;

    // Append style element to head
    document.head.appendChild(element);

    // Reference to the stylesheet
    sheet = element.sheet;

    //for each letter, calculate distance to fire 
    let x = 0;
    let y = 0;
    let trans = 0;
    let moveclass = "";
    var styles = "";
    for(let i = 0; i < 26; i++) {
        //get x and y amount to translate by
        x = getX(letters[i]);
        y = getY(letters[i]);
        trans = "translate(" + x + "px," + y + "px);";

        //set new class name
        moveclass = "move" + i;

        //set css rule
        styles = '.' + moveclass + ' {';
        styles += 'transform: ' + trans;
        styles += '}';

        // Add the CSS rule to the stylesheet
        sheet.insertRule(styles, i);

        //add new class with new translate rule to letter
        letters[i].classList.add(moveclass);
    }

    $('.fireplace').addClass('explode');
} )

function getX(letter) {
    let letterX = getOffset(letter).left;
    return fireX-letterX;
}

function getY(letter) {
    let letterY = getOffset(letter).top;
    return fireY-letterY;
}

$(document).on( "click", '.explode', function() {
    
} )