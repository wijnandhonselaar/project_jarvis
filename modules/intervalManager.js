var cp = require('child_process');
var child = cp.fork('./modules/sensorPolling');
var intervalArray = [];

//return message of childprocess - sensors data
child.on('message', function(m) {
    //TODO switch with main data
  console.log('received: ' + m);
});

//sending job to childprocess
function pullData(sensor){
    child.send(sensor);
    timeout = setTimeout(pullData, sensor.commands.status.requestInterval, sensor);
    intervalArray.push(timeout);
}

//adding interval timers to sensors based on their minimum interval to get status
function addIntervalsToSensors(list){
    for (var i = 0; i < list.length; i++) {
        pullData(list[i]);
    };
}

module.exports = {
    //reinitiate intervalTimers for all sensors
    reInitiateIntervals : function (list){
        for (var i = 0; i < intervalArray.length; i++) {
            clearTimeout(intervalArray[i]);
        };
        intervalArray.splice(0,intervalArray.length);
        addIntervalsToSensors(list);
    }
}
