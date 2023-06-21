const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

var positions = []

io.on('connection', (socket) => {
    console.log(socket.id);
    console.log('a user connected');
    positions.push({id: socket.id, x: 0, y: 0, color: "#000000"})

    io.emit('positions', positions)
    socket.on('disconnect', () => {
        console.log(socket.id);
        console.log(positions)
        positions = positions.filter(position => position.id.localeCompare(socket.id) != 0);
        console.log(positions)
        console.log('user disconnected');
        io.emit('positions', positions)
    });
    socket.on('chat message', (msg) => {
        console.log('message: ' + msg);
    });
    socket.on('moved', (msg) => {
        positions.forEach(position => {
            if(position.id.localeCompare(socket.id) == 0){
                position.x = msg.x
                position.y = msg.y
            }
        })
        io.emit('positions', positions)
    })
    socket.on('configured', (msg) =>{
        positions.forEach(position => {
            if(position.id.localeCompare(socket.id) == 0){
                position.name = msg.name
                position.color = msg.color
            }
        })
        io.emit('positions', positions)
    })
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});