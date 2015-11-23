var express                 = require('express');
var app                     = express();
var server                  = require('http').Server(app);
var io                      = require('socket.io')(server);

// Routes
var sensorRoutes            = require('./routes/sensorRoutes');

server.listen(80);

// Middleware
app.use(express.static('public'));
app.use("/api/v1/sensor",sensorRoutes);

app.get('/', function (req, res) {
    res.sendfile(__dirname+'/public/index.html');
});

