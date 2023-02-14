// ~~~~~~~~~~~~~~~~~~~~~~~
// fire spreading code
// ~~~~~~~~~~~~~~~~~~~~~~~

$(document).on( "click", '#incendo-grid .letter' , function() {
    var children = $(this).children().children();
    console.log(children);

    for(let i = 0; i < children.length; i++) {
        children[i].classList.add('burn');
        //if it has the branch class, then invert it halfway through the animation to turn the box shadow blue
        if(children[i].classList.contains("branch")) {
            setTimeout(() => { children[i].style.filter = "invert(1)"; }, 2500);
        }
    }
})