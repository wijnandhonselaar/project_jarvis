"use strict";

var Actuator = require('../models/actuator.js'),
    Sensor = require('../models/sensor.js');

/**
 * checkType - returns the model based on the type (string) paramater
 * @param type(string): the device type (actuator/sensor)
 */
function checkType(type) {
    if(type === 'actuator' || type === 'Actuator' || type === "actuators" || "Actuators"){
        return Actuator;
    } else if (type === 'sensor' || type === 'Sensor' || type === "Sensoren" || type === "sensors" || type === "Sensors" || type === "sensoren") {
        return Sensor;
    } else {
        return false;
    }
}

/**
 *  getDevice - returns the requested device
 *  @param id(number): the id of the device
 *  @param type(string): the device type (actuator/sensor)
 *  @param fn(function): callback function (err, res)
 */
function getDevice(id, type, fn) {

    type = checkType(type);

    if(!type) {
        fn({Error: "type is unknown"});
        return false;
    }

    type.get(id).then(function(res) {
        fn(null, res);
    }).error(function(err) {
        fn({Error: "The sensor wasn't found", Message: err});
    });
}

/**
 * getAllDevices
 * @param type(string): get all actuators or sensors.
 * @param fn(function): the callback
 */
function getAllDevices(type, fn) {

    type = checkType(type);

    if(!type) {
        fn({Error: "type is unknown"});
        return false;
    }

    type.run().then(function(res) {
        fn(null, res);
    }).error(function(err) {
        fn({Error: "The "+ type +" wasn't found", Message: err});
    });
}

/**
 *  saveDevice - saves the object from the newDevice parameter
 *  @param newDevice(object): the new device
 *  @param type(string): with the device (actuator/sensor)
 *  @param fn(function): callback function (err, res)
 */
function saveDevice(newDevice, type, fn) {

    type = checkType(type);

    if(!type) {
        fn({Error: "type is unknown"});
        return false;
    }

    type.save(newDevice).then(function(res) {
        fn(null, res);
    }).error(function(err){
        fn({Error: "The sensor wasn't saved", Message: err});
    });
}

/**
 *  updateAlias - updates the alias
 *  @param type(string): the type (actuator/sensor)
 *  @param alias(string): the alias
 *  @param fn(function): callback function (err, res)
 */
function updateAlias(id, type, alias, fn) {

    type = checkType(type);

    if(!type) {
        fn({Error: "type is unknown"});
        return false;
    }

    type.get(id).update({config: {alias: alias}}).run().then(function(res) {
        fn(null, res);
    }).error(function(err) {
        fn(err);
    });
}


/**
 *  updateClientRequestInterval - updates the clientRequestInterval for a sensor
 *  @param id(number): the id of the object to update
 *  @param interval(number): the desired interval
 *  @param fn(function): callback function (err, res)
 */
function updateClientRequestInterval(id, interval, fn) {

    Sensor.get(id).update({config: {clientRequestInterval: interval}}).run().then(function(res) {
        fn(null, res);
    }).error(function(err) {
        fn(err);
    });
}

/**
 *
 * @param id: the id of the device to update
 * @param type: actuator or sensor
 * @param status: true or false
 * @param fn: callback function(err, res)
 */
function updateActive(id, type, status, fn) {

    type = checkType(type);

    if(!type) {
        fn({Error: "type is unknown"});
        return false;
    }

    type.get(id).update({config: {active: status}}).run().then(function(res) {
        fn(null, res);
    }).error(function(err) {
        fn(err);
    });
}

module.exports = {
    saveDevice: saveDevice,
    getDevice: getDevice,
    updateAlias: updateAlias,
    updateClientRequestInterval: updateClientRequestInterval,
    updateActive: updateActive,
    getAllDevices: getAllDevices
};