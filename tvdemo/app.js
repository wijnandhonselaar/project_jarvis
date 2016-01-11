var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

server.listen(1337);

app.use(express.static('frontend'));

app.get('/', function (req, res) {
    res.sendfile(__dirname+'/frontend/index.html');
});