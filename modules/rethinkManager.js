var Actuator = require('../models/actuator.js'),
    Sensor = require('../models/sensor.js');

/*
 * checkType - returns the model based on the type (string) paramater
 * type(string): the device type (actuator/sensor)
 */
function checkType(type) {
    if(type === 'actuator' || type === 'Actuator'){
        return Actuator;
    } else if (type === 'sensor' || type === 'Sensor') {
        return Sensor;
    } else {
        return false;
    }
}

/*
 *  getDevice - returns the requested device
 *  id(number): the id of the device
 *  type(string): the device type (actuator/sensor)
 *  fn(function): callback function (err, res)
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

/*
 *  saveDevice - saves the object from the newDevice parameter
 *  newDevice(object): the new device
 *  type(string): with the device (actuator/sensor)
 *  fn(function): callback function (err, res)
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

/*
 *  updateAlias - updates the alias
 *  type(string): the type (actuator/sensor)
 *  alias(string): the alias
 *  fn(function): callback function (err, res)
 */
function updateAlias(id, type, alias, fn) {

    type = checkType(type);

    type.get(id).update({config: {alias: alias}}).run().then(function(res) {
        fn(null, res);
    }).error(function(err) {
        fn(err);
        return false;
    });

}


/*
 *  updateClientRequestInterval - updates the clientRequestInterval for a sensor
 *  id(number): the id of the object to update
 *  interval(number): the desired interval
 *  fn(function): callback function (err, res)
 */
function updateClientRequestInterval(id, interval, fn) {

    Sensor.get(id).update({config: {clientRequestInterval: interval}}).run().then(function(res) {
        fn(null, res);
    }).error(function(err) {
        fn(err);
        return false;
    });
}

module.exports = {
    saveDevice: saveDevice,
    getDevice: getDevice,
    updateAlias: updateAlias,
    updateClientRequestInterval: updateClientRequestInterval
};