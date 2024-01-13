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

export{scrabble}