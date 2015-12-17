/* jshint ignore:start */
var express = require("express");
var app = express();
var server = require('http').Server(app);
var bodyParser = require('body-parser');

var device = require("./device");
var config = require("./config");
var broadcast = require("./broadcast");
var deviceRoutes = require('./deviceRoutes');


server.listen(config.PORT);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use("/", deviceRoutes);


device.init();

/* jshint ignore:end */