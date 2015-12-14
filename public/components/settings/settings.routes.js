(function () {
    'use strict';

    angular
        .module('jarvis.settings')
        .config(routes);

    routes.$inject = ['$stateProvider'];

    function routes($stateProvider) {
        $stateProvider
            .state('settings', {
                url: "/settings",
                params: { activeMenu: "settings" },
                data: { pageTitle: "Settings" },
                views: {
                    "headerView" : {
                        templateUrl: "components/header/header.html",
                        controller: "HeaderCtrl",
                        controllerAs: "hc"
                    },
                    "mainView": {
                        templateUrl: "components/settings/settings.html",
                        controller: 'SettingsCtrl',
                        controllerAs: 'sc'
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