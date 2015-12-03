var devices =  {
    actuators:[],
    sensors:[]
};
var io = null;
var rethinkManager = require('./rethinkManager');

/**
 *
 * @param device
 * @param remote
 */

function addDevice(device, remote, deviceType) {
    // lets see if its known in the database
    rethinkManager.getDevice(device.id, deviceType, function(err, res) {
        if(res === undefined) {
            //if(GLOBAL.logToConsole) console.log('Device unkown in the database!');

            var deviceObj = {id: device.id, model: device, config: {alias: '', ip: remote.address, clientRequestInterval: device.commands.status.requestInterval}, status:null};
            devices[deviceType].push(deviceObj);
            if(device.type === 'sensor'){
                initiateStatusPolling(deviceObj);
            }
            io.emit("deviceAdded", deviceObj);
            // Save to the database!
            rethinkManager.saveDevice({id: device.id, model: device, config: {alias: '', ip: remote.address, clientRequestInterval: device.commands.status.requestInterval}}, device.type, function(err, res){
                if(err) {
                    //if(GLOBAL.logToConsole) console.log("Failed to save "+ device.name + " to the database");
                    //if(GLOBAL.logToConsole) console.log(err);
                } else {
                    //if(GLOBAL.logToConsole) console.log("Saved "+ device.name + " to the database");
                }
            });
            //if(GLOBAL.logToConsole) console.log("Discovered "+ device.name + " on "+remote.address+ ' length: '+devices[deviceType].length);
        } else {
           // if(GLOBAL.logToConsole) console.log('Device '+ res.model.name +' is known in the database!');
            var deviceObj = {id: res.id, model: res.model, config: res.config, status:null};
            devices[deviceType].push(deviceObj);
            if(device.type === 'sensor'){
                initiateStatusPolling(deviceObj);
            }
            io.emit("deviceAdded", deviceObj);
        }
    });
}

function addToDeviceList(device, remote) {
    var deviceType;
    switch(device.type){
        case 'actuator':
            deviceType = 'actuators';
            break;
        case 'sensor':
            deviceType = 'sensors';
            break;
    }
    if(devices[deviceType].length !== 0) {
        var exists = false;

        // check the local object
        for(var i = 0; i<devices[deviceType].length; i++){
            if(devices[deviceType][i].id === device.id){
                exists = true;
            }
        }

        if(!exists){
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
function updateDeviceAliasFunction(devicetype, id, alias, callback){
    for (var i = 0; i < devices[devicetype].length; i++) {
       if(devices[devicetype][i].id === id){
            devices[devicetype][i].config.alias = alias;

            // save to the database!
            rethinkManager.updateAlias(id, devicetype, alias, function(err, res) {
                if(err) {
                    callback( {err: "Error, could not update " + id + " with id: " + id + " to update alias."});
                } else {
                    callback( {success: "Success, alias for "+ id + " was successfully updated."});
                }
            });           
       }
    }   
}

/**
 *
 * @param id
 * @param clientRequestInterval
 * @returns {*}
 */
function updateSensorIntervalFunction(id, clientRequestInterval, callback){
    for (var i = 0; i < devices.sensors.length; i++) {
        if(devices.sensors[i].id === id){
            devices.sensors[i].config.clientRequestInterval = clientRequestInterval;
            rethinkManager.updateClientRequestInterval(id, clientRequestInterval, function(err, res) {
                if(err) {
                     callback({err: "Error, could not find sensors with id: " + id + " to update request interval."});
                } else {
                    callback({success: "Success, interval for "+ id + " was successfully updated."});
                }
            });
        }
    }
}

function initiateStatusPolling(sensor){
    workerManager.pullData(sensor);
}

function updateSensorStatusFunction(obj){
    sensor = getSensorById(obj.id);
    console.log(sensor.status);
    console.log(obj.status);
    if(sensor.status !== obj.status){
        console.log("Niet hetzelfde");
        sensor.status = obj.status;
        io.emit("deviceUpdated", sensor);
    }
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
    removeAll: function(){devices.actuators = []; devices.sensors = [];},
    getSensors: function(){return devices.sensors;},
    getActuators: function(){return devices.actuators;},
    updateDeviceAlias: updateDeviceAliasFunction,
    updateDeviceStatus: updateDeviceStatus,
    updateSensorInterval: updateSensorIntervalFunction,
    updateSensorStatus: updateSensorStatusFunction
};

//circular dependency (export must be first)
var workerManager = require('./workerManager');
