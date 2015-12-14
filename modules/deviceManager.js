var devices = {
    actuators: [],
    sensors: []
};
var io = null;
var ruleEngine = null;
var scenarioManager = require('./scenarioManager');
var rethinkManager = require('./rethinkManager');
var logger = require('./logManager');
var Actuator = require('../models/actuator');

var rules = {
    on: {
        command: 'on',
        timers: [],
        events: [],
        thresholds: []
    },
    off: {
        command: 'off',
        timers: [],
        events: [],
        thresholds: []
    }
};
/**
 *
 * @param device
 * @param remote
 */

function updateManagers(event) {
    for (var i = 0; i < getActuators().length; i++) {
        ruleEngine.apply(getActuators()[i], event);
    }
    //scenarioManager.validate(event);
}

function addDevice(device, remote, deviceType) {
    // lets see if its known in the database
    rethinkManager.getDevice(device.id, deviceType, function (err, res) {
        var deviceObj = null;
        if (res === undefined) {
            deviceObj = {
                id: device.id,
                savedAt: Math.round((new Date()).getTime() / 1000),
                model: device,
                config: {
                    rules: rules,
                    alias: device.name,
                    ip: remote.address,
                    clientRequestInterval: device.commands.status.requestInterval,
                    scenarios: {}
                },
                status: {state: false}
            };
            devices[deviceType].push(deviceObj);
            if (device.type === 'sensor' || deviceType === 'sensor') {
                initiateStatusPolling(deviceObj);
            }
            io.emit("deviceAdded", deviceObj);
            // Save to the database!
            rethinkManager.saveDevice({
                id: device.id,
                savedAt: Math.round((new Date()).getTime() / 1000),
                model: device,
                config: {
                    rules: rules,
                    alias: device.name,
                    ip: remote.address,
                    clientRequestInterval: device.commands.status.requestInterval,
                    scenarios: {}
                }
            }, device.type, function (err, res) {
                if (err) {
                    console.log(err);
                    logger.logEvent(deviceObj, deviceObj.model.type, "Automatisch" ,deviceObj.config.alias + " gevonden. Maar er was een error " + err, 2, null);
                } else {
                    logger.logEvent(deviceObj, deviceObj.model.type, "Automatisch" ,"Nieuwe " + deviceObj.model.type + " : " + deviceObj.config.alias + " gevonden.", 4, null);
                }
            });
        } else {
            deviceObj = {id: res.id, model: res.model, config: res.config, status:res.status};
            devices[deviceType].push(deviceObj);
            if (device.type === 'sensor' || deviceType === 'sensors') {
                initiateStatusPolling(deviceObj);
            };
            io.emit("deviceAdded", deviceObj);
        }
    });
}
/**
 * Broadcasts event from device. it's triggered from the autodiscover module
 * @param msg
 */
function broadcastEvent(msg) {
    var device = getActuatorById(parseInt(msg.id));
    if (!device) device = getSensorById(parseInt(msg.id));
    if (device) {
        updateManagers(msg);
        logger.logEvent(device, device.model.type, "Automatisch", msg.msg, msg.severity);
        io.emit('deviceEvent', {device: device, event: msg})
    } else {
        console.log('What the fuck, ik kan mijn apparaat niet vinden');
    }
}

function addToDeviceList(device, remote, deviceType) {
    if (typeof deviceType === 'undefined') {
        switch (device.type) {
            case 'actuator':
                deviceType = 'actuators';
                break;
            case 'sensor':
                deviceType = 'sensors';
                break;
        }
    }

    if (devices[deviceType].length !== 0) {
        var exists = false;
        // check the local object
        for (var i = 0; i < devices[deviceType].length; i++) {
            if (devices[deviceType][i].id === device.id) {
                exists = true;
            }
        }

        if (!exists) {
            addDevice(device, remote, deviceType);
        }
    } else {
        addDevice(device, remote, deviceType);
    }
}

/**
 *
 * @param ip
 * @returns {*}
 */
