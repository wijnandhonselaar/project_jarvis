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
                        controllerAs: "scena"
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
            .state('scenarioNew', {
                url: "/scenarios/new",
                params: { data: null, activeMenu: "scenario" },
                data: { pageTitle: "new scenario" },
                views: {
                    "headerView" : {
                        templateUrl: "components/header/header.html",
                        controller: "HeaderCtrl",
                        controllerAs: "hc"
                    },
                    "mainView": {
                        templateUrl: "components/scenario/scenario.new.html",
                        controller: 'ScenarioNewctrl',
                        controllerAs: 'scennew'
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
    .state('scenarioDetail', {
            url: "/scenarios/:uid",
            params: { data: null, activeMenu: "scenario" },
            data: { pageTitle: "Scenario detail" },
            views: {
                "headerView" : {
                    templateUrl: "components/header/header.html",
                    controller: "HeaderCtrl",
                    controllerAs: "hc"
                },
                "mainView": {
                    templateUrl: "components/scenario/scenario.detail.html",
                    controller: 'ScenarioDetailctrl',
                    controllerAs: 'scd'
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