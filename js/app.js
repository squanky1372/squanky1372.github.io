const http = require("http")
const fs = require('fs')
const outport = 3000
const SerialPort = require("serialport")

var index = fs.readFileSync("index.html")

const parsers = SerialPort.parsers;
const parser = new parsers.Readline({
    delimiter: '\r\n'
});

var port = new SerialPort('COM15', {
    baudRate: 9600, 
    dataBits: 8,
    parity: 'none',
    stopBits: 1,
    flowControl: false
})

port.pipe(parser);

var app = http.createServer(function(req, res){
    res.writeHead(200, {'Content-Type': 'text/html'})
    res.end(index);
})

var io = require("socket.io").listen(app);
io.on("connection", function(data){
    console.log('client is listening')
})

parser.on('data', function(data){
    console.log(data);
    io.emit('data', data);
})

app.listen(3000);