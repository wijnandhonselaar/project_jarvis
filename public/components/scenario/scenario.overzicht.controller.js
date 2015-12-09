(function () {
    'use strict';

    angular
        .module('jarvis.scenario')
        .controller('ScenarioOverzichtctrl', ScenarioOverzichtctrl);

    ScenarioOverzichtctrl.$inject = ["$http", "$state","$stateParams", "$scope"];

    function ScenarioOverzichtctrl($http, $state, $sp, $scope) {
        var scena = this;
        getScenarios();
        scena.getScenarios = getScenarios;
        scena.goToDetail = goToDetail;
        scena.toggleState = toggleState;
        scena.goToNew = goToNew;

        function getScenarios(){
            $http.get("/scenario")
                .success(function (data) {
                    scena.scenarios = data.scenarios;
                    return data;
                })
                .error(function (err) {
                    console.log("Error get scenario's", err);
                    return err;
                });
        }
        function goToDetail(scenario) {
            $state.go("scenarioDetail");
            $state.transitionTo("actuatorDetail", {
                uid: scenario.id,
                data: scenario
            });
        }
        function goToNew(){
            $state.go("scenarioNew");
        }
        function toggleState(){

        }

    }
})();