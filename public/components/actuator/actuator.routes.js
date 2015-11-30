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
                params: { activeMenu: "actuators" },
                data: { pageTitle: "Actuatoren" },
                views: {
                    "headerView" : {
                        templateUrl: "components/header/header.html",
                        controller: "HeaderCtrl",
                        controllerAs: "hc"
                    },
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
                        controllerAs: "mc"
                    }
                }
            })
            .state('actuatorDetail', {
                url: "/actuators/:uid",
                params: { data: null, activeMenu: "actuators" },
                data: { pageTitle: "Actuator Detail" },
                views: {
                    "headerView" : {
                        templateUrl: "components/header/header.html",
                        controller: "HeaderCtrl",
                        controllerAs: "hc"
                    },
                    "mainView": {
                        templateUrl: "components/actuator/actuator.detail.html",
                        controller: 'ActuatorDetailCtrl',
                        controllerAs: 'adc'
                    },
                    "logView": {
                        templateUrl: "components/log/log.html",
                        controller: "LogCtrl",
                        controllerAs: "lc"
                    },
                    "menuView": {
                        templateUrl: "components/menu/menu.html",
                        controller: "MenuCtrl",
                        controllerAs: "mc"
                    }
                }
            });
    }

})();