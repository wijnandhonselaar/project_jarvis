(function () {
    'use strict';

    angular
        .module('jarvis.ruleEngineScenarios')
        .config(routes);

    routes.$inject = ['$stateProvider'];

    function routes($stateProvider) {
        $stateProvider
            .state('ruleEngineScenarios', {
                url: "/scenarios/:uid/rules",
                params: { data: null, activeMenu: "scenario" },
                data: { pageTitle: "RuleEngine" },
                views: {
                    "headerView" : {
                        templateUrl: "components/header/header.html",
                        controller: "HeaderCtrl",
                        controllerAs: "hc"
                    },
                    "mainView": {
                        templateUrl: "components/ruleEngineScenarios/ruleEngineScenarios.detail.html",
                        controller: 'ruleEngineScenariosCtrl',
                        controllerAs: 'rec'
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