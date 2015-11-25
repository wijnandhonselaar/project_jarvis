/*
 * actuator: [{ model,
 *              config{String alias, String ip, Integer clientRequestInterval},
 *              status
 *           }]
 * actuator: [{ model,
 *              config{String alias, String ip, Integer clientRequestInterval},
 *              status
 *           }]
 *
 */
var devices =  {
    actuator:[],
    sensor:[]
};
/*
 *  d       device
 *  remote  remote ip-address
 *  io      Socket
 */
function addToDeviceList(d,remote, io) {
    if(devices[d.type].length !== 0) {
        var exists = false;
        for(var i = 0; i<devices[d.type].length; i++){
            if(devices[d.type][i].id === d.id){
                exists = true;
            }
        }

        if(!exists){
            devices[d.type].push({model: d, config: {alias: '', ip: remote, clientRequestInterval: 5000}, status: null});
            io.emit("deviceAdded", {data: d});
            if(GLOBAL.logToConsole) console.log("Discovered "+ d.name + " on "+remote.address+ ' length: '+devices[d.type].length);
        }

    } else {
        devices[d.type].push({model: d, config: {alias: '', ip: remote, clientRequestInterval: 5000}, status: null});
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
    return null;
}

function getSensorById(id) {
    for (var i = 0; i < devices.sensor.length; i++) {
        if(devices.sensor[i].id === id){
            return devices.sensor[i];
        }
    }
    return {Error: "Error, could not find sensor with id: " + id + "."};
}

function getActuatorById(id) {
    for (var i = 0; i < devices.actuator.length; i++) {
        if(devices.actuator[i].id === id){
            return devices.actuator[i];
        }
    }
    return {Error: "Error, could not find actuator with id: " + id + "."};
}

function updateDeviceAliasFunction(devicetype, id, alias){
    if(devicetype === "sensors"){
        devicetype = "sensor"
    }
    if(devicetype === "actuators"){
        devicetype = "actuator"
    }
    for (var i = 0; i < devices.devicetype.length; i++) {
       if(devices.devicetype[i].id === id){
            devices.devicetype[i].config.alias = clientRequestInterval;
            return {Succes: "Succes, alias for "+ devices.devicetype[i].id + " was succesfully updated."};
       }
    }
    return {Error: "Error, could not find " +devicetype + " with id: " + id + " to update"};
}

function updateSensorIntervalFunction(id, clientRequestInterval){
    for (var i = 0; i < devices.sensor.length; i++) {
        if(devices.sensor[i].id === id){
            devices.sensor[i].config.clientRequestInterval = clientRequestInterval;
            return {Succes: "Succes, interval for "+ devices.sensor[i].id + " was succesfully updated."};
        }
    };
    return {Error: "Error, could not find sensor with id: " + id + " to update"};
}

module.exports = {
    add: addToDeviceList,
    getByIP:getDeviceByIPAddress,
    getSensor: getSensorById,
    getActuator: getActuatorById,
    getAll: function(){return devices;},
    getSensors: function(){return devices.sensor;},
    getActuators: function(){return devices.actuator;},
    updateDeviceAlias: updateDeviceAliasFunction,
    updateSensorInterval: updateSensorIntervalFunction
};