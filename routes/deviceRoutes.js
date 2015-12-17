"use strict";
module.exports = (function() {
    var deviceManager = require('../modules/deviceManager');
    var express = require('express');
    var comm = require('../modules/interperter/comm.js');
    var route = express.Router();
    var logger = require('../modules/logManager');
    var conflictManager = require('../modules/conflictManager');

    route.get('/', function (req, res) {
        console.log(deviceManager.getAll());
        res.send({devices: deviceManager.getAll()});
    });

    route.get('/actuators', function (req, res) {
        res.send({actuators: deviceManager.getActuators()});
    });

    route.get('/sensors', function (req, res) {
        res.send({sensors: deviceManager.getSensors()});
    });

    route.get('/:devicetype/:id/commands/:command', function (req, res) {
        var devicetype = req.params.devicetype;
        var device = '';
        if (devicetype === 'actuator') {
            device = deviceManager.getActuator(parseInt(req.params.id));
        }
        if (devicetype === 'sensor') {
            device = deviceManager.getSensor(parseInt(req.params.id));
        }

        var response = comm.get(req.params.command, device, function () {
            res.send(JSON.stringify(response));
        });
    });
    route.post('/actuators/:id/rules', function (req, res) {
        var object = {
            id: parseInt(req.params.id),
            rules: req.body.rules
        };
        res.json(deviceManager.setRules(object));
    });

    route.get('/actuators/:id', function (req, res) {
        res.json(deviceManager.getActuator(parseInt(req.params.id)));
    });

    /**
     * START LOG ROUTES
     */
    // example: http://localhost:3221/devices/logs?severity=5&offset=20&limit=20
    route.get('/logs', function(req, res) {
        logger.getAllEvents(parseInt(req.query.offset), parseInt(req.query.limit), function(err, result) {
            res.send(JSON.stringify(result));
        });
    });

    route.get('/:devicetype/:id/eventlogs', function (req, res) {
        logger.getEvents(parseInt(req.params.id), function (err, result) {
            res.send(JSON.stringify(result));
        });
    });

    route.get('/sensors/:id/datalogs', function (req, res) {
        logger.getData(parseInt(req.params.id), function (err, result) {
            res.send(JSON.stringify(result));
        });
    });
    /**
     * END LOG SHIZZLE ROUTES
     */

    route.post('/:devicetype/:id/commands/:command', function (req, res) {
        var device = deviceManager.getActuator(parseInt(req.params.id));
        comm.post(req.params.command, device, req.body, function (response) {
            deviceManager.updateActuatorState(device.id, response);
            res.send(JSON.stringify(response));
        });
    });

    route.put('/:devicetype/:id/alias', function (req, res) {
        deviceManager.updateDeviceAlias(req.params.devicetype, parseInt(req.params.id), req.body.alias, function (response) {
            res.send(JSON.stringify(response));
        });
    });

    route.put('/sensors/:id/interval', function (req, res) {
        deviceManager.updateSensorInterval(parseInt(req.params.id), parseInt(req.body.interval), function (response) {
            res.send(JSON.stringify(response));
        });
    });


    route.post('/:devicetype/:id/resolveconflict', function (req, res) {
        if (req.body)
            conflictManager.resolve(req.body, function (r) {
                res.send(r);
            });
    });

    /**
     * Update an actuator
     */
    route.put('/actuators/:id', function (req, res) {
        deviceManager.updateActuator(req.params.id, req.body.actuator, function (response) {
            res.send(JSON.stringify(response));
        });
    });

    return route;

})();