module.exports = (function() {
    var deviceManager = require('../modules/deviceManager');
    var express= require('express');
    var comm = require('../modules/interperter/comm.js');
    var route = express.Router();
    var logger = require('../modules/logger');

    route.get('/', function(request, resp) {
        console.log(deviceManager.getAll());
        resp.send({devices: deviceManager.getAll()});
    });

    route.get('/actuators', function(request, resp) {
        resp.send({actuators: deviceManager.getActuators()});
    });

    route.get('/sensors', function(request, resp) {
        resp.send({sensors: deviceManager.getSensors()});
    });

    route.get('/:devicetype/:id/:command', function(request, resp){
        var devicetype = request.params.devicetype;
        var device = '';
        if(devicetype === 'actuator'){
            device = deviceManager.getActuator(parseInt(request.params.id));
        }
        if(devicetype === 'sensor'){
            device = deviceManager.getSensor(parseInt(request.params.id));
        }
        response = comm.get(request.params.command,device, function(){
            resp.send(JSON.stringify(response))
        });
    });

    route.get('/actuators/log', function(request, resp) {
        var log = '';
        resp.send(JSON.stringify(log));
    });

    route.get('/sensors/log', function(request, resp) {
        resp.send(JSON.stringify(logger.getSenors()));
    });

    route.get('/:devicetype/:id/log', function(request, resp) {
        var log ='';
        resp.send(JSON.stringify(log));
    });

    route.post('/:devicetype/:id/:command', function(request, resp){
        var device = deviceManager.getActuator(parseInt(request.params.id));
        comm.post(request.params.command , device,  request.body, function(response){
            resp.send(JSON.stringify(response));
        });
    });

    route.put('/:devicetype/:id/alias', function(request,resp){
        deviceManager.updateDeviceAlias(request.params.devicetype, parseInt(request.params.id), request.body.alias, function(response){
            console.log("inside callback", response);
           resp.send(JSON.stringify(response)); 
        }); 
    });

    route.put('/sensors/:id/interval', function(request,resp){
        deviceManager.updateSensorInterval(parseInt(request.params.id), request.body.interval, function(response){
           resp.send(JSON.stringify(response)); 
        }); 
    });

    return route;
})();