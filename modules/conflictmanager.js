var ruleEngine = null;
var io = null;
//var scenarioManager = require('./scenarioManager');
//
//function detect(command, device, executingScenario){
//
//    for (var scenario in device.config.scenarios) {
//        if (device.config.hasOwnProperty(scenario)) {
//
//            if(scenarioManager.getScenarioState(scenario)) {
//
//                device.config.scenarios[scenario].command != command;
//                presentResolve(executingScenario, scenario);
//                //conflictDetected;
//            }
//
//        }
//    }
//
//    return true;
//}
//
//function presentResolve(executingScenario, conflictingScenario){
//    if(!solution)
//        io.emit('resolve', {executed: scenarioManager.getScenario(executingScenario), conflicting:scenarioManager.getScenario(conflictingScenario)});
//}
//
//
////ResolveObject?
//
////var t = {
////    winner: scenario,
////    loser: scenario,
////    device: 1337
////};
//
//function resolve(resolveObject){
//    resolveObject.winner.priority = loser.priorty+1;
//    resolveObject.loser.priority = winner.priorty-2;
//    scenarioManager.update(resolveObject.winner);
//    scenarioManager.update(resolveObject.loser);
//}
//
module.exports = {
    init: function(socketio){
        if(socketio) io = socketio;
    },
    //detect:detect
};