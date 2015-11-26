/*
 * actuator: [{ id,
 *              model,
 *              config{String alias, String ip, Integer clientRequestInterval},
 *              status
 *           }]
 * sensor:   [{ id,
 *              model,
 *              config{String alias, String ip, Integer clientRequestInterval},
 *              status
 *           }]
 *
 */
var devices =  {
    actuators:[],
    sensors:[]
};
var io = null;

/**
 *
 * @param device
 * @param remote
 */
function addToDeviceList(device, remote) {
    //console.log('Adding device:' + device.id);
    if(devices[device.type].length !== 0) {
        //console.log('Hier kom ik niet');
        var exists = false;
        for(var i = 0; i<devices[device.type].length; i++){
            if(devices[device.type][i].id === device.id){
                exists = true;
            }
        }

        if(!exists){
            devices[device.type].push({id: device.id, model: device, config: {alias: '', ip: remote.address, clientRequestInterval: 5000}, status: null});
            io.emit("deviceAdded", {data: device});
            if(GLOBAL.logToConsole) console.log("Discovered "+ device.name + " on "+remote.address+ ' length: '+devices[device.type].length);
        }

    } else {
        //console.log('Adding device:' + device.id + 'type: ' + device.type);
        devices[device.type].push({id: device.id, model: device, config: {alias: '', ip: remote, clientRequestInterval: 5000}, status: null});
        //console.log('Added device: ' + devices[device.type][devices[device.type].length - 1].id);
        io.emit("deviceAdded", {data: device});
        if(GLOBAL.logToConsole) console.log("Discovered "+ device.name + " on "+remote.address+ ' length: '+devices[device.type].length);
    }
    if(devices.actuators[0] !== undefined) {
        //console.log('Actuators: ' + devices.actuators[0]);
    }
    if(devices.sensors[0] !== undefined) {
        //console.log('Sensors: ' + devices.sensors[0]);
    }
    //console.log('Device count: ' + (devices.sensors.length + devices.actuators.length));
}

/**
 *
 * @param ip
 * @returns {*}
 */
function getDeviceByIPAddress(ip){
    for (var property in devices) {
        if (object.hasOwnProperty(property)) {
            for(var i = 0; i<devices[property].length; i++){
                if(devices[property][i].ip == ip){
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
        if(devices.sensors[i].id === id){
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
        if(devices.actuators[i].id === id){
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
    for (var i = 0; i < devices.devicetype.length; i++) {
        if(devices.devicetype[i].id === id){
            devices.devicetype[i].config.status = status;
            return {Success: "Success, status for "+ devices.devicetype[i].id + " was successfully updated."};
        }
    }
    return {err: "Error, could not find " +devicetype + " with id: " + id + " to update status."};
}

/**
 *
 * @param devicetype
 * @param id
 * @param alias
 * @returns {*}
 */
function updateDeviceAliasFunction(devicetype, id, alias){
    for (var i = 0; i < devices.devicetype.length; i++) {
       if(devices.devicetype[i].id === id){
            devices.devicetype[i].config.alias = alias;
            return {Success: "Success, alias for "+ devices.devicetype[i].id + " was successfully updated."};
       }
    }

    return {err: "Error, could not find " +devicetype + " with id: " + id + " to update alias."};
}

/**
 *
 * @param id
 * @param clientRequestInterval
 * @returns {*}
 */
function updateSensorIntervalFunction(id, clientRequestInterval){
    for (var i = 0; i < devices.sensors.length; i++) {
        if(devices.sensors[i].id === id){
            devices.sensors[i].config.clientRequestInterval = clientRequestInterval;
            return {Success: "Success, interval for "+ devices.sensors[i].id + " was successfully updated."};
        }
    }

    return {err: "Error, could not find sensors with id: " + id + " to update request interval."};
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
    init: function(socketio){
        io = socketio;
    },
    add: addToDeviceList,
    getByIP:getDeviceByIPAddress,
    getSensor: getSensorById,
    getActuator: getActuatorById,
    getAll: function(){return devices;},
    getSensors: function(){return devices.sensors;},
    getActuators: function(){return devices.actuators;},
    updateDeviceAlias: updateDeviceAliasFunction,
    updateDeviceStatus: updateDeviceStatus,
    updateSensorInterval: updateSensorIntervalFunction
};