function getDeviceByIPAddress(ip) {
    for (var property in devices) {
        if (object.hasOwnProperty(property)) {
            for (var i = 0; i < devices[property].length; i++) {
                if (devices[property][i].ip == ip) {
                    return devices[property][i];
                }
            }
        }
    }
    return {err: "Error, could not find device with IP: " + ip + "."};
}

/**
 *
 * @param id
 * @returns {*}
 */
function getSensorById(id) {
    for (var i = 0; i < devices.sensors.length; i++) {
        if (devices.sensors[i].id === id) {
            return devices.sensors[i];
        }
    }
    return {err: "Error, could not find sensor with id: " + id + "."};
}

/**
 *
 * @param id
 * @returns {*}
 */
function getActuatorById(id) {
    for (var i = 0; i < devices.actuators.length; i++) {
        if (devices.actuators[i].id === id) {
            return devices.actuators[i];
        }
    }
    return {err: "Error, could not find actuator with id: " + id + "."};
}

/**
 *
 * @param devicetype
 * @param id
 * @param status
 * @returns {*}
 */
function updateDeviceStatus(devicetype, id, status) {
    devicetype = parseDeviceType(devicetype);
    for (var i = 0; i < devices[devicetype].length; i++) {
        if (devices[devicetype][i].id === id) {
            devices[devicetype][i].config.status = status;
            return {Success: "Success, status for " + devices[devicetype][i].id + " was successfully updated."};
        }
    }
    return {err: "Error, could not find " + devicetype + " with id: " + id + " to update status."};
}

function parseDeviceType(devicetype) {
    switch (devicetype) {
        case 'actuator':
            return 'actuators';
            break;
        case 'sensor':
            return 'sensors';
            break;
    }
}

/**
 *
 * @param devicetype
 * @param id
 * @param alias
 * @returns {*}
 */
function updateDeviceAliasFunction(devicetype, id, alias, callback) {
    var found = false;
    for (var i = 0; i < devices[devicetype].length; i++) {
        if (devices[devicetype][i].id === id) {
            devices[devicetype][i].config.alias = alias;
            found = true;
            // save to the database!
            rethinkManager.updateAlias(id, devicetype, alias, function (err, res) {
                if (err) {
                    logger.logEvent(res, devicetype, "Handmatig", "Alias voor " + res.model.name + " niet aangepast.", 3);
                    callback({err: "Error, could not update " + devicetype + " with id: " + id + " to update alias."});
                } else {
                    logger.logEvent(res, devicetype, "Handmatig", "Nieuwe alias voor " + res.model.name + " ingesteld.", 4);
                    io.emit("deviceUpdated", devices[devicetype][i]);
                    callback({success: "Success, alias for " + id + " was successfully updated."});
                }
            });
        }
    }
    if(found === false){
        callback({err: "Error, could nog find " + devicetype + " with id: " + id + "to update alias."})
    }
}

/**
 *
 * @param id
 * @param clientRequestInterval
 * @returns {*}
 */
function updateSensorIntervalFunction(id, clientRequestInterval, callback) {
    var found = false;
    for (var i = 0; i < devices.sensors.length; i++) {
        if (devices.sensors[i].id === id) {
            found = true;
            devices.sensors[i].config.clientRequestInterval = clientRequestInterval;
            var sensor = devices.sensors[i];
            initiateStatusPolling(sensor);
            rethinkManager.updateClientRequestInterval(id, clientRequestInterval, function(err, res) {
                if(err) {
                     logger.logEvent(res, sensor.model.type, "Handmatig" ,"Sensorinterval voor " + sensor.model.name + " niet aangepast.", 3);
                     callback({err: "Error, could not find sensors with id: " + id + " to update request interval."});
                } else {
                    io.emit("deviceUpdated", sensor);
                    logger.logEvent(sensor, sensor.model.type, "Handmatig" ,"Sensorinterval voor " + sensor.model.name + " ingesteld.", 4);
                    callback({success: "Success, interval for "+ id + " was successfully updated."});
                }
            });
        }
    };
    if(found === false){
        callback({err: "Error, could nog find sensor with id: " + id + "to update interval."})
    }
}

