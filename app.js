GLOBAL.logToConsole = true;
GLOBAL.port = 3221;

var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var autoDiscover = require('./classes/autodiscover');
var sensorRoutes = require('./routes/sensorRoutes');

server.listen(GLOBAL.port);
autoDiscover.init(server, io);

// Middleware
app.use(express.static('public'));
app.use("/api/v1/sensor",sensorRoutes);

app.get('/', function (req, res) {
    res.sendfile(__dirname+'/public/index.html');
});

app.get('/devices',function(req,res){
    res.json(autoDiscover.getDevices());
});

