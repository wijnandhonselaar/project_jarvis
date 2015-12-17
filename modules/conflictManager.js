var ruleEngine = null;
var io = null;
var scenarioManager = null;
var deviceManager = null;
var resolvedConflicts = [];

function detect(command, device, executingScenario) {
    for (var scenario in device.config.scenarios) {
        if (device.config.scenarios.hasOwnProperty(scenario)) {
            //if (scenarioManager.getByName(scenario)) {
            //if(scenario == executingScenario.name){
            //    return true;
            //}
            scenarioManager.getByName(scenario, function (scenario) {
                if (scenario.status) {
                    //console.log(device.config.scenarios[scenario.name]);
                    if (device.config.scenarios[scenario.name].command != command) {
                        //console.log('(' + scenario.name + ') active: ' + device.config.scenarios[scenario.name].command + ' want to execute (' + executingScenario.name + ') ' + command);
                        var alreadyResolved = false;

                        for (var i = 0; i < resolvedConflicts.length; i++) {
                            //(resolvedConflicts[i].winner == scenario.name && resolvedConflicts[i].loser == executingScenario.name) ||
                            if (device.id == resolvedConflicts[i].device.id && (resolvedConflicts[i].winner == executingScenario.name && resolvedConflicts[i].loser == scenario.name)) {
                                return true;
                            }
                        }

                        if (!alreadyResolved) {
                            presentResolve(device, command, device.config.scenarios[scenario.name].command, executingScenario, scenario);
                            return false;
                        }
                    }
                }
            });

            //}
        }
    }

    return false;

}

function presentResolve(deviceObj, executingCommand, conflictingCommand, executingScenario, conflictingScenario) {
    //console.log('presenting resolve');
    io.emit('resolveConflict', {
        executed: {scenario: executingScenario.name, command:executingCommand, device:deviceObj },
        conflicting: {scenario:conflictingScenario.name, command:conflictingCommand, device:deviceObj }
    });
}


function resolve(resolveObject, callback) {
    for (var scenario in resolveObject.device.config.scenarios) {
        if (resolveObject.device.config.scenarios.hasOwnProperty(scenario)) {
            if(scenario == resolveObject.winner){
                scenarioManager.start(resolveObject.winner);
                resolvedConflicts.push(resolveObject);
                deviceManager.executeCommand(resolveObject.device.config.scenarios[scenario].command, resolveObject.device, {}, function(){
                    callback('Conflict resolved');
                });
            }
        }
    }
}


module.exports = {
    init: function (socketio, sm, dm) {
        if (sm) scenarioManager = sm;
        if (socketio) io = socketio;
        if (dm) deviceManager = dm;
    },
    resolve: resolve,
    detect: detect
};