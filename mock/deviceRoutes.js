/* jshint ignore:start */
//send all devices at once
module.exports = (function() {
	var express = require('express');
	var route = express.Router();
	var helper = require('./device')
	var index = 0;
	var config = require("./config")

	route.get('/sok', function (req, res) {
	    if (index == (config.numberOfSensors + config.numberOfActuators)) {

	    }
	    if (index < config.numberOfActuators) {
	        res.send(JSON.stringify(helper.devices.actuators[index]));
	        index++;
	    }
	    else if (index < (config.numberOfSensors + config.numberOfActuators)) {
	        res.send(JSON.stringify(helper.devices.sensors[index - config.numberOfActuators]));
	        index++;
	    }
	});

	route.get('/status', function (req, res) {
	    sensor = helper.getSensorById(req.body.id);
	    
	    status = helper.determineState(sensor);
	    res.send(status);
	});

	route.post('/on', function (req, res) {
	    actuator = helper.getActuatorById(req.body.id);
	    if (req.body.id === 0) {
	        actuator.status = {state: true, intensity: 255}
	    }
	    else {
	        actuator.status = {state: true};
	    }
	    //status = determineStateActuator(actuator, null);
	    res.send(actuator.status);
	});

	route.post('/off', function (req, res) {
	    actuator = helper.getActuatorById(req.body.id);
	    if (req.body.id === 0) {
	        actuator.status = {state: false, intensity: 0}
	    }
	    else {
	        actuator.status = {state: false}
	    }
	    //status = determineStateActuator(actuator, null);
	    res.send(actuator.status);
	});

	route.post('/changeIntensity', function (req, res) {
	    actuator = helper.getActuatorById(req.body.id);
	    actuator.status = {
	        state: true,
	        intensity: req.body.intensity,
	        teststring: req.body.teststring,
	        testbool: req.body.testbool
	    };
	    res.send(actuator.status);
	});
 return route;

})();
/* jshint ignore:end */