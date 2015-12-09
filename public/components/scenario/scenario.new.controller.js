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
        snc.scenario = {name: "", description: ""};

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