var fire = document.getElementsByClassName("fireplace");
var sparks = fire[0].getElementsByTagName("main");

var littleFire = document.getElementsByClassName("fireplace__flame");
var bigFire = document.getElementsByClassName("fireplace__flame_big");

$(document).on( "mousedown", '.fireplace', function() {
    //set fire animation to running
    setFireAnimation(0);
} )

$(document).on( "mouseup", '.fireplace', function() {
    //set fire animation to pause
    setFireAnimation(1);

} )

function setFireAnimation(pause) {
    if(pause) {
        littleFire[0].style.animationPlayState = "paused";
        bigFire[0].style.animationPlayState = "paused";
    
        sparks[0].style.animationPlayState = "paused";
        sparks[1].style.animationPlayState = "paused";
        sparks[2].style.animationPlayState = "paused";
        sparks[3].style.animationPlayState = "paused";
    } else {
        littleFire[0].style.animationPlayState = "running";
        bigFire[0].style.animationPlayState = "running";
    
        sparks[0].style.animationPlayState = "running";
        sparks[1].style.animationPlayState = "running";
        sparks[2].style.animationPlayState = "running";
        sparks[3].style.animationPlayState = "running";
    }
}