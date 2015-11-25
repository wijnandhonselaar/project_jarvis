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
                data: { pageTitle: "Sensoren" },
                views: {
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
                        controllerAd: "mc"
                    }
                }
            })
            .state('sensorDetail', {
                url: "/sensors/:uid",
                templateUrl: "components/sensor/sensor.detail.html",
                controller: 'SensorDetailCtrl',
                controllerAs: 'sdc',
                params: { data: null },
                data: { pageTitle: "uid: sensor" }
            });
    }

})();