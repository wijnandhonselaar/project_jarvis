module.exports = (function() {
    var deviceManager = require('../modules/deviceManager');
    var express= require('express');
    var route = express.Router();

    route.get('/', function(request, resp) {
        resp.send({devices: deviceManager.getAll()});
    });

    route.get('/actuators', function(request, resp) {
        resp.send({actuators: deviceManager.getActuators()});
    });

    route.get('/sensors', function(request, resp) {
        resp.send({sensors: deviceManager.getSensors()});
    });

    route.put('/:devicetype/:id/alias', function(request,resp){
        response = deviceManager.updateDeviceAlias(request.params.devicetype, request.params.id, request.body.alias);
        resp.send(JSON.stringify(response));
    });

    route.put('/sensors/:id/interval', function(request,resp){
        response = deviceManager.updateSensorInterval(request.params.id, request.body.interval);
        resp.send(JSON.stringify(response));
    });

    return route;
})();