module.exports = (function() {
    var deviceManager = require('../modules/deviceManager');
    var express= require('express');
    var comm = require('../modules/interperter/comm.js');
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

    route.get('/:devicetype/:id/:command', function(request, resp){
        var device = deviceManager.getActuator(request.params.id);
        response = comm.get(request.params.command,device, function(){
            resp.send(JSON.stringify(response))
        })
    });

    route.post('/:devicetype/:id/:command', function(request,resp){
        var device = deviceManager.getActuator(request.params.id);
        response = comm.post(request.params.command , device,command.parameters, function(){
            resp.send(JSON.stringify(response));
        });
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