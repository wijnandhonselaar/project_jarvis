module.exports = (function() {
    var deviceManager = require('../modules/deviceManager');
    var express= require('express');
    var comm = require('../modules/interperter/comm.js');
    var route = express.Router();
    var logger = require('../modules/logManager');

    route.get('/', function(req, res) {
        console.log(deviceManager.getAll());
        res.send({devices: deviceManager.getAll()});
    });

    route.get('/actuators', function(req, res) {
        res.send({actuators: deviceManager.getActuators()});
    });

    route.get('/sensors', function(req, res) {
        res.send({sensors: deviceManager.getSensors()});
    });

    route.get('/:devicetype/:id/:command', function(req, res){
        var devicetype = req.params.devicetype;
        var device = '';
        if(devicetype === 'actuator'){
            device = deviceManager.getActuator(parseInt(req.params.id));
        }
        if(devicetype === 'sensor'){
            device = deviceManager.getSensor(parseInt(req.params.id));
        }
        response = comm.get(req.params.command,device, function(){
            res.send(JSON.stringify(response))
        });
    });
    route.post('/actuators/:id/rules', function(req,res){
        var object = {
            id:parseInt(req.params.id),
            rules:req.body.rules
        };
        res.json(deviceManager.setRules(object))
    });

    route.get('/actuators/log', function(request, resp) {
        var log = '';
        res.send(JSON.stringify(log));
    });

    route.get('/sensors/log', function(req, res) {
        res.send(JSON.stringify(logger.getSenors()));
    });

    route.get('/:devicetype/:id/log', function(req, res) {
        var log ='';
        res.send(JSON.stringify(log));
    });

    route.post('/:devicetype/:id/:command', function(req, res){
        var device = deviceManager.getActuator(parseInt(req.params.id));
        comm.post(req.params.command , device,  req.body, function(response){
            deviceManager.updateActuatorState(device.id, response);
            res.send(JSON.stringify(response));
        });
    });

    route.put('/:devicetype/:id/alias', function(req,res){
        deviceManager.updateDeviceAlias(req.params.devicetype, parseInt(req.params.id), req.body.alias, function(response){
            console.log("inside callback", response);
           res.send(JSON.stringify(response)); 
        }); 
    });

    route.put('/sensors/:id/interval', function(req,res){
        deviceManager.updateSensorInterval(parseInt(req.params.id), req.body.interval, function(response){
           res.send(JSON.stringify(response)); 
        }); 
    });

    return route;
})();