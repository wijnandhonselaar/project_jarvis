(function () {
    'use strict';

    angular
        .module('jarvis.sensor')
        .config(routes);

    routes.$inject = ['$stateProvider'];

    function routes($stateProvider) {
        $stateProvider
            .state('scenarioOverzicht', {
                url: "/scenarios",
                params: { activeMenu: "scenario" },
                data: { pageTitle: "Scenario" },
                views: {
                    "headerView" : {
                        templateUrl: "components/header/header.html",
                        controller: "HeaderCtrl",
                        controllerAs: "hc"
                    },
                    "mainView": {
                        templateUrl: "components/scenario/scenario.overzicht.html",
                        controller: 'ScenarioOverzichtctrl',
                        controllerAs: "scene"
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