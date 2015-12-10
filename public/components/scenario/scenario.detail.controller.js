(function () {
    'use strict';

    angular
        .module('jarvis.scenario')
        .controller('ScenarioDetailctrl', ScenarioDetailctrl);

    ScenarioDetailctrl.$inject = ["ScenarioService", "$stateParams", "$scope"];

    function ScenarioDetailctrl(ScenarioService, $sp, $scope) {
        var sdc = this;
        sdc.uid = $sp.uid;
        sdc.updatename = updateName;
        sdc.updateDescription = updateDescription;
        sdc.devices = [];

        /**
         * Scenario model
         * @type {{name: string, description: string, actuators: *[]}}
         */
        sdc.scenario = {
            name: "",
            description: "",
            actuators: [{
                deviceid: null,
                action: {
                    command: "",
                    parameters: []
                }
            }]
        };

        getScenario(sdc.uid);

        function getScenario(id){
            ScenarioService.get(id)
                .then(function(data){
                    sdc.scenario = data;
                    console.log(data);
                    sdc.scenarioName = data.scenario.name;
                    sdc.scenarioDescription = data.scenario.description;
                    //sdc.scenario.actuators.forEach(function(actuator) {
                    //    sdc.devices.push(ScenarioService.getActuatorByID(actuator.deviceid));
                    //});
                    return data;
                })
                .catch(function(err){
                    console.log("Error get scenario ", err);
                    return err;
                });
        }

        function updateName(id, scenarioName){
            sdc.scenario.scenario.name = scenarioName;
            ScenarioService.update(id, sdc.scenario)
                .then(function(data){
                    return data;
                })
                .catch(function(err){
                    console.log("Error with update ", err);
                    return err;
                });
            }

        function updateDescription(id, scenarioDescription){
            sdc.scenario.scenario.description = scenarioDescription;
            ScenarioService.update(id, sdc.scenario)
                .then(function(data){
                    return data;
                })
                .catch(function(err){
                    console.log("Error with update description", err);
                    return err;
                });
         }
        }
})();