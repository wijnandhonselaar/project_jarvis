(function () {
    'use strict';

    angular
        .module('jarvis.scenario')
        .controller('ScenarioNewctrl', ScenarioNewctrl);

    ScenarioNewctrl.$inject = ["ScenarioService","$scope", "$state"];
    /**
     *
     * @param ScenarioService            Scenario Service
     * @param $scope
    * @param $state
     * @constructor
     */
    function ScenarioNewctrl(ScenarioService, $scope,  $state) {
        var snc = this;
        snc.create = create;
        snc.goToOverview = goToOverview;
        snc.addActuator = addActuator;
        snc.select = select;
        snc.removeActuator = removeActuator;

        /**
         * Scenario model
         * @type {{name: string, description: string, actuators: *[]}}
         */
        snc.scenario = {name: "", description: "", actuators: []};

        var swiper = null;
        snc.repeater = [];
        snc.devices = [];
        snc.actions = [];
        snc.actuators = [];

        function addActuator() {
            snc.actuators = [];
            ScenarioService.getActuators()
                .then(function (data) {
                    for(var i = 0; i<data.actuators.length; i++){
                        var exists = false;
                        for(var j = 0; j<snc.devices.length; j++){
                            if(data.actuators[i].id === snc.devices[j].id){
                                exists = true;
                            }
                        }
                        if(!exists){
                            snc.actuators.push(data.actuators[i]);
                        }
                    }
                    $('#actuatorscenario').openModal();
                    reloadSwiper();
                })
                .catch(function (err) {
                    console.error(err);
                    return err;
                });
        }

        function removeActuator(id) {
            for (var i = 0; i < snc.devices.length; i++) {
                if (snc.devices[i].id === id) {
                    snc.devices.splice(i, 1);
                }
            }
        }

        function select(actuator) {
            $('#actuatorscenario').closeModal();
            snc.devices.push(actuator);
        }

        /**
         * Create new scenario
         */
        function create() {
            snc.devices.forEach(function (device) {
                var action = $('#' + device.id + ' option:selected').data("value");
                snc.scenario.actuators.push({
                    deviceid: action.deviceid,
                    action: {command: action.command.name, parameters: []}
                });
            });
            ScenarioService.create(snc.scenario.name, snc.scenario.description, snc.scenario.actuators)
                .then(function (data) {

                    snc.goToOverview(data.scenario);
                    return null;
                })
                .catch(function (err) {
                    console.error("Error creating scenario", err);
                    return err;
                });
        }


        function reloadSwiper() {
            var amount = Math.ceil(snc.actuators.length / 6);
            snc.repeater = [];
            for (var i = 0; i < amount; i++) {
                snc.repeater.push(i);
            }
            $scope.$apply();
            swiper = new Swiper('.swiper-container', {
                pagination: '.swiper-pagination',
                paginationClickable: true
            });
        }

        /**
         * Redirect to detail page
         * @param scenario
         */
        function goToOverview() {
            $state.go("scenarioDetail");
        }
    }
})();