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
        sdc.test = test;
        sdc.devices = [];
        sdc.repeater = [];
        sdc.actuators = [];
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
            }]
        };

        getScenario(sdc.uid);

        function addActuator(){
            ScenarioService.getActuators()
                .then(function(data){
                    sdc.actuators = data.actuators;
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

        function select(actuator){
            $('#actuatorscenario').closeModal();
            sdc.devices.push(actuator);
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
                .catch(function (err) {
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
                .catch(function (err) {
                    console.log("Error with update description", err);
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

        function goToOverview() {
            $state.go("scenarioOverzicht");
        }
    }
})
();