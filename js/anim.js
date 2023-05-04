// ~~~~~~~~~~~~~~~~~~~~~~~
// explosion animation code
// ~~~~~~~~~~~~~~~~~~~~~~~

var incendoComponents = $('#incendo-grid .letter').children().children();
var allComponents = $('#full-grid .letter').children().children();

//when click on arrow, animate pieces and scroll page
$(document).on( "click", '.icon', function() {
    var element = document.createElement('style'),
	big_boom_sheet;

    // Append style element to head
    document.head.appendChild(element);

    // Reference to the stylesheet
    big_boom_sheet = element.sheet;

    //if user is at top of page, then move to the bottom. Make letters explode when you move.
    //delay scroll so user can see explode effect for a second before moving on
    if(window.scrollY < 500) {
        console.log(window.scrollY);
        explodeAnim(big_boom_sheet, "boom", incendoComponents);
        setTimeout(() => { 
            smoothScroll(850);
        }, 500);
    } else {
        //no animation because doing all those letters bugs out the system CHECK IF IT WORKS ON YOUR OTHER LAPTOP
        smoothScroll(0);
        // console.log(window.scrollY);
        // explodeAnim(big_boom_sheet, "boom", allComponents);
        // setTimeout(() => { 
        //     smoothScroll(0);
        // }, 500);
    }
} )

//add explosion animation to each component
function explodeAnim(sheet, cname, obj) {
    var new_class = "";
    //for all pieces, thins, and branches, add new boom class + transform rules to new stylesheet
    for(let i = 0; i < obj.length; i++) {
        new_class = cname + i;
        sheet.insertRule("." + new_class + explodeStyle(), i);
        
        obj[i].classList.add(new_class);
    }
}

//setup explosion css with random values and according to user position on page
function explodeStyle() {
    let rand_x = getRand(-1000, 1000);
    let delay = getRand(0,1);
    let scale = getRand(1,5);
    let up_down = (window.scrollY == 0) ? -5000 : 5000;

    return "{transition-delay: " + delay + "s;" + "transform: translate(" + rand_x + "px," + up_down + "px) rotate(720deg) scale(" + scale + ");}";
}

//helper to explodeStyle
//pulled from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
function getRand(min, max) {
    return Math.random() * (max - min) + min;
}

//scroll smoother than a criminal
function smoothScroll(scrollAmount) {
    window.scrollTo({
        top: scrollAmount,
        behavior: 'smooth',
    });
}

//remove the boom class so that they can explode again later
function removeBoomClass(components) {
    console.log("remove");
    for(let i = 0; i < components.length; i++) {
        components[i].classList.remove("boom" + i.toString());       
    }
}

// ~~~~~~~~~~~~~~~~~~~~~~~
// scroll behavior
// ~~~~~~~~~~~~~~~~~~~~~~~
let top_of_page = true;
document.addEventListener('scroll', function (){
    console.log(window.scrollY);
    if(window.scrollY < 600 && !top_of_page) {
        removeBoomClass(incendoComponents);
        //explodeAnim(big_boom_sheet, "boom", incendoComponents);
    }

    // if(window.scrollY >= 600 && top_of_page){
    //     removeBoomClass(allComponents);
    // }

    if(window.scrollY < 600) {
        top_of_page = true;
    } else {
        top_of_page = false;
    }
}, true);

// ~~~~~~~~~~~~~~~~~~~~~~~
// individual pieces burning animation code
// ~~~~~~~~~~~~~~~~~~~~~~~

$(document).on( "mouseover", '#full-grid .piece, #dense-grid .piece, #full-grid .thin, #dense-grid .thin, #full-grid .branch, #dense-grid .branch' , function() {
    var c = $(this).attr("class");
    
    $(this).addClass('burn');

    //if it has the branch class, then invert it halfway through the animation to turn the box shadow blue
    if(c[0] == 'b') {
        setTimeout(() => { $(this).css("filter", "invert(1)"); }, 1500);
        setTimeout(() => { $(this).css("filter", "invert(0)"); }, 3000);
    }

    setTimeout(() => { $(this).removeClass('burn'); }, 5000);
})

$(document).on( "mouseover", '.piece, .thin, .branch' , function() {
    $(this).css("border-style", "solid");
    $(this).css("border-color", "rgb(255, 255,255)");
})

$(document).on( "mouseout", '.piece, .thin' , function() {
    $(this).css("border-color", "black");
})

$(document).on( "mouseout", '.branch' , function() {
    $(this).css("border-style", "none");
})

// ~~~~~~~~~~~~~~~~~~~~~~~
// arrow animation code
// ~~~~~~~~~~~~~~~~~~~~~~~

const $icon = document.querySelector('.icon');
const $arrow = document.querySelector('.arrow');

$icon.onclick = () => {
  $arrow.animate([
    {bottom: '0'},
    {bottom: '10px'},
    {bottom: '0'}
  ],{
    duration: 700,
    iterations: 3
  });
}