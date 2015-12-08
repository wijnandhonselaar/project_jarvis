(function () {
    //'use strict';

    angular
        .module('jarvis.ruleEngine')
        .controller('ruleEngineCtrl', ruleEngineCtrl);

    ruleEngineCtrl.$inject = ["DevicesService", "$stateParams", "$scope", '$timeout', '$http'];

    function ruleEngineCtrl(DS, $sp, $scope, $timeout, $http) {
        var rec = this;
        rec.sensors = DS.getSensors();
        rec.selectedSensor = null;
        rec.selectedCommand = null;
        rec.updateFieldList = updateFieldList;
        rec.addToThresholds = addToThresholds;
        rec.getSensorFields = getSensorFields;
        rec.threshold = {
            device: null,
            field: null,
            operator: null,
            value: null,
            gate: 'AND'
        };

        function getSensorFields(id){
            for(var i = 0; i<rec.sensors.length; i++){
                if(rec.sensors[i].id == id){
                    //console.log(rec.sensors[i].model.commands.status.returns);
                    return rec.sensors[i].model.commands.status.returns;
                }
            }
        }

        function updateFieldList() {
            DS.getDeviceById(rec.threshold.device, 'sensor').then(function (data) {
                console.log(data);
                rec.selectedSensor = data;
                $scope.$apply();
            }).catch(function(e){
                console.error(e);
            });
        }

        function addToThresholds() {
            rec.ruleObjects[rec.selectedCommand].thresholds.push(rec.threshold);
            rec.threshold = {
                device: null,
                field: null,
                operator: null,
                value: null,
                gate: 'AND'
            };
        }


        $timeout(function () {
            rec.ruleObjects = rec.actuator.config.rules;
            console.log(rec.ruleObjects);
        });

        DS.getDeviceById($sp.uid, "actuator")
            .then(function (data) {
                rec.actuator = data;
                rec.actuatoralias = data.config.alias;
                $scope.$apply();
            })
            .catch(function (err) {
                Materialize.toast("Device not found", 4000);
                console.error(err);
            });

        DS.setOnDeviceUpdate(function (data) {
            if (data.id === rec.actuator.id) {
                rec.actuator = data;
            }
        });
    }

})();