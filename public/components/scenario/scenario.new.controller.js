(function () {
    'use strict';

    angular
        .module('jarvis.scenario')
        .controller('ScenarioNewctrl', ScenarioNewctrl);

    ScenarioNewctrl.$inject = ["ScenarioService","$state"];
    /**
     *
     * @param ScenarioService            Scenario Service
     * @param $state
     * @constructor
     */
    function ScenarioNewctrl(ScenarioService, $state) {
        var snc = this;
        snc.create = create;
        snc.goToDetail = goToDetail;
        snc.modal = actuatoradd;
        snc.scenario = {name: "", description: ""};
        var swiper = null;
        snc.repeater = [];

        function actuatoradd(){
            ScenarioService.getActuators()
                .then(function(data){
                    console.log(data);
                    snc.actuators = data;
                    $('#actuatorscenario').openModal();
            })
                .catch(function(err){
                    console.error(err);
                    return err;
                });


        }

        /**
         * Create new scenario
         */
        function create () {
            ScenarioService.create(snc.scenario.name, snc.scenario.description)
                .then(function(data) {
                    snc.goToDetail(data.scenario);
                    return null;
                })
                .catch(function(err) {
                    console.log("Error creating scenario", err);
                    return err;
                });
        }


        function reloadSwiper() {
            var amount = Math.ceil( scena.scenarios.length / 8 );
            scena.repeater = [];
            for(var i = 0; i < amount; i++) {
                scena.repeater.push(i);
            }
            console.log(scena.repeater);
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
        function goToDetail(scenario) {
            $state.go("scenarioDetail");
            $state.transitionTo("scenarioDetail", {
                uid: scenario.id,
                data: scenario
            });
        }
    }
})();