(function() {
    'use strict';

    angular
        .module('jarvis.sensor')
        .controller('SensorDetailCtrl', SensorDetailCtrl);

    SensorDetailCtrl.$inject = ["DevicesService", "$stateParams", "$scope"];

    function SensorDetailCtrl(DS, $sp, $scope) {
        var sdc = this;
        sdc.sensor = null;
        sdc.sensoralias = "";
        sdc.updateAlias = updateSensor;
        sdc.updateInterval = updateInterval;

        DS.getDeviceById($sp.uid,"sensor")
            .then(function(data){
                sdc.sensor = data;
                console.log("sensor:\n", data);
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

        function updateInterval(newValue) {
            if( isNaN(parseInt(newValue)) ){
                sdc.sensor.config.clientRequestInterval = sdc.sensor.model.commands.status.requestInterval;
                return Materialize.toast("Nieuwe value is geen nummer", 4000);
            }
            if( parseInt(newValue) < sdc.sensor.model.commands.status.requestInterval ) {
                sdc.sensor.config.clientRequestInterval = sdc.sensor.model.commands.status.requestInterval;
                return Materialize.toast("De interval moet groter zijn dan " + sdc.sensor.model.commands.status.requestInterval, 4000);
            }
            DS.updateDevice("sensors", sdc.sensor.id, "interval", parseInt(newValue))
                .then(function(data){
                    Materialize.toast("Succesfully updated interval data", 4000);
                })
                .catch(function(err){
                    console.error(err);
                    Materialize.toast("Error updating sensor interval", 4000);
                });
        }

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
    }

})();