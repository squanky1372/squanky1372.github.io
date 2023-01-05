function atmega(color){
    this.id = 0;
    this.color = color;

    this.setID = function(id){
        this.id = id;
    }
    this.drawAt = function(x,y){
        push()
        translate(x,y)
        noFill()
        rect(0,0,25,25)
        textSize(20)
        fill(0,100,150)
        text(this.id,5,20)
        pop()
    }
}

function esp32(){
    this.id = 1;
}