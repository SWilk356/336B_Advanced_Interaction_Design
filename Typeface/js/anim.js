// ~~~~~~~~~~~~~~~~~~~~~~~
// bonfire animation code
// ~~~~~~~~~~~~~~~~~~~~~~~

var bonfire = document.getElementsByClassName("fireplace");
var sparks = bonfire[0].getElementsByTagName("main");

var littleFire = document.getElementsByClassName("fireplace__flame");
var bigFire = document.getElementsByClassName("fireplace__flame_big");

// $(document).on( "mousedown", '.fireplace', function() {
//     //set fire animation to running
//     setFireAnimation("running");
// } )

// $(document).on( "mouseup", '.fireplace', function() {
//     //set fire animation to pause
//     setFireAnimation("paused");
// } )

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
// move letters to fire and shake animation code
// ~~~~~~~~~~~~~~~~~~~~~~~
var letters = document.getElementsByClassName("letter");
var fireplace = document.getElementById("fp");
var fireContainer = document.getElementsByClassName("fire");

// calculate x and y pos based on relative distance to body
// getOffset() from https://stackoverflow.com/questions/442404/retrieve-the-position-x-y-of-an-html-element
function getOffset(el) {
    const rect = el.getBoundingClientRect();
    return {
      left: rect.left + window.scrollX,
      top: rect.top + window.scrollY
    };
}

const fireX = getOffset(fp).left + 100;
const fireY = getOffset(fp).top + 100;

//getX and getY get the letter's coordinates in the page and return the difference between its coordinates and the fire's coordinates
function getX(letter) {
    let letterX = getOffset(letter).left;
    return fireX-letterX;
}

function getY(letter) {
    let letterY = getOffset(letter).top;
    return fireY-letterY;
}

$(document).on( "click", '.fireplace', function() {
    //fireContainer.style.zIndex = 1;
    //make new stylesheet to contain all translation rules
    var element = document.createElement('style'),
	move_sheet;

    // Append style element to head
    document.head.appendChild(element);

    // Reference to the stylesheet
    move_sheet = element.sheet;

    //grow the fire
    let growFire = ".fireplace {transition: all 2s; transform: scale(2.5) translate(0px,-100px);}";
    move_sheet.insertRule(growFire, 0);
    //move letters to the fire
    moveLetters(move_sheet);

    //create shake animation for container and the fire
    let setShakeAnim = "";
    let createShakeAnim = "";

    setShakeAnim = ".container, .fire {";
    setShakeAnim += "animation: 0.1s shake linear infinite; animation-play-state: running;}";
    createShakeAnim = "@keyframes shake {";
    createShakeAnim += "0% {transform: translateX(10px);}";
    createShakeAnim += "50% {transform: translateX(-20px);}";
    createShakeAnim += "100% {transform: translateX(20px);}}";

    //add to new css sheet after letters have moved to the fire
    setTimeout(() => { 
        move_sheet.insertRule(setShakeAnim, 27);
        move_sheet.insertRule(createShakeAnim, 28);
     }, 1400);

    //setup aesthetics for next animation
    $('.fireplace').addClass('explode');
    setFireAnimation("running");
} )

function moveLetters(move_sheet) {
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

    //stop the fire from shaking because it is releasing the letters
    fireContainer[0].style.animationPlayState = "paused";

    var new_class = "";
    //for all pieces, thins, and branches, add new boom class + transform rules to new stylesheet
    for(let i = 0; i < 252; i++) {
        new_class = "boom" + i;
        if (i < 190) { //190 pieces
            boom_sheet.insertRule("." + new_class + explodeStyle(pieces[i]), i);
        
            pieces[i].classList.add(new_class);
        } else if (i >= 190 && i < 220) { //30 thins
            boom_sheet.insertRule("." + new_class + explodeStyle(thins[i-190]), i);
            
            thins[i-190].classList.add(new_class);
        } else { //32 branches
            boom_sheet.insertRule("." + new_class + explodeStyle(branches[i-220]), i);
            
            branches[i-220].classList.add(new_class);
        }
        
    }

    //end of explosion, reload the page to reset
    setTimeout(() => { location.reload(); }, 3000);
} )

//setup explosion css with random values
function explodeStyle(elem) {
    var new_style = "";
    let rand_x = getRand(-1000, 1000);
    let delay = getRand(0,1);

    return "{transition-delay: " + delay + "s;" + "transform: translate(" + rand_x + "px,-1000px) rotate(720deg);}";
}

//helper to explodeStyle
//pulled from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
function getRand(min, max) {
    return Math.random() * (max - min) + min;
}

// ~~~~~~~~~~~~~~~~~~~~~~~
// individual pieces burning animation code
// ~~~~~~~~~~~~~~~~~~~~~~~

$(document).on( "mouseover", '.piece, .thin, .branch', function() {
    $(this).addClass('burn');
} )

/*<div class="piece">
          <div class="burn">
            <div class="flame"></div>
            <div class="flame"></div>
            <div class="flame"></div>
            <div class="flame"></div>
            <div class="flame"></div>
            <div class="flame"></div>
            <div class="flame"></div>
            <div class="flame"></div>
            <div class="flame"></div>
            <div class="flame"></div>
          </div>
        </div>*/