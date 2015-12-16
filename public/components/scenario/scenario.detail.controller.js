(function () {
    'use strict';

    angular
        .module('jarvis.scenario')
        .controller('ScenarioDetailctrl', ScenarioDetailctrl);

    ScenarioDetailctrl.$inject = ["ScenarioService", "$stateParams","$state", "$scope"];

    function ScenarioDetailctrl(ScenarioService, $sp, $state, $scope) {
        var sdc = this;
        sdc.uid = $sp.uid;
        sdc.updatename = updateName;
        sdc.addActuator = addActuator;
        sdc.select = select;
        sdc.updateDescription = updateDescription;
        sdc.delete = deleteScenario;
        sdc.removeActuator = removeActuator;
        sdc.updateActuator = updateActuator;
        sdc.selectedAction = selectedAction;
        sdc.isAllowedCommand = ScenarioService.isAllowedCommand;
        sdc.selected = 'on';
        sdc.devices = [];
        sdc.repeater = [];
        sdc.actuators = [];
        sdc.GoToDetail = GoToDetail;
        var swiper = null;

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
            }],
            status:""
        };

        getScenario(sdc.uid);

        function GoToDetail(scenario){
            $state.go("ruleEngineScenarios");
            $state.transitionTo("ruleEngineScenarios", {
                uid: scenario.id,
                data: scenario
            });
        }

        function addActuator(){
            sdc.actuators = [];
            ScenarioService.getActuators()
                .then(function(data){
                    for(var i = 0; i<data.actuators.length; i++){
                        var exists = false;
                        for(var j = 0; j<sdc.scenario.actuators.length; j++){
                            if(data.actuators[i].id === sdc.scenario.actuators[j].deviceid){
                                exists = true;
                            }
                        }
                        if(!exists){
                            data.actuators[i].selected = data.actuators[i].model.commands[i];
                            sdc.actuators.push(data.actuators[i]);
                        }
                    }
                    $('#actuatorscenario').openModal();
                    reloadSwiper();
                })
                .catch(function(err){
                    console.error(err);
                    return err;
                });
        }

        function reloadSwiper() {
            var amount = Math.ceil( sdc.actuators.length / 6 );
            sdc.repeater = [];
            for(var i = 0; i < amount; i++) {
                sdc.repeater.push(i);
            }
            $scope.$apply();
            swiper = new Swiper('.swiper-container', {
                pagination: '.swiper-pagination',
                paginationClickable: true
            });
        }

        function removeActuator(id) {
            for(var i = 0; i < sdc.devices.length; i++) {
                var device = sdc.devices[i];
                if(device.id === id) {
                    delete device.config.scenarios[sdc.scenario.name];
                    ScenarioService.updateActuator(device);
                    sdc.devices.splice(i, 1);
                }
            }
            for(i = 0; i < sdc.scenario.actuators.length; i++) {
                if(sdc.scenario.actuators[i].deviceid === id) {
                    sdc.scenario.actuators.splice(i, 1);
                    ScenarioService.update(sdc.scenario.id, sdc.scenario);
                }
            }
        }

        function select(actuator){
            $('#actuatorscenario').closeModal();
            sdc.devices.push(actuator);
            for(var i = 0; i < sdc.devices.length; i++) {
                if(sdc.devices[i].id === actuator.id) {
                    sdc.devices[i].config.scenarios[sdc.scenario.name] = {
                        command: '',
                        parameters: []
                    };
                    ScenarioService.updateActuator(sdc.devices[i]);
                }
            }
            sdc.scenario.actuators.push({
                deviceid: actuator.id,
                action: {
                    command: "on",
                    parameters: []
                },
                priority: 100
            });
            updateScenario();
        }

        function updateScenario(){
            ScenarioService.update(sdc.scenario.id, sdc.scenario)
                .then(function(data){
                   return data;
                })
                .catch(function(err){
                    console.error(err);
                });
        }

        function getScenario(id) {
            ScenarioService.get(id)
                .then(function(data){
                    sdc.scenario = data.scenario;
                    sdc.scenarioName = data.scenario.name;
                    sdc.scenarioDescription = data.scenario.description;
                    sdc.scenario.actuators.forEach(function(actuator) {
                        ScenarioService.getActuatorByID(actuator.deviceid)
                            .then(function(data) {
                                sdc.devices.push(data);
                                $scope.$apply();
                            })
                            .catch(function (err) {
                                console.error(err);
                            });
                    });
                    return data;
                })
                .catch(function (err) {
                    console.error("Error get scenario ", err);
                    return err;
                });
        }

        function updateName(id, scenarioName){
            sdc.scenario.name = scenarioName;
            ScenarioService.update(id, sdc.scenario)
                .then(function(data){
                    return data;
                })
                .catch(function (err) {
                    console.error("Error with update ", err);
                    return err;
                });
        }

        function updateDescription(id, scenarioDescription){
            sdc.scenario.description = scenarioDescription;
            ScenarioService.update(id, sdc.scenario)
                .then(function(data){
                    return data;
                })
                .catch(function (err) {
                    console.error("Error with update description", err);
                    return err;
                });
        }


        function deleteScenario(scenario) {
            ScenarioService.delete(scenario)
                .then(function (data) {
                    goToOverview();
                    return data;
                })
                .catch(function (err) {
                    goToOverview();
                    console.error(err);
                    return err;
                });
        }

        function updateActuator(command, id) {
            //var action = $('#'+actuatorID + ' option:selected').data("value");
            console.log(command);
            //for(var i = 0; i < sdc.devices.length; i++) {
            //    if(sdc.devices[i].id == id) {
            //        console.log("Found device in devicemanager");
            //        sdc.devices[i].config.scenarios[sdc.scenario.name].command = command.name;
            //        ScenarioService.updateActuator(sdc.devices[i]);
            //    }
            //}
            //for(i = 0; i < sdc.scenario.actuators.length; i++) {
            //    if(sdc.scenario.actuators[i].deviceid == id) {
            //        console.log("Found device in Scenario");
            //        sdc.scenario.actuators[i].command = command.name;
            //        ScenarioService.update(sdc.scenario.id, sdc.scenario);
            //    }
            //}

        }

        function selectedAction(command, actuator) {
            console.log(command);
            for(var i = 0; i < actuator.model.commands.length; i++) {
                if(actuator.model.commands[i].name == command.name) {
                    console.log(command);
                    return command;
                }
            }
        }

        function goToOverview() {
            $state.go("scenarioOverzicht");
        }
    }
})
();