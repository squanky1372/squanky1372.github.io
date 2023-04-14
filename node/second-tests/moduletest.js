var printtest = function a(){
    console.log("this is the module")
};

var mini = function(){
    fetch('../	data/simple-words.txt')
        .then(response => response.text())
        .then(text => letterCount(text.split("\r\n")))
    var letters = Array(26).fill(0)
    var letters2 = Array(26).fill(0)
    
    console.log(letters)
    var letterCount = function(text){
        for(var i = 0; i < 26; i++){ 
            letters[i] = [] 
            letters2[i] = Array(26).fill(0)
            for(var j = 0; j < 26; j++){ 
                letters2[i][j] = [];
            }
        }
        console.log(letters2)
        console.log(text)
        text.forEach(element => {
            letters[element.charCodeAt(0)-97].push(element);
            (letters2[element[0].charCodeAt(0)-97][element[1].charCodeAt(0)-97]).push(element)
        });
        console.log(letters)
        console.log(letters2)
        criss_cross(text)

        console.log(letters2[0][6])
        console.log(letters2[0][6].filter(input => checkLetter(input, "hello", 2)))
        letters2[0][6].filter(input => checkLetter(input, "hello", 2)).forEach(word => {
            console.log(word)
        })
    }
    var checkLetter = function(firstWord, secondWord, position){
        return firstWord[position] == secondWord[position]
    }
    var valid = []
    var criss_cross = function(text){
        // return;
        text.forEach(A => {
        letters[  A[0].charCodeAt(0)-97].forEach(One => {
        letters[One[1].charCodeAt(0)-97].forEach(B => {
            console.log(`A: ${A} One: ${One} B: ${B}`);
            console.log(valid);
        letters2[  A[1].charCodeAt(0)-97][  B[1].charCodeAt(0)-97].forEach(Two => {
        letters2[One[2].charCodeAt(0)-97][Two[2].charCodeAt(0)-97].forEach(C => {

        letters2[  A[2].charCodeAt(0)-97][  B[2].charCodeAt(0)-97].filter(word  => {checkLetter(word ,     C, 2)}).forEach(Three => {
        letters2[One[3].charCodeAt(0)-97][Two[3].charCodeAt(0)-97].filter(word2 => {checkLetter(word2, Three, 3)}).forEach(D => {

        letters2[  A[3].charCodeAt(0)-97][  B[3].charCodeAt(0)-97].filter(word3 => {checkLetter(word3,     C, 3)}).filter(word4 => {checkLetter(word4,     D, 3)}).forEach(Four => {
        letters2[One[4].charCodeAt(0)-97][Two[4].charCodeAt(0)-97].filter(word5 => {checkLetter(word5, Three, 4)}).filter(word6 => {checkLetter(word6, Four, 4)}).forEach(E => {
            valid.push([A,B,C,D,E,One,Two,Three,Four])
            console.log([A,B,C,D,E,One,Two,Three,Four])
        })})})})})})})})})
    }
}

module.exports.printtest = printtest;
module.exports.mini = mini;