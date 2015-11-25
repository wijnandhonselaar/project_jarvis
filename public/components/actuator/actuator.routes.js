(function () {
    'use strict';

    angular
        .module('jarvis.actuator')
        .config(routes);

    routes.$inject = ['$stateProvider'];

    function routes($stateProvider) {
        $stateProvider
            .state('actuatorsOverzicht', {
                url: "/actuators",
                templateUrl: "components/actuator/actuator.overzicht.html",
                controller: 'ActuatorOverzichtCtrl',
                controllerAs: 'aoc',
                data: { pageTitle: "Actuatoren" }
            })
            .state('actuatorDetail', {
                url: "/actuators/:uid",
                templateUrl: "components/actuator/actuator.detail.html",
                controller: 'ActuatorDetailCtrl',
                controllerAs: 'adc',
                params: { data: null },
                data: { pageTitle: "uid: actuator" }
            });
    }

})();