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
	move_sheet;

    // Append style element to head
    document.head.appendChild(element);

    // Reference to the stylesheet
    move_sheet = element.sheet;

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
        move_sheet.insertRule(styles, i);

        //add new class with new translate rule to letter
        letters[i].classList.add(moveclass);
    }

    $('.fireplace').addClass('explode');
    setFireAnimation("running");
} )

function getX(letter) {
    let letterX = getOffset(letter).left;
    return fireX-letterX;
}

function getY(letter) {
    let letterY = getOffset(letter).top;
    return fireY-letterY;
}

// ~~~~~~~~~~~~~~~~~~~~~~~
// explosion animation code
// ~~~~~~~~~~~~~~~~~~~~~~~

var pieces = document.getElementsByClassName("piece");
var thins = document.getElementsByClassName("thin");
var branches = document.getElementsByClassName("branch");

$(document).on( "click", '.explode', function() {
    var element = document.createElement('style'),
	boom_sheet;

    // Append style element to head
    document.head.appendChild(element);

    // Reference to the stylesheet
    boom_sheet = element.sheet;

    var new_class = "";
    for(let i = 0; i < 190; i++) {
        new_class = "boom" + i;
        boom_sheet.insertRule(new_class + explode(pieces[i]), i);
        
        pieces[i].classList.add(new_class);
    }
    for(let j = 0; j < 30; j++) {
        new_class = "boom" + j;
        boom_sheet.insertRule(new_class + explode(thins[j]), j);

        console.log(explode(thins[j]));
        
        thins[j].classList.add(new_class);
    }
    for(let k = 0; k < 32; k++) {
        new_class = "boom" + k;
        boom_sheet.insertRule(new_class + explode(branches[k]), k);
        
        branches[k].classList.add(new_class);
    }
} )

function explode(elem) {
    var new_style = "";
    let rand_x = getRand(-500, 500);

    return "{transform: translate(" + rand_x + "px,-1000px);}";
}

function getRand(min, max) {
    return Math.random() * (max - min) + min;
}