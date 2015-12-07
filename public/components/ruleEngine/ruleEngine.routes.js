(function () {
    'use strict';

    angular
        .module('jarvis.ruleEngine')
        .config(routes);

    routes.$inject = ['$stateProvider'];

    function routes($stateProvider) {
        $stateProvider
            .state('ruleEngine', {
                url: "/actuators/:uid/rules",
                params: { data: null, activeMenu: "actuators" },
                data: { pageTitle: "RuleEngine" },
                views: {
                    "headerView" : {
                        templateUrl: "components/header/header.html",
                        controller: "HeaderCtrl",
                        controllerAs: "hc"
                    },
                    "mainView": {
                        templateUrl: "components/ruleEngine/ruleEngine.detail.html",
                        controller: 'ruleEngineCtrl',
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