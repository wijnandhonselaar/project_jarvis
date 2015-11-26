/*
 * actuator: [{ model,
 *              config{String alias, String ip, Integer clientRequestInterval},
 *              status
 *           }]
 * sensor:   [{ model,
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
 *  d       device
 *  remote  remote ip-address
 *  io      Socket
 */

function addToDeviceList(d, remote) {
    if(devices[d.type].length !== 0) {
        var exists = false;
        for(var i = 0; i<devices[d.type].length; i++){
            if(devices[d.type][i].id === d.id){
                exists = true;
            }
        }

        if(!exists){
            devices[d.type].push({id: d.id, model: d, config: {alias: '', ip: remote.address, clientRequestInterval: 5000}, status: null});
            io.emit("deviceAdded", {data: d});
            if(GLOBAL.logToConsole) console.log("Discovered "+ d.name + " on "+remote.address+ ' length: '+devices[d.type].length);
        }

    } else {
        devices[d.type].push({id: d.id, model: d, config: {alias: '', ip: remote, clientRequestInterval: 5000}, status: null});
        io.emit("deviceAdded", {data: d});
        if(GLOBAL.logToConsole) console.log("Discovered "+ d.name + " on "+remote.address+ ' length: '+devices[d.type].length);
    }
}

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

function getSensorById(id) {
    for (var i = 0; i < devices.sensors.length; i++) {
        if(devices.sensors[i].id === id){
            return devices.sensors[i];
        }
    }
    return {err: "Error, could not find sensor with id: " + id + "."};
}

function getActuatorById(id) {
    for (var i = 0; i < devices.actuators.length; i++) {
        if(devices.actuators[i].id === id){
            return devices.actuators[i];
        }
    }
    return {err: "Error, could not find actuator with id: " + id + "."};
}

function updateDeviceStatus(devicetype, id, status) {
    for (var i = 0; i < devices.devicetype.length; i++) {
        if(devices.devicetype[i].id === id){
            devices.devicetype[i].config.status = status;
            return {Success: "Success, status for "+ devices.devicetype[i].id + " was successfully updated."};
        }
    }
    return {err: "Error, could not find " +devicetype + " with id: " + id + " to update status."};
}

function updateDeviceAliasFunction(devicetype, id, alias){
    for (var i = 0; i < devices.devicetype.length; i++) {
       if(devices.devicetype[i].id === id){
            devices.devicetype[i].config.alias = alias;
            return {Success: "Success, alias for "+ devices.devicetype[i].id + " was successfully updated."};
       }
    }

    return {err: "Error, could not find " +devicetype + " with id: " + id + " to update alias."};
}

function updateSensorIntervalFunction(id, clientRequestInterval){
    for (var i = 0; i < devices.sensors.length; i++) {
        if(devices.sensors[i].id === id){
            devices.sensors[i].config.clientRequestInterval = clientRequestInterval;
            return {Success: "Success, interval for "+ devices.sensors[i].id + " was successfully updated."};
        }
    }

    return {err: "Error, could not find sensors with id: " + id + " to update request interval."};
}

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