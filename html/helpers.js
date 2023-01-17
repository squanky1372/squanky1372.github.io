//checks if the mouse is within the bounds of a rectangle.  
//If you're drawing a rectangle using rect(x,y,w,h), those parameters map to these.
//If you've tranlated the canvas before drawing them, add the translateX/Y parameters
//If you've scaled the canvas, and scaleX/Y. If you scaled by one parameter, only set scaleX.
function mouseInsideRect(x, y, w, h, translateX = 0, translateY = 0, scaleX = 0, scaleY = scaleX){
    x = (x*scaleX + translateX)
    y = (y*scaleY + translateY)
    w = w * scaleX
    h = h * scaleY
    return (mouseX > x && mouseX < x+w && mouseY > y && mouseY < x+h)
}

// function windowResized() {
//     resizeCanvas(windowWidth, windowHeight);
// }
// function mouseClicked() {
//     console.log(mouseX, mouseY)
// }