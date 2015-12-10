(function () {
    'use strict';

    angular
        .module('jarvis.scenario')
        .controller('ScenarioDetailctrl', ScenarioDetailctrl);

    ScenarioDetailctrl.$inject = ["ScenarioService", "$stateParams","$state", "$scope"];

    function ScenarioDetailctrl(ScenarioService, $sp,$state, $scope) {
        var scd = this;
        scd.uid = $sp.uid;
        scd.updatename = updateName;
        scd.updateDescription = updateDescription;
        scd.delete = deleteScenario;

        getScenario(scd.uid);

        function getScenario(id) {
            ScenarioService.get(id)
                .then(function (data) {
                    scd.scenario = data;
                    scd.scenarioName = data.scenario.name;
                    scd.scenarioDescription = data.scenario.description;
                    return data;
                })
                .catch(function (err) {
                    console.log("Error get scenario ", err);
                    return err;
                });
        }

        function updateName(id, scenarioName) {
            scd.scenario.scenario.name = scenarioName;
            ScenarioService.update(id, scd.scenario)
                .then(function (data) {
                    return data;
                })
                .catch(function (err) {
                    console.log("Error with update ", err);
                    return err;
                });
        }

        function updateDescription(id, scenarioDescription) {
            scd.scenario.scenario.description = scenarioDescription;
            ScenarioService.update(id, scd.scenario)
                .then(function (data) {
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