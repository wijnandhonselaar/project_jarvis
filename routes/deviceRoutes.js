module.exports = (function() {
    var deviceManager = require('../modules/deviceManager');
    var express= require('express');
    var comm = require('../modules/interperter/comm.js');
    var route = express.Router();
    var logger = require('../modules/logManager');

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

    route.get('/:devicetype/:id/commands/:command', function(request, resp){
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

    route.post('/actuators/:id/rules', function(req,res){
        var object = {
            id:parseInt(req.params.id),
            rules:req.body.rules
        };
        res.json(deviceManager.setRules(object))
    });

    /**
     * START LOG ROUTES
     */
    // example: http://localhost:3221/devices/logs?severity=5&offset=20&limit=20
    route.get('/logs', function(req, res) {
        logger.getAllEvents(parseInt(req.query.severity), parseInt(req.query.offset), parseInt(req.query.limit), function(err, result) {
            res.send(JSON.stringify(result));
         });
    });

    route.get('/:devicetype/:id/eventlogs', function(req, res) {
        logger.getEvents(parseInt(req.params.id), function(err, result) {
            res.send(JSON.stringify(result));
        });
    });

    route.get('/sensors/:id/datalogs', function(req, res) {
        logger.getData(parseInt(req.params.id), function(err, result) {
            res.send(JSON.stringify(result));
        });
    });
    /**
     * END LOG SHIZZLE ROUTES
     */

    route.post('/:devicetype/:id/commands/:command', function(request, resp){
        var device = deviceManager.getActuator(parseInt(request.params.id));
        comm.post(request.params.command , device,  request.body, function(response){
            deviceManager.updateActuatorState(device.id, response);
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