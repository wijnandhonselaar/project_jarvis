process.env.TZ = 'Europe/Amsterdam';
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
var scenarioManager = require('./modules/scenarioManager');
var logManager = require('./modules/logManager');
var testRoutes = require('./routes/testRoutes');
var deviceRoutes = require('./routes/deviceRoutes');
var settingRoutes = require('./routes/settingRoutes');
var scenarioRoutes = require('./routes/scenarioRoutes');
var ruleEngine = require('./modules/ruleEngine');
var conflictManager = require('./modules/conflictManager');
var commandValidator = require('./modules/interperter/validator');

server.listen(GLOBAL.port);

scenarioManager.init(io, conflictManager, deviceManager);
conflictManager.init(io, null, deviceManager);
autoDiscover.init(server, io);
logManager.init(io);
deviceManager.init(io, ruleEngine, commandValidator);
ruleEngine.init(deviceManager, scenarioManager);

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
app.use("/settings", settingRoutes);
//app.use("/alerts", alertRoutes);

app.get('/', function (req, res) {
    res.sendfile(__dirname+'/public/index.html');
});

app.get('/testRule', function(req,res){
    ruleEngine.apply(deviceManager.getActuator(0));
    res.send('');
});
