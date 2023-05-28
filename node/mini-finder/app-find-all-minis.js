const http = require("http")
const fs = require('fs')
var moduletestinstance = require("./find_all_minis.js")
const port = 8889

const server = http.createServer(function(req, res){
    res.writeHead(200, {'Content-Type': 'text/html'})
    fs.readFile('index.html', function(error, data){
        if(error){
            res.writeHead(404)
            res.write('Error: file not found')
        }
        else{
            res.write(data)
        }
        
        res.end()
    })
    console.log("output1")
})

server.listen(port, function(error){
    
    if(error){
        console.log("error")
    }
    else{
        console.log("server is listening on port " + port)
    }
    var solutions = moduletestinstance.mini()
    console.log(solutions)

    solutions.forEach(solution => {
        fs.appendFile('log.txt', `${solution} \r\n`, function (err) {
            if (err) {
                console.log("yikes")
            } else {
                console.log("success")
            }
            })
    })
    
})