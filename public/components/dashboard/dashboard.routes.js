(function () {
    'use strict';

    angular
        .module('jarvis.dashboard')
        .config(routes);

    routes.$inject = ['$stateProvider'];

    function routes($stateProvider) {
        $stateProvider
            .state('dashboard', {
                url: "/dashboard",
                params: { activeMenu: "dashboard" },
                data: { pageTitle: "Dashboard" },
                views: {
                    "headerView" : {
                        templateUrl: "components/header/header.html",
                        controller: "HeaderCtrl",
                        controllerAs: "hc"
                    },
                    "mainView": {
                        templateUrl: "components/dashboard/dashboard.html",
                        controller: 'DashboardCtrl',
                        controllerAs: 'db'
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