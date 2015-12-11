(function () {
    //'use strict';

    angular
        .module('jarvis.ruleEngine')
        .controller('ruleEngineCtrl', ruleEngineCtrl);

    ruleEngineCtrl.$inject = ["DevicesService", "$stateParams", "$scope", '$timeout', '$http'];

    function ruleEngineCtrl(DS, $sp, $scope, $timeout, $http) {
        var rec = this;
        rec.sensors = [];
        rec.actuators = [];
        rec.openModal = openModal;
        rec.getActuatorById = getActuatorById;
        rec.showDetail = showDetail;
        rec.getSensorById = getSensorById;
        rec.selectedSensor = null;
        rec.selectedActuator = null;
        rec.selectedCommand = null;
        rec.closeModal = closeModal;
        rec.showDetailEvent = showDetailEvent;
        rec.updateFieldList = updateFieldList;
        rec.addToThresholds = addToThresholds;
        rec.getSensorFields = getSensorFields;
        rec.updateEventList = updateEventList;
        rec.translateOperator = translateOperator;

        rec.timePickerOptions = {
            step: 20,
            timeFormat: 'g:ia',
            appendTo: 'body'
        };

        rec.threshold = {
            device: null,
            field: null,
            operator: null,
            value: null,
            gate: 'AND'
        };

        rec.event = {
            device : null,
            event : null,
        };

        function showDetail(rule){
            rec.threshold = rule;
            $('#ruleModal').openModal();
        }


        function showDetailEvent(rule){
            rec.event = rule;
            $('#eventModal').openModal();
        }

        function closeModal(modal){
            $('#'+modal).closeModal();
        }

        function openModal(modal){
            $('#'+modal).openModal();
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

        function getActuatorById(id){
            for(var i = 0; i<rec.actuators.length; i++) {
                if (rec.actuators[i].id == id) {
                    //console.log(rec.sensors[i].model.commands.status.returns);
                    return rec.actuators[i];
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

        function updateEventList() {
            DS.getDeviceById(rec.event.device, 'actuator').then(function (data) {
                console.log(data);
                rec.selectedActuator = data;
                $scope.$apply();
            }).catch(function(e){
                console.error(e);
            });
        }

        function addToThresholds() {

            if(rec.threshold.name !== null && rec.threshold.device !== null && rec.selectedCommand) {
                rec.ruleObjects[rec.selectedCommand].thresholds.push(rec.threshold);
                rec.threshold = {
                    name: null,
                    device: null,
                    field: null,
                    operator: null,
                    value: null,
                    gate: 'AND'
                };
            }

            if(rec.event.device !== null){
                console.log('ik sla een event op');
                if(!rec.ruleObjects[rec.selectedCommand].events) {
                    rec.ruleObjects[rec.selectedCommand].events = [];
                }
                rec.ruleObjects[rec.selectedCommand].events.push(rec.event);
                rec.event = {
                    device : null,
                    event: null
                };
            }
        }

        $timeout(function () {
            $('#timepicker').timepicker();
            rec.actuators = JSON.parse(JSON.stringify(DS.getActuators()));
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