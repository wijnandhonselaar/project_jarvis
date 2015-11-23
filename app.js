GLOBAL.logToConsole = true;
GLOBAL.port = 3221;

var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var autoDiscover = require('./classes/autoDiscover');

var interperter = require('./classes/interperter');
var sok = require('./models/SOK');

server.listen(GLOBAL.port);
autoDiscover.init(server, io);

interperter.post('stringtest', sok , {naam:'hallo'} , function(res){

});

app.use(express.static('public'));
app.get('/', function (req, res) {
    res.sendfile(__dirname+'/public/index.html');
});

app.get('/devices',function(req,res){
    res.json(autoDiscover.getDevices());
});

