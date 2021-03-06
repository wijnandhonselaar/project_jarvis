(function() {
    'use strict';

    angular
        .module('jarvis.sensor')
        .controller('SensorDetailCtrl', SensorDetailCtrl);

    SensorDetailCtrl.$inject = ["DevicesService", "$stateParams", "$scope", "LogService"];

    function SensorDetailCtrl(DS, $sp, $scope, LS) {
        var sdc = this;
        sdc.sensor = null;
        sdc.sensoralias = "";
        sdc.updateAlias = updateSensor;
        sdc.data = [];
        sdc.updateInterval = updateInterval;
        sdc.onHistoryClick = onHistoryClick;
        sdc.onChartClick = onChartClick;
        sdc.chartoptions = {
            scaleShowGridLines: false,
            scaleGridLineWidth: 1,
            barShowStroke: true,
            barStrokeWidth: 2,
            barValueSpacing: 5,
            barDatasetSpacing: 1,
            animation : false,
            showTooltips: false,
        };
        

        function onChartClick() {
           $('#graphModal').openModal();
        }

        function onHistoryClick(){
            $('#historyModal').openModal();
        }

        LS.loadLogsDetail($sp.uid, true).then(function(data){
            sdc.labels = data.labels;
            sdc.data.push(data.data);
            $scope.$apply();
        }).catch(function(err){
            Materialize.toast("Logdata not found", 3000);
            console.error(err);
        });

        LS.loadLogsDetail($sp.uid, false).then(function(data){
            sdc.logData = data;
            $scope.$apply();
        }).catch(function(err){
            Materialize.toast("Logdata not found", 3000);
            console.error(err);
        });

        LS.setOnLogUpdate(function(data){
            if(data.device.id === sdc.sensor.id) {
                console.log(sdc.labels.length + " == " + sdc.data[0].length);
                //history update
                data.timestamp = LS.convertUnixTime(data.timestamp);
                sdc.logData.unshift(data);

                // graph update
                for(var k in data.status){
                    sdc.data[0].push(data.status[k]);
                }

                console.log(sdc.labels[sdc.labels.length-6]);
                if(sdc.labels[sdc.labels.length-6] !== ""){
                    sdc.labels.push(data.timestamp);
                }else{
                    sdc.labels.push("");
                }

                if(sdc.data[0].length > 60){
                    sdc.labels.splice(sdc.labels.length-1, 1);
                    sdc.data[0].splice(0,1);
                    sdc.logData.splice(0,1);
                }
                $scope.$apply();
            }
        });
        
        DS.getDeviceById($sp.uid,"sensor")
            .then(function(data){
                sdc.sensor = data;
                sdc.logData = LS.getDatalogById(sdc.sensor.model.id);
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