function initiateStatusPolling(sensor) {
    workerManager.pullData(sensor);
}

function updateSensorStatusFunction(obj) {
    var sensor = getSensorById(obj.id);
    if (sensor.status !== obj.status) {
        updateManagers();
        sensor.status = obj.status;
        logger.logData(sensor);
        io.emit("deviceUpdated", sensor);
        rethinkManager.setStatus(obj.id, obj.status, function (err, res) {
            if (err) {
                console.log('set status to database error:', err);
            }
        });
    }
}

function updateActuatorState(id, state) {
    var actuator = getActuatorById(id);
    actuator.status = state;
    io.emit("deviceUpdated", actuator);
}


function getActuators() {
    return devices.actuators;
}

function setRules(object) {
    var a = getActuatorById(object.id);
    if (a.err) {
        console.error(a.err);
        return {err: 'Couldn\'t find actuator by id'}
    } else {
        //console.log('set new rules');
        a.config.rules = object.rules;
        //console.log(a.config);
        return {success: 'set'}
    }
}

function updateActuator(id, actuator, cb) {
    console.log('Update actuator');
    for (var i = 0; i < devices.actuators.length; i++) {
        if (devices.actuators[i].id == id) {
            console.log(actuator.config);
            devices.actuators[i] = actuator;
            console.log(devices.actuators[i].config);
            Actuator.get(id)
                .then(function (persisted) {
                    persisted = actuator;
                    persisted.save()
                        .then(function (res) {
                            cb(null, res);
                        })
                        .catch(function (err) {
                            cb({error: err, message: 'Could not update actuator.'});
                        });
                }).catch(function (err) {
                cb({error: err, message: 'Could not update actuator.'});
            });
        }
    }
}

function loadDevicesFromDatabase() {
    rethinkManager.getAllDevices('sensors', function (err, res) {
        if (err) {
            console.log(err);
        } else {
            //console.log(res);
            for (var i = 0; i < res.length; i++) {
                addToDeviceList(res[i], res[i].ip, 'sensors');
            }
        }
    });

    rethinkManager.getAllDevices('actuators', function (err, res) {
        if (err) {
            console.log(err);
        } else {

            for (var i = 0; i < res.length; i++) {

                addToDeviceList(res[i], res[i].ip, 'actuators');
            }
        }
    });
}

//noinspection JSClosureCompilerSyntax
    /**
     *
     * @type {{ init: Function,
 *          add: addToDeviceList,
 *          getByIP: getDeviceByIPAddress,
 *          getSensor: getSensorById,
 *          getActuator: getActuatorById,
 *          getAll: Function,
 *          getSensors: Function,
 *          getActuators: Function,
 *          updateDeviceAlias: updateDeviceAliasFunction,
 *          updateDeviceStatus: updateDeviceStatus,
 *          updateSensorInterval: updateSensorIntervalFunction
*         }}
     */
module.exports = {
    init: function (socketio, rec) {
        io = socketio;
        ruleEngine = rec;
        loadDevicesFromDatabase();
    },
    add: addToDeviceList,
    getByIP: getDeviceByIPAddress,
    getSensor: getSensorById,
    getActuator: getActuatorById,
    broadcastEvent: broadcastEvent,
    getAll: function () {
        return devices;
    },
    removeAll: function () {
        devices.actuators = [];
        devices.sensors = [];
    },
    getSensors: function () {
        return devices.sensors;
    },
    getActuators: getActuators,
    updateDeviceAlias: updateDeviceAliasFunction,
    updateDeviceStatus: updateDeviceStatus,
    updateSensorInterval: updateSensorIntervalFunction,
    updateSensorStatus: updateSensorStatusFunction,
    updateActuatorState: updateActuatorState,
    setRules: setRules,
    updateActuator: updateActuator
};

//circular dependency (export must be first)
var workerManager = require('./workerManager');
