var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static('public'));

io.on('connection', (socket) => {
    console.log('user connected');

    socket.on('offer', (data) => {
        socket.broadcast.emit('offer', data);
    });

    socket.on('initiate', () => {
        io.emit('initiate');
    });
})

http.listen(80, () => console.log('Example app listening on port 80!'))