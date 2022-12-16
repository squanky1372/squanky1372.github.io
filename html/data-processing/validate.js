var gtext = fetch('../data/valid-wordle-words.txt')
    .then(response => response.text())
    .then(text => { return text.split("\n"); })

var wordset = function(validation){
    this.validate = function(word){
        if(this.validation(word)) this.valid.push(word)
    }
    this.validation = validation;
    //function(word){for(var i = 0; i<4; i++){ if(word[i] >= word[i+1]) return false } return true}
    this.valid = []
}
var letterCount = function(validationarray, text){
    total = 0;
    text.forEach(word => {
        validationarray.forEach((el, i) => {
            el.validate(word);
        })
    });
}