GLOBAL.logToConsole = true;
GLOBAL.dev = true;
GLOBAL.port = 3221;

var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var bodyParser = require('body-parser')
var autoDiscover = require('./modules/autoDiscover');
var testRoutes = require('./routes/testRoutes');
var deviceRoutes = require('./routes/deviceRoutes');

server.listen(GLOBAL.port);
autoDiscover.init(server, io);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

if(GLOBAL.dev) {
    app.use('/test', testRoutes);
}

// Middleware
app.use(express.static('public'));
app.use("/api/v1/devices", deviceRoutes);

app.get('/', function (req, res) {
    res.sendfile(__dirname+'/public/index.html');
});
