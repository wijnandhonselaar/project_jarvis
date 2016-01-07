"use strict";

var devices = {
    actuators: [],
    sensors: []
};
var io = null;
var ruleEngine = null;
var validator = null;
var scenarioManager = require('./scenarioManager');
var rethinkManager = require('./rethinkManager');
var logger = require('./logManager');
var Actuator = require('../models/actuator');
var comm = require('./interperter/comm');

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
 * Function that's called after each state update (both sensors and actuators)
 * @param event
 */
function updateManagers(event) {
    //for (var i = 0; i < getActuators().length; i++) {
    //    ruleEngine.apply(getActuators()[i], event);
    //}
    scenarioManager.validate(event);
}

setInterval(updateManagers,20000);

/**
 *
 * Adds device to device array and / or adds it to the database when it does not exist
 * @param device
 * @param remote
 * @param deviceType
 */
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
                    console.error(err);
                    logger.logEvent(deviceObj, deviceObj.model.type, logger.automatic ,deviceObj.config.alias + " gevonden. Maar er was een error " + err, logger.severity.notice);
                } else {
                    logger.logEvent(deviceObj, deviceObj.model.type, logger.automatic ,deviceObj.config.alias + " gevonden.", logger.severity.notice);
                }
            });
        } else {
            deviceObj = {id: res.id, model: res.model, config: res.config, status:res.status};
            devices[deviceType].push(deviceObj);
            if (device.type === 'sensor' || deviceType === 'sensors') {
                initiateStatusPolling(deviceObj);
            }
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
        io.emit('deviceEvent', {device: device, event: msg});
    } else {
        console.error('What the fuck, ik kan mijn apparaat niet vinden');
        logger.logEvent(null, 'actuator', logger.automatic, msg.msg, logger.severity.error);
    }
}

/**
 * called within addDevice method. This method adds the device to the in-memory list of devices. (array)
 * @param device
 * @param remote
 * @param deviceType
 */
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
 * Omitted method, it's not used anymore.
 * @param ip
 * @returns {*}
 */
