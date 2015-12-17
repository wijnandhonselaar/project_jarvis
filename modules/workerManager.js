"use strict";

var cp = require('child_process');
var child = cp.fork('./modules/workers/sensorPolling');
var intervalArray = [];
var deviceManager = require('./deviceManager');
//return message of childprocess - sensor data
child.on('message', function(m) {
    deviceManager.updateSensorStatus(m);
});

//sending job to childprocess
function pullData(sensor){
    child.send(sensor);
    var timeout = setTimeout(pullData, sensor.config.clientRequestInterval, sensor);
    for (var i = 0; i < intervalArray.length; i++) {
        if(intervalArray[i].id === sensor.id){
            intervalArray.splice(i, 1);  
        }
    }
    intervalArray.push({id: sensor.id, timeout:timeout});
}

//adding interval timers to sensors based on their minimum interval to get status
function addIntervalsToSensors(list){
    for (var i = 0; i < list.length; i++) {
        pullData(list[i]);
    }
}

module.exports = {
    pullData: pullData,
    //reinitiate intervalTimers for all sensors
    reInitiateIntervals : function (list){
        for (var i = 0; i < intervalArray.length; i++) {
            clearTimeout(intervalArray[i]);
        }
        intervalArray.splice(0,intervalArray.length);
        addIntervalsToSensors(list);
    }
};
