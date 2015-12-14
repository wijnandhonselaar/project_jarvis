(function() {
    'use strict';

    angular
        .module('jarvis.sensor')
        .controller('SensorDetailCtrl', SensorDetailCtrl);

    SensorDetailCtrl.$inject = ["DevicesService", "$stateParams", "$scope", "LogService"];

    function SensorDetailCtrl(DS, $sp, $scope, LS) {
        var sdc = this;
        sdc.GetValueByKey = GetValueByKey;
        sdc.sensor = null;
        sdc.sensoralias = "";
        sdc.updateAlias = updateSensor;
        sdc.data = [];
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
            console.log(err);
        });

        LS.loadLogsDetail($sp.uid, false).then(function(data){
            sdc.logData = data;
            $scope.$apply();
        }).catch(function(err){
            Materialize.toast("Logdata not found", 3000);
            console.log(err);
        });

        LS.setOnLogUpdate(function(data){
            if(data.device.id === sdc.sensor.id) {
                //history update
                sdc.logData.push(data);

                // graph update
                for(var k in data.status){
                    sdc.data[0].push(data.status[k]);
                }
                sdc.labels.push("");

                if(sdc.data[0].length > 60){
                    sdc.data[0].splice(0,3);
                    sdc.logData.splice(0,3);
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

        //initialize tabs log/graph
        $(document).ready(function(){
            $('ul.tabs').tabs();
        });
    }

})();