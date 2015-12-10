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
        snc.goToDetail = goToDetail;
        snc.addActuator = addActuator;
        snc.select = select;
        snc.scenario = {name: "", description: "", actuators: []};
        var swiper = null;
        snc.repeater = [];

        function addActuator(){
                ScenarioService.getActuators()
                    .then(function(data){
                        snc.actuators = data.actuators;
                        $('#actuatorscenario').openModal();
                        reloadSwiper();
                    })
                    .catch(function(err){
                        console.error(err);
                        return err;
                    });
        }

        function select(actuator){
                    console.log(actuator);
                    $('#actuatorscenario').closeModal();
                    snc.scenario.actuators.push(actuator.id);
        }
        /**
         * Create new scenario
         */
        function create () {
            if(snc.scenario.name === "" || snc.scenario.description === ""){
                Materialize.toast("Please fill all fields", 4000);
            }
            else {
                ScenarioService.create(snc.scenario.name, snc.scenario.description)
                    .then(function (data) {
                        snc.goToDetail(data.scenario);
                        return null;
                    })
                    .catch(function (err) {
                        console.log("Error creating scenario", err);
                        return err;
                    });
            }
        }


        function reloadSwiper() {
            var amount = Math.ceil( snc.actuators.length / 6 );
            snc.repeater = [];
            console.log(snc.repeater);
            for(var i = 0; i < amount; i++) {
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
        function goToDetail(scenario) {
            $state.go("scenarioDetail");
            $state.transitionTo("scenarioDetail", {
                uid: scenario.id,
                data: scenario
            });
        }
    }
})();