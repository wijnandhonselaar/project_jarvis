(function() {
    'use strict';

    angular
        .module('jarvis.sensor')
        .controller('SensorDetailCtrl', SensorDetailCtrl);

    SensorDetailCtrl.$inject = ["DevicesService", "$stateParams", "$scope"];

    function SensorDetailCtrl(DS, $sp, $scope) {
        var sdc = this;
        sdc.GetValueByKey = GetValueByKey;
        sdc.sensor = null;
        sdc.sensoralias = "";
        sdc.updateAlias = updateSensor;

        DS.getDeviceById($sp.uid,"sensor")
            .then(function(data){
                sdc.sensor = data;
                sdc.sensoralias = data.config.alias;
                $scope.$apply();
            })
            .catch(function(err){
                Materialize.toast("Device not found", 4000);
                console.error(err);
            });

        DS.setOnDeviceUpdate(function(data){
            if(data.id === sdc.sensor.id) {
                sdc.sensor = data;
            }
        });

        function updateSensor(key,value) {
            if(!key || !value) return console.error("no key or value");
            DS.updateDevice("sensors",sdc.sensor.id,key,value)
                .then(function(){
                    Materialize.toast("Successfully updated sensor data", 4000);
                })
                .catch(function(err){
                    console.error(err);
                    Materialize.toast("Error updating sensor data",4000);
                });
        }

        function GetValueByKey(key) {
            // todo implemented
            return "Not implemented";
        }
    }

})();