(function () {
    //'use strict';

    angular
        .module('jarvis.ruleEngine')
        .controller('ruleEngineCtrl', ruleEngineCtrl);

    ruleEngineCtrl.$inject = ["DevicesService", "$stateParams", "$scope", '$timeout', '$http'];

    function ruleEngineCtrl(DS, $sp, $scope, $timeout, $http) {
        var rec = this;
        rec.sensors = [];
        rec.showDetail = showDetail;
        rec.getSensorById = getSensorById;
        rec.selectedSensor = null;
        rec.selectedCommand = null;
        rec.updateFieldList = updateFieldList;
        rec.addToThresholds = addToThresholds;
        rec.getSensorFields = getSensorFields;
        rec.translateOperator = translateOperator;
        rec.threshold = {
            device: null,
            field: null,
            operator: null,
            value: null,
            gate: 'AND'
        };

        rec.activeRule = null;
        function showDetail(rule){
            rec.activeRule = rule;
            $('#ruleModal').openModal();
        }

        function translateOperator(operator){
            var r = '';
            switch(operator){
                case '>':
                     r = 'groter dan';
                    break;
                case '<':
                     r = 'kleiner dan';
                    break;
                case '===':
                    r = 'gelijk aan';
                    break;
            }
            return r;
        }

        function getSensorById(id){
            for(var i = 0; i<rec.sensors.length; i++) {
                if (rec.sensors[i].id == id) {
                    return rec.sensors[i];
                }
            }
        }

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
            rec.sensors = JSON.parse(JSON.stringify(DS.getSensors()));
            rec.ruleObjects = rec.actuator.config.rules;
            $scope.$watch('rec.ruleObjects', function(newVal, oldVal){
                DS.updateRules(rec.actuator.id, newVal);
            }, true);
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