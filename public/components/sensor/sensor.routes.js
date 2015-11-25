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
                templateUrl: "components/sensor/sensor.overzicht.html",
                controller: 'SensorOverzichtCtrl',
                controllerAs: 'soc',
                data: { pageTitle: "Sensoren" }
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