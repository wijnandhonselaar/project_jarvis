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
        rec.showDetailTimer = showDetailTimer;
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
        rec.remove = remove;

        rec.timePickerOptions = {
            step: 20,
            timeFormat: 'g:ia',
            appendTo: 'body'
        };

        rec.timer = {
            name : null,
            time: null,
            gate : 'OR'
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
            gate : 'OR'
        };

        function remove(type, ruleID, modal){
            var obj = rec.ruleObjects[rec.selectedCommand][type];
            for(var i = 0; i<obj.length; i++){
                if(obj[i].id == ruleID){
                    obj.splice(i,1);
                    closeModal(modal);
                }
            }
            reset();
        }

        function showDetail(rule){
            rec.threshold = rule;
            $('#ruleModal').openModal();
        }


        function showDetailEvent(rule){
            rec.event = rule;
            $('#eventModal').openModal();
        }

        function showDetailTimer(rule){
            rec.timer = rule;
            $('#timerModal').openModal();
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
                    return rec.sensors[i].model.commands.status.returns;
                }
            }
        }

        function getActuatorById(id){
            for(var i = 0; i<rec.actuators.length; i++) {
                if (rec.actuators[i].id == id) {
                    return rec.actuators[i];
                }
            }
        }

        function updateFieldList() {
            DS.getDeviceById(rec.threshold.device, 'sensor').then(function (data) {
                rec.selectedSensor = data;
                $scope.$apply();
            }).catch(function(e){
                console.error(e);
            });
        }

        function updateEventList() {
            DS.getDeviceById(rec.event.device, 'actuator').then(function (data) {
                rec.selectedActuator = data;
                $scope.$apply();
            }).catch(function(e){
                console.error(e);
            });
        }

        function reset(){

            rec.event = {
                id: null,
                device : null,
                event: null
            };

            rec.threshold = {
                id: null,
                name: null,
                device: null,
                field: null,
                operator: null,
                value: null,
                gate: 'AND'
            };

            rec.timer =  {
                id: null,
                name : null,
                time: null
            };
        }

        function addToThresholds() {

            if(rec.threshold.name !== null && rec.threshold.device !== null && rec.selectedCommand) {
                rec.threshold.id = guid();
                rec.ruleObjects[rec.selectedCommand].thresholds.push(rec.threshold);
            }

            if(rec.event.device !== null){
                if(!rec.ruleObjects[rec.selectedCommand].events) {
                    rec.ruleObjects[rec.selectedCommand].events = [];
                }
                rec.event.id = guid();
                rec.ruleObjects[rec.selectedCommand].events.push(rec.event);
            }

            if(rec.timer.name !== null){
                if(!rec.ruleObjects[rec.selectedCommand].timers) {
                    rec.ruleObjects[rec.selectedCommand].timers = [];
                }
                rec.timer.id = guid();
                rec.ruleObjects[rec.selectedCommand].timers.push(rec.timer);
            }

            reset();
        }

        $timeout(function () {
            $('#timepicker').timepicker({ 'step': 15, timeFormat: 'H:i' });
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

        function guid() {
            function s4() {
                return Math.floor((1 + Math.random()) * 0x10000)
                    .toString(16)
                    .substring(1);
            }
            return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
                s4() + '-' + s4() + s4() + s4();
        }
    }

})();