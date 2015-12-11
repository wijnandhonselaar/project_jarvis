var ruleEngine = null;

function detect(command, device, executingScenario){

    for (var scenario in device.config.scenarios) {

        if (device.config.hasOwnProperty(scenario)) {
            if(scenarioManager.getScenarioState(scenario)) {
                device.config.scenarios[scenario].command != command;
                resolve(executingScenario, scenario);
                //conflictDetected;
            }
        }
    }

    return true;
}

function resolve(){

}

module.exports = {
    init: function(){

    },
    detect:detect
};