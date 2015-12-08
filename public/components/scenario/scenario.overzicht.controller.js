(function () {
    'use strict';

    angular
        .module('jarvis.scenario')
        .controller('ScenarioOverzichtctrl', ScenarioOverzichtctrl);

    ScenarioOverzichtctrl.$inject = ["$http", "$stateParams", "$scope"];

    function ScenarioOverzichtctrl($http, $sp, $scope) {
        var scene = this;
        scene.scenarios = getScenarios();


        function getScenarios(){
            $http.get("/scenario")
                .success(function (data) {
                    return data;
                })
                .error(function (err) {
                    console.log("Error get scenario's", err);
                });
        }
    }
})();