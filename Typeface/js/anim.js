// ~~~~~~~~~~~~~~~~~~~~~~~
// move letters to fire and shake animation code
// ~~~~~~~~~~~~~~~~~~~~~~~
var letters = document.getElementsByClassName("letter");

//make letters shake on click of "To Specimen"
$(document).on( "click", '.explode', function() {
    //fireContainer.style.zIndex = 1;
    //make new stylesheet to contain all translation rules
    var element = document.createElement('style'),
	move_sheet;

    // Append style element to head
    document.head.appendChild(element);

    // Reference to the stylesheet
    move_sheet = element.sheet;

    //create shake animation for container and the fire
    let setShakeAnim = "";
    let createShakeAnim = "";

    setShakeAnim = ".letter {";
    setShakeAnim += "animation: 0.1s shake forwards ease-out; animation-iteration-count: 3; animation-play-state: running;}";
    createShakeAnim = "@keyframes shake {";
    createShakeAnim += "0% {transform: translateY(10px);}";
    createShakeAnim += "50% {transform: translateY(-20px);}";
    createShakeAnim += "100% {transform: translateY(20px);}}";


    //add to new css sheet
    move_sheet.insertRule(setShakeAnim, 0);
    move_sheet.insertRule(createShakeAnim, 1);

    setTimeout(() => { 
        document.head.removeChild(element);
    }, 1000);
} )

// ~~~~~~~~~~~~~~~~~~~~~~~
// explosion animation code
// ~~~~~~~~~~~~~~~~~~~~~~~

var big_container = document.getElementById("big-container");

var pieces = document.getElementsByClassName("piece");
var thins = document.getElementsByClassName("thin");
var branches = document.getElementsByClassName("branch");

var incendoComponents = $('#incendo-grid .letter').children().children();
var allComponents = $('#full-grid .letter').children().children();


$(document).on( "click", '.explode', function() {
    var element = document.createElement('style'),
	big_boom_sheet;

    // Append style element to head
    document.head.appendChild(element);

    // Reference to the stylesheet
    big_boom_sheet = element.sheet;

    if(window.scrollY == 0) {

        setTimeout(() => { 
            explodeAnim(big_boom_sheet, "boom", incendoComponents);
            smoothScroll(750);
        }, 500);
        setTimeout(() => { 
            removeBoomClass(incendoComponents);
        }, 3500);
    } else {
        setTimeout(() => { 
            explodeAnim(big_boom_sheet, "boom", allComponents);
            smoothScroll(-750);
        }, 500);
        setTimeout(() => { 
            removeBoomClass(allComponents);
        }, 3500);
    }

} )

function getOffset(el) {
    const rect = el.getBoundingClientRect();
    return {
      left: rect.left + window.scrollX,
      top: rect.top + window.scrollY
    };
  }

function explodeAnim(sheet, cname, obj) {
    var new_class = "";
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
    let up_down = (window.scrollY == 0) ? 5000 : -5000;

    return "{transition-delay: " + delay + "s;" + "transform: translate(" + rand_x + "px," + up_down + "px) rotate(720deg) scale(" + scale + ");}";
}

//helper to explodeStyle
//pulled from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
function getRand(min, max) {
    return Math.random() * (max - min) + min;
}

function smoothScroll(scrollAmount) {
    window.scrollTo({
        top: scrollAmount,
        behavior: 'smooth',
    });
}

function removeBoomClass(components) {
    for(let i = 0; i < components.length; i++) {
        components[i].style.opacity = 0;
        setTimeout(() => { 
            components[i].classList.remove("boom" + i.toString());
        }, 1000);
        setTimeout(() => { 
            components[i].style.opacity = 1;
        }, 3000);
        
    }
}

// ~~~~~~~~~~~~~~~~~~~~~~~
// individual pieces burning animation code
// ~~~~~~~~~~~~~~~~~~~~~~~

$(document).on( "mouseover", '#full-grid .piece, #full-grid .thin, #full-grid .branch' , function() {
    var c = $(this).attr("class");
    
    $(this).addClass('burn');

    //if it has the branch class, then invert it halfway through the animation to turn the box shadow blue
    if(c[0] == 'b') {
        setTimeout(() => { $(this).css("filter", "invert(1)"); }, 1500);
        setTimeout(() => { $(this).css("filter", "invert(0)"); }, 3000);
    }

    setTimeout(() => { $(this).removeClass('burn'); }, 5000);
})

$(document).on( "mouseover", '.piece, .thin, .branch, .burn' , function() {
    $(this).css("border-style", "solid");
    $(this).css("border-color", "white");
})

$(document).on( "mouseout", '.piece, .thin, .branch, .burn' , function() {
    $(this).css("border-color", "black");
})

$(document).on( 'mouseover', '.col-1, .col-2, .col-3', function () {
    $(this).css('border-style', 'solid');
    $(this).css('border-color', 'white');
})

$(document).on( 'mouseout', '.col-1, .col-2, .col-3', function () {
    $(this).css('border-style', 'none');
})