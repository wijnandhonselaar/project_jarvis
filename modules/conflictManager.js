var ruleEngine = null;
var io = null;
var resolvedConflicts = [];
var scenarioManager = require('./scenarioManager');

function detect(command, device, executingScenario) {

    for (var scenario in device.config.scenarios) {
        if (device.config.hasOwnProperty(scenario)) {

            if (scenarioManager.getScenarioState(scenario)) {

                if (device.config.scenarios[scenario].command != command) {
                    var alreadyResolved = false;
                    for (var i = 0; i < resolvedConflicts.length; i++) {

                        if ((resolvedConflicts[i].winner.id == scenario && resolvedConflicts[i].loser.id == executingScenario) || (resolvedConflicts[i].winner.id == executingScenario && resolvedConflicts[i].loser.id == scenario)) {
                            alreadyResolved = true;
                        }

                        if (!alreadyResolved) presentResolve(executingScenario, scenario);
                    }
                }
            }
        }
    }

    return true;
}

function presentResolve(executingScenario, conflictingScenario) {
    io.emit('resolveConflict', {
        executed: scenarioManager.getScenario(executingScenario),
        conflicting: scenarioManager.getScenario(conflictingScenario)
    });
}


//ResolveObject?

//var t = {
//    winner: scenario,
//    loser: scenario,
//    device: 1337
//};

function resolve(resolveObject, callback) {
    resolveObject.winner.priority += 1;
    resolveObject.loser.priority -= 2;
    resolvedConflicts.push(resolveObject);
    scenarioManager.update(resolveObject.winner);
    scenarioManager.update(resolveObject.loser);
    callback('Conflict resolved');
}


module.exports = {
    init: function (socketio) {
        if (socketio) io = socketio;
    },
    resolve:resolve
    //detect:detect
};