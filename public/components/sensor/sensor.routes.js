(function () {
    'use strict';

    angular
        .module('jarvis.sensor')
        .config(routes);

    routes.$inject = ['$stateProvider'];

    function routes($stateProvider) {
        $stateProvider
            .state('sensorenOverzicht', {
                url: "/sensors",
                params: { activeMenu: "sensors" },
                data: { pageTitle: "Sensoren" },
                views: {
                    "headerView" : {
                        templateUrl: "components/header/header.html",
                        controller: "HeaderCtrl",
                        controllerAs: "hc"
                    },
                    "mainView": {
                        templateUrl: "components/sensor/sensor.overzicht.html",
                        controller: 'SensorOverzichtCtrl',
                        controllerAs: 'soc'
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
            .state('sensorDetail', {
                url: "/sensors/:uid",
                params: { data: null, activeMenu: "sensors" },
                data: { pageTitle: "Sensoren detail" },
                views: {
                    "headerView" : {
                        templateUrl: "components/header/header.html",
                        controller: "HeaderCtrl",
                        controllerAs: "hc"
                    },
                    "mainView": {
                        templateUrl: "components/sensor/sensor.detail.html",
                        controller: 'SensorDetailCtrl',
                        controllerAs: 'sdc'
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