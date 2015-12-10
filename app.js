GLOBAL.logToConsole = false;
GLOBAL.dev = true;
GLOBAL.port = 3221;

var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var deviceManager = require('./modules/deviceManager');
var bodyParser = require('body-parser');
var autoDiscover = require('./modules/autodiscover');
var logManager = require('./modules/logManager');
var testRoutes = require('./routes/testRoutes');
var deviceRoutes = require('./routes/deviceRoutes');
var alertRoutes = require('./routes/alertRoutes');
var scenarioRoutes = require('./routes/scenarioRoutes');
var ruleEngine = require('./modules/ruleEngine');

server.listen(GLOBAL.port);

autoDiscover.init(server, io);
logManager.init(io);
deviceManager.init(io, ruleEngine);
ruleEngine.init(deviceManager);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

if(GLOBAL.dev) {
    app.use('/test', testRoutes);
}

// Middleware
app.use(express.static('public'));
app.use("/devices", deviceRoutes);
app.use("/scenario", scenarioRoutes);
//app.use("/alerts", alertRoutes);

app.get('/', function (req, res) {
    res.sendfile(__dirname+'/public/index.html');
});


app.get('/testRule', function(req,res){
    ruleEngine.apply(deviceManager.getActuator(0));
    res.send('');
});
