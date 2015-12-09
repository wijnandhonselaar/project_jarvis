(function () {
    'use strict';

    angular
        .module('jarvis.scenario')
        .controller('ScenarioDetailctrl', ScenarioDetailctrl);

    ScenarioDetailctrl.$inject = ["$http", "$stateParams", "$scope"];

    function ScenarioDetailctrl($http, $sp, $scope) {
        var scd = this;
        scd.updateDescription = updateDescription;
        scd.updateName = updateName;


        getScenario();

        function getScenario(){
            $http.get("/scenario/"+$sp.uid)
                .success(function (data) {
                    scd.scenario = data.scenario;
                    scd.scenarioName = data.scenario.name;
                    scd.scenarioDescription = data.scenario.description;
                    return data;
                })
                .error(function (err) {
                    console.log("Error get scenario's", err);
                    return err;
                });
        }


        function updateDescription(description){
            scd.scenario.description = description;
            $http.put("/scenario/"+$sp.uid, scd.scenario)
                .success(function (data) {
                    Materialize.toast("Succesful changed description", 4000);
                })
                .error(function (err) {
                    console.error(err);
                    return err;
                });
        }

        function updateName (name){
            scd.scenario.name = name;
            $http.put("/scenario/"+$sp.uid, scd.scenario)
                .success(function (data) {
                    Materialize.toast("Succesful changed name into "+ data.scenario.name, 4000);
                })
                .error(function (err) {
                    console.error(err);
                    return err;
                });
        }
    }
})();