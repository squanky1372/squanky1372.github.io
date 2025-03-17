function scrabble(terminal, validationString){
    var word_length = validationString.length
    var words = fetch(`./data/${word_length}-letter-words.json`)
        .then(response => response.json())
        .then(text => { 
            var wordlist = []
            text.forEach(word_i => {wordlist.push(word_i.word)})
            console.log(wordlist)
            var validWords = []
            wordlist.forEach((word, i) => {
                var isValid = true;
                Array.from(validationString).forEach((letter,i) => {if(letter != "*" && !letter.includes(word[i]))isValid =  false;})
                if(isValid) validWords.push(word)
            })
            terminal.echo(validWords)
            return wordlist; 
        })
}

function whitelist(terminal, letters){
    for(var i = 2; i < 16; i++){
        var words = fetch(`./data/${i}-letter-words.json`)
        .then(response => response.json())
        .then(text => { 
            var wordlist = []
            text.forEach(word_i => {wordlist.push(word_i.word)})
            console.log(wordlist)
            var validWords = []
            wordlist.forEach((word, i) => {
                var isValid = true;
                Array.from(word).forEach((letter,i) => {if(!letters.includes(letter))isValid =  false;})
                if(isValid) validWords.push(word)
            })
            if(validWords.length > 0){
                terminal.echo("" + validWords[0].length + ":" + validWords)
                terminal.echo()

            }
            // return wordlist; 
        })
    }
}

export{scrabble, whitelist}