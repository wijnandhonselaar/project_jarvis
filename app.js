GLOBAL.logToConsole = true;
GLOBAL.port = 3221;

var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var bodyParser = require('body-parser')
var autoDiscover = require('./classes/autoDiscover');
var validator = require('./classes/interperter/validator');
var sok = require('./models/SOK');

server.listen(GLOBAL.port);
autoDiscover.init(server, io);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.post('/koffiezetapparaat/stringtest', function(req, res){
    validator.validate('stringtest', sok, req.body, function(interperterResponse){
        res.json(interperterResponse)
    });
});

app.use(express.static('public'));
app.get('/', function (req, res) {
    res.sendfile(__dirname+'/public/index.html');
});

app.get('/devices',function(req,res){
    res.json(autoDiscover.getDevices());
});

