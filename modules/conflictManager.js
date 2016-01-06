var ruleEngine = null;
var io = null;
var scenarioManager = null;
var deviceManager = null;
var resolvedConflicts = [];

/**
 * Methode die zoekt naar conflicten op basis van het uitgevoerde commando, device, scenario.
 * @param command
 * @param device
 * @param executingScenario
 * @returns {boolean}
 */
function detect(command, device, executingScenario) {

    function getByNameCallback(scenario) {
        if(scenario.err) {
            return false;
        }
        if (scenario.status) {
            if (device.config.scenarios[scenario.name].command != command) {
                var alreadyResolved = false;

                for (var i = 0; i < resolvedConflicts.length; i++) {
                    if (device.id == resolvedConflicts[i].device.id && (resolvedConflicts[i].winner == executingScenario.name && resolvedConflicts[i].loser == scenario.name)) {
                        return true;
                    }
                }

                if (!alreadyResolved) {
                    //presentResolve(device, command, device.config.scenarios[scenario.name].command, executingScenario, scenario);
                    return false;
                }
            }
        }
    }

    for (var scenario in device.config.scenarios) {
        if (device.config.scenarios.hasOwnProperty(scenario)) {
            if(scenario != executingScenario.name) {
                scenarioManager.getByName(scenario, getByNameCallback);
            }
        }
    }

    return false;

}

/**
 * Called by detect, presents the to be resolved conflict to the client by a socket.emit
 * @param deviceObj
 * @param executingCommand
 * @param conflictingCommand
 * @param executingScenario
 * @param conflictingScenario
 */
function presentResolve(deviceObj, executingCommand, conflictingCommand, executingScenario, conflictingScenario) {
    io.emit('resolveConflict', {
        executed: {scenario: executingScenario.name, command: executingCommand, device: deviceObj},
        conflicting: {scenario: conflictingScenario.name, command: conflictingCommand, device: deviceObj}
    });
}


/**
 * Function that's called after the user interacts with a 'to be resolved conflict' to resolve it.
 * @param resolveObject
 * @param callback
 */
function resolve(resolveObject, callback, startAndExecute) {

    function executeCommandCB() {
        callback('Conflict resolved');
    }

    if (startAndExecute) {
        for (var scenario in resolveObject.device.config.scenarios) {
            if (resolveObject.device.config.scenarios.hasOwnProperty(scenario)) {
                if (scenario == resolveObject.winner) {
                    scenarioManager.start(resolveObject.winner);
                    deviceManager.executeCommand(resolveObject.device.config.scenarios[scenario].command, resolveObject.device, {}, false, executeCommandCB);
                    //console.log('execute', resolveObject.device.config.scenarios[scenario].command);
                }
            }
        }
    }

    resolveObject.device = deviceManager.getActuator(resolveObject.device);

    var exists = false;
    for(var i = 0; i<resolvedConflicts.length; i++){
        if(resolvedConflicts[i].winner == resolveObject.winner && resolvedConflicts[i].loser == resolveObject.loser && resolveObject.device.id == resolvedConflicts[i].device.id){
            exists = true;
        } else if(resolvedConflicts[i].winner == resolveObject.loser && resolvedConflicts[i].loser == resolveObject.winner && resolveObject.device.id == resolvedConflicts[i].device.id) {
            exists = true;
            flipWinnerLoser(i)
        }
    }
    if(!exists){ resolvedConflicts.push(resolveObject); }
    emitResolvedConflicts();
}


function flipWinnerLoser(index){
    var winner = resolvedConflicts[index].winner;
    resolvedConflicts[index].winner = resolvedConflicts[index].loser;
    resolvedConflicts[index].loser = winner;
}

function emitResolvedConflicts(){
    var emitThis = [];
    for(var i = 0; i<resolvedConflicts.length; i++){
        emitThis.push({
            winner:resolvedConflicts[i].winner,
            loser:resolvedConflicts[i].loser,
            device: {
                id:resolvedConflicts[i].device.id,
                alias:resolvedConflicts[i].device.config.alias
            }
        });
    }
    io.emit('resolvedConflictsList', emitThis);
}

var preemtiveConflictList = {};
function preEmptiveDetect(scenario) {
    scenarioManager.getAll(function (err, scenariosArray) {
        for (var c = 0; c < scenario.actuators.length; c++) {
            //console.log('LOOP1', 'kom ik hier wel');
            var currentScenarioActuator = scenario.actuators[c];
            for (var i = 0; i < scenariosArray.length; i++) {
                //console.log('LOOP2', 'kom ik hier wel');
                var scenarioInLoop = scenariosArray[i];
                for (var b = 0; b < scenarioInLoop.actuators.length; b++) {
                    //console.log('LOOP3', 'kom ik hier wel');
                    if (currentScenarioActuator.deviceid === scenarioInLoop.actuators[b].deviceid) {
                        //console.log('LOOP3', 'actuator gevonden');
                        if (currentScenarioActuator.action.command != scenarioInLoop.actuators[b].action.command) {
                            if (!preemtiveConflictList[scenario.name]) {
                                preemtiveConflictList[scenario.name] = {};
                            }
                            if(!preemtiveConflictList[scenario.name][scenarioInLoop.name]) {
                                preemtiveConflictList[scenario.name][scenarioInLoop.name] = []
                            }
                            scenarioInLoop.actuators[b]['deviceAlias'] = deviceManager.getActuator(scenarioInLoop.actuators[b].deviceid).config.alias;
                            var exists = false;
                            for (var l = 0; l < preemtiveConflictList[scenario.name][scenarioInLoop.name].length; l++) {
                                if (preemtiveConflictList[scenario.name][scenarioInLoop.name][l].deviceid === scenarioInLoop.actuators[b].deviceid) {
                                    preemtiveConflictList[scenario.name][scenarioInLoop.name][l] = scenarioInLoop.actuators[b];
                                    exists = true;
                                }
                            }
                            if (!exists) preemtiveConflictList[scenario.name][scenarioInLoop.name].push(scenarioInLoop.actuators[b]);
                        } else if (preemtiveConflictList[scenario.name]) {
                            if (preemtiveConflictList[scenario.name][scenarioInLoop.name]) {
                                for (var x = 0; x < preemtiveConflictList[scenario.name][scenarioInLoop.name].length; x++) {
                                    if (preemtiveConflictList[scenario.name][scenarioInLoop.name][x].deviceid === scenarioInLoop.actuators[b].deviceid) {
                                        preemtiveConflictList[scenario.name][scenarioInLoop.name].splice(x, 1);
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        io.emit('preemtiveConflictDetection', preemtiveConflictList);
        emitResolvedConflicts();
    });
}

module.exports = {
    init: function (socketio, sm, dm) {
        if (sm) scenarioManager = sm;
        if (socketio) io = socketio;
        if (dm) deviceManager = dm;
    },
    preEmptiveDetect: preEmptiveDetect,
    resolve: resolve,
    detect: detect
};