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

function setFireAnimation(state) {
    littleFire[0].style.animationPlayState = state;
    bigFire[0].style.animationPlayState = state;

    sparks[0].style.animationPlayState = state;
    sparks[1].style.animationPlayState = state;
    sparks[2].style.animationPlayState = state;
    sparks[3].style.animationPlayState = state;
}