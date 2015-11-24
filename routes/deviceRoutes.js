module.exports = (function() {
    var deviceManager = require('./deviceManager');
    var express= require('express');

    var route = express.Router();

    route.get('/devices', function(request, resp) {
        resp.send({devices: deviceManager.getAll()});
    });

    route.get('/devices/actuators', function(request, resp) {
        resp.send({actuators: deviceManager.getActuators()});
    });

    route.get('/devices/sensors', function(request, resp) {
        resp.send({sensors: deviceManager.getSensors()});
    });
    //
    //route.get('/devices/:id', function(request, resp) {
    //    resp.send({sensors: deviceManager.getByPk(request.paramter['id'])});
    //});

    return route;
})();