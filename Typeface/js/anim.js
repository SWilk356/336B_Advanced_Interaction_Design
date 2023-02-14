// ~~~~~~~~~~~~~~~~~~~~~~~
// bonfire animation code
// ~~~~~~~~~~~~~~~~~~~~~~~

var bonfire = document.getElementsByClassName("fireplace");
var sparks = bonfire[0].getElementsByTagName("main");

var littleFire = document.getElementsByClassName("fireplace__flame");
var bigFire = document.getElementsByClassName("fireplace__flame_big");

//set fire animation to play/pause
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
        move_sheet.insertRule(setShakeAnim, letters.length+1);
        move_sheet.insertRule(createShakeAnim, letters.length+2);
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
    for(let i = 0; i < letters.length; i++) {
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

var allComponents = $('.letter').children().children();


$(document).on( "click", '.explode', function() {
    var element = document.createElement('style'),
	big_boom_sheet;

    // Append style element to head
    document.head.appendChild(element);

    // Reference to the stylesheet
    big_boom_sheet = element.sheet;

    //stop the fire from shaking because it is releasing the letters
    fireContainer[0].style.animationPlayState = "paused";

    explodeAnim(big_boom_sheet, "boom", allComponents);

    // var new_class = "";
    // var numTotalComponents = pieces.length + thins.length + branches.length;
    // //for all pieces, thins, and branches, add new boom class + transform rules to new stylesheet
    // for(let i = 0; i < numTotalComponents; i++) {
    //     new_class = "boom" + i;
    //     if (i < pieces.length) { //190 pieces
    //         boom_sheet.insertRule("." + new_class + explodeStyle(pieces[i]), i);
        
    //         pieces[i].classList.add(new_class);
    //     } else if (i >= pieces.length && i < pieces.length + thins.length) { //30 thins
    //         boom_sheet.insertRule("." + new_class + explodeStyle(thins[i-190]), i);
            
    //         thins[i-pieces.length].classList.add(new_class);
    //     } else { //32 branches
    //         boom_sheet.insertRule("." + new_class + explodeStyle(branches[i-220]), i);
            
    //         branches[i-(pieces.length + thins.length)].classList.add(new_class);
    //     }
        
    // }

    //end of explosion, reload the page to reset
    setTimeout(() => { location.reload(); }, 3000);
} )

function explodeAnim(sheet, cname, obj) {
    var new_class = "";
    console.log(obj);
    //for all pieces, thins, and branches, add new boom class + transform rules to new stylesheet
    for(let i = 0; i < obj.length; i++) {
        new_class = cname + i;
        sheet.insertRule("." + new_class + explodeStyle(), i);
        
        obj[i].classList.add(new_class);
    }
}

//setup explosion css with random values
function explodeStyle() {
    let rand_x = getRand(-1000, 1000);
    let delay = getRand(0,1);
    let scale = getRand(1,5);

    return "{transition-delay: " + delay + "s;" + "transform: translate(" + rand_x + "px,-1000px) rotate(720deg) scale(" + scale + ");}";
}

//helper to explodeStyle
//pulled from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
function getRand(min, max) {
    return Math.random() * (max - min) + min;
}

// ~~~~~~~~~~~~~~~~~~~~~~~
// individual pieces burning animation code
// ~~~~~~~~~~~~~~~~~~~~~~~

$(document).on( "mouseover", '#full-grid .piece, #full-grid .thin, #full-grid .branch' , function() {
    var c = $(this).attr("class");
    
    $(this).addClass('burn');

    //if it has the branch class, then invert it halfway through the animation to turn the box shadow blue
    if(c[0] == 'b') {
        setTimeout(() => { $(this).css("filter", "invert(1)"); }, 2500);
    }
})

// ~~~~~~~~~~~~~~~~~~~~~~~
// drag drop code
// ~~~~~~~~~~~~~~~~~~~~~~~

var elm = document.createElement('style'),
indiv_boom_sheet;

// Append style element to head
document.head.appendChild(elm);

// Reference to the stylesheet
indiv_boom_sheet = elm.sheet;

function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    var el = document.getElementById(data);
    var children = $("#" + data).children().children();
    explodeAnim(indiv_boom_sheet, "indiv-boom", children);
    indiv_boom_sheet.insertRule("#" + data, "{top: " + getY(el) + "; left: " + getX(el) + ";}", children.length);
    //maybe instead of appending child just move it by the distance without the transition
    console.log(indiv_boom_sheet);
    //ev.target.appendChild(document.getElementById(data));
}