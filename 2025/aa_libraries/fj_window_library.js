function windowResized() {
    // Recalculate size when the window is resized
    let size = min(windowWidth, windowHeight) * 0.95;
    resizeCanvas(size, size);
    centerCanvas();
}

function centerCanvas() {
    // Center the canvas using CSS
    let x = (windowWidth - width) / 2;
    let y = (windowHeight - height) / 2;
    canvas.position(x, y);
}

function scaleContent(){
    scale(min(windowWidth, windowHeight) * 0.95 / 600)
}

function disableCanvasDefaults() {
    // Prevent selection and zooming via CSS
    canvas.style('touch-action', 'none'); // Disable default touch actions

    // Prevent default behaviors for double-tap and long-press
    canvas.elt.addEventListener('touchstart', (e) => e.preventDefault(), { passive: false });
    canvas.elt.addEventListener('touchmove', (e) => e.preventDefault(), { passive: false });
    canvas.elt.addEventListener('touchend', (e) => e.preventDefault(), { passive: false });
}