(function () {
    'use strict';

    angular
        .module('jarvis.devices')
        .factory('DevicesService', DevicesService);

    DevicesService.$inject = ['$http'];

    function DevicesService($http) {
        return {
            devices: {},
            getDevices: getDevices
        };

        function getDevices() {
            var ds = this;
            $http.get("/devices")
                .success(function(devices){
                    console.log(devices);
                    ds.devices.actuator = devices.actuator;
                    ds.devices.sensor = devices.sensor;
                })
                .error(function(err){
                    if(err) console.error(err);
                });
        }
    }
})();