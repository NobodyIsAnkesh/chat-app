var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
users = [];
connections = [];

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {

    socket.on('new user', function (data, callback) {
        callback(true);
        socket.username = data;
        connections.push(socket);
        users.push(socket.username);
        console.log("User Connected = " + socket.username + ", Total Connected = " + connections.length);
        io.emit('get users', users);
    });

    socket.on('chat message', function (data) {
        io.emit('new message', { msg: data, user: socket.username });
    });

    socket.on('disconnect', () => {
        connections.splice(connections.indexOf(socket), 1);
        users.splice(users.indexOf(socket.username), 1);
        console.log("User Disconnected, Remaining = " + connections.length);
        io.emit('get users', users);
    });
});

// app.listen(3000, () => {
//     console.log("Server started at 3000");
// })

http.listen(3000, () => {
    console.log("Server started at 3000");
})