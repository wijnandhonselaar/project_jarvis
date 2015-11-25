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
                data: { pageTitle: "Actuatoren" },
                views: {
                    "mainView": {
                        templateUrl: "components/actuator/actuator.overzicht.html",
                        controller: 'ActuatorOverzichtCtrl',
                        controllerAs: 'aoc'
                    },
                    "logView": {
                        templateUrl: "components/log/log.html",
                        controller: "LogCtrl",
                        controllerAs: "lc"
                    },
                    "menuView": {
                        templateUrl: "components/menu/menu.html",
                        controller: "MenuCtrl",
                        controllerAd: "mc"
                    }
                }
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