function getDeviceByIPAddress(ip) {
    for (var property in devices) {
        if (devices.hasOwnProperty(property)) {
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
 * Exported method. Used to update the alias of a device.
 * @param devicetype
 * @param id
 * @param alias
 * @param callback
 */
function updateDeviceAliasFunction(devicetype, id, alias, callback) {
    var found = false;
    function updateCB(err, res) {
        if(err) {
            throw err;
            logger.logEvent(res, devicetype, logger.manual ,"Alias voor " + res.model.name + " niet aangepast.", logger.severity.warning);
            callback( {err: "Error, could not update " + devicetype + " with id: " + id + " to update alias."});
        } else {
            logger.logEvent(res, devicetype, logger.manual ,"Nieuwe alias voor " + res.model.name + " ingesteld.", logger.severity.notice);
            io.emit("deviceUpdated", device);
            callback( {success: "Success, alias for "+ id + " was successfully updated."});
        }
    }
    for (var i = 0; i < devices[devicetype].length; i++) {
        if (devices[devicetype][i].id === id) {
            devices[devicetype][i].config.alias = alias;
            found = true;
            var device = devices[devicetype][i];
            // save to the database!
            rethinkManager.updateAlias(id, devicetype, alias, updateCB);
        }
    }
    if(found === false){
        callback({err: "Error, could nog find " + devicetype + " with id: " + id + "to update alias."});
    }
}

/**
 * Updates the sensor update interval. Sets the poll timer to given milliseconds
 * @param id
 * @param clientRequestInterval
 * @returns {*}
 */
function updateSensorIntervalFunction(id, clientRequestInterval, callback) {
    var found = false;

    function updateCB(err, res) {
        if(err) {
            logger.logEvent(res, sensor.model.type, "Handmatig" ,"Sensorinterval voor " + sensor.model.name + " niet aangepast.", 3);
            callback({err: "Error, could not find sensors with id: " + id + " to update request interval."});
        } else {
            io.emit("deviceUpdated", sensor);
            logger.logEvent(sensor, sensor.model.type, "Handmatig" ,"Sensorinterval voor " + sensor.model.name + " ingesteld.", 4);
            callback({success: "Success, interval for "+ id + " was successfully updated."});
        }
    }

    for (var i = 0; i < devices.sensors.length; i++) {
        if (devices.sensors[i].id === id) {
            found = true;
            devices.sensors[i].config.clientRequestInterval = clientRequestInterval;
            var sensor = devices.sensors[i];
            initiateStatusPolling(sensor);
            rethinkManager.updateClientRequestInterval(id, clientRequestInterval, updateCB);
        }
    }
    if(found === false){
        callback({err: "Error, could nog find sensor with id: " + id + "to update interval."});
    }
}

/**
 * starts up the sensorpoll worker (offloaded to child process)
 * @param sensor
 */
function initiateStatusPolling(sensor) {
    workerManager.pullData(sensor);
}

/**
 * Parses the data from the poll child process and reads the sensor status (values) and pushes these to the client
 * @param obj
 */
function updateSensorStatusFunction(obj) {
    var sensor = getSensorById(obj.id);
    if (sensor.status !== obj.status) {

        updateManagers();
        sensor.status = obj.status;
        logger.logData(sensor);
        io.emit("deviceUpdated", sensor);
        rethinkManager.setStatus(obj.id, 'sensor', obj.status, function (err, res) {
            if (err) {
                console.error('set status to database error:', err);
            }
        });
    }
}

/**
 * This method checks device state and only toggles if corresponding gate is active.
 * @param command
 * @param device
 * @returns {boolean}
 */
function checkState(command, device) {
    if (device.status) {
        var state = device.status.state;
        switch (command) {
            case 'on':
                if (!state) {
                    return true;
                } else if (state) {
                    return false;
                }
                break;
            case 'off':
                if (!state) {
                    return false;
                } else if (state) {
                    return true;
                }
                break
        }
    } else {
        return true;
    }
}

/**
 * Updates the actuator state and pushes this to the client
 * @param id
 * @param state
 */
function updateActuatorState(id, state) {
    var actuator = getActuatorById(id);
    if(actuator.err) {
        logger.logEvent(null, 'actuator', logger.automatic, actuator.err, logger.severity.error);
        return;
    }
    actuator.status = state;
    // Only emit when the action is not originated from a scenario
    io.emit("deviceUpdated", actuator);
    rethinkManager.setStatus(id, 'actuator', state, function(err, res){
        if(err) {
            console.error('set status to database error:', err);
            if(getActuatorById(id).err === undefined) {
                logger.logEvent(getActuatorById(id), 'actuator', state, err.message, logger.severity.error);
            } else {
                logger.logEvent(null, 'actuator', state, getActuatorById(id).err, logger.severity.error);
            }
        }
    });
}

/**
 * Returns a list of actuators
 * @returns {*}
 */
function getActuators() {
    return devices.actuators;
}


/**
 * Adds a rule (set from within the ruleEngine) to the device
 * @param object
 * @returns {*}
 */
function setRules(object) {
    var a = getActuatorById(object.id);
    if (a.err) {
        console.error(a.err);
        return {err: 'Couldn\'t find actuator by id'};
    } else {
        a.config.rules = object.rules;
        return {success: 'set'};
    }
}

/**
 * Execute given command (with optional params) on device
 * @param command
 * @param device
 * @param params
 * @param isScenario boolean
 * @param cb
 */
function executeCommand(command, device, params, isScenario, cb){

    switch (device.model.commands[command].httpMethod) {
        case 'POST':
            comm.post(command, device, params, isScenario, function (state, device) {
                updateActuatorState(device.id, state);
                if(cb) cb(state);
            });
            break;
        case 'GET':
            comm.get(command, device, function (state, device) {
                updateActuatorState(device.id, state);
                if(cb) cb(state);
            });
            break;
    }
}

/**
 * Removed nested scenario from actuator
 * @param id Actuator id
 * @param scenario name
 */
function removeScenarioFromActuator(id, scenario) {
    function thenCBsmall(res) {
        if(res.err) logger.logEvent(null, 'scenario', logger.automatic, res.err.message, logger.severity.error, Math.round((new Date()).getTime() / 1000));
    }
    function catchCBsmall(err) {
        console.error('Error bij verwijderen scenario uit config van een actuator.');
        logger.logEvent(null, 'scenario', logger.automatic, err.message, logger.severity.error, Math.round((new Date()).getTime() / 1000));
    }
    function thenCB(actuator) {
        delete actuator.config.scenarios[scenario];
        actuator.save()
            .then(thenCBsmall)
            .catch(catchCBsmall);
    }
    function catchCB(err) {
        console.error('Error bij ophalen actuator.');
        logger.logEvent(null, 'scenario', logger.automatic, err.message, logger.severity.error, Math.round((new Date()).getTime() / 1000));
    }
    for(var i = 0; i < devices.actuators.length; i++) {
        if (devices.actuators[i].id == id) {
            delete devices.actuators[i].config.scenarios[scenario];
            Actuator.get(parseInt(id))
                .then(thenCB)
                .catch(catchCB);
        }
    }
}



/**
 * Update actuator (save to database)
 * @param id
 * @param actuator
 * @param cb
 */
function updateActuator(id, actuator, cb) {
    function thenCB1(res) {
        cb(null, res);
    }

    function catchCB1(err) {
        console.error('Error bij opslaan');
        logger.logEvent(null, 'scenario', logger.automatic, err.message, logger.severity.error, Math.round((new Date()).getTime() / 1000));
        cb({error: err, message: 'Could not update actuator.'});
    }

    function thenCB2(persisted) {
        persisted.merge(actuator);
        persisted.save()
            .then(thenCB1)
            .catch(catchCB1);
    }

    function catchCB2(err) {
        console.error('Error bij ophalen met id: ' + id);
        logger.logEvent(null, 'scenario', logger.automatic, err.message, logger.severity.error, Math.round((new Date()).getTime() / 1000));
        cb({error: err, message: 'Could not update actuator.'});
    }

    for (var i = 0; i < devices.actuators.length; i++) {
        if (devices.actuators[i].id == id) {
            devices.actuators[i] = actuator;
            Actuator.get(parseInt(id))
                .then(thenCB2).catch(catchCB2);
        }
    }
}

/**
 * Gets al the devices from the database. Is called from the init (on startup) function.
 */
function loadDevicesFromDatabase() {
    rethinkManager.getAllDevices('sensors', function (err, res) {
        if (err) {
            console.error(err);
        } else {
            for (var i = 0; i < res.length; i++) {
                addToDeviceList(res[i], res[i].ip, 'sensors');
            }
        }
    });

    rethinkManager.getAllDevices('actuators', function (err, res) {
        if (err) {
            console.error(err);
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
    init: function (socketio, rec, validatorInject) {
        io = socketio;
        validator = validatorInject;
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
    updateSensorInterval: updateSensorIntervalFunction,
    updateSensorStatus: updateSensorStatusFunction,
    updateActuatorState: updateActuatorState,
    setRules: setRules,
    updateActuator: updateActuator,
    executeCommand:executeCommand,
    checkState:checkState,
    removeScenarioFromActuator: removeScenarioFromActuator
};

//circular dependency (export must be first)
var workerManager = require('./workerManager');
