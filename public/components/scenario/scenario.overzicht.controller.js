(function () {
    'use strict';

    angular
        .module('jarvis.scenario')
        .controller('ScenarioOverzichtctrl', ScenarioOverzichtctrl);

    ScenarioOverzichtctrl.$inject = ["ScenarioService", "$state","$timeout","$stateParams", "$scope"];

    function ScenarioOverzichtctrl(ScenarioService, $state, $timeout, $sp, $scope) {
        var scena = this;
        var swiper = null;
        scena.repeater = [];
        getScenarios();
        scena.getScenarios = getScenarios;
        scena.goToDetail = goToDetail;
        scena.toggleState = toggleState;
        scena.goToNew = goToNew;

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

        function getScenarios() {
            ScenarioService.getall()
                .then(function(data){
                    scena.scenarios = data.scenarios;
                    console.log(scena.scenarios);
                    reloadSwiper();
                    return data;
                })
                .catch(function(err){
                    console.log("Error get scenario's", err);
                    return err;
                });
        }

        function goToDetail(scenario) {
            $state.go("scenarioDetail");
            $state.transitionTo("scenarioDetail", {
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