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
            $http.get("/deviceManager")
                .success(function(devices){
                    console.log(devices);
                    ds.devices.actuators = devices.actuators;
                    ds.devices.sensors = devices.sensors;
                })
                .error(function(err){
                    if(err) console.error(err);
                });
        }
    }
})();