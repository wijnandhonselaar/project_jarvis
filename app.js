var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var udpListener = require('./classes/udpListener');
server.listen(80);

app.use(express.static('public'));
app.get('/', function (req, res) {
    res.sendfile(__dirname+'/public/index.html');
});
