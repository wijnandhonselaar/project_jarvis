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


function checkIfExists(scenarioArray, scenario, device){
    var exists = false;
    for(var a = 0; a<resolvedConflicts.length; a++){
        for(var i = 0; i<scenarioArray.length; i++){
            if (resolvedConflicts[a].winner == scenario.name && resolvedConflicts[a].loser == scenarioArray[i].name && resolvedConflicts[a].device.id == device.id) {
                exists = true;
            } else if(resolvedConflicts[a].winner == scenarioArray[i].name && resolvedConflicts[a].loser == scenario.name && resolvedConflicts[a].device.id == device.id) {
                exists = true;
            }
        }
    }
    console.log(scenario.name, exists);
    return exists;
}

function checkIfDeviceHasScenario(scenario, device){
    if(device.config.scenarios[scenario.name]) return true;
}

function checkIfWinningScenariosAreActive(winner, loser, callback){
    var allowed = true;
    var total = 0;

    function f() {
        total++;
        if(total == resolvedConflicts.length) {
            callback(allowed);
        }
    }

    for(var i = 0; i<resolvedConflicts.length; i++){
        if(resolvedConflicts[i].loser == scenario){
            scenarioManager.getByName(resolvedConflicts[i].winner, function(d){
                if(d.status){
                    allowed = false;
                    f();
                }
            })
        }
    }
}


function checkAgainstResolvedConflicts(device, scenario, scenarioState, newcommand, callback){
    scenarioManager.getAll(function (err, scenariosArray) {

        var allowed = true;

        var scenarioList = scenariosArray.filter(function(d){
            return d.status && d.name != scenario.name;
        });
        if(scenarioList.length == 0) return callback(true,newcommand, device);

        for(var i = 0; i<scenarioList.length; i++){
            for (var b = 0; b < resolvedConflicts.length; b++) {
                if (resolvedConflicts[b].winner == scenarioList[i].name && resolvedConflicts[b].loser == scenario.name && resolvedConflicts[b].device.id == device.id) {
                    allowed = false;
                    break;
                }
            }
        }

        callback(allowed, newcommand, device);

    });
}



//function checkAgainstResolvedConflicts(device, scenario, scenarioState, newcommand, device, callback){
//    if(scenarioState == 'start' && resolvedConflicts.length > 0) {
//        scenarioManager.getAll(function (err, scenariosArray) {
//            if(checkIfExists(scenariosArray, scenario, device)) {
//                for (var a = 0; a < scenariosArray.length; a++) {
//                    //if (!scenariosArray[a].status) return callback(true, newcommand, device);
//                        for (var i = 0; i < resolvedConflicts.length; i++) {
//                            if (resolvedConflicts[i].winner == scenario.name && resolvedConflicts[i].loser == scenariosArray[a].name && resolvedConflicts[i].device.id == device.id) {
//                                console.log('ik ben de winnaar' + scenario.name);
//                                callback(true, newcommand, device);
//                            } else if (resolvedConflicts[i].winner == scenariosArray[a].name && resolvedConflicts[i].loser == scenario.name && checkIfDeviceHasScenario(scenario, device)) {
//                                console.log('ik ben de verliezer ' + scenario.name);
//                                checkIfWinningScenariosAreActive(scenario, scenariosArray[a].name, function (allowed) {
//                                    callback(allowed, newcommand, device);
//                                });
//
//                                //scenarioManager.getByName(resolvedConflicts[i].winner, function(d){
//                                //    if(!d.status){
//                                //        console.log('maar de ' + d.name + ' staat niet aan duuss....')
//                                //        callback(true, newcommand, device);
//                                //    } else {
//                                //        callback(false, newcommand, device);
//                                //    }
//                                //})
//
//                            } else {
//                                callback(false, newcommand, device);
//                            }
//                        }
//                }
//            } else {
//                callback(true, newcommand, device);
//            }
//        })
//    } else {
//        callback(true, newcommand, device);
//    }
//};


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
                    deviceManager.executeCommand(resolveObject.device.config.scenarios[scenario].command, resolveObject.device, {}, executeCommandCB);
                    //console.log('execute', resolveObject.device.config.scenarios[scenario].command);
                }
            }
        }
    } else {
        resolveObject.device = deviceManager.getActuator(resolveObject.device);
    }

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
    checkAgainstResolvedConflicts:checkAgainstResolvedConflicts,
    resolve: resolve,
    detect: detect
};