var word_grid = [[" "," "," "," "," "],[" "," "," "," "," "],[" "," "," "," "," "],[" "," "," "," "," "],[" "," "," "," "," "]]

var mini = function(){
    var letters = Array(26).fill(0)
    var letters2 = Array(26).fill(0)

    var letterCount = function(text){
        for(var i = 0; i < 26; i++){ 
            letters[i] = [] 
            letters2[i] = Array(26).fill(0)
            for(var j = 0; j < 26; j++){  letters2[i][j] = [];}
        }
        text.forEach(element => {
            letters[element.charCodeAt(0)-97].push(element);
            (letters2[element[0].charCodeAt(0)-97][element[1].charCodeAt(0)-97]).push(element)
        });
        return criss_cross(text)

    }
    var checkLetter = function(firstWord, firstposition, secondWord, secondposition){
        return firstWord[firstposition] == secondWord[secondposition]
    }
    var valid = []
    var valid_count = 0;

    var check_in_grid = function(word, pos){
        for(var i = 0; i < 5; i++){
            if(pos < 5 && !(word_grid[pos][i] == " " || word_grid[pos][i] == word[i])){ return false}
            else if(pos > 5 && !(word_grid[i][pos-5] == " " || word_grid[i][pos-5] == word[i])){return false}
        } return true
    }

    var place_in_grid = function(word, pos){
        for(var i = 0; i < 5; i++){
            if(pos < 5){ word_grid[pos][i] = word[i] }
            else{ word_grid[i][pos-5] = word[i] }
        }
    }

    var criss_cross = function(text){
        // return;
        var startTime = Date.now();
        console.log(text)
        text.filter(word_a => check_in_grid(word_a, 0)).forEach(A => {
            console.log(valid)
            letters[  A[0].charCodeAt(0)-97].filter(word_one => check_in_grid(word_one, 5)).forEach(One => {
                
                var dt = Math.floor((Date.now() - startTime) / 1000);
                var format_dt = [Math.floor(dt/3600), Math.floor((dt/60) % 60), dt%60]
                console.log(`${valid_count} Time: ${format_dt} A: ${A} One: ${One}`);
                //console.log(valid);

                if(A != One) letters[One[1].charCodeAt(0)-97].filter(word_b => check_in_grid(word_b, 1)).forEach(B => {
                    
                letters2[  A[1].charCodeAt(0)-97][  B[1].charCodeAt(0)-97].filter(word_two => check_in_grid(word_two, 6)).forEach(Two => {
                if(B != Two) letters2[One[2].charCodeAt(0)-97][Two[2].charCodeAt(0)-97].filter(word_c => check_in_grid(word_c, 2)).forEach(C => {

                    letters2[  A[2].charCodeAt(0)-97][  B[2].charCodeAt(0)-97].filter(word  => checkLetter(word , 2,  C, 2)).filter(word_three => check_in_grid(word_three, 7)).forEach(Three => {
                    if(C != Three) letters2[One[3].charCodeAt(0)-97][Two[3].charCodeAt(0)-97].filter(word2 => checkLetter(word2, 2, Three, 3)).filter(word_d => check_in_grid(word_d, 3)).forEach(D => {

                        letters2[  A[3].charCodeAt(0)-97][  B[3].charCodeAt(0)-97].filter(word3 => checkLetter(word3, 2, C, 3)).filter(word4 => checkLetter(word4, 3,   D, 3)).filter(word_four => check_in_grid(word_four, 8)).forEach(Four => {
                        if(D != Four) letters2[One[4].charCodeAt(0)-97][Two[4].charCodeAt(0)-97].filter(word5 => checkLetter(word5, 2, Three, 4)).filter(word6 => checkLetter(word6, 3, Four, 4)).filter(word_e => check_in_grid(word_e, 4)).forEach(E => {
                        
                            letters2[A[4].charCodeAt(0)-97][B[4].charCodeAt(0)-97].filter(word5 => checkLetter(word5, 2, C, 4)).filter(word6 => checkLetter(word6, 3, D, 4)).filter(word6 => checkLetter(word6, 4, E, 4)).filter(word_five => check_in_grid(word_five, 9)).forEach(Five => {
                                valid.push([A,B,C,D,E,One,Two,Three,Four,Five])
                                valid_count++;
        })})})})})})})})})})

        return valid
        
    }

    var gtext = fetch('../data/simple-words.txt')
            .then(response => response.text())
            .then(text => { 
                letterCount(text.split("\r\n"))
                criss_cross(text.split("\r  \n")); 
                document.getElementById("outputbox").innerHTML = valid.join(" ")
            })

    console.log(word_grid)
    //place_in_grid("aloes", 0)
    //place_in_grid("andes", 5)
    // place_in_grid("aloes", 0)
    // console.log(word_grid)
    //text = text.split(",")
}