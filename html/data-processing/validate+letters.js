var gtext = fetch('../data/valid-wordle-words.txt')
    .then(response => response.text())
    .then(text => { return text.split("\n"); })

var total = 0;
var letterdata = function(letter=0){
    this.letter = letter
    this.lettercounts = Array(6).fill(0)
    this.percents = Array(6).fill(0)
}
var wordset = function(validation){
    this.validate = function(word){
        if(this.validation(word)) this.valid.push(word)
    }
    this.validation = validation;
    //function(word){for(var i = 0; i<4; i++){ if(word[i] >= word[i+1]) return false } return true}
    this.valid = []
}

var alphabetData = Array(26)
var letterCount = function(validationarray, text){
    for(var a = 0; a < 26; a++) {alphabetData[a] = new letterdata(String.fromCharCode(a+97))}
    total = 0;
    text.forEach(word => {
        for(var i = 0; i<5; i++){
            alphabetData[word[i].charCodeAt(0)-97].lettercounts[i] += 1
            alphabetData[word[i].charCodeAt(0)-97].lettercounts[5] += 1
        }
        total += 1
        validationarray.forEach((el, i) => {
            el.validate(word);
        })
    });
    console.log(alphabetData)
    printdata(alphabetData)
}
var printdata = function(data){
    data.forEach((e,i) => {
        for(var i = 0; i < 5; i++){e.percents[i] = e.lettercounts[i] / total}
        e.percents[5] = e.lettercounts[5] / (total * 5)
        console.log(e.letter, e.lettercounts[0], e.lettercounts[1], e.lettercounts[2], e.lettercounts[3], e.lettercounts[4], e.lettercounts[5] )
    